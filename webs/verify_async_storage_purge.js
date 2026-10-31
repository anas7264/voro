// Verification script for async storage purge and delete operations
import assert from 'assert';
import nodeCrypto from 'crypto';
import path from 'path';

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

global.sessionStorage = { clear: () => {} };

async function runVerification() {
  console.log('=========================================');
  console.log('🧪 RUNNING ASYNC STORAGE PURGE VERIFICATION');
  console.log('=========================================');

  const storageModulePath = path.resolve('./src/utils/storage.js');
  const storage = (await import(storageModulePath)).default;

  // Test 1: Verify storage initialization
  console.log('🟢 Test 1: Initializing storage manager...');
  await storage.ensureInitialized();
  console.log('✅ Success: Storage manager initialized.');

  // Test 2: Verify async set and delete
  console.log('🟢 Test 2: Testing async set and delete...');
  const testKey = 'settings';
  const testValue = { theme: 'dark', fontSize: 'medium' };

  const setRes = await storage.set(testKey, testValue);
  assert.strictEqual(setRes, true, 'storage.set should resolve to true');

  const readValue = storage.get(testKey);
  assert.deepStrictEqual(readValue, testValue, 'storage.get should retrieve set value');

  const deletePromise = storage.delete(testKey);
  assert(deletePromise instanceof Promise, 'storage.delete must return a Promise');
  const deleteRes = await deletePromise;
  assert.strictEqual(deleteRes, true, 'storage.delete should resolve to true');

  const afterDeleteValue = storage.get(testKey);
  assert.strictEqual(afterDeleteValue, null, 'storage.get should return null after delete');
  console.log('✅ Success: Async set and delete verified.');

  // Test 3: Verify async clear operation
  console.log('🟢 Test 3: Testing async clear operation...');
  await storage.set('profile', { name: 'Test User' });
  await storage.set('settings', { theme: 'light' });

  const clearPromise = storage.clear();
  assert(clearPromise instanceof Promise, 'storage.clear must return a Promise');
  const clearRes = await clearPromise;
  assert.strictEqual(clearRes, true, 'storage.clear should resolve to true');

  assert.strictEqual(storage.get('profile'), null, 'profile should be null after clear');
  assert.strictEqual(storage.get('settings'), null, 'settings should be null after clear');
  console.log('✅ Success: Async clear operation verified.');

  console.log('\n🎉 ALL ASYNC STORAGE PURGE VERIFICATION TESTS PASSED SUCCESSFULLY!');
  console.log('=========================================');
  process.exit(0);
}

runVerification().catch((err) => {
  console.error('❌ Async Storage Purge Verification Failed:', err);
  process.exit(1);
});
