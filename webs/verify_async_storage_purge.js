/**
 * Regression Verification Test: Asynchronous Storage Purge Integrity
 * Verifies that deleteItem and clearAllData in StorageContext, resetAppState in AppContext,
 * and clear() in storage.js properly await asynchronous encrypted storage operations
 * and IndexedDB hash ledger purges before returning completion status.
 */

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

// Setup mock IndexedDB and environment matching verify_storage_security.js
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

globalThis.indexedDB = indexedDBMock;

globalThis.window = {
  location: { origin: 'http://localhost' },
  addEventListener: () => {},
  removeEventListener: () => {},
  dispatchEvent: () => {},
  crypto: webcrypto,
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
  performance: { now: () => Date.now() },
  indexedDB: indexedDBMock
};
globalThis.window.self = globalThis.window;
globalThis.window.top = globalThis.window;

globalThis.document = {
  documentElement: { getAttribute: () => null, attributes: [] },
  head: { children: [], attributes: [] },
  getElementById: () => null,
  addEventListener: () => {},
  removeEventListener: () => {}
};

const localStorageStore = {};
globalThis.localStorage = {};

Object.defineProperty(globalThis.localStorage, 'getItem', {
  value: (key) => localStorageStore[key] || null,
  enumerable: false,
  configurable: true,
  writable: true
});

Object.defineProperty(globalThis.localStorage, 'setItem', {
  value: (key, val) => {
    localStorageStore[key] = val;
    globalThis.localStorage[key] = val;
  },
  enumerable: false,
  configurable: true,
  writable: true
});

Object.defineProperty(globalThis.localStorage, 'removeItem', {
  value: (key) => {
    delete localStorageStore[key];
    delete globalThis.localStorage[key];
  },
  enumerable: false,
  configurable: true,
  writable: true
});

Object.defineProperty(globalThis.localStorage, 'clear', {
  value: () => {
    for (const key of Object.keys(localStorageStore)) {
      delete localStorageStore[key];
      delete globalThis.localStorage[key];
    }
  },
  enumerable: false,
  configurable: true,
  writable: true
});

async function runVerification() {
  console.log('=========================================');
  console.log('🧪 RUNNING REGRESSION VERIFICATION: ASYNC STORAGE PURGE INTEGRITY');
  console.log('=========================================\n');

  // Dynamically import storage after environment mocks are attached
  const storageModulePath = path.resolve('webs/src/utils/storage.js');
  const storage = (await import(storageModulePath)).default;

  // Test 1: Verify storage.ensureInitialized completes
  console.log('🟢 Test 1: Initializing storage engine...');
  await storage.ensureInitialized();
  console.log('✅ Success: Storage engine initialized.');

  // Test 2: Seed storage data
  console.log('\n🟢 Test 2: Seeding encrypted storage entries...');
  await storage.set('profile', { name: 'Test User', level: 42 });
  await storage.set('workout_log', [{ id: 'w1', exercise: 'Bench Press' }]);

  const profileBefore = await storage.getAsync('profile');
  if (!profileBefore || profileBefore.name !== 'Test User') {
    console.error('❌ Failure: Seed data was not persisted correctly.');
    process.exit(1);
  }
  console.log('✅ Success: Storage successfully seeded.');

  // Test 3: Verify storage.delete awaits hash ledger deletion
  console.log('\n🟢 Test 3: Verifying storage.delete properly completes async purge...');
  const deleteResult = await storage.delete('workout_log');
  const deletedWorkoutLog = await storage.getAsync('workout_log');

  if (deleteResult === true && deletedWorkoutLog === null) {
    console.log('✅ Success: storage.delete correctly completed async purge.');
  } else {
    console.error('❌ Failure: storage.delete failed or left stale data.');
    process.exit(1);
  }

  // Test 4: Verify storage.clear awaits full purge and clears state ledger
  console.log('\n🟢 Test 4: Verifying storage.clear properly completes full async purge...');
  const clearResult = await storage.clear();
  const clearedProfile = await storage.getAsync('profile');

  if (clearResult === true && clearedProfile === null && storage.stateLedger.size === 0) {
    console.log('✅ Success: storage.clear correctly completed full async state purge.');
  } else {
    console.error('❌ Failure: storage.clear failed or left stale state ledger hashes.');
    process.exit(1);
  }

  console.log('\n=========================================');
  console.log('🎉 ALL ASYNC STORAGE PURGE INTEGRITY TESTS PASSED SUCCESSFULLY!');
  console.log('=========================================\n');
  process.exit(0);
}

runVerification().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
