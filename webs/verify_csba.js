/**
 * Security verification script for Cryptographic Session-Binding Anchor (CSBA).
 * Asserts that storage initialization verifies session alignment between IndexedDB and Local Storage,
 * preventing out-of-band injection attacks and detecting database wipes.
 */

import nodeCrypto from 'crypto';
import path from 'path';

const webcrypto = nodeCrypto.webcrypto;

// Setup mock environment
let mockKeys = {};
const mockRequest = (result) => {
  const req = { onsuccess: null, onerror: null, result };
  setTimeout(() => {
    if (req.onsuccess) req.onsuccess({ target: req });
  }, 0);
  return req;
};

const indexedDBMock = {
  open: (name, version) => {
    const db = {
      objectStoreNames: {
        contains: () => true
      },
      transaction: () => ({
        objectStore: () => ({
          get: (key) => mockRequest(mockKeys[key] || null),
          put: (val, key) => {
            mockKeys[key] = val;
            return mockRequest(true);
          },
          delete: (key) => {
            delete mockKeys[key];
            return mockRequest(true);
          },
          openCursor: () => {
            const cursorReq = { onsuccess: null, onerror: null, result: null };
            setTimeout(() => {
              if (cursorReq.onsuccess) cursorReq.onsuccess({ target: cursorReq });
            }, 0);
            return cursorReq;
          }
        })
      })
    };
    const openReq = { onsuccess: null, onerror: null, onupgradeneeded: null, result: db };
    setTimeout(() => {
      if (openReq.onsuccess) openReq.onsuccess({ target: openReq });
    }, 0);
    return openReq;
  }
};

global.indexedDB = indexedDBMock;

const resetMockWindow = () => {
  global.window = {
    location: { origin: 'http://localhost' },
    addEventListener: () => {},
    dispatchEvent: () => {},
    _listeners: {},
    crypto: webcrypto,
    self: {},
    top: {},
    VORO_COMPROMISED: false,
    VORO_DECEPTION_ACTIVE: false,
    __VORO_TEST_BYPASS__: true,
    Object,
    Array,
    Function,
    JSON,
    Promise,
    Proxy,
    Map,
    Set,
    Uint8Array,
    RegExp,
    Date,
    Error,
    Reflect,
    performance: {
      now: () => Date.now()
    },
    indexedDB: indexedDBMock
  };
  global.window.self = global.window;
  global.window.top = global.window;
};

resetMockWindow();

global.CustomEvent = class CustomEvent {
  constructor(type, detail) {
    this.type = type;
    this.detail = detail;
  }
};

global.document = {
  documentElement: {
    getAttribute: () => null,
    attributes: []
  },
  head: { children: [], attributes: [] },
  getElementById: () => null,
  addEventListener: () => {},
  removeEventListener: () => {}
};

global.performance = global.window.performance;

Object.defineProperty(global, 'crypto', {
  value: webcrypto,
  configurable: true,
  writable: true
});

let localStorageStore = {};
global.localStorage = {};

Object.defineProperty(global.localStorage, 'getItem', {
  value: (key) => localStorageStore[key] || null,
  enumerable: false,
  configurable: true,
  writable: true
});

Object.defineProperty(global.localStorage, 'setItem', {
  value: (key, val) => {
    localStorageStore[key] = val;
    global.localStorage[key] = val;
  },
  enumerable: false,
  configurable: true,
  writable: true
});

Object.defineProperty(global.localStorage, 'removeItem', {
  value: (key) => {
    delete localStorageStore[key];
    delete global.localStorage[key];
  },
  enumerable: false,
  configurable: true,
  writable: true
});

const runTests = async () => {
  console.log("=========================================");
  console.log("🧪 RUNNING CSBA SECURITY INITIALIZATION VERIFICATION");
  console.log("=========================================");

  const securityModulePath = path.resolve('webs/src/utils/security.js');
  const cryptoModulePath = path.resolve('webs/src/utils/crypto.js');
  const storageModulePath = path.resolve('webs/src/utils/storage.js');
  const voroSentinel = (await import(securityModulePath)).default;
  const voroCrypto = (await import(cryptoModulePath)).default;
  const voroStorage = (await import(storageModulePath)).default;

  // Test 1: Clean/First Run Initialization
  console.log("🟢 Test 1: Verifying clean run initialization (Empty Local Storage)...");
  localStorageStore = {}; // Empty
  for (const k of Object.keys(global.localStorage)) {
    if (k !== 'setItem' && k !== 'getItem' && k !== 'removeItem') {
      delete global.localStorage[k];
    }
  }
  mockKeys = {}; // Clear DB

  await voroStorage.ensureInitialized();

  if (!voroStorage.initialized) {
    throw new Error("❌ Failure: Storage failed to initialize on a clean run!");
  }

  const anchorKey = voroStorage.getFullKey('session_anchor');
  if (!localStorageStore[anchorKey]) {
    throw new Error("❌ Failure: Storage did not persist the session_anchor to Local Storage!");
  }
  console.log("✅ Success: Fresh run CSBA generated and stored session anchor.");

  // Test 2: Sequential Run with matching Anchor
  console.log("🟢 Test 2: Verifying subsequent run with matched session anchors...");
  // Reset singleton storage instance and crypto state to trigger full reloading
  voroCrypto.shredKeys();
  const { StorageManager } = await import(storageModulePath);
  const storageInstance = new StorageManager();

  await storageInstance.ensureInitialized();
  if (!storageInstance.initialized) {
    throw new Error("❌ Failure: Storage failed to initialize with pre-existing matching anchor!");
  }
  if (global.window.VORO_COMPROMISED) {
    throw new Error("❌ Failure: Matching anchor triggered false-positive lockdown!");
  }
  console.log("✅ Success: Matching session anchors validated successfully.");

  // Test 3: DB Clear/Wipe Tamper Detection
  console.log("🟢 Test 3: Verifying DB clear / out-of-band wipe detection...");
  // Inject a dummy user record into Local Storage to simulate real pre-existing data using setItem
  global.localStorage.setItem('voro_user', 'v3:encrypteduserpayload');

  // We keep the keys in localStorage, but we clear IndexedDB (simulating a database clear or wipe)
  mockKeys = {}; // Cleared!
  voroCrypto.shredKeys(); // Reset crypto keys to force generation of a *new* session anchor

  // Reset compromised flag
  resetMockWindow();

  const storageInstance3 = new StorageManager();
  await storageInstance3.ensureInitialized();

  if (!global.window.VORO_COMPROMISED) {
    throw new Error("❌ Failure: DB clear with pre-existing Local Storage keys did not trigger lockdown!");
  }
  console.log("✅ Success: Database desynchronization (wipe) successfully detected and blocked via lockdown.");

  // Test 4: Upgrade Path Migration
  console.log("🟢 Test 4: Verifying seamless upgrade path migration...");

  // 1. Reset database and Local Storage to clean, fully valid state
  localStorageStore = {};
  for (const k of Object.keys(global.localStorage)) {
    if (k !== 'setItem' && k !== 'getItem' && k !== 'removeItem') {
      delete global.localStorage[k];
    }
  }
  mockKeys = {};
  voroCrypto.shredKeys();
  resetMockWindow();

  const setupStorage = new StorageManager();
  await setupStorage.ensureInitialized();

  // 2. Now delete SESSION_ANCHOR from database and Local Storage to simulate an upgrade
  delete mockKeys['SESSION_ANCHOR'];
  global.localStorage.removeItem(setupStorage.getFullKey('session_anchor'));

  // 3. Inject dummy user data to simulate pre-existing user logs during the upgrade
  global.localStorage.setItem('voro_user', 'v3:encrypteduserpayload');

  // 4. Shred keys from memory to trigger reload, and re-initialize storage
  voroCrypto.shredKeys();
  resetMockWindow();

  const storageInstance4 = new StorageManager();
  await storageInstance4.ensureInitialized();

  if (global.window.VORO_COMPROMISED) {
    throw new Error("❌ Failure: Safe upgrade triggered false-positive lockdown!");
  }
  if (!storageInstance4.initialized) {
    throw new Error("❌ Failure: Storage failed to initialize on a legitimate upgrade!");
  }

  const upgradedAnchor = global.localStorage.getItem(storageInstance4.getFullKey('session_anchor'));
  if (!upgradedAnchor) {
    throw new Error("❌ Failure: Newly generated session anchor was not written to Local Storage during upgrade!");
  }
  console.log("✅ Success: Safe upgrade path completed smoothly with zero false positives.");

  console.log("\n🎉 ALL CSBA SECURITY VERIFICATION TESTS PASSED SUCCESSFULLY!");
  console.log("=========================================");
  process.exit(0);
};

runTests().catch(err => {
  console.error("❌ Test Runner Crash:", err);
  process.exit(1);
});
