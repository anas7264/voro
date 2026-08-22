/**
 * Security verification script for Deep Schema & Type Strictness Validator (DSVSS)
 * in VORO Storage Manager (webs/src/utils/storage.js).
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
  console.log("🧪 RUNNING SECURITY VERIFICATION: STORAGE DSVSS & BACKUP IMPORT");
  console.log("=========================================");

  // Dynamically import storage after environment mocks are attached
  const storageModulePath = path.resolve('./src/utils/storage.js');
  const storage = (await import(storageModulePath)).default;

  await storage.ensureInitialized();

  // --- TEST 1: Prototype Pollution Neutralization ---
  console.log("🟢 Test 1: Verifying prototype pollution vectors are stripped during backup import...");
  const maliciousBackup = {
    version: 1,
    data: {
      profile: {
        name: "Legitimate User",
        __proto__: { polluted: true },
        constructor: { prototype: { admin: true } }
      }
    }
  };

  await storage.import(maliciousBackup);
  const profile = storage.get('profile');

  if (profile && profile.name === "Legitimate User" && !({}).polluted && !({}).admin) {
    console.log("✅ Success: Prototype pollution vector successfully neutralized.");
  } else {
    throw new Error("❌ Failure: Prototype pollution detected or object compromised!");
  }

  // --- TEST 2: Schema Type Conformance Enforcement ---
  console.log("🟢 Test 2: Verifying schema type mismatches are rejected...");
  // workout_log expects an array, profile expects an object
  const invalidTypeBackup = {
    version: 1,
    data: {
      workout_log: { invalid: "Not an array!" },
      profile: ["Not an object!"]
    }
  };

  // Clear existing items
  await storage.delete('workout_log');
  await storage.delete('profile');

  await storage.import(invalidTypeBackup);
  const workoutLog = storage.get('workout_log');
  const invalidProfile = storage.get('profile');

  if (workoutLog === null && invalidProfile === null) {
    console.log("✅ Success: Invalid schema types successfully rejected.");
  } else {
    throw new Error(`❌ Failure: Invalid schema types were accepted! workout_log: ${JSON.stringify(workoutLog)}, profile: ${JSON.stringify(invalidProfile)}`);
  }

  // --- TEST 3: XSS & Script Injection Sanitization ---
  console.log("🟢 Test 3: Verifying XSS HTML/Script tags are sanitized in string fields...");
  const xssBackup = {
    version: 1,
    data: {
      profile: {
        name: "<script>alert('xss')</script>Alex Voro",
        goal: "<img src=x onerror=alert('xss')>Maintenance"
      }
    }
  };

  await storage.import(xssBackup);
  const sanitizedProfile = storage.get('profile');

  if (sanitizedProfile && typeof sanitizedProfile.name === 'string' && !sanitizedProfile.name.includes('<script>') && !sanitizedProfile.goal.includes('<img')) {
    console.log("✅ Success: Embedded XSS payloads successfully sanitized.");
  } else {
    throw new Error(`❌ Failure: Unsanitized script tag found in profile: ${JSON.stringify(sanitizedProfile)}`);
  }

  // --- TEST 4: Valid Backup Import Conformance ---
  console.log("🟢 Test 4: Verifying valid schema payloads are correctly imported...");
  const validBackup = {
    version: 1,
    data: {
      profile: {
        name: "Voro Athlete",
        goal: "muscle_gain"
      },
      workout_log: [
        { id: 1, exercise: "Bench Press", weight: 100 }
      ]
    }
  };

  await storage.import(validBackup);
  const importedProfile = storage.get('profile');
  const importedWorkouts = storage.get('workout_log');

  if (importedProfile?.name === "Voro Athlete" && Array.isArray(importedWorkouts) && importedWorkouts.length === 1) {
    console.log("✅ Success: Valid schema payloads imported successfully.");
  } else {
    throw new Error("❌ Failure: Valid backup payload import failed!");
  }

  console.log("\n🎉 ALL STORAGE SECURITY VERIFICATION TESTS PASSED SUCCESSFULLY!");
  console.log("=========================================");
  process.exit(0);
};

runTests().catch(err => {
  console.error(err);
  process.exit(1);
});
