/**
 * Dedicated security verification script for Password-Authenticated Backup and Cryptographic Integrity.
 * This runs in Node.js and asserts that backups can be securely password-encrypted and decrypted,
 * preventing cross-device key mismatches while maintaining maximum Zero-Trust privacy.
 */

import nodeCrypto from 'crypto';
import { promises as fs } from 'fs';
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
  __VORO_TEST_BYPASS__: true, // Start in test mode to bypass load checks
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

originalDefineProperty(global, 'crypto', {
  value: webcrypto,
  configurable: true,
  writable: true
});

// Accurate browser-like localStorage mock (non-enumerable methods)
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
  console.log("🧪 RUNNING SECURITY VERIFICATION: PASSWORD BACKUP");
  console.log("=========================================");

  // Load modules
  const cryptoModulePath = path.resolve('webs/src/utils/crypto.js');
  const storageModulePath = path.resolve('webs/src/utils/storage.js');

  const voroCrypto = (await import(cryptoModulePath)).default;
  const storage = (await import(storageModulePath)).default;

  // Let's seed storage with test data
  await storage.ensureInitialized();
  await storage.set('profile', { name: "Voro Champion", fitnessLevel: "elite" });
  await storage.set('settings', { theme: "dark" });

  // --- TEST 1: Direct Crypto Encryption and Decryption with Password ---
  console.log("🟢 Test 1: Verifying direct PBKDF2/AES-GCM encryption and decryption with password...");
  const secretData = { secretToken: "VoroEnclaveSecretValue", biometricRating: 99 };
  const password = "SuperSecureMasterPassword123!";

  const encrypted = await voroCrypto.encryptWithPassword(secretData, password);

  if (encrypted.salt && encrypted.iv && encrypted.ciphertext && encrypted.iterations === 100000) {
    console.log("✅ Success: Password-based encryption completed with random salt and IV.");
  } else {
    throw new Error("❌ Failure: Password-based encryption returned incorrect schema!");
  }

  const decrypted = await voroCrypto.decryptWithPassword(encrypted, password);
  if (decrypted && decrypted.secretToken === "VoroEnclaveSecretValue") {
    console.log("✅ Success: Decryption with the correct password was successful and content matched.");
  } else {
    throw new Error(`❌ Failure: Decryption failed or data mismatched! decrypted=${JSON.stringify(decrypted)}`);
  }

  // --- TEST 2: Decryption failure with incorrect password ---
  console.log("🛡️ Test 2: Verifying decryption fails gracefully with an incorrect password...");
  const failedDecrypted = await voroCrypto.decryptWithPassword(encrypted, "WrongPassword");
  if (failedDecrypted === null) {
    console.log("✅ Success: Decryption correctly returned null on incorrect password.");
  } else {
    throw new Error("❌ Failure: Decryption did not fail on incorrect password!");
  }

  // --- TEST 3: Full Backup Export with Password ---
  console.log("🟢 Test 3: Verifying storage.export(password) produces valid voro_backup_v3 payload...");
  const backupV3 = await storage.export(password);
  console.log("DEBUG backupV3:", JSON.stringify(backupV3).substring(0, 150) + "...");
  if (backupV3.voro_backup_v3 === true && backupV3.salt && backupV3.iv && backupV3.ciphertext) {
    console.log("✅ Success: Storage manager successfully exported v3 password-encrypted backup.");
  } else {
    throw new Error("❌ Failure: Exported v3 backup had an incorrect schema!");
  }

  // --- TEST 4: Full Backup Import with Correct Password ---
  console.log("🟢 Test 4: Verifying storage.import(backup, password) successfully decrypts and restores state...");
  // Clear storage first
  await storage.clear();
  console.log("DEBUG before import, stateLedger size:", storage.stateLedger.size);
  const importRes = await storage.import(backupV3, password);
  console.log("DEBUG importRes is:", importRes);
  console.log("DEBUG stateLedger keys after import:", Array.from(storage.stateLedger.keys()));

  const restoredProfile = await storage.getAsync('profile');
  if (importRes === true && restoredProfile && restoredProfile.name === "Voro Champion") {
    console.log("✅ Success: Decrypted backup successfully restored setting states.");
  } else {
    throw new Error(`❌ Failure: Backup import failed or profile data was not restored! importRes=${importRes}, profile=${JSON.stringify(restoredProfile)}`);
  }

  // --- TEST 5: Backward compatibility with standard v2 backups ---
  console.log("🟢 Test 5: Verifying backward compatibility with device-bound v2 backups...");
  await storage.set('settings', { theme: "light" });
  const backupV2 = await storage.export(); // No password
  if (backupV2.voro_backup_v2 === true && backupV2.payload) {
    console.log("✅ Success: Successfully generated device-bound v2 backup.");
  } else {
    throw new Error("❌ Failure: Device-bound v2 backup signature was incorrect!");
  }

  await storage.clear();
  const importV2Res = await storage.import(backupV2);
  const restoredSettings = await storage.getAsync('settings');
  if (importV2Res === true && restoredSettings && restoredSettings.theme === "light") {
    console.log("✅ Success: Backward compatibility with device-bound v2 backups verified.");
  } else {
    throw new Error("❌ Failure: v2 backup import failed!");
  }

  console.log("\n🎉 ALL PASSWORD-BASED BACKUP SECURITY TESTS PASSED SUCCESSFULLY!");
  console.log("=========================================");
  process.exit(0);
};

runTests().catch(err => {
  console.error(err);
  process.exit(1);
});
