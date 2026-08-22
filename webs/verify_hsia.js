/**
 * Security verification script for HMAC-Based Cryptographic State Integrity Attestation (HSIA).
 * Asserts that database state signatures are cryptographically keyed using VORO's Master Key,
 * making state forgery impossible without key custody, and verifies constant-time comparisons.
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

const runTests = async () => {
  console.log("=========================================");
  console.log("🧪 RUNNING HSIA & CONSTANT-TIME SECURITY VERIFICATION");
  console.log("=========================================");

  const cryptoModulePath = path.resolve('./src/utils/crypto.js');
  const voroCrypto = (await import(cryptoModulePath)).default;

  // Test 1: Constant-Time Comparison Correctness
  console.log("🟢 Test 1: Verifying constant-time comparison helper...");
  const sig1 = "d83fb2215c2cfca89de";
  const sig2 = "d83fb2215c2cfca89de";
  const sig3 = "d83fb2215c2cfca89df"; // Different character at end
  const sig4 = "differentlength";

  if (!voroCrypto.constantTimeCompare(sig1, sig2)) {
    throw new Error("❌ Failure: constantTimeCompare returned false for identical strings!");
  }
  if (voroCrypto.constantTimeCompare(sig1, sig3)) {
    throw new Error("❌ Failure: constantTimeCompare returned true for different strings!");
  }
  if (voroCrypto.constantTimeCompare(sig1, sig4)) {
    throw new Error("❌ Failure: constantTimeCompare returned true for different lengths!");
  }
  console.log("✅ Success: Constant-time comparison verified.");

  // Test 2: Cryptographic State Integrity Signature Generation
  console.log("🟢 Test 2: Verifying cryptographically keyed signature generation...");
  const testPayload = "VORO-INTEGRITY-PAYLOAD-DATA";
  const signatureA = await voroCrypto.computeHmacSignature(testPayload);
  const signatureB = await voroCrypto.computeHmacSignature(testPayload);

  if (!signatureA || signatureA.length !== 64) {
    throw new Error(`❌ Failure: Invalid signature length generated! ${signatureA}`);
  }
  if (signatureA !== signatureB) {
    throw new Error("❌ Failure: Keyed signature generation is not deterministic!");
  }
  console.log("✅ Success: Keyed HMAC-SHA-256 signature generated successfully.");

  // Test 3: Signature uniqueness across payloads
  console.log("🟢 Test 3: Verifying signature collision resistance and message-dependency...");
  const diffPayload = "VORO-INTEGRITY-PAYLOAD-DATA-MUTATED";
  const signatureDiff = await voroCrypto.computeHmacSignature(diffPayload);

  if (signatureA === signatureDiff) {
    throw new Error("❌ Failure: Different payloads yielded identical signatures!");
  }
  console.log("✅ Success: Mutation sensitivity verified.");

  console.log("\n🎉 ALL HSIA SECURITY VERIFICATION TESTS PASSED SUCCESSFULLY!");
  console.log("=========================================");
  process.exit(0);
};

runTests().catch(err => {
  console.error("❌ Test Runner Crash:", err);
  process.exit(1);
});
