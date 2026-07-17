/**
 * Dedicated security verification script for KDICA (Keystroke Dynamics and Interaction Cadence Attestation).
 * This runs in Node.js and simulates natural user vs. bot events to verify active defense lockdown triggers.
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
    },
    subtle: {
      encrypt: () => Promise.resolve(new ArrayBuffer(16)),
      decrypt: () => Promise.resolve(new ArrayBuffer(16)),
      deriveKey: () => Promise.resolve({}),
      importKey: () => Promise.resolve({}),
      generateKey: () => Promise.resolve({})
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
    addEventListener: (type, cb) => {
      docListeners[type] = docListeners[type] || [];
      docListeners[type].push(cb);
    },
    removeEventListener: () => {}
  };

  global.performance = global.window.performance;

  // Safely redefine global.crypto
  originalDefineProperty(global, 'crypto', {
    value: mockCrypto,
    configurable: true,
    writable: true
  });

  // Safely redefine global.navigator
  originalDefineProperty(global, 'navigator', {
    value: {
      webdriver: false,
      languages: ["en-US"],
      plugins: [1, 2, 3]
    },
    configurable: true,
    writable: true
  });

  global.localStorage = {
    getItem: (key) => {
      if (key === 'voro_test_mode') return global.localStorage.test_mode_val || 'true'; // Start in test mode
      return null;
    },
    setItem: () => {},
    removeItem: () => {},
    clear: () => {}
  };
  global.localStorage.test_mode_val = 'true';

  global.sessionStorage = {
    clear: () => {}
  };

  // Capture helpers
  return {
    triggerDocStart: (type, event) => {
      if (docListeners[type]) {
        docListeners[type].forEach(cb => cb(event));
      }
    },
    triggerDocEnd: (type, event) => {
      if (docListeners[type]) {
        docListeners[type].forEach(cb => cb(event));
      }
    }
  };
};

const runTests = async () => {
  console.log("=========================================");
  console.log("🧪 RUNNING SECURITY VERIFICATION: KDICA");
  console.log("=========================================");

  // Mock global environment
  const mock = mockWindow();

  // Load the security module
  const securityModulePath = path.resolve('src/utils/security.js');
  const sentinel = (await import(securityModulePath)).default;

  let lockdownCount = 0;
  window.addEventListener('voro-security-lockdown', () => {
    lockdownCount++;
  });

  // Helper to wait
  const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  // --- TEST 1: Natural Human Input ---
  console.log("🏃 Test 1: Simulating Natural Human Input...");
  lockdownCount = 0;
  window.VORO_COMPROMISED = false;
  window.VORO_DECEPTION_ACTIVE = false;
  window.__VORO_TEST_BYPASS__ = false; // Disable test mode for timing checks
  global.localStorage.test_mode_val = 'false';

  for (let i = 0; i < 5; i++) {
    mock.triggerDocStart('keydown', { type: 'keydown', key: 'a', isTrusted: true });
    await wait(50); // Human-like dwell time (50ms)
    mock.triggerDocEnd('keyup', { type: 'keyup', key: 'a', isTrusted: true });
    await wait(100); // Wait between keystrokes
  }

  if (lockdownCount === 0 && !window.VORO_COMPROMISED) {
    console.log("✅ Success: Human input accepted gracefully without triggering lockdown.");
  } else {
    throw new Error("❌ Failure: Natural human input incorrectly triggered security lockdown!");
  }

  // --- TEST 2: Programmatic Bot Input (Anomalies) ---
  console.log("🤖 Test 2: Simulating Robotic Automated Input...");
  lockdownCount = 0;
  window.VORO_COMPROMISED = false;
  window.VORO_DECEPTION_ACTIVE = false;
  window.__VORO_TEST_BYPASS__ = false;
  global.localStorage.test_mode_val = 'false';

  for (let i = 0; i < 6; i++) {
    mock.triggerDocStart('keydown', { type: 'keydown', key: 'b', isTrusted: true });
    // Sub-millisecond or zero dwell time (programmatic simulation)
    mock.triggerDocEnd('keyup', { type: 'keyup', key: 'b', isTrusted: true });
    await wait(10);
  }

  if (lockdownCount > 0 || window.VORO_COMPROMISED) {
    console.log("✅ Success: KDICA successfully detected bot cadence and triggered security lockdown!");
  } else {
    throw new Error("❌ Failure: Rapid/Robotic automated input bypassed KDICA checks!");
  }

  // --- TEST 3: Authorized Test Mode Bypass ---
  console.log("🛠️ Test 3: Simulating Robotic Input in Test Mode...");
  lockdownCount = 0;
  window.VORO_COMPROMISED = false;
  window.VORO_DECEPTION_ACTIVE = false;
  window.__VORO_TEST_BYPASS__ = true; // Enable test bypass
  global.localStorage.test_mode_val = 'true';

  for (let i = 0; i < 6; i++) {
    mock.triggerDocStart('keydown', { type: 'keydown', key: 'c', isTrusted: true });
    mock.triggerDocEnd('keyup', { type: 'keyup', key: 'c', isTrusted: true });
    await wait(10);
  }

  if (lockdownCount === 0 && !window.VORO_COMPROMISED) {
    console.log("✅ Success: Test mode correctly bypassed KDICA timing checks.");
  } else {
    throw new Error("❌ Failure: Test mode failed to bypass KDICA timing checks!");
  }

  console.log("\n🎉 ALL KDICA SECURITY VERIFICATION TESTS PASSED SUCCESSFULLY!");
  console.log("=========================================");
  process.exit(0);
};

runTests().catch(err => {
  console.error(err);
  process.exit(1);
});
