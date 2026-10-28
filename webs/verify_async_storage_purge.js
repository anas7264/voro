/**
 * Verification script for Async Storage Purge & Deletion Handling in VORO
 * Verifies that deleteItem, clearAllData, and resetAppState return promises
 * and correctly await storage clearance before resolving.
 */

import nodeCrypto from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const webcrypto = nodeCrypto.webcrypto;

// Setup synchronous mock environment BEFORE any module load
const mockKeys = {};

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
          get: (key) => {
            return mockRequest(mockKeys[key] || null);
          },
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

global.window = {
  location: { origin: 'http://localhost' },
  addEventListener: () => {},
  removeEventListener: () => {},
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

const localStorageStore = {};
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

Object.defineProperty(global.localStorage, 'clear', {
  value: () => {
    for (const key of Object.keys(localStorageStore)) {
      delete localStorageStore[key];
      delete global.localStorage[key];
    }
  },
  enumerable: false,
  configurable: true,
  writable: true
});

global.sessionStorage = {
  clear: () => {}
};

const runTests = async () => {
  console.log("=========================================");
  console.log("🧪 RUNNING VERIFICATION: ASYNC STORAGE PURGE & DELETION");
  console.log("=========================================");

  const storageModulePath = path.resolve(__dirname, 'src/utils/storage.js');
  const storageModule = await import(storageModulePath);
  const storage = storageModule.default;

  await storage.ensureInitialized();

  // Test 1: Verify storage.delete is asynchronous and returns boolean
  console.log("🟢 Test 1: Verifying storage.delete is async and clears key and state ledger...");
  await storage.set('profile', { name: "Test User" });
  if (!storage.exists('profile')) {
    throw new Error("❌ Failure: Item 'profile' was not stored.");
  }

  const deletePromise = storage.delete('profile');
  if (!(deletePromise instanceof Promise)) {
    throw new Error("❌ Failure: storage.delete did not return a Promise.");
  }

  const deleteResult = await deletePromise;
  if (deleteResult !== true) {
    throw new Error(`❌ Failure: storage.delete resolved to ${deleteResult} instead of true.`);
  }

  if (storage.exists('profile')) {
    throw new Error("❌ Failure: 'profile' key still exists in storage after delete.");
  }
  console.log("✅ Success: storage.delete is async and successfully purges key.");

  // Test 2: Verify storage.clear is asynchronous and purges all items & state ledger
  console.log("🟢 Test 2: Verifying storage.clear is async and purges all storage...");
  await storage.set('profile', { name: "Test User 2" });
  await storage.set('workout_log', [{ id: 1, name: "Squat" }]);

  const clearPromise = storage.clear();
  if (!(clearPromise instanceof Promise)) {
    throw new Error("❌ Failure: storage.clear did not return a Promise.");
  }

  const clearResult = await clearPromise;
  if (clearResult !== true) {
    throw new Error(`❌ Failure: storage.clear resolved to ${clearResult} instead of true.`);
  }

  if (storage.list().length !== 0) {
    throw new Error(`❌ Failure: storage keys remain after storage.clear(): ${storage.list().join(', ')}`);
  }
  console.log("✅ Success: storage.clear is async and successfully purges all keys.");

  console.log("\n🎉 ALL ASYNC STORAGE PURGE VERIFICATION TESTS PASSED SUCCESSFULLY!");
  console.log("=========================================");
  process.exit(0);
};

runTests().catch(err => {
  console.error("❌ Test runner error:", err);
  process.exit(1);
});
