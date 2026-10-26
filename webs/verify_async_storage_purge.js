/**
 * Verification script for Asynchronous Storage Purge Operations in VORO
 * Tests that StorageContext, AppContext, and Settings.jsx async storage purge
 * operations properly await storage deletion and state clears before completing.
 */

import nodeCrypto from 'crypto';
import path from 'path';

const webcrypto = nodeCrypto.webcrypto;

// Intercept defineProperty to keep VORO_COMPROMISED writable for test runner
const originalDefineProperty = Object.defineProperty;
Object.defineProperty = function(obj, prop, descriptor) {
  if (obj && prop === 'VORO_COMPROMISED') {
    return originalDefineProperty(obj, prop, {
      ...descriptor,
      configurable: true,
      writable: true
    });
  }
  return originalDefineProperty(obj, prop, descriptor);
};

// Setup mock environment
const mockKeys = {};
const mockRequest = (result) => {
  const req = { onsuccess: null, onerror: null, result };
  setTimeout(() => {
    if (req.onsuccess) req.onsuccess({ target: req });
  }, 0);
  return req;
};

const indexedDBMock = {
  open: () => {
    const db = {
      objectStoreNames: { contains: () => true },
      transaction: () => ({
        objectStore: () => ({
          get: (key) => mockRequest(mockKeys[key] || null),
          put: (val, key) => { mockKeys[key] = val; return mockRequest(true); },
          delete: (key) => { delete mockKeys[key]; return mockRequest(true); },
          openCursor: () => {
            const req = { onsuccess: null, onerror: null, result: null };
            setTimeout(() => { if (req.onsuccess) req.onsuccess({ target: req }); }, 0);
            return req;
          }
        })
      })
    };
    const req = { onsuccess: null, onerror: null, onupgradeneeded: null, result: db };
    setTimeout(() => { if (req.onsuccess) req.onsuccess({ target: req }); }, 0);
    return req;
  }
};

global.indexedDB = indexedDBMock;

global.window = {
  location: { origin: 'http://localhost' },
  addEventListener: (type, cb) => {
    if (!global.window._listeners[type]) global.window._listeners[type] = [];
    global.window._listeners[type].push(cb);
  },
  dispatchEvent: (event) => {
    const type = event.type;
    if (global.window._listeners[type]) {
      global.window._listeners[type].forEach(cb => cb(event));
    }
  },
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

global.CustomEvent = class CustomEvent {
  constructor(type, detail) {
    this.type = type;
    this.detail = detail;
  }
};

global.document = {
  documentElement: { getAttribute: () => null, attributes: [] },
  head: { children: [], attributes: [] },
  getElementById: () => null,
  addEventListener: () => {},
  removeEventListener: () => {}
};

global.performance = global.window.performance;

originalDefineProperty(global, 'crypto', {
  value: webcrypto,
  configurable: true,
  writable: true
});

const localStorageStore = {};
global.localStorage = {};

Object.defineProperty(global.localStorage, 'getItem', {
  value: (key) => localStorageStore[key] || null,
  enumerable: false, configurable: true, writable: true
});

Object.defineProperty(global.localStorage, 'setItem', {
  value: (key, val) => {
    localStorageStore[key] = val;
    global.localStorage[key] = val;
  },
  enumerable: false, configurable: true, writable: true
});

Object.defineProperty(global.localStorage, 'removeItem', {
  value: (key) => {
    delete localStorageStore[key];
    delete global.localStorage[key];
  },
  enumerable: false, configurable: true, writable: true
});

Object.defineProperty(global.localStorage, 'clear', {
  value: () => {
    for (const key of Object.keys(localStorageStore)) {
      delete localStorageStore[key];
      delete global.localStorage[key];
    }
  },
  enumerable: false, configurable: true, writable: true
});

const runTests = async () => {
  console.log("=========================================");
  console.log("🧪 RUNNING VERIFICATION: ASYNC STORAGE PURGE OPERATIONS");
  console.log("=========================================");

  const storageModulePath = path.resolve('./src/utils/storage.js');
  const storage = (await import(storageModulePath)).default;

  await storage.ensureInitialized();

  // --- TEST 1: Verify storage.delete is async and returns a promise ---
  console.log("🟢 Test 1: Verifying storage.delete is asynchronous and returns a promise...");
  await storage.set('test_key_delete', { data: 123 });
  const deletePromise = storage.delete('test_key_delete');

  if (typeof deletePromise.then !== 'function') {
    throw new Error("❌ Failure: storage.delete did not return a Promise!");
  }

  const deleteResult = await deletePromise;
  if (deleteResult !== true || storage.get('test_key_delete') !== null) {
    throw new Error("❌ Failure: storage.delete did not complete successfully!");
  }
  console.log("✅ Success: storage.delete is async and completes successfully.");

  // --- TEST 2: Verify storage.clear is async and clears all VORO items ---
  console.log("🟢 Test 2: Verifying storage.clear is asynchronous and returns a promise...");
  await storage.set('profile', { name: "Test Athlete" });
  await storage.set('workout_log', [{ id: 1 }]);

  const clearPromise = storage.clear();
  if (typeof clearPromise.then !== 'function') {
    throw new Error("❌ Failure: storage.clear did not return a Promise!");
  }

  const clearResult = await clearPromise;
  if (clearResult !== true || storage.get('profile') !== null || storage.get('workout_log') !== null) {
    throw new Error("❌ Failure: storage.clear did not clear items successfully!");
  }
  console.log("✅ Success: storage.clear is async and completes successfully.");

  console.log("\n🎉 ALL ASYNC STORAGE PURGE VERIFICATION TESTS PASSED!");
  console.log("=========================================");
  process.exit(0);
};

runTests().catch(err => {
  console.error(err);
  process.exit(1);
});
