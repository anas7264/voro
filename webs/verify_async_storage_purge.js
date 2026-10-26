import nodeCrypto from 'crypto';
import path from 'path';

const webcrypto = nodeCrypto.webcrypto;

// Store original defineProperty
const originalDefineProperty = Object.defineProperty;

// Intercept defineProperty to keep VORO_COMPROMISED writable for our test runner
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

global.document = {
  documentElement: { getAttribute: () => null, attributes: [] },
  head: { children: [], attributes: [] },
  getElementById: () => null,
  addEventListener: () => {},
  removeEventListener: () => {}
};

originalDefineProperty(global, 'crypto', {
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

async function runTests() {
  console.log("=========================================");
  console.log("🧪 RUNNING ASYNC STORAGE PURGE VERIFICATION");
  console.log("=========================================");

  const storageModulePath = path.resolve('./src/utils/storage.js');
  const storage = (await import(storageModulePath)).default;

  await storage.ensureInitialized();

  // Test 1: Verify storage.delete Promise resolution
  console.log("🟢 Test 1: Testing async delete lifecycle...");
  await storage.set("user", { name: "Voro" });
  if (storage.get("user") === null) {
    throw new Error("Failed to set test item");
  }

  const deleteResult = await storage.delete("user");
  if (deleteResult !== true) {
    throw new Error("storage.delete failed to return true");
  }
  if (storage.get("user") !== null) {
    throw new Error("storage.delete failed to remove item");
  }
  console.log("✅ Success: Async item deletion verified!");

  // Test 2: Verify storage.clear Promise resolution
  console.log("🟢 Test 2: Testing async clearAllData lifecycle...");
  await storage.set("user", { name: "Voro" });
  await storage.set("profile", { goal: "endurance" });

  const clearResult = await storage.clear();
  if (clearResult !== true) {
    throw new Error("storage.clear failed to return true");
  }
  if (storage.get("user") !== null || storage.get("profile") !== null) {
    throw new Error("storage.clear failed to purge items");
  }
  console.log("✅ Success: Async storage purge verified!");

  console.log("\n🎉 ALL ASYNC STORAGE PURGE TESTS PASSED SUCCESSFULLY!");
  console.log("=========================================");
  process.exit(0);
}

runTests().catch((err) => {
  console.error("❌ TEST FAILED:", err);
  process.exit(1);
});
