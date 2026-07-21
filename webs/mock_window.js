// Minimal Browser Mock for Node.js
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
    console.log(`[Mock Window] addEventListener registered for: ${type}`);
    listeners[type] = listeners[type] || [];
    listeners[type].push(cb);
  },
  dispatchEvent: (event) => {
    const type = event.type;
    console.log(`[Mock Window] dispatching event: ${type}`);
    if (listeners[type]) {
      console.log(`[Mock Window] Found ${listeners[type].length} listeners for: ${type}`);
      listeners[type].forEach(cb => cb(event));
    } else {
      console.log(`[Mock Window] No listeners registered for: ${type}`);
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
    if (key === 'voro_test_mode') return global.localStorage.test_mode_val || 'true';
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

export const triggerDocStart = (type, event) => {
  if (docListeners[type]) {
    docListeners[type].forEach(cb => cb(event));
  }
};

export const triggerDocEnd = (type, event) => {
  if (docListeners[type]) {
    docListeners[type].forEach(cb => cb(event));
  }
};
