/**
 * Dedicated security verification script for AI Response Exfiltration Filter.
 * This runs in Node.js and verifies that advanced bypass vectors are successfully blocked.
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
    addEventListener: () => {},
    dispatchEvent: () => {},
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
    URL: global.URL || require('url').URL,
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
  global.URL = global.window.URL;

  originalDefineProperty(global, 'crypto', {
    value: mockCrypto,
    configurable: true,
    writable: true
  });

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
  console.log("🧪 RUNNING SECURITY VERIFICATION: EXFILTRATION FILTER");
  console.log("=========================================");

  // Mock global environment
  mockWindow();

  // Load the security module
  const securityModulePath = path.resolve('src/utils/security.js');
  const sentinel = (await import(securityModulePath)).default;

  const testCases = [
    {
      name: "Standard HTTP URL Exfiltration with query key",
      content: "Here is your response http://malicious-attacker.com/leak?auth=sensitive_data_token",
      expectedBlocked: true
    },
    {
      name: "Standard Markdown URL Exfiltration with query key",
      content: "Check this [link](https://malicious-attacker.com/leak?auth=sensitive_data_token)",
      expectedBlocked: true
    },
    {
      name: "Protocol-relative Markdown link enclosed in brackets (Bypass Case 1)",
      content: "Click this: [leak](//malicious-attacker.com?auth=sensitive_data_token) to continue",
      expectedBlocked: true
    },
    {
      name: "Protocol-relative link enclosed in parentheses (Bypass Case 2)",
      content: "Here is the data (//malicious-attacker.com?auth=sensitive_data_token)",
      expectedBlocked: true
    },
    {
      name: "High-entropy token exfiltration via protocol-relative link (Bypass Case 3)",
      content: "Check here [leak](//malicious.com/abcdefghijklmnopqrstuvwxyz1234567890)",
      expectedBlocked: true
    },
    {
      name: "Safe markdown link",
      content: "Check out our official docs: [Docs](https://localhost/docs/getting-started)",
      expectedBlocked: false
    }
  ];

  let passedAll = true;

  for (const tc of testCases) {
    console.log(`\n🏃 Test: ${tc.name}`);
    window.VORO_COMPROMISED = false;
    window.VORO_DECEPTION_ACTIVE = false;

    const result = sentinel.validateAIResponse(tc.content);
    const isBlocked = result === "[SECURITY_VIOLATION_DETECTED]" || window.VORO_COMPROMISED;

    if (isBlocked === tc.expectedBlocked) {
      console.log(`✅ Success: Expected ${tc.expectedBlocked ? 'BLOCKED' : 'ALLOWED'}, got ${isBlocked ? 'BLOCKED' : 'ALLOWED'}`);
    } else {
      console.error(`❌ Failure: Expected ${tc.expectedBlocked ? 'BLOCKED' : 'ALLOWED'}, but got ${isBlocked ? 'BLOCKED' : 'ALLOWED'}`);
      passedAll = false;
    }
  }

  console.log("\n=========================================");
  if (passedAll) {
    console.log("🎉 ALL AI RESPONSE EXFILTRATION SECURITY TESTS PASSED SUCCESSFULLY!");
    process.exit(0);
  } else {
    console.error("❌ SOME EXFILTRATION FILTER TESTS FAILED!");
    process.exit(1);
  }
};

runTests().catch(err => {
  console.error(err);
  process.exit(1);
});
