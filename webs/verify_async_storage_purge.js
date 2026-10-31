/**
 * Verification script for async storage purge operations (deleteItem, clearAllData, resetAppState).
 */

import nodeCrypto from 'crypto';
import path from 'path';

const webcrypto = nodeCrypto.webcrypto;

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
          openCursor: () => mockRequest(null)
        })
      })
    };
    return mockRequest(db);
  }
};

global.indexedDB = indexedDBMock;

global.window = {
  location: { origin: 'http://localhost' },
  addEventListener: () => {},
  dispatchEvent: () => {},
  _listeners: {},
  crypto: webcrypto,
  VORO_COMPROMISED: false,
  __VORO_TEST_BYPASS__: true,
  indexedDB: indexedDBMock,
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
  }
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

global.performance = global.window.performance;

const localStorageStore = {};
global.localStorage = {
  getItem: (key) => localStorageStore[key] || null,
  setItem: (key, val) => {
    localStorageStore[key] = val;
    global.localStorage[key] = val;
  },
  removeItem: (key) => {
    delete localStorageStore[key];
    delete global.localStorage[key];
  },
  clear: () => {
    for (const key of Object.keys(localStorageStore)) {
      delete localStorageStore[key];
      delete global.localStorage[key];
    }
  }
};

async function runTests() {
  console.log('=========================================');
  console.log('🧪 RUNNING ASYNC STORAGE PURGE VERIFICATION');
  console.log('=========================================');

  const storageModulePath = path.resolve('./src/utils/storage.js');
  const storage = (await import(storageModulePath)).default;

  await storage.ensureInitialized();

  // Test 1: Verify storage.delete returns a promise that resolves to boolean
  console.log('🟢 Test 1: Verifying storage.delete promise resolution...');
  await storage.set('user', { name: 'Test User' });

  const deletePromise = storage.delete('user');
  if (!(deletePromise && typeof deletePromise.then === 'function')) {
    throw new Error('storage.delete should return a Promise');
  }
  const deleteResult = await deletePromise;
  if (deleteResult !== true) {
    throw new Error(`Expected deleteResult to be true, got ${deleteResult}`);
  }
  if (storage.get('user') !== null) {
    throw new Error('storage.get("user") should be null after delete');
  }
  console.log('✅ Success: storage.delete promise resolved correctly.');

  // Test 2: Verify storage.clear returns a promise that resolves to boolean
  console.log('🟢 Test 2: Verifying storage.clear promise resolution...');
  await storage.set('profile', { age: 30 });
  await storage.set('settings', { theme: 'dark' });

  const clearPromise = storage.clear();
  if (!(clearPromise && typeof clearPromise.then === 'function')) {
    throw new Error('storage.clear should return a Promise');
  }
  const clearResult = await clearPromise;
  if (clearResult !== true) {
    throw new Error(`Expected clearResult to be true, got ${clearResult}`);
  }
  if (storage.get('profile') !== null || storage.get('settings') !== null) {
    throw new Error('storage items should be null after clear');
  }
  console.log('✅ Success: storage.clear promise resolved correctly.');

  console.log('\n🎉 ALL ASYNC STORAGE PURGE VERIFICATION TESTS PASSED SUCCESSFULLY!');
  console.log('=========================================');
  process.exit(0);
}

runTests().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
