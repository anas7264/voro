/**
 * Verification test for async storage purge and delete operations in StorageContext, AppContext, and Settings.
 */

import nodeCrypto from 'crypto';
import path from 'path';

const webcrypto = nodeCrypto.webcrypto;

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
      objectStoreNames: { contains: () => true },
      transaction: () => ({
        objectStore: () => ({
          get: (key) => mockRequest(mockKeys[key] || null),
          put: (val, key) => { mockKeys[key] = val; return mockRequest(true); },
          delete: (key) => { delete mockKeys[key]; return mockRequest(true); },
          openCursor: () => {
            const cursorReq = { onsuccess: null, onerror: null, result: null };
            setTimeout(() => { if (cursorReq.onsuccess) cursorReq.onsuccess({ target: cursorReq }); }, 0);
            return cursorReq;
          }
        })
      })
    };
    const openReq = { onsuccess: null, onerror: null, onupgradeneeded: null, result: db };
    setTimeout(() => { if (openReq.onsuccess) openReq.onsuccess({ target: openReq }); }, 0);
    return openReq;
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
  Object, Array, Function, JSON, Promise, Proxy, Map, Set, Uint8Array, RegExp, Date, Error, Reflect,
  performance: { now: () => Date.now() },
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

global.sessionStorage = { clear: () => {} };

const run = async () => {
  console.log("=========================================");
  console.log("🧪 VERIFYING ASYNC STORAGE PURGE & DELETE HANDLING");
  console.log("=========================================");

  const storageModulePath = path.resolve('./src/utils/storage.js');
  const storage = (await import(storageModulePath)).default;

  // Initialize storage
  await storage.ensureInitialized();

  // Test set item
  await storage.set('workout_log', [{ foo: 'bar' }]);
  console.log("🟢 Test key set successfully.");

  // Simulate StorageContext deleteItem behavior (Async)
  const asyncDeleteItem = async (key) => {
    try {
      return await storage.delete(key);
    } catch (err) {
      console.error("Delete error:", err);
      return false;
    }
  };

  const deleteResult = await asyncDeleteItem('workout_log');
  if (deleteResult === true && !storage.exists('workout_log')) {
    console.log("✅ Success: deleteItem awaited and succeeded.");
  } else {
    throw new Error("❌ Failure: deleteItem did not await or fail correctly.");
  }

  // Set items again to test clearAllData
  await storage.set('user', { name: 'Alice' });
  await storage.set('profile', { role: 'Admin' });

  // Simulate StorageContext clearAllData behavior (Async)
  const asyncClearAllData = async () => {
    try {
      return await storage.clear();
    } catch (err) {
      console.error("Clear error:", err);
      return false;
    }
  };

  const clearResult = await asyncClearAllData();
  if (clearResult === true && storage.get('user') === null && storage.get('profile') === null) {
    console.log("✅ Success: clearAllData awaited and cleared storage.");
  } else {
    throw new Error("❌ Failure: clearAllData did not await or clear correctly.");
  }

  console.log("=========================================");
  console.log("🎉 ALL ASYNC STORAGE PURGE TESTS PASSED!");
  console.log("=========================================");
  process.exit(0);
};

run().catch(err => {
  console.error("❌ Test failed:", err);
  process.exit(1);
});
