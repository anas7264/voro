// mock_window.js
var originalDefineProperty = Object.defineProperty;
Object.defineProperty = function(obj, prop, descriptor) {
  if (obj && prop === "VORO_COMPROMISED") {
    return originalDefineProperty(obj, prop, {
      ...descriptor,
      configurable: true,
      writable: true
    });
  }
  return originalDefineProperty(obj, prop, descriptor);
};
var listeners = {};
var docListeners = {};
var mockCrypto = {
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
  location: { origin: "http://localhost" },
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
      listeners[type].forEach((cb) => cb(event));
    } else {
      console.log(`[Mock Window] No listeners registered for: ${type}`);
    }
  },
  crypto: mockCrypto,
  self: {},
  top: {},
  VORO_COMPROMISED: false,
  VORO_DECEPTION_ACTIVE: false,
  __VORO_TEST_BYPASS__: true,
  // Start in test mode to bypass load checks
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
global.CustomEvent = class CustomEvent2 {
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
  removeEventListener: () => {
  }
};
global.performance = global.window.performance;
originalDefineProperty(global, "crypto", {
  value: mockCrypto,
  configurable: true,
  writable: true
});
originalDefineProperty(global, "navigator", {
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
    if (key === "voro_test_mode") return global.localStorage.test_mode_val || "true";
    return null;
  },
  setItem: () => {
  },
  removeItem: () => {
  },
  clear: () => {
  }
};
global.localStorage.test_mode_val = "true";
global.sessionStorage = {
  clear: () => {
  }
};
var triggerDocStart = (type, event) => {
  if (docListeners[type]) {
    docListeners[type].forEach((cb) => cb(event));
  }
};

// src/utils/security.js
var _toString = Function.prototype.toString;
var _OToString = Object.prototype.toString;
var _call = Function.prototype.call;
var _apply = Function.prototype.apply;
var _bind = Function.prototype.bind;
var _test = RegExp.prototype.test;
var _exec = RegExp.prototype.exec;
var _split = String.prototype.split;
var _SIncludes = String.prototype.includes;
var _match = String.prototype.match;
var _replace = String.prototype.replace;
var _padStart = String.prototype.padStart;
var _toLowerCase = String.prototype.toLowerCase;
var _startsWith = String.prototype.startsWith;
var _endsWith = String.prototype.endsWith;
var _slice = String.prototype.slice;
var _trim = String.prototype.trim;
var _forEach = Array.prototype.forEach;
var _filter = Array.prototype.filter;
var _map = Array.prototype.map;
var _reduce = Array.prototype.reduce;
var _AIncludes = Array.prototype.includes;
var _join = Array.prototype.join;
var _push = Array.prototype.push;
var _reverse = Array.prototype.reverse;
var _ASlice = Array.prototype.slice;
var _find = Array.prototype.find;
var _some = Array.prototype.some;
var _every = Array.prototype.every;
var _URLSearch = typeof URL !== "undefined" ? Object.getOwnPropertyDescriptor(URL.prototype, "search")?.get : null;
var _URLHash = typeof URL !== "undefined" ? Object.getOwnPropertyDescriptor(URL.prototype, "hash")?.get : null;
var _URLHostname = typeof URL !== "undefined" ? Object.getOwnPropertyDescriptor(URL.prototype, "hostname")?.get : null;
var _URLOrigin = typeof URL !== "undefined" ? Object.getOwnPropertyDescriptor(URL.prototype, "origin")?.get : null;
var _parseFromString = typeof DOMParser !== "undefined" ? DOMParser.prototype.parseFromString : null;
var _MapGet = Map.prototype.get;
var _MapSet = Map.prototype.set;
var _MapHas = Map.prototype.has;
var _MapDelete = Map.prototype.delete;
var _MapClear = Map.prototype.clear;
var _MapEntries = Map.prototype.entries;
var _SetAdd = Set.prototype.add;
var _SetHas = Set.prototype.has;
var _SetDelete = Set.prototype.delete;
var _WeakMapGet = WeakMap.prototype.get;
var _WeakMapSet = WeakMap.prototype.set;
var _WeakMapHas = WeakMap.prototype.has;
var _WeakSetAdd = WeakSet.prototype.add;
var _WeakSetHas = WeakSet.prototype.has;
var _Uint8Fill = Uint8Array.prototype.fill;
var _Uint8Set = Uint8Array.prototype.set;
var _Uint8Slice = Uint8Array.prototype.slice;
var _TEncoderEncode = typeof TextEncoder !== "undefined" ? TextEncoder.prototype.encode : null;
var _TDecoderDecode = typeof TextDecoder !== "undefined" ? TextDecoder.prototype.decode : null;
var _ArrayFrom = Array.from;
var _PromiseThen = Promise.prototype.then;
var _PromiseCatch = Promise.prototype.catch;
var _PromiseFinally = Promise.prototype.finally;
var _rAF = typeof window !== "undefined" ? window.requestAnimationFrame : null;
var _rIC = typeof window !== "undefined" ? window.requestIdleCallback : null;
var _Object = Object;
var _Array = Array;
var _Function = Function;
var _Reflect = typeof Reflect !== "undefined" ? Reflect : null;
var _JSON = JSON;
var _Promise = Promise;
var _Proxy = Proxy;
var _Map = Map;
var _Set = Set;
var _Uint8Array = Uint8Array;
var _NToString = Number.prototype.toString;
var _setInterval = typeof setInterval !== "undefined" ? setInterval : null;
var _setTimeout = typeof setTimeout !== "undefined" ? setTimeout : null;
var _Error = Error;
var _RegExp = RegExp;
var _Date = Date;
var _log2 = Math.log2;
var _fetch = typeof window !== "undefined" ? window.fetch : null;
var _open = typeof window !== "undefined" ? window.open : null;
var _XHR = typeof window !== "undefined" ? window.XMLHttpRequest : null;
var _BroadcastChannel = typeof window !== "undefined" ? window.BroadcastChannel : null;
var _BCPostMessage = typeof window !== "undefined" && window.BroadcastChannel ? window.BroadcastChannel.prototype.postMessage : null;
var _indexedDBOpen = typeof window !== "undefined" && window.indexedDB ? window.indexedDB.open : null;
var _Headers = typeof Headers !== "undefined" ? Headers : null;
var _XHROpen = typeof window !== "undefined" && window.XMLHttpRequest ? window.XMLHttpRequest.prototype.open : null;
var _XHRSetRequestHeader = typeof window !== "undefined" && window.XMLHttpRequest ? window.XMLHttpRequest.prototype.setRequestHeader : null;
var _WebSocket = typeof window !== "undefined" ? window.WebSocket : null;
var _sendBeacon = typeof window !== "undefined" && window.navigator ? window.navigator.sendBeacon : null;
var _SWRegister = typeof window !== "undefined" && window.navigator?.serviceWorker ? window.navigator.serviceWorker.register : null;
var _writeText = typeof window !== "undefined" && window.navigator?.clipboard ? window.navigator.clipboard.writeText : null;
var _readText = typeof window !== "undefined" && window.navigator?.clipboard ? window.navigator.clipboard.readText : null;
var _share = typeof window !== "undefined" && window.navigator ? window.navigator.share : null;
var _URL = typeof window !== "undefined" ? window.URL : null;
var _createObjectURL = typeof window !== "undefined" && window.URL ? window.URL.createObjectURL : null;
var _revokeObjectURL = typeof window !== "undefined" && window.URL ? window.URL.revokeObjectURL : null;
var _RTCPeerConnection = typeof window !== "undefined" ? window.RTCPeerConnection || window.webkitRTCPeerConnection : null;
var _EventSource = typeof window !== "undefined" ? window.EventSource : null;
var _Worker = typeof window !== "undefined" ? window.Worker : null;
var _SharedWorker = typeof window !== "undefined" ? window.SharedWorker : null;
var _Request = typeof Request !== "undefined" ? Request : null;
var _Response = typeof Response !== "undefined" ? Response : null;
var _ResponseJSON = typeof Response !== "undefined" && Response.prototype ? Response.prototype.json : null;
var _ResponseText = typeof Response !== "undefined" && Response.prototype ? Response.prototype.text : null;
var _ResponseBlob = typeof Response !== "undefined" && Response.prototype ? Response.prototype.blob : null;
var _ResponseArrayBuffer = typeof Response !== "undefined" && Response.prototype ? Response.prototype.arrayBuffer : null;
var _ResponseFormData = typeof Response !== "undefined" && Response.prototype ? Response.prototype.formData : null;
var _StorageGetItem = typeof window !== "undefined" && typeof Storage !== "undefined" ? Storage.prototype.getItem : null;
var _StorageSetItem = typeof window !== "undefined" && typeof Storage !== "undefined" ? Storage.prototype.setItem : null;
var _StorageRemoveItem = typeof window !== "undefined" && typeof Storage !== "undefined" ? Storage.prototype.removeItem : null;
var _StorageClear = typeof window !== "undefined" && typeof Storage !== "undefined" ? Storage.prototype.clear : null;
var _SubtleEncrypt = typeof window !== "undefined" && window.crypto?.subtle ? window.crypto.subtle.encrypt : null;
var _SubtleDecrypt = typeof window !== "undefined" && window.crypto?.subtle ? window.crypto.subtle.decrypt : null;
var _SubtleDeriveKey = typeof window !== "undefined" && window.crypto?.subtle ? window.crypto.subtle.deriveKey : null;
var _SubtleImportKey = typeof window !== "undefined" && window.crypto?.subtle ? window.crypto.subtle.importKey : null;
var _SubtleGenerateKey = typeof window !== "undefined" && window.crypto?.subtle ? window.crypto.subtle.generateKey : null;
var _freeze = Object.freeze;
var _values = Object.values;
var _entries = Object.entries;
var _defineProperty = Object.defineProperty;
var _getOwnPropertyNames = Object.getOwnPropertyNames;
var _getOwnPropertySymbols = Object.getOwnPropertySymbols;
var _getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
var _getPrototypeOf = Object.getPrototypeOf;
var _hasOwnProperty = Object.prototype.hasOwnProperty;
var _ReflectApply = typeof Reflect !== "undefined" ? Reflect.apply : null;
var _ReflectDefineProperty = typeof Reflect !== "undefined" ? Reflect.defineProperty : null;
var _ReflectGetOwnPropertyDescriptor = typeof Reflect !== "undefined" ? Reflect.getOwnPropertyDescriptor : null;
var _ReflectOwnKeys = typeof Reflect !== "undefined" ? Reflect.ownKeys : null;
var _perfNow = typeof performance !== "undefined" && performance.now ? _ReflectApply ? _ReflectApply(_bind, performance.now, [performance]) : performance.now.bind(performance) : null;
var _seal = Object.seal;
var _preventExtensions = Object.preventExtensions;
var _isFrozen = Object.isFrozen;
var PULSE_INTERVAL = 3e4;
var PULSE_DRIFT_THRESHOLD = PULSE_INTERVAL + 1e4;
var _lastIntegrityPulse = 0;
var _activeContext = null;
var _lastUserInteraction = 0;
var USER_PRESENCE_THRESHOLD = 3e4;
var _kdicaPresses = /* @__PURE__ */ new Map();
var _kdicaAnomalies = 0;
var KDICA_ANOMALY_THRESHOLD = 5;
var isTestMode = () => {
  if (typeof window === "undefined") return false;
  const testModeMarker = typeof localStorage !== "undefined" && _StorageGetItem ? _call.call(_StorageGetItem, localStorage, "voro_test_mode") : null;
  return window.__VORO_TEST_BYPASS__ === true || testModeMarker === "true";
};
var initializeUserPresence = () => {
  if (typeof window === "undefined" || typeof document === "undefined") return;
  const updatePresence = (e) => {
    if (e.isTrusted) {
      _lastUserInteraction = _perfNow ? _call.call(_perfNow, performance) : Date.now();
      if (typeof window !== "undefined" && window._voro_idle_shredded) {
        window._voro_idle_shredded = false;
        try {
          const activeEvent = new CustomEvent("voro-security-user-active", {
            detail: { timestamp: _lastUserInteraction }
          });
          window.dispatchEvent(activeEvent);
        } catch (err) {
        }
        if (_console.info) {
          _call.call(_console.info, console, "Security Sentinel: User re-attested. Session re-activated.");
        }
      }
    }
  };
  const handleInteractionStart = (e) => {
    updatePresence(e);
    if (isTestMode()) return;
    const id = e.type === "keydown" ? `key_${e.key}` : `mouse_${e.button || 0}`;
    const time = _perfNow ? _call.call(_perfNow, performance) : Date.now();
    _kdicaPresses.set(id, time);
  };
  const handleInteractionEnd = (e) => {
    if (isTestMode()) return;
    const id = e.type === "keyup" ? `key_${e.key}` : `mouse_${e.button || 0}`;
    const startTime = _kdicaPresses.get(id);
    if (!startTime) return;
    const endTime = _perfNow ? _call.call(_perfNow, performance) : Date.now();
    const duration = endTime - startTime;
    _kdicaPresses.delete(id);
    if (duration < 5) {
      _kdicaAnomalies++;
      if (_console.warn) {
        _call.call(_console.warn, console, `Security Sentinel: KDICA Anomaly detected (${e.type} duration: ${duration.toFixed(3)}ms). Anomalies: ${_kdicaAnomalies}/${KDICA_ANOMALY_THRESHOLD}`);
      }
      if (_kdicaAnomalies >= KDICA_ANOMALY_THRESHOLD) {
        if (_console.error) {
          _call.call(_console.error, console, `Security Sentinel: Programmatic bot/exfiltration pattern attested. Executing immediate lockdown.`);
        }
        executeLockdown();
      }
    } else if (duration >= 30 && duration <= 1e3) {
      _kdicaAnomalies = Math.max(0, _kdicaAnomalies - 1);
    }
  };
  ["mousedown", "keydown", "touchstart"].forEach((type) => {
    document.addEventListener(type, handleInteractionStart, { capture: true, passive: true });
  });
  ["mouseup", "keyup", "touchend"].forEach((type) => {
    document.addEventListener(type, handleInteractionEnd, { capture: true, passive: true });
  });
};
var _console = {
  log: typeof console !== "undefined" ? console.log : null,
  warn: typeof console !== "undefined" ? console.warn : null,
  error: typeof console !== "undefined" ? console.error : null,
  info: typeof console !== "undefined" ? console.info : null,
  debug: typeof console !== "undefined" ? console.debug : null,
  trace: typeof console !== "undefined" ? console.trace : null
};
var calculateEntropy = (str) => {
  if (!str || str.length < 20) return 0;
  const len = str.length;
  const frequencies = {};
  for (let i = 0; i < len; i++) {
    const char = str[i];
    frequencies[char] = (frequencies[char] || 0) + 1;
  }
  const values = _call.call(_values, Object, frequencies);
  return _call.call(_reduce, values, (sum, freq) => {
    const p = freq / len;
    return sum - p * _log2(p);
  }, 0);
};
var prototypeSnapshots = /* @__PURE__ */ new Map();
var corePrototypes = [
  { name: "Object", proto: Object.prototype },
  { name: "Array", proto: Array.prototype },
  { name: "Function", proto: Function.prototype },
  { name: "String", proto: String.prototype },
  { name: "Number", proto: Number.prototype },
  { name: "Boolean", proto: Boolean.prototype },
  { name: "Error", proto: Error.prototype }
];
var TRUSTED_WRAPPERS = /* @__PURE__ */ new WeakSet();
var snapshotPrototypes = () => {
  if (typeof window === "undefined") return;
  corePrototypes.forEach(({ name, proto }) => {
    try {
      const keys = _getOwnPropertyNames(proto);
      const symbols = _getOwnPropertySymbols ? _getOwnPropertySymbols(proto) : [];
      const currentKeys = [...keys, ...symbols];
      prototypeSnapshots.set(name, new Set(currentKeys));
      _call.call(_forEach, currentKeys, (key) => {
        if (isTestMode()) return;
        try {
          const desc = _getOwnPropertyDescriptor(proto, key);
          if (desc && desc.configurable) {
            const hardenedDesc = { configurable: false };
            if (_call.call(_hasOwnProperty, desc, "writable")) hardenedDesc.writable = false;
            _defineProperty(proto, key, hardenedDesc);
          }
        } catch (e) {
        }
      });
    } catch (e) {
    }
  });
};
snapshotPrototypes();
var initializeContextRibbon = () => {
  if (typeof window === "undefined") return;
  const wrapAsync = (native, name) => {
    return function(...args) {
      const capturedContext = _activeContext;
      const wrappedArgs = _call.call(_map, args, (arg) => {
        if (typeof arg === "function") {
          return function(...fnArgs) {
            const prevContext = _activeContext;
            _activeContext = capturedContext;
            try {
              return _ReflectApply ? _ReflectApply(arg, this, fnArgs) : _call.call(arg, this, ...fnArgs);
            } finally {
              _activeContext = prevContext;
            }
          };
        }
        return arg;
      });
      return _ReflectApply ? _ReflectApply(native, this, wrappedArgs) : _call.call(native, this, ...wrappedArgs);
    };
  };
  if (_PromiseThen) {
    Promise.prototype.then = wrapAsync(_PromiseThen, "Promise.then");
    TRUSTED_WRAPPERS.add(Promise.prototype.then);
  }
  if (_PromiseCatch) {
    Promise.prototype.catch = wrapAsync(_PromiseCatch, "Promise.catch");
    TRUSTED_WRAPPERS.add(Promise.prototype.catch);
  }
  if (_PromiseFinally) {
    Promise.prototype.finally = wrapAsync(_PromiseFinally, "Promise.finally");
    TRUSTED_WRAPPERS.add(Promise.prototype.finally);
  }
  if (_setTimeout) {
    window.setTimeout = wrapAsync(_setTimeout, "setTimeout");
    TRUSTED_WRAPPERS.add(window.setTimeout);
  }
  if (_setInterval) {
    window.setInterval = wrapAsync(_setInterval, "setInterval");
    TRUSTED_WRAPPERS.add(window.setInterval);
  }
  if (_rAF) {
    window.requestAnimationFrame = wrapAsync(_rAF, "requestAnimationFrame");
    TRUSTED_WRAPPERS.add(window.requestAnimationFrame);
  }
  if (_rIC) {
    window.requestIdleCallback = wrapAsync(_rIC, "requestIdleCallback");
    TRUSTED_WRAPPERS.add(window.requestIdleCallback);
  }
};
initializeContextRibbon();
var _cloakingCache = /* @__PURE__ */ new WeakMap();
var _trapEntropy = generateSecurityNonce();
var _generateDynamicTraps = (target, key) => {
  const traps = {
    get(obj, prop) {
      if (typeof window !== "undefined" && window.VORO_COMPROMISED || isDeceptionActive()) {
        if (key) {
          const decoy = getDecoyData(key);
          if (decoy && typeof decoy === "object") return decoy[prop];
        }
        return void 0;
      }
      const value = obj[prop];
      if (value && typeof value === "object" && !_isFrozen(value)) {
        return createSecureProxy(value, key ? `${key}.${String(prop)}` : null);
      }
      return value;
    },
    set(obj, prop, value) {
      if (typeof window !== "undefined" && window.VORO_COMPROMISED || isDeceptionActive()) return false;
      obj[prop] = value;
      return true;
    },
    defineProperty(obj, prop, desc) {
      if (typeof window !== "undefined" && window.VORO_COMPROMISED || isDeceptionActive()) return false;
      return _ReflectDefineProperty(obj, prop, desc);
    },
    deleteProperty(obj, prop) {
      if (typeof window !== "undefined" && window.VORO_COMPROMISED || isDeceptionActive()) return false;
      return _Reflect ? _Reflect.deleteProperty(obj, prop) : delete obj[prop];
    },
    ownKeys(obj) {
      if (typeof window !== "undefined" && window.VORO_COMPROMISED || isDeceptionActive()) return [];
      return _ReflectOwnKeys(obj);
    },
    getPrototypeOf(obj) {
      if (typeof window !== "undefined" && window.VORO_COMPROMISED || isDeceptionActive()) return null;
      return _getPrototypeOf(obj);
    }
  };
  if (_trapEntropy[0] > "8") {
    traps.has = (obj, prop) => {
      if (typeof window !== "undefined" && window.VORO_COMPROMISED || isDeceptionActive()) return false;
      return prop in obj;
    };
  }
  return traps;
};
var rotateCloakingCache = () => {
  _cloakingCache = /* @__PURE__ */ new WeakMap();
};
var createSecureProxy = (target, key = null) => {
  if (!target || typeof target !== "object" || _isFrozen(target)) return target;
  if (_call.call(_WeakMapHas, _cloakingCache, target)) {
    return _call.call(_WeakMapGet, _cloakingCache, target);
  }
  const proxy = new Proxy(target, _generateDynamicTraps(target, key));
  _call.call(_WeakMapSet, _cloakingCache, target, proxy);
  return proxy;
};
var checkPrototypeIntegrity = () => {
  if (typeof window === "undefined") return true;
  let compromised = false;
  corePrototypes.forEach(({ name, proto }) => {
    try {
      const keys = _getOwnPropertyNames(proto);
      const symbols = _getOwnPropertySymbols ? _getOwnPropertySymbols(proto) : [];
      const currentKeys = [...keys, ...symbols];
      const originalKeys = prototypeSnapshots.get(name);
      if (!originalKeys) return;
      for (const key of currentKeys) {
        if (!originalKeys.has(key)) {
          const keyDesc = typeof key === "symbol" ? key.toString() : key;
          if (_console.error) _call.call(_console.error, console, `Security Sentinel: Prototype Pollution detected on ${name}.prototype.${keyDesc}. Proactively purging polluted property.`);
          try {
            delete proto[key];
          } catch (e) {
            try {
              _defineProperty(proto, key, { value: void 0, configurable: false, writable: false });
            } catch (innerE) {
            }
          }
          compromised = true;
        }
      }
      originalKeys.forEach((key) => {
        if (!currentKeys.includes(key)) {
          const keyDesc = typeof key === "symbol" ? key.toString() : key;
          if (_console.error) _call.call(_console.error, console, `Security Sentinel: Prototype Tampering detected (deleted): ${name}.prototype.${keyDesc}`);
          compromised = true;
        }
      });
    } catch (e) {
      compromised = true;
    }
  });
  if (compromised) {
    executeLockdown();
  }
  return !compromised;
};
var validateCallStack = () => {
  if (typeof window === "undefined" || isTestMode()) return true;
  if (window.VORO_COMPROMISED) return false;
  try {
    const stack = new _Error().stack;
    if (!stack) return true;
    const lines = _call.call(_split, stack, "\n");
    const trustedOrigin = window.location.origin;
    if (lines.length > 50) {
      if (_console.error) _call.call(_console.error, console, "Security Sentinel: Abnormal call stack depth detected.");
      executeLockdown();
      return false;
    }
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      if (!line || _call.call(_SIncludes, line, "validateCallStack")) continue;
      if (_call.call(_SIncludes, line, "<anonymous>") || _call.call(_SIncludes, line, "eval at") || _call.call(_SIncludes, line, "at eval")) {
        if (_console.error) _call.call(_console.error, console, "Security Sentinel: Unauthorized execution context (eval/anonymous) detected in call stack.");
        executeLockdown();
        return false;
      }
      const dangerousProtocols = ["blob:", "data:", "filesystem:", "chrome-extension:", "moz-extension:", "extension:", "about:"];
      if (_call.call(_some, dangerousProtocols, (proto) => _call.call(_SIncludes, line, proto))) {
        if (_console.error) _call.call(_console.error, console, "Security Sentinel: Unauthorized protocol detected in call stack.");
        executeLockdown();
        return false;
      }
      const urlMatch = _call.call(_match, line, /(https?:\/\/[^\s)]+)/);
      if (urlMatch) {
        try {
          const cleanUrl = _call.call(_replace, urlMatch[0], /:\d+(?::\d+)?$/, "");
          const urlObj = new URL(cleanUrl);
          if (_call.call(_URLOrigin, urlObj) !== trustedOrigin) {
            if (_console.error) _call.call(_console.error, console, `Security Sentinel: Cross-origin script provenance detected: ${_call.call(_URLOrigin, urlObj)}`);
            executeLockdown();
            return false;
          }
        } catch (e) {
          if (_console.error) _call.call(_console.error, console, "Security Sentinel: Malformed or obfuscated provenance URL detected.");
          executeLockdown();
          return false;
        }
      }
    }
    return true;
  } catch (e) {
    if (_console.error) _call.call(_console.error, console, "Security Sentinel: Call stack analysis failed.", e);
    executeLockdown();
    return false;
  }
};
var sanitizeInput = (input) => {
  if (typeof input !== "string") return input;
  input = _call.call(_replace, input, /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F\u200B-\u200D\uFEFF]/g, "");
  if (typeof window !== "undefined" && window.DOMParser && _parseFromString) {
    try {
      const parser = new DOMParser();
      const doc = _call.call(_parseFromString, parser, input, "text/html");
      const dangerousTags = ["script", "style", "iframe", "object", "embed", "link", "base", "form", "meta", "svg", "math", "applet", "frame", "frameset", "video", "audio", "canvas", "details", "template"];
      _call.call(_forEach, dangerousTags, (tag) => {
        const elements = doc.getElementsByTagName(tag);
        while (elements.length > 0) {
          elements[0].parentNode.removeChild(elements[0]);
        }
      });
      const allElements = doc.querySelectorAll("*");
      _call.call(_forEach, allElements, (el) => {
        for (let i = 0; i < el.attributes.length; i++) {
          const attr = _call.call(_toLowerCase, el.attributes[i].name);
          const value = _call.call(_toLowerCase, el.attributes[i].value);
          if (_call.call(_startsWith, attr, "on") || attr === "action" || attr === "formaction" || (attr === "href" || attr === "src") && _call.call(_startsWith, value, "javascript:")) {
            el.removeAttribute(el.attributes[i].name);
            i--;
          }
        }
      });
      return doc.body.textContent || doc.body.innerText || "";
    } catch (e) {
      if (_console.warn) _call.call(_console.warn, console, "DOMParser sanitization failed, falling back to regex", e);
    }
  }
  let r = input;
  r = _call.call(_replace, r, /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
  r = _call.call(_replace, r, /<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "");
  r = _call.call(_replace, r, /\bon\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "");
  r = _call.call(_replace, r, /\b(?:form)?action\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "");
  r = _call.call(_replace, r, /javascript:[^"']*/gi, "");
  r = _call.call(_replace, r, /<[^>]*>/g, "");
  return r;
};
function generateSecurityNonce() {
  if (typeof window === "undefined" || !window.crypto) {
    return Math.random().toString(36).substring(2, 15);
  }
  const array = new Uint8Array(16);
  window.crypto.getRandomValues(array);
  return _call.call(_join, _call.call(_map, _ArrayFrom(array), (byte) => _call.call(_padStart, _call.call(_NToString, byte, 16), 2, "0")), "");
}
var voroPolicy = typeof window !== "undefined" && window.trustedTypes ? window.trustedTypes.createPolicy("voroPolicy", {
  createHTML: (input) => sanitizeInput(input),
  createScript: (input) => {
    console.error("Security Sentinel: Dynamic script creation blocked by Trusted Types.");
    return "";
  },
  createScriptURL: (input) => {
    const allowedDomains = ["self", "https://fonts.googleapis.com", "https://fonts.gstatic.com"];
    const url = new URL(input, window.location.origin);
    if (allowedDomains.includes(url.origin) || url.origin === window.location.origin) {
      return input;
    }
    console.error("Security Sentinel: External script URL blocked by Trusted Types.");
    return "";
  }
}) : {
  createHTML: (input) => sanitizeInput(input),
  createScript: (input) => {
    if (_console.error) _call.call(_console.error, console, "Security Sentinel: Dynamic script creation blocked by Trusted Types Fallback.");
    return "";
  },
  createScriptURL: (input) => {
    if (_console.error) _call.call(_console.error, console, "Security Sentinel: External script URL blocked by Trusted Types Fallback.");
    return "";
  }
};
var DECOY_DATA = {
  user: { id: "voro_anon_7721", name: "Elite User", level: 42, status: "Active" },
  profile: {
    name: "Elite User",
    goal: "Maintenance",
    activity: "Highly Active",
    preferences: { theme: "dark", units: "metric" }
  },
  nutrition_log: [
    { date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0], meal: "Breakfast", calories: 650, protein: 45 },
    { date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0], meal: "Lunch", calories: 800, protein: 55 }
  ],
  workout_log: [
    { date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0], exercise: "Bench Press", sets: 5, reps: 5, weight: 100 }
  ],
  vitals: { heart_rate: 62, systolic: 118, diastolic: 78, oxygen: 99 },
  settings: { notifications: true, privacy_mode: "maximum", biometric_auth: true },
  chat_history: [],
  notifications: [],
  achievements: [],
  habits: []
};
var DEFAULT_DECOY = _freeze({ status: "secure", integrity: "verified" });
var getDecoyData = (key) => {
  const baseKey = key.replace(/^voro_/, "");
  return DECOY_DATA[baseKey] || DECOY_DATA[key] || DEFAULT_DECOY;
};
var isDeceptionActive = () => {
  return typeof window !== "undefined" && window.VORO_DECEPTION_ACTIVE === true;
};
var checkUserPresence = () => {
  if (isTestMode()) return true;
  const now = _perfNow ? _call.call(_perfNow, performance) : Date.now();
  return now - _lastUserInteraction <= USER_PRESENCE_THRESHOLD;
};
var activeCapabilities = /* @__PURE__ */ new Map();
var ATTESTATION_WHITELIST = [
  "self",
  "https://fonts.googleapis.com",
  "https://fonts.gstatic.com"
];
var executeSecurely = async (action, callback, requiredCapabilities = []) => {
  if (typeof window === "undefined") return await callback();
  if (!validateCallStack()) {
    throw new _Error("Security Sentinel: Secure execution context denied due to unauthorized provenance.");
  }
  const nonce = generateSecurityNonce();
  const opaquePrefix = _call.call(_slice, generateSecurityNonce(), 0, 8);
  const tag = `__VORO_${opaquePrefix}_CTX_${nonce}__`;
  _call.call(_MapSet, activeCapabilities, nonce, {
    action,
    timestamp: _perfNow ? _call.call(_perfNow, performance) : Date.now(),
    capabilities: Array.isArray(requiredCapabilities) ? requiredCapabilities : [requiredCapabilities],
    consumed: /* @__PURE__ */ new Set(),
    tag
  });
  try {
    const context = {
      [tag]: async () => {
        const prevContext = _activeContext;
        _activeContext = { nonce, tag };
        try {
          return await callback();
        } finally {
          _activeContext = prevContext;
        }
      }
    };
    return await context[tag]();
  } finally {
    _call.call(_MapDelete, activeCapabilities, nonce);
  }
};
var verifyAttestation = (sinkName, targetUrl = null) => {
  if (typeof window === "undefined") return true;
  if (window.VORO_COMPROMISED) return false;
  if (targetUrl) {
    try {
      const url = new URL(targetUrl, window.location.origin);
      if (ATTESTATION_WHITELIST.includes("self") && url.origin === window.location.origin) return true;
      if (ATTESTATION_WHITELIST.some((allowed) => url.origin === allowed)) return true;
    } catch (e) {
    }
  }
  try {
    const stack = new _Error().stack;
    if (!stack) return false;
    let authorized = false;
    let authorizedNonce = null;
    for (const [nonce, record] of activeCapabilities.entries()) {
      const inStack = stack.includes(record.tag);
      const inRibbon = _activeContext && _activeContext.nonce === nonce;
      if (inStack || inRibbon) {
        const hasSinkCap = record.capabilities.includes(`sink:${sinkName}`);
        let hasDomainCap = true;
        if (targetUrl) {
          try {
            const url = new URL(targetUrl, window.location.origin);
            const domainCap = `domain:${url.host}`;
            const restrictedDomains = record.capabilities.filter((c) => c.startsWith("domain:"));
            if (restrictedDomains.length > 0) {
              hasDomainCap = restrictedDomains.includes(domainCap);
            }
          } catch (e) {
            hasDomainCap = false;
          }
        }
        if (hasSinkCap && hasDomainCap) {
          if (record.capabilities.includes("requirement:user-presence") && !isTestMode()) {
            const now2 = _perfNow ? _call.call(_perfNow, performance) : Date.now();
            const idleTime = now2 - _lastUserInteraction;
            if (idleTime > USER_PRESENCE_THRESHOLD) {
              if (_console.warn) _call.call(_console.warn, console, `Security Sentinel: GNCA Violation for ${sinkName}. User presence required but not detected (Idle: ${Math.round(idleTime)}ms).`);
              return false;
            }
          }
          const consumptionToken = `${sinkName}${targetUrl ? `:${targetUrl}` : ""}`;
          if (record.consumed.has(consumptionToken)) {
            if (_console.warn) _call.call(_console.warn, console, `Security Sentinel: Single-shot violation for ${sinkName}. Authorization already consumed.`);
            return false;
          }
          authorized = true;
          authorizedNonce = nonce;
          record.consumed.add(consumptionToken);
          break;
        }
      }
    }
    if (!authorized) {
      if (_console.error) _call.call(_console.error, console, `Security Sentinel: GNCA Violation for ${sinkName}. Call originated outside of authorized scope or lacks granular capabilities [target: ${targetUrl || "none"}].`);
      if (targetUrl && (targetUrl.includes("api.anthropic.com") || targetUrl.includes("openai.com"))) {
        executeLockdown();
      }
      return false;
    }
    const now = _perfNow ? _call.call(_perfNow, performance) : Date.now();
    const drift = now - _lastIntegrityPulse;
    if (drift > PULSE_DRIFT_THRESHOLD) {
      if (_console.error) _call.call(_console.error, console, `Security Sentinel: Attestation Permit expired for ${sinkName}. Integrity Pulse drift exceeded threshold [${Math.round(drift)}ms].`);
      executeLockdown();
      return false;
    }
    if (!validateCallStack()) {
      if (_console.error) _call.call(_console.error, console, `Security Sentinel: Attestation Permit mismatch for ${sinkName}. Provenance validation failed.`);
      executeLockdown();
      return false;
    }
    return true;
  } catch (e) {
    executeLockdown();
    return false;
  }
};
var initializeAttestationSinks = () => {
  if (typeof window === "undefined") return;
  if (_indexedDBOpen && window.indexedDB) {
    const idbWrapper = function(name, version) {
      const isSecureVault = name === "VORO_SECURE_STORAGE";
      if (isSecureVault && !verifyAttestation("indexedDB.open", "voro://enclave")) {
        throw new _Error("Enclave access blocked by VORO Neural Shield. No Attestation Permit found.");
      }
      return _ReflectApply ? _ReflectApply(_indexedDBOpen, window.indexedDB, arguments) : _call.call(_indexedDBOpen, window.indexedDB, name, version);
    };
    TRUSTED_WRAPPERS.add(idbWrapper);
    window.indexedDB.open = idbWrapper;
  }
  if (_open) {
    const openWrapper = function(url, target, features) {
      if (!verifyAttestation("window.open", url)) {
        if (_console.error) _call.call(_console.error, console, "Security Sentinel: window.open blocked. No Attestation Permit found.");
        return null;
      }
      return _ReflectApply ? _ReflectApply(_open, window, arguments) : _call.call(_open, window, url, target, features);
    };
    TRUSTED_WRAPPERS.add(openWrapper);
    window.open = openWrapper;
  }
  if (_fetch) {
    const fetchWrapper = function(...args) {
      const input = args[0];
      const init = args[1];
      const url = input instanceof Request ? input.url : input;
      if (!verifyAttestation("fetch", url)) {
        return Promise.reject(new _Error("Network command blocked by VORO Neural Shield. No Attestation Permit found."));
      }
      let secureArgs = args;
      if (init && init.headers) {
        const secureInit = { ...init };
        if (_Headers && init.headers instanceof _Headers) {
          const newHeaders = new _Headers(init.headers);
          const entries = newHeaders.entries();
          let entry;
          while (!(entry = entries.next()).done) {
            const [k, v] = entry.value;
            const resolved = _resolveValue(v);
            if (resolved !== v) newHeaders.set(k, resolved);
          }
          secureInit.headers = newHeaders;
        } else if (Array.isArray(init.headers)) {
          secureInit.headers = _call.call(_map, init.headers, (pair) => {
            if (Array.isArray(pair) && pair.length >= 2) {
              return [pair[0], _resolveValue(pair[1])];
            }
            return pair;
          });
        } else if (typeof init.headers === "object") {
          const newHeaders = { ...init.headers };
          _call.call(_forEach, _entries(newHeaders), ([k, v]) => {
            newHeaders[k] = _resolveValue(v);
          });
          secureInit.headers = newHeaders;
        }
        secureArgs = [input, secureInit];
      }
      return _ReflectApply ? _ReflectApply(_fetch, window, secureArgs) : _call.call(_fetch, window, ...secureArgs);
    };
    TRUSTED_WRAPPERS.add(fetchWrapper);
    window.fetch = fetchWrapper;
  }
  if (_XHR) {
    const OriginalXHR = _XHR;
    const xhrWrapper = function() {
      if (!verifyAttestation("XMLHttpRequest")) {
        throw new _Error("XHR creation blocked by VORO Neural Shield. No Attestation Permit found.");
      }
      return new OriginalXHR();
    };
    if (_XHROpen) {
      const openWrapper = function(method, url, async, user, password) {
        if (!verifyAttestation("XMLHttpRequest.open", url)) {
          throw new _Error("XHR.open blocked by VORO Neural Shield. No Attestation Permit found.");
        }
        return _ReflectApply ? _ReflectApply(_XHROpen, this, arguments) : _call.call(_XHROpen, this, method, url, async, user, password);
      };
      TRUSTED_WRAPPERS.add(openWrapper);
      OriginalXHR.prototype.open = openWrapper;
    }
    if (_XHRSetRequestHeader) {
      const setHeaderWrapper = function(name, value) {
        return _call.call(_XHRSetRequestHeader, this, name, _resolveValue(value));
      };
      TRUSTED_WRAPPERS.add(setHeaderWrapper);
      OriginalXHR.prototype.setRequestHeader = setHeaderWrapper;
    }
    xhrWrapper.prototype = OriginalXHR.prototype;
    _getOwnPropertyNames(OriginalXHR).forEach((prop) => {
      if (!xhrWrapper[prop]) {
        try {
          const descriptor = _getOwnPropertyDescriptor(OriginalXHR, prop);
          if (descriptor) _defineProperty(xhrWrapper, prop, descriptor);
        } catch (e) {
        }
      }
    });
    TRUSTED_WRAPPERS.add(xhrWrapper);
    window.XMLHttpRequest = xhrWrapper;
  }
  if (_WebSocket) {
    const OriginalWS = _WebSocket;
    const wsWrapper = function(url, protocols) {
      if (!verifyAttestation("WebSocket", url)) {
        throw new _Error("WebSocket connection blocked by VORO Neural Shield. No Attestation Permit found.");
      }
      return new OriginalWS(url, protocols);
    };
    wsWrapper.prototype = OriginalWS.prototype;
    _getOwnPropertyNames(OriginalWS).forEach((prop) => {
      if (!wsWrapper[prop]) {
        try {
          const descriptor = _getOwnPropertyDescriptor(OriginalWS, prop);
          if (descriptor) _defineProperty(wsWrapper, prop, descriptor);
        } catch (e) {
        }
      }
    });
    TRUSTED_WRAPPERS.add(wsWrapper);
    window.WebSocket = wsWrapper;
  }
  if (_sendBeacon && window.navigator) {
    const beaconWrapper = function(...args) {
      const url = args[0];
      if (!verifyAttestation("navigator.sendBeacon", url)) {
        return false;
      }
      return _ReflectApply ? _ReflectApply(_sendBeacon, window.navigator, args) : _call.call(_sendBeacon, window.navigator, ...args);
    };
    TRUSTED_WRAPPERS.add(beaconWrapper);
    window.navigator.sendBeacon = beaconWrapper;
  }
  if (_SWRegister && window.navigator?.serviceWorker) {
    const swWrapper = function(scriptURL, options) {
      if (!verifyAttestation("navigator.serviceWorker.register", scriptURL)) {
        return Promise.reject(new _Error("Service Worker registration blocked by VORO Neural Shield. No Attestation Permit found."));
      }
      return _call.call(_SWRegister, window.navigator.serviceWorker, scriptURL, options);
    };
    TRUSTED_WRAPPERS.add(swWrapper);
    window.navigator.serviceWorker.register = swWrapper;
  }
  if (_writeText && window.navigator?.clipboard) {
    const writeTextWrapper = function(text) {
      if (!verifyAttestation("navigator.clipboard.writeText")) {
        return Promise.reject(new _Error("Clipboard write blocked by VORO Neural Shield. No Attestation Permit found."));
      }
      return _call.call(_writeText, window.navigator.clipboard, text);
    };
    TRUSTED_WRAPPERS.add(writeTextWrapper);
    window.navigator.clipboard.writeText = writeTextWrapper;
  }
  if (_readText && window.navigator?.clipboard) {
    const readTextWrapper = function() {
      if (!verifyAttestation("navigator.clipboard.readText")) {
        return Promise.reject(new _Error("Clipboard read blocked by VORO Neural Shield. No Attestation Permit found."));
      }
      return _call.call(_readText, window.navigator.clipboard);
    };
    TRUSTED_WRAPPERS.add(readTextWrapper);
    window.navigator.clipboard.readText = readTextWrapper;
  }
  if (_share && window.navigator) {
    const shareWrapper = function(data) {
      if (!verifyAttestation("navigator.share")) {
        return Promise.reject(new _Error("Web Share blocked by VORO Neural Shield. No Attestation Permit found."));
      }
      return _call.call(_share, window.navigator, data);
    };
    TRUSTED_WRAPPERS.add(shareWrapper);
    window.navigator.share = shareWrapper;
  }
  if (_BroadcastChannel) {
    const OriginalBC = _BroadcastChannel;
    const bcWrapper = function(name) {
      if (!verifyAttestation("BroadcastChannel")) {
        throw new _Error("BroadcastChannel creation blocked by VORO Neural Shield. No Attestation Permit found.");
      }
      return new OriginalBC(name);
    };
    bcWrapper.prototype = OriginalBC.prototype;
    TRUSTED_WRAPPERS.add(bcWrapper);
    window.BroadcastChannel = bcWrapper;
  }
  if (_createObjectURL && window.URL) {
    const createObjectURLWrapper = function(obj) {
      if (!verifyAttestation("URL.createObjectURL")) {
        throw new _Error("URL.createObjectURL blocked by VORO Neural Shield. No Attestation Permit found.");
      }
      return _call.call(_createObjectURL, window.URL, obj);
    };
    TRUSTED_WRAPPERS.add(createObjectURLWrapper);
    window.URL.createObjectURL = createObjectURLWrapper;
  }
  if (_revokeObjectURL && window.URL) {
    const revokeObjectURLWrapper = function(url) {
      if (!verifyAttestation("URL.revokeObjectURL")) {
        throw new _Error("URL.revokeObjectURL blocked by VORO Neural Shield. No Attestation Permit found.");
      }
      return _call.call(_revokeObjectURL, window.URL, url);
    };
    TRUSTED_WRAPPERS.add(revokeObjectURLWrapper);
    window.URL.revokeObjectURL = revokeObjectURLWrapper;
  }
  if (_RTCPeerConnection) {
    const OriginalRTC = _RTCPeerConnection;
    const rtcWrapper = function(configuration) {
      if (!verifyAttestation("RTCPeerConnection")) {
        throw new _Error("WebRTC connection blocked by VORO Neural Shield. No Attestation Permit found.");
      }
      return new OriginalRTC(configuration);
    };
    rtcWrapper.prototype = OriginalRTC.prototype;
    _getOwnPropertyNames(OriginalRTC).forEach((prop) => {
      if (!rtcWrapper[prop]) {
        try {
          const descriptor = _getOwnPropertyDescriptor(OriginalRTC, prop);
          if (descriptor) _defineProperty(rtcWrapper, prop, descriptor);
        } catch (e) {
        }
      }
    });
    TRUSTED_WRAPPERS.add(rtcWrapper);
    window.RTCPeerConnection = rtcWrapper;
    if (window.webkitRTCPeerConnection) window.webkitRTCPeerConnection = rtcWrapper;
  }
  if (_EventSource) {
    const OriginalES = _EventSource;
    const esWrapper = function(url, configuration) {
      if (!verifyAttestation("EventSource", url)) {
        throw new _Error("EventSource connection blocked by VORO Neural Shield. No Attestation Permit found.");
      }
      return new OriginalES(url, configuration);
    };
    esWrapper.prototype = OriginalES.prototype;
    _getOwnPropertyNames(OriginalES).forEach((prop) => {
      if (!esWrapper[prop]) {
        try {
          const descriptor = _getOwnPropertyDescriptor(OriginalES, prop);
          if (descriptor) _defineProperty(esWrapper, prop, descriptor);
        } catch (e) {
        }
      }
    });
    TRUSTED_WRAPPERS.add(esWrapper);
    window.EventSource = esWrapper;
  }
  if (_Worker) {
    const OriginalWorker = _Worker;
    const workerWrapper = function(scriptURL, options) {
      if (!verifyAttestation("Worker", scriptURL)) {
        throw new _Error("Worker construction blocked by VORO Neural Shield. No Attestation Permit found.");
      }
      return new OriginalWorker(scriptURL, options);
    };
    workerWrapper.prototype = OriginalWorker.prototype;
    _getOwnPropertyNames(OriginalWorker).forEach((prop) => {
      if (!workerWrapper[prop]) {
        try {
          const descriptor = _getOwnPropertyDescriptor(OriginalWorker, prop);
          if (descriptor) _defineProperty(workerWrapper, prop, descriptor);
        } catch (e) {
        }
      }
    });
    TRUSTED_WRAPPERS.add(workerWrapper);
    window.Worker = workerWrapper;
  }
  if (_SharedWorker) {
    const OriginalSharedWorker = _SharedWorker;
    const sharedWorkerWrapper = function(scriptURL, options) {
      if (!verifyAttestation("SharedWorker", scriptURL)) {
        throw new _Error("SharedWorker construction blocked by VORO Neural Shield. No Attestation Permit found.");
      }
      return new OriginalSharedWorker(scriptURL, options);
    };
    sharedWorkerWrapper.prototype = OriginalSharedWorker.prototype;
    _getOwnPropertyNames(OriginalSharedWorker).forEach((prop) => {
      if (!sharedWorkerWrapper[prop]) {
        try {
          const descriptor = _getOwnPropertyDescriptor(OriginalSharedWorker, prop);
          if (descriptor) _defineProperty(sharedWorkerWrapper, prop, descriptor);
        } catch (e) {
        }
      }
    });
    TRUSTED_WRAPPERS.add(sharedWorkerWrapper);
    window.SharedWorker = sharedWorkerWrapper;
  }
  if (_Request) {
    const OriginalRequest = _Request;
    const requestWrapper = function(input, init) {
      const url = typeof input === "string" ? input : input instanceof Request ? input.url : input?.url;
      if (!verifyAttestation("Request", url)) {
        throw new _Error("Request construction blocked by VORO Neural Shield. No Attestation Permit found.");
      }
      let secureInit = init;
      if (init && init.headers) {
        secureInit = { ...init };
        if (_Headers && init.headers instanceof _Headers) {
          const newHeaders = new _Headers(init.headers);
          const entries = newHeaders.entries();
          let entry;
          while (!(entry = entries.next()).done) {
            const [k, v] = entry.value;
            const resolved = _resolveValue(v);
            if (resolved !== v) newHeaders.set(k, resolved);
          }
          secureInit.headers = newHeaders;
        } else if (Array.isArray(init.headers)) {
          secureInit.headers = _call.call(_map, init.headers, (pair) => {
            if (Array.isArray(pair) && pair.length >= 2) {
              return [pair[0], _resolveValue(pair[1])];
            }
            return pair;
          });
        } else if (typeof init.headers === "object") {
          const newHeaders = { ...init.headers };
          _call.call(_forEach, _entries(newHeaders), ([k, v]) => {
            newHeaders[k] = _resolveValue(v);
          });
          secureInit.headers = newHeaders;
        }
      }
      return new OriginalRequest(input, secureInit);
    };
    requestWrapper.prototype = OriginalRequest.prototype;
    TRUSTED_WRAPPERS.add(requestWrapper);
    window.Request = requestWrapper;
  }
  if (_Response && _Response.prototype) {
    const responseMethods = [
      { name: "json", native: _ResponseJSON },
      { name: "text", native: _ResponseText },
      { name: "blob", native: _ResponseBlob },
      { name: "arrayBuffer", native: _ResponseArrayBuffer },
      { name: "formData", native: _ResponseFormData }
    ];
    responseMethods.forEach(({ name, native }) => {
      if (!native) return;
      const wrapper = function() {
        if (!verifyAttestation(`Response.${name}`)) {
          throw new _Error(`Response.${name} blocked by VORO Neural Shield. No Attestation Permit found.`);
        }
        return _call.call(native, this);
      };
      TRUSTED_WRAPPERS.add(wrapper);
      try {
        _defineProperty(Response.prototype, name, {
          value: wrapper,
          configurable: false,
          writable: false,
          enumerable: true
        });
      } catch (e) {
        Response.prototype[name] = wrapper;
      }
    });
  }
  if (typeof window !== "undefined" && window.crypto?.subtle) {
    const cryptoMethods = [
      { name: "encrypt", native: _SubtleEncrypt, prop: "crypto.subtle.encrypt" },
      { name: "decrypt", native: _SubtleDecrypt, prop: "crypto.subtle.decrypt" },
      { name: "deriveKey", native: _SubtleDeriveKey, prop: "crypto.subtle.deriveKey" },
      { name: "importKey", native: _SubtleImportKey, prop: "crypto.subtle.importKey" },
      { name: "generateKey", native: _SubtleGenerateKey, prop: "crypto.subtle.generateKey" }
    ];
    cryptoMethods.forEach(({ name, native, prop }) => {
      if (!native) return;
      const wrapper = function(...args) {
        if (!verifyAttestation(prop)) {
          throw new _Error(`Cryptographic operation [${name}] blocked by VORO Neural Shield. No Attestation Permit found.`);
        }
        const resolvedArgs = _call.call(_map, args, (arg) => {
          if (typeof arg === "string" && _call.call(_startsWith, arg, "voro_key_")) {
            return _call.call(_keyEnclave.get, _keyEnclave, arg) || arg;
          }
          return arg;
        });
        return _ReflectApply ? _ReflectApply(native, window.crypto.subtle, resolvedArgs) : _call.call(native, window.crypto.subtle, ...resolvedArgs);
      };
      TRUSTED_WRAPPERS.add(wrapper);
      try {
        _defineProperty(window.crypto.subtle, name, {
          value: wrapper,
          configurable: false,
          writable: false,
          enumerable: true
        });
      } catch (e) {
        window.crypto.subtle[name] = wrapper;
      }
    });
  }
  if (typeof window !== "undefined" && typeof Storage !== "undefined") {
    const storageMethods = [
      { name: "getItem", native: _StorageGetItem },
      { name: "setItem", native: _StorageSetItem },
      { name: "removeItem", native: _StorageRemoveItem },
      { name: "clear", native: _StorageClear }
    ];
    storageMethods.forEach(({ name, native }) => {
      if (!native) return;
      const wrapper = function(...args) {
        let instance = "Storage";
        try {
          if (this === (typeof window !== "undefined" ? window.localStorage : null)) instance = "localStorage";
          else if (this === (typeof window !== "undefined" ? window.sessionStorage : null)) instance = "sessionStorage";
        } catch (e) {
        }
        if (!verifyAttestation(`${instance}.${name}`)) {
          if (_console.warn) _call.call(_console.warn, console, `Security Sentinel: Unauthorized ${instance}.${name} blocked.`);
          return null;
        }
        return _call.call(native, this, ...args);
      };
      TRUSTED_WRAPPERS.add(wrapper);
      try {
        _defineProperty(Storage.prototype, name, {
          value: wrapper,
          configurable: false,
          // Prevent easy removal or monkey-patching
          writable: false,
          enumerable: true
        });
      } catch (e) {
        if (window.localStorage) {
          try {
            _defineProperty(window.localStorage, name, { value: wrapper, configurable: false, writable: false });
          } catch (le) {
          }
        }
        if (window.sessionStorage) {
          try {
            _defineProperty(window.sessionStorage, name, { value: wrapper, configurable: false, writable: false });
          } catch (se) {
          }
        }
      }
    });
  }
};
initializeAttestationSinks();
var createHoneyTrap = (name, target = {}) => {
  if (typeof Proxy === "undefined") return target;
  return new Proxy(target, {
    get(obj, prop) {
      if (_console.error) _call.call(_console.error, console, `Security Sentinel: Honey-trap [${name}] accessed (get: ${String(prop)}).`);
      executeLockdown();
      return obj[prop];
    },
    set(obj, prop, value) {
      if (_console.error) _call.call(_console.error, console, `Security Sentinel: Honey-trap [${name}] accessed (set: ${String(prop)}).`);
      executeLockdown();
      obj[prop] = value;
      return true;
    },
    deleteProperty(obj, prop) {
      if (_console.error) _call.call(_console.error, console, `Security Sentinel: Honey-trap [${name}] accessed (delete: ${String(prop)}).`);
      executeLockdown();
      return Reflect.deleteProperty(obj, prop);
    },
    defineProperty(obj, prop, descriptor) {
      if (_console.error) _call.call(_console.error, console, `Security Sentinel: Honey-trap [${name}] accessed (defineProperty: ${String(prop)}).`);
      executeLockdown();
      return Reflect.defineProperty(obj, prop, descriptor);
    },
    ownKeys(obj) {
      if (_console.error) _call.call(_console.error, console, `Security Sentinel: Honey-trap [${name}] accessed (ownKeys).`);
      executeLockdown();
      return Reflect.ownKeys(obj);
    }
  });
};
var injectHoneyTokens = () => {
  if (typeof window === "undefined") return;
  try {
    const tokens = [
      { name: "__VORO_INTERNAL_VAULT__", data: { root_key: "0xAE712FB3C9", version: "v3.0.1", integrity: "verified" } },
      { name: "_voro_debug_session", data: { session_id: "voro_debug_882193", level: "SU", bypass: true } },
      { name: "VORO_SECURITY_CONFIG", data: { lockdown_bypass: false, sentinel_debug: true, monitor_all: true } }
    ];
    tokens.forEach((token) => {
      if (!(token.name in window)) {
        Object.defineProperty(window, token.name, {
          get: () => createHoneyTrap(token.name, token.data),
          configurable: false,
          enumerable: false
        });
      }
    });
  } catch (e) {
  }
};
injectHoneyTokens();
var initializeErrorOrchestration = () => {
  if (typeof window === "undefined") return;
  const handleGlobalError = (event) => {
    const errorData = {
      message: event.message || "Unknown Error",
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      stack: event.error ? event.error.stack : null
    };
    const redactedError = redactData(errorData);
    if (_console.error) {
      _call.call(_console.error, console, "Security Sentinel: Intercepted Global Error", redactedError);
    }
    if (redactedError.stack && (redactedError.stack.includes("eval") || redactedError.stack.includes("anonymous"))) {
      executeLockdown();
    }
  };
  const handleUnhandledRejection = (event) => {
    const reason = event.reason;
    const redactedReason = redactData(reason);
    if (_console.error) {
      _call.call(_console.error, console, "Security Sentinel: Intercepted Unhandled Rejection", redactedReason);
    }
  };
  window.addEventListener("error", handleGlobalError);
  window.addEventListener("unhandledrejection", handleUnhandledRejection);
};
var securityNexus = typeof window !== "undefined" && _BroadcastChannel ? new _BroadcastChannel("voro-security-nexus") : null;
var _tabId = Math.random().toString(36).substring(2, 15);
var _peerRegistry = /* @__PURE__ */ new Map();
var PEER_TIMEOUT_THRESHOLD = PULSE_DRIFT_THRESHOLD + 2e4;
if (securityNexus) {
  securityNexus.onmessage = (event) => {
    const data = event.data;
    if (data === "VORO_LOCKDOWN" && !window.VORO_COMPROMISED) {
      console.warn("Security Sentinel: Received lockdown signal from peer tab.");
      executeLockdown(false);
    } else if (data && data.type === "VORO_HEALTH_PULSE" && data.tabId !== _tabId) {
      _call.call(_MapSet, _peerRegistry, data.tabId, data.timestamp);
    } else if (data && data.type === "VORO_PEER_UNLOAD" && data.tabId !== _tabId) {
      _call.call(_MapDelete, _peerRegistry, data.tabId);
    }
  };
  window.addEventListener("beforeunload", () => {
    if (securityNexus && _BCPostMessage) {
      _call.call(_BCPostMessage, securityNexus, {
        type: "VORO_PEER_UNLOAD",
        tabId: _tabId
      });
    }
  });
}
if (typeof window !== "undefined") {
  window.addEventListener("securitypolicyviolation", (e) => {
    if (isTestMode()) return;
    if (_console.error) {
      _call.call(_console.error, console, "Security Sentinel: Active CSP Violation detected!", redactData({
        blockedURI: e.blockedURI,
        violatedDirective: e.violatedDirective,
        sourceFile: e.sourceFile,
        lineNumber: e.lineNumber
      }));
    }
    executeLockdown();
  });
}
var executeLockdown = (broadcast = true) => {
  if (typeof window === "undefined") return;
  if (window.VORO_COMPROMISED && !broadcast) return;
  if (_console.error) _call.call(_console.error, console, "CRITICAL: VORO Neural Shield has detected an integrity violation. Executing Lockdown.");
  try {
    if (!window.VORO_COMPROMISED) {
      _defineProperty(window, "VORO_COMPROMISED", {
        value: true,
        writable: false,
        configurable: false
      });
    }
  } catch (e) {
    window.VORO_COMPROMISED = true;
  }
  window.VORO_DECEPTION_ACTIVE = true;
  if (_keyEnclave && _keyEnclave.clear) {
    _call.call(_keyEnclave.clear, _keyEnclave);
  }
  if (broadcast && securityNexus && _BCPostMessage) {
    _call.call(_BCPostMessage, securityNexus, "VORO_LOCKDOWN");
  }
  const lockdownEvent = new CustomEvent("voro-security-lockdown", {
    detail: { timestamp: (/* @__PURE__ */ new Date()).toISOString(), reason: "Integrity Violation" }
  });
  window.dispatchEvent(lockdownEvent);
  if (window.storage && typeof window.storage.clearCache === "function") {
    window.storage.clearCache();
  }
  try {
    sessionStorage.clear();
    window.name = "";
  } catch (e) {
  }
  try {
    Object.freeze(window.localStorage);
  } catch (e) {
  }
};
var performIntegrityCheck = () => {
  if (typeof window === "undefined") return true;
  if (window.VORO_COMPROMISED) return false;
  const coreAPIs = [
    { obj: window, prop: "fetch", name: "fetch" },
    { obj: window, prop: "open", name: "window.open" },
    { obj: window.crypto, prop: "getRandomValues", name: "crypto.getRandomValues" },
    { obj: window.crypto.subtle, prop: "encrypt", name: "crypto.subtle.encrypt" },
    { obj: window.crypto.subtle, prop: "decrypt", name: "crypto.subtle.decrypt" },
    { obj: window.crypto.subtle, prop: "deriveKey", name: "crypto.subtle.deriveKey" },
    { obj: window.crypto.subtle, prop: "importKey", name: "crypto.subtle.importKey" },
    { obj: window.crypto.subtle, prop: "generateKey", name: "crypto.subtle.generateKey" },
    { obj: window.localStorage, prop: "getItem", name: "localStorage.getItem" },
    { obj: window.localStorage, prop: "setItem", name: "localStorage.setItem" },
    { obj: window.indexedDB, prop: "open", name: "indexedDB.open" },
    { obj: JSON, prop: "parse", name: "JSON.parse" },
    { obj: JSON, prop: "stringify", name: "JSON.stringify" },
    { obj: typeof Reflect !== "undefined" ? Reflect : null, prop: "apply", name: "Reflect.apply" },
    { obj: typeof Reflect !== "undefined" ? Reflect : null, prop: "construct", name: "Reflect.construct" },
    { obj: typeof Reflect !== "undefined" ? Reflect : null, prop: "defineProperty", name: "Reflect.defineProperty" },
    { obj: typeof Reflect !== "undefined" ? Reflect : null, prop: "get", name: "Reflect.get" },
    { obj: typeof Reflect !== "undefined" ? Reflect : null, prop: "set", name: "Reflect.set" },
    { obj: Function.prototype, prop: "call", name: "Function.prototype.call" },
    { obj: Function.prototype, prop: "apply", name: "Function.prototype.apply" },
    { obj: Function.prototype, prop: "bind", name: "Function.prototype.bind" },
    { obj: Object.prototype, prop: "toString", name: "Object.prototype.toString" },
    { obj: Object.prototype, prop: "hasOwnProperty", name: "Object.prototype.hasOwnProperty" },
    { obj: Object, prop: "defineProperty", name: "Object.defineProperty" },
    { obj: window, prop: "eval", name: "eval" },
    { obj: window, prop: "Function", name: "Function" },
    { obj: window, prop: "atob", name: "atob" },
    { obj: window, prop: "btoa", name: "btoa" },
    { obj: window, prop: "DOMParser", name: "DOMParser" },
    { obj: window.localStorage, prop: "clear", name: "localStorage.clear" },
    { obj: window.localStorage, prop: "removeItem", name: "localStorage.removeItem" },
    { obj: window.sessionStorage, prop: "getItem", name: "sessionStorage.getItem" },
    { obj: window.sessionStorage, prop: "setItem", name: "sessionStorage.setItem" },
    { obj: window.sessionStorage, prop: "removeItem", name: "sessionStorage.removeItem" },
    { obj: window.sessionStorage, prop: "clear", name: "sessionStorage.clear" },
    { obj: window, prop: "XMLHttpRequest", name: "XMLHttpRequest" },
    { obj: window.XMLHttpRequest?.prototype, prop: "open", name: "XMLHttpRequest.open" },
    { obj: window.indexedDB, prop: "open", name: "indexedDB.open" },
    { obj: window, prop: "WebSocket", name: "WebSocket" },
    { obj: window.navigator, prop: "sendBeacon", name: "navigator.sendBeacon" },
    { obj: window.navigator?.clipboard, prop: "writeText", name: "navigator.clipboard.writeText" },
    { obj: window.navigator?.clipboard, prop: "readText", name: "navigator.clipboard.readText" },
    { obj: window.navigator, prop: "share", name: "navigator.share" },
    { obj: window, prop: "BroadcastChannel", name: "BroadcastChannel" },
    { obj: window, prop: "Request", name: "Request" },
    { obj: window.Response?.prototype, prop: "json", name: "Response.json" },
    { obj: window.Response?.prototype, prop: "text", name: "Response.text" },
    { obj: window.Response?.prototype, prop: "blob", name: "Response.blob" },
    { obj: window, prop: "Proxy", name: "Proxy" },
    { obj: document, prop: "createElement", name: "document.createElement" },
    { obj: document, prop: "write", name: "document.write" },
    { obj: window, prop: "Notification", name: "Notification" },
    { obj: window.navigator, prop: "geolocation", name: "navigator.geolocation" },
    { obj: window.navigator, prop: "credentials", name: "navigator.credentials" },
    { obj: window, prop: "Permissions", name: "Permissions" },
    { obj: window, prop: "DeviceMotionEvent", name: "DeviceMotionEvent" },
    { obj: window, prop: "Worker", name: "Worker" },
    { obj: window, prop: "SharedWorker", name: "SharedWorker" },
    { obj: window.navigator?.serviceWorker, prop: "register", name: "navigator.serviceWorker.register" },
    { obj: window, prop: "setInterval", name: "setInterval" },
    { obj: window, prop: "setTimeout", name: "setTimeout" },
    { obj: performance, prop: "now", name: "performance.now" },
    { obj: Object, prop: "freeze", name: "Object.freeze" },
    { obj: Object, prop: "seal", name: "Object.seal" },
    { obj: Object, prop: "preventExtensions", name: "Object.preventExtensions" },
    { obj: Object, prop: "isFrozen", name: "Object.isFrozen" },
    { obj: Object, prop: "isSealed", name: "Object.isSealed" },
    { obj: Object, prop: "isExtensible", name: "Object.isExtensible" },
    { obj: window, prop: "URL", name: "URL" },
    { obj: window.URL, prop: "createObjectURL", name: "URL.createObjectURL" },
    { obj: window.URL, prop: "revokeObjectURL", name: "URL.revokeObjectURL" },
    { obj: window, prop: "RTCPeerConnection", name: "RTCPeerConnection" },
    { obj: window, prop: "EventSource", name: "EventSource" },
    { obj: window, prop: "Error", name: "Error" }
  ];
  let compromised = false;
  if (typeof window !== "undefined") {
    const globals = [
      { actual: window.Object, expected: _Object, name: "Object" },
      { actual: window.Array, expected: _Array, name: "Array" },
      { actual: window.Function, expected: _Function, name: "Function" },
      { actual: window.JSON, expected: _JSON, name: "JSON" },
      { actual: window.Promise, expected: _Promise, name: "Promise" },
      { actual: window.Proxy, expected: _Proxy, name: "Proxy" },
      { actual: window.Map, expected: _Map, name: "Map" },
      { actual: window.Set, expected: _Set, name: "Set" },
      { actual: window.Uint8Array, expected: _Uint8Array, name: "Uint8Array" },
      { actual: window.RegExp, expected: _RegExp, name: "RegExp" },
      { actual: window.Date, expected: _Date, name: "Date" },
      { actual: window.Error, expected: _Error, name: "Error" }
    ];
    if (_Reflect) globals.push({ actual: window.Reflect, expected: _Reflect, name: "Reflect" });
    for (const { actual, expected, name } of globals) {
      if (actual !== expected) {
        if (_console.error) _call.call(_console.error, console, `Security Sentinel: Global Identity Violation! window.${name} has been replaced.`);
        compromised = true;
      }
    }
  }
  if (typeof window !== "undefined" && typeof navigator !== "undefined") {
    const testMode = typeof localStorage !== "undefined" && _StorageGetItem ? _call.call(_StorageGetItem, localStorage, "voro_test_mode") : null;
    const bypassAutomation = window.__VORO_TEST_BYPASS__ === true || testMode === "true";
    if (!bypassAutomation) {
      const isAutomation = navigator.webdriver || window.callPhantom || window._phantom || window.__nightmare || window.domAutomation || window.domAutomationController || window.Cypress || window.__pw_click || document.documentElement.getAttribute("webdriver") || navigator.languages === "" || navigator.plugins && navigator.plugins.length === 0 && navigator.webdriver;
      if (isAutomation) {
        if (_console.error) _call.call(_console.error, console, "Security Sentinel: Environment Attestation Failure (Automation Detected).");
        compromised = true;
      }
    }
  }
  if (!checkPrototypeIntegrity()) {
    compromised = true;
  }
  if (!checkStructuralIntegrity()) {
    compromised = true;
  }
  try {
    if (typeof import.meta !== "undefined" && import.meta.env) {
      const sensitiveKeys = ["VITE_CLAUDE_API_KEY", "VITE_OPENAI_API_KEY", "VITE_STRIPE_KEY"];
      sensitiveKeys.forEach((key) => {
        if (import.meta.env[key] && import.meta.env[key] !== "[REDACTED_BY_SENTINEL]") {
          import.meta.env[key] = "[REDACTED_BY_SENTINEL]";
        }
      });
    }
  } catch (e) {
  }
  try {
    if (typeof window !== "undefined" && window.self !== window.top && !isTestMode()) {
      if (_console.error) _call.call(_console.error, console, "Security Sentinel: Frame Integrity Violation! Application is being rendered in an unauthorized frame/iframe.");
      compromised = true;
    }
  } catch (e) {
    if (!isTestMode()) compromised = true;
  }
  const isNative = (fn) => {
    try {
      if (typeof fn !== "function") return false;
      const str = _call.call(_toString, fn);
      if (!_call.call(_test, /\{\s*\[native code\]\s*\}/, str)) return false;
      if (_call.call(_startsWith, fn.name, "bound ")) return false;
      const desc = _ReflectGetOwnPropertyDescriptor ? _ReflectGetOwnPropertyDescriptor(fn, "prototype") : null;
      if (desc && desc.configurable) return false;
      if (fn !== _toString) {
        const toStringStr = _call.call(_toString, fn.toString);
        if (!_call.call(_test, /\{\s*\[native code\]\s*\}/, toStringStr)) return false;
      }
      return true;
    } catch (e) {
      return false;
    }
  };
  const isAuthorized = (val, name) => {
    if (TRUSTED_WRAPPERS.has(val)) return true;
    const mustBeWrapped = [
      "fetch",
      "window.open",
      "XMLHttpRequest",
      "WebSocket",
      "indexedDB.open",
      "navigator.sendBeacon",
      "navigator.serviceWorker.register",
      "navigator.clipboard.writeText",
      "navigator.clipboard.readText",
      "navigator.share",
      "BroadcastChannel",
      "XMLHttpRequest.open",
      "localStorage.getItem",
      "localStorage.setItem",
      "localStorage.removeItem",
      "localStorage.clear",
      "sessionStorage.getItem",
      "sessionStorage.setItem",
      "sessionStorage.removeItem",
      "sessionStorage.clear",
      "URL.createObjectURL",
      "URL.revokeObjectURL",
      "RTCPeerConnection",
      "EventSource",
      "Worker",
      "SharedWorker",
      "Request",
      "Response.json",
      "Response.text",
      "Response.blob",
      "Response.arrayBuffer",
      "Response.formData",
      "crypto.subtle.encrypt",
      "crypto.subtle.decrypt",
      "crypto.subtle.deriveKey",
      "crypto.subtle.importKey",
      "crypto.subtle.generateKey"
    ];
    if (_call.call(_AIncludes, mustBeWrapped, name)) return false;
    if (typeof val !== "function") return true;
    return isNative(val);
  };
  _call.call(_forEach, coreAPIs, ({ obj, prop, name }) => {
    try {
      if (obj && obj[prop]) {
        if (!isAuthorized(obj[prop], name)) {
          if (isTestMode()) return;
          const mustBeWrapped = [
            "fetch",
            "window.open",
            "XMLHttpRequest",
            "WebSocket",
            "indexedDB.open",
            "navigator.sendBeacon",
            "navigator.serviceWorker.register",
            "navigator.clipboard.writeText",
            "navigator.clipboard.readText",
            "navigator.share",
            "BroadcastChannel",
            "XMLHttpRequest.open",
            "localStorage.getItem",
            "localStorage.setItem",
            "localStorage.removeItem",
            "localStorage.clear",
            "sessionStorage.getItem",
            "sessionStorage.setItem",
            "sessionStorage.removeItem",
            "sessionStorage.clear",
            "URL.createObjectURL",
            "URL.revokeObjectURL",
            "RTCPeerConnection",
            "EventSource",
            "Worker",
            "SharedWorker",
            "Request",
            "Response.json",
            "Response.text",
            "Response.blob",
            "Response.arrayBuffer",
            "Response.formData",
            "crypto.subtle.encrypt",
            "crypto.subtle.decrypt",
            "crypto.subtle.deriveKey",
            "crypto.subtle.importKey",
            "crypto.subtle.generateKey"
          ];
          if (_call.call(_AIncludes, mustBeWrapped, name)) {
            if (_console.error) _call.call(_console.error, console, `Security Sentinel: CRITICAL Integrity Violation! High-risk sink ${name} has been neutralized (reverted to native or monkey-patched). Triggering immediate lockdown.`);
            compromised = true;
          } else {
            if (_console.error) _call.call(_console.error, console, `Security Sentinel: Integrity Violation! ${name} has been monkey-patched. Executing Self-Healing restore.`);
            try {
              const capturedMap = {
                "JSON.parse": JSON.parse,
                "JSON.stringify": JSON.stringify,
                "Object.defineProperty": _defineProperty,
                "setInterval": _setInterval,
                "setTimeout": _setTimeout,
                "performance.now": _perfNow,
                "Object.freeze": _freeze,
                "Object.seal": _seal,
                "Object.preventExtensions": _preventExtensions,
                "Error": _Error,
                "URL": _URL
              };
              const native = capturedMap[name];
              if (native && obj) {
                _defineProperty(obj, prop, {
                  value: native,
                  configurable: true,
                  writable: true,
                  enumerable: true
                });
                if (_console.info) _call.call(_console.info, console, `Security Sentinel: Successfully restored native primitive for ${name}.`);
              } else {
                compromised = true;
              }
            } catch (restoreError) {
              compromised = true;
            }
          }
        }
      }
    } catch (e) {
      compromised = true;
    }
  });
  if (compromised) {
    executeLockdown();
  } else {
    _lastIntegrityPulse = _perfNow ? _perfNow() : Date.now();
    if (typeof window !== "undefined") {
      try {
        if (_keyEnclave && _keyEnclave.rotate) {
          _call.call(_keyEnclave.rotate, _keyEnclave);
        }
        const pulseEvent = new CustomEvent("voro-integrity-pulse", {
          detail: { timestamp: _lastIntegrityPulse }
        });
        window.dispatchEvent(pulseEvent);
      } catch (e) {
      }
    }
  }
  return !compromised;
};
var sanitizeObject = (o, s = /* @__PURE__ */ new WeakSet()) => {
  if (!o || typeof o !== "object") return typeof o === "string" ? sanitizeInput(o) : o;
  if (s.has(o)) return "[CIRCULAR_REFERENCE]";
  s.add(o);
  if (Array.isArray(o)) return o.map((i) => sanitizeObject(i, s));
  const r = {};
  _getOwnPropertyNames(o).forEach((k) => {
    if (!["__proto__", "constructor", "prototype"].includes(k)) r[k] = sanitizeObject(o[k], s);
  });
  return r;
};
var redactData = (d, s = null) => {
  const seen = s || (typeof WeakSet !== "undefined" ? /* @__PURE__ */ new WeakSet() : null);
  if (typeof d === "string") {
    const p = {
      UUID: /\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/gi,
      CREDIT_CARD: /\b(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|6(?:011|5[0-9]{2})[0-9]{12}|(?:2131|1800|35\d{3})\d{11})\b/g,
      EMAIL: /[\w.-]+@[\w.-]+\.\w+/g,
      IPV4: /\b(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/g,
      IPV6: /\b(?:(?:[A-Fa-f0-9]{1,4}:){7}[A-Fa-f0-9]{1,4}|(?:[A-Fa-f0-9]{1,4}:){1,6}:[A-Fa-f0-9]{1,4}|(?:[A-Fa-f0-9]{1,4}:){1,5}(?::[A-Fa-f0-9]{1,4}){1,2}|(?:[A-Fa-f0-9]{1,4}:){1,4}(?::[A-Fa-f0-9]{1,4}){1,3}|(?:[A-Fa-f0-9]{1,4}:){1,3}(?::[A-Fa-f0-9]{1,4}){1,4}|(?:[A-Fa-f0-9]{1,4}:){1,2}(?::[A-Fa-f0-9]{1,4}){1,5}|[A-Fa-f0-9]{1,4}:(?::[A-Fa-f0-9]{1,4}){1,6}|(?::[A-Fa-f0-9]{1,4}){1,7}|(?:[A-Fa-f0-9]{1,4}:){1,7}:|:(?::[A-Fa-f0-9]{1,4}){1,7}|::)\b/g,
      PHONE: /\b(?!\d{13,16}\b)(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g,
      STRIPE: /sk_(?:live|test)_\w{24,34}/g,
      STRIPE_RESTRICTED: /rk_(?:live|test)_\w{24,34}/g,
      AWS: /AKIA\w{16}/g,
      BEARER: /Bearer\s+[A-Za-z0-9-._~+/]+=*/g,
      JWT: /eyJ[\w=-]+\.eyJ[\w=-]+\.[\w-_.+/=]*/g,
      GOOGLE: /AIza[0-9A-Za-z-_]{35}/g,
      GITHUB: /\b(?:ghp|gho|ghu|ghs|ghr|github_pat)_[a-zA-Z0-9]{36,255}\b/g,
      OPENAI: /\bsk-(?:proj-)?[a-zA-Z0-9\-_]{20,}\b/g,
      PEM_KEY: /-----BEGIN (?:[\w\s]+)PRIVATE KEY-----[\s\S]+?-----END (?:[\w\s]+)PRIVATE KEY-----|-----BEGIN (?:[\w\s]+)PUBLIC KEY-----[\s\S]+?-----END (?:[\w\s]+)PUBLIC KEY-----/g,
      SSH_KEY: /-----BEGIN OPENSSH PRIVATE KEY-----[\s\S]+?-----END OPENSSH PRIVATE KEY-----/g,
      CLAUDE: /sk-ant-api03-[a-zA-Z0-9\-_]{93,}/g,
      SLACK: /https:\/\/hooks\.slack\.com\/services\/T\w{8,10}\/B\w{8,10}\/\w{24}/g,
      DISCORD: /https:\/\/discord\.com\/api\/webhooks\/\d+\/[\w-]{68}/g,
      MARKER: /\[(USER_DATA|SECURITY_PROTOCOL|MESSAGE_HISTORY|USER_INPUT)_\w{32}\]/g
    };
    let r2 = d;
    const entries = _call.call(_entries, Object, p);
    _call.call(_forEach, entries, ([n, g]) => {
      r2 = _call.call(_replace, r2, g, (m) => n === "MARKER" ? `[[${_call.call(_slice, m, 1, -1)}]]` : `[REDACTED_${n}]`);
    });
    r2 = _call.call(_replace, r2, /\b(?!\d{13,16}\b)[A-Za-z0-9+/=\-_]{24,}\b/g, (m) => calculateEntropy(m) > 4.2 ? "[REDACTED_SECRET]" : m);
    return r2;
  }
  if (!d || typeof d !== "object") return d;
  if (seen && _call.call(_WeakSetHas, seen, d)) return "[CIRCULAR_REFERENCE]";
  if (seen) _call.call(_WeakSetAdd, seen, d);
  if (Array.isArray(d)) return _call.call(_map, d, (i) => redactData(i, seen));
  const r = {};
  const keys = _getOwnPropertyNames(d);
  _call.call(_forEach, keys, (k) => {
    if (!_call.call(_AIncludes, ["__proto__", "constructor", "prototype"], k)) {
      r[k] = redactData(d[k], seen);
    }
  });
  return r;
};
var maskBiometrics = (d, s = /* @__PURE__ */ new WeakSet()) => {
  if (!d || typeof d !== "object") return d;
  if (s.has(d)) return "[CIRCULAR_REFERENCE]";
  const k = ["weight", "body_fat", "systolic", "diastolic", "heart_rate", "glucose", "insulin", "testosterone", "oxygen"];
  s.add(d);
  if (Array.isArray(d)) return d.map((i) => maskBiometrics(i, s));
  const r = {};
  _getOwnPropertyNames(d).forEach((p) => {
    if (!["__proto__", "constructor", "prototype"].includes(p)) {
      r[p] = k.includes(p) ? "[REDACTED_BIOMETRIC]" : maskBiometrics(d[p], s);
    }
  });
  return r;
};
var detectHomoglyphs = (host) => {
  return /[^\x00-\x7F]/.test(host) || host.toLowerCase().startsWith("xn--");
};
var validateAIResponse = (c, n = null) => {
  if (!c) return c;
  if (_call.call(_test, /[\u200B-\u200D\uFEFF]/, c)) {
    if (_console.error) _call.call(_console.error, console, "Security Sentinel: Steganographic markers detected in AI output.");
    executeLockdown();
    return "[SECURITY_VIOLATION_DETECTED]";
  }
  if (n && _call.call(_SIncludes, c, n)) {
    executeLockdown();
    return "[SECURITY_VIOLATION_DETECTED]";
  }
  const urlRegex = /(?:https?:\/\/|www\.|(?<!:)\/\/|javascript:|data:|blob:)[^\s)\]]+/gi;
  const urls = _call.call(_match, c, urlRegex) || [];
  const highSignalKeywords = ["cookie", "session", "localstorage", "voro_", "token", "secret", "credential", "password"];
  const queryOnlyKeywords = ["auth", "key", "sid", "pwd", "access_token", "id_token", "api"];
  const appOrigin = typeof window !== "undefined" ? window.location.origin : null;
  for (const url of urls) {
    try {
      if (!_URL) throw new Error("URL constructor not available");
      let preparedUrl = url;
      if (_call.call(_startsWith, preparedUrl, "//")) {
        preparedUrl = "https:" + preparedUrl;
      } else if (_call.call(_startsWith, preparedUrl, "www.")) {
        preparedUrl = "https://" + preparedUrl;
      }
      const urlObj = new _URL(preparedUrl, appOrigin || void 0);
      if (appOrigin && _call.call(_URLOrigin, urlObj) === appOrigin) continue;
      if (detectHomoglyphs(_call.call(_URLHostname, urlObj))) {
        if (_console.warn) _call.call(_console.warn, console, `Security Sentinel: AI exfiltration attempt blocked (Homoglyph hostname: ${_call.call(_URLHostname, urlObj)}).`);
        executeLockdown();
        return "[SECURITY_VIOLATION_DETECTED]";
      }
      let decodedUrl = url;
      try {
        decodedUrl = decodeURIComponent(url);
      } catch (e) {
      }
      const lowerUrl = _call.call(_toLowerCase, decodedUrl);
      const searchStr = _call.call(_URLSearch, urlObj);
      const hashStr = _call.call(_URLHash, urlObj);
      const lowerQuery = searchStr ? _call.call(_toLowerCase, decodeURIComponent(searchStr)) : "";
      const lowerHash = hashStr ? _call.call(_toLowerCase, decodeURIComponent(hashStr)) : "";
      if (_call.call(_some, highSignalKeywords, (kw) => _call.call(_SIncludes, lowerUrl, kw))) {
        if (_console.warn) _call.call(_console.warn, console, "Security Sentinel: AI exfiltration attempt blocked (High-signal Keyword in URL).");
        executeLockdown();
        return "[SECURITY_VIOLATION_DETECTED]";
      }
      if (_call.call(_some, queryOnlyKeywords, (kw) => _call.call(_SIncludes, lowerQuery, kw) || _call.call(_SIncludes, lowerHash, kw))) {
        if (_console.warn) _call.call(_console.warn, console, "Security Sentinel: AI exfiltration attempt blocked (Sensitive Keyword in Query/Hash).");
        executeLockdown();
        return "[SECURITY_VIOLATION_DETECTED]";
      }
      const segments = _call.call(_split, decodedUrl, /[\/\?&%=:._\-#]/);
      for (const segment of segments) {
        if (segment.length >= 24 && calculateEntropy(segment) > 4.2) {
          if (_console.warn) _call.call(_console.warn, console, "Security Sentinel: AI exfiltration attempt blocked (High-entropy token in URL).");
          executeLockdown();
          return "[SECURITY_VIOLATION_DETECTED]";
        }
      }
    } catch (e) {
      const lowerUrl = _call.call(_toLowerCase, url);
      const hasHighSignal = _call.call(_some, highSignalKeywords, (kw) => _call.call(_SIncludes, lowerUrl, kw));
      const hasQueryOnly = _call.call(_some, queryOnlyKeywords, (kw) => _call.call(_SIncludes, lowerUrl, kw));
      if (hasHighSignal || hasQueryOnly) {
        if (_console.warn) _call.call(_console.warn, console, "Security Sentinel: AI exfiltration fallback blocked (Keyword in malformed URL).");
        executeLockdown();
        return "[SECURITY_VIOLATION_DETECTED]";
      }
      const segments = _call.call(_split, lowerUrl, /[\/\?&%=:._\-#]/);
      for (const segment of segments) {
        if (segment.length >= 24 && calculateEntropy(segment) > 4.2) {
          if (_console.warn) _call.call(_console.warn, console, "Security Sentinel: AI exfiltration fallback blocked (High-entropy token in malformed URL).");
          executeLockdown();
          return "[SECURITY_VIOLATION_DETECTED]";
        }
      }
    }
  }
  const words = _call.call(_split, c, /\s+/);
  for (const word of words) {
    if (word.length > 32 && calculateEntropy(word) > 4.5) {
      if (_console.warn) _call.call(_console.warn, console, "Security Sentinel: High-entropy data segment detected in AI body.");
      executeLockdown();
      return "[SECURITY_VIOLATION_DETECTED]";
    }
  }
  let v = redactData(_call.call(_replace, c, /\[\/?(USER_DATA|SECURITY_PROTOCOL|MESSAGE_HISTORY|USER_INPUT).*?\]/g, "[REDACTED_BOUNDARY]"));
  return v;
};
var _domBackboneSnapshot = null;
var checkStructuralIntegrity = () => {
  if (typeof window === "undefined" || typeof document === "undefined") return true;
  try {
    const root = document.getElementById("root");
    const head = document.head;
    const generateBackbone = () => {
      const serialize = (el) => {
        if (!el) return "";
        const attrStr = _call.call(_ArrayFrom, Array, el.attributes).filter((a) => ["id"].includes(a.name.toLowerCase())).map((a) => `${a.name}=${a.value}`).sort().join("|");
        return `${el.tagName}[${attrStr}]`;
      };
      let backbone = serialize(head) + "{";
      _call.call(_forEach, _call.call(_ArrayFrom, Array, head.children), (c) => backbone += serialize(c) + ",");
      backbone += "};" + serialize(root) + "{";
      if (root) {
        _call.call(_forEach, _call.call(_ArrayFrom, Array, root.children), (c) => {
          backbone += serialize(c) + "[";
          _call.call(_forEach, _call.call(_ArrayFrom, Array, c.children), (gc) => backbone += serialize(gc) + ",");
          backbone += "],";
        });
      }
      backbone += "}";
      return backbone;
    };
    const currentBackbone = generateBackbone();
    if (!_domBackboneSnapshot) {
      _domBackboneSnapshot = currentBackbone;
      return true;
    }
    if (currentBackbone !== _domBackboneSnapshot) {
      if (_console.error) _call.call(_console.error, console, "Security Sentinel: Structural DOM Integrity Violation detected.");
      return false;
    }
    return true;
  } catch (e) {
    return false;
  }
};
var startMutationShield = () => {
  if (typeof window === "undefined" || typeof MutationObserver === "undefined") return;
  const dangerousTags = ["script", "iframe", "object", "embed", "base"];
  const checkNode = (node) => {
    if (node.nodeType !== 1) return false;
    const tag = node.tagName.toLowerCase();
    if (dangerousTags.includes(tag)) return true;
    if (node.attributes) {
      for (let i = 0; i < node.attributes.length; i++) {
        const attr = node.attributes[i].name.toLowerCase();
        const val = node.attributes[i].value.toLowerCase();
        if (attr.startsWith("on") || val.startsWith("javascript:")) return true;
      }
    }
    return false;
  };
  const observer = new MutationObserver((mutations) => {
    let violation = false;
    for (const mutation of mutations) {
      if (mutation.type === "childList") {
        for (const node of mutation.addedNodes) {
          if (checkNode(node)) {
            violation = true;
            if (_console.error) _call.call(_console.error, console, "Security Sentinel: Unauthorized DOM injection detected.");
            break;
          }
        }
      } else if (mutation.type === "attributes") {
        const attr = mutation.attributeName.toLowerCase();
        const val = mutation.target.getAttribute(mutation.attributeName)?.toLowerCase() || "";
        if (attr.startsWith("on") || val.startsWith("javascript:")) {
          violation = true;
          if (_console.error) _call.call(_console.error, console, `Security Sentinel: Unauthorized attribute tampering [${attr}] detected.`);
        }
      }
      if (violation) break;
    }
    if (violation) executeLockdown();
  });
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true
    // Note: No attributeFilter to ensure all on* event handlers are caught
  });
  return observer;
};
var PolymorphicKeyEnclave = class {
  constructor() {
    this._enclave = new _Map();
    this._masks = new _Map();
  }
  _generateMask(len) {
    const mask = new _Uint8Array(len);
    if (typeof window !== "undefined" && window.crypto) {
      window.crypto.getRandomValues(mask);
    } else {
      for (let i = 0; i < len; i++) mask[i] = Math.floor(Math.random() * 256);
    }
    return mask;
  }
  _applyMask(shard, mask) {
    _call.call(_forEach, shard, (byte, i) => {
      shard[i] = byte ^ mask[i % mask.length];
    });
  }
  set(handle, key) {
    const isKey = typeof key === "object" && key.constructor && (key.constructor.name === "CryptoKey" || _call.call(_OToString, key) === "[object CryptoKey]");
    if (isKey) {
      _call.call(_MapSet, this._enclave, handle, { type: "key", data: key });
      return;
    }
    if (typeof key === "string") {
      const encoder = new TextEncoder();
      const bytes = _call.call(_TEncoderEncode, encoder, key);
      const len = bytes.length;
      const s1 = Math.floor(len / 3);
      const s2 = Math.floor(2 * len / 3);
      const shards = [
        new _Uint8Array(_call.call(_Uint8Slice, bytes, 0, s1)),
        _call.call(_reverse, new _Uint8Array(_call.call(_Uint8Slice, bytes, s1, s2))),
        new _Uint8Array(_call.call(_Uint8Slice, bytes, s2))
      ];
      const masks = _call.call(_map, shards, (shard) => this._generateMask(shard.length));
      _call.call(_forEach, shards, (shard, i) => this._applyMask(shard, masks[i]));
      _call.call(_MapSet, this._enclave, handle, { type: "string", data: shards });
      _call.call(_MapSet, this._masks, handle, masks);
      _call.call(_Uint8Fill, bytes, 0);
    }
  }
  get(handle) {
    const entry = _call.call(_MapGet, this._enclave, handle);
    if (!entry) return null;
    if (entry.type === "key") return entry.data;
    if (entry.type === "string") {
      const shards = entry.data;
      const masks = _call.call(_MapGet, this._masks, handle);
      const totalLen = shards[0].length + shards[1].length + shards[2].length;
      const assembled = new _Uint8Array(totalLen);
      const s0 = new _Uint8Array(shards[0]);
      this._applyMask(s0, masks[0]);
      _call.call(_Uint8Set, assembled, s0, 0);
      _call.call(_Uint8Fill, s0, 0);
      const s1 = _call.call(_reverse, new _Uint8Array(shards[1]));
      const m1 = _call.call(_reverse, _call.call(_Uint8Slice, masks[1]));
      this._applyMask(s1, m1);
      _call.call(_Uint8Set, assembled, s1, shards[0].length);
      _call.call(_Uint8Fill, s1, 0);
      _call.call(_Uint8Fill, m1, 0);
      const s2 = new _Uint8Array(shards[2]);
      this._applyMask(s2, masks[2]);
      _call.call(_Uint8Set, assembled, s2, shards[0].length + shards[1].length);
      _call.call(_Uint8Fill, s2, 0);
      const decoder = new TextDecoder();
      const result = _call.call(_TDecoderDecode, decoder, assembled);
      _call.call(_Uint8Fill, assembled, 0);
      return result;
    }
    return null;
  }
  rotate() {
    const entries = _call.call(_MapEntries, this._enclave);
    let next;
    while (!(next = entries.next()).done) {
      const entryVal = next.value;
      const handle = entryVal[0];
      const entry = entryVal[1];
      if (entry.type === "string") {
        const shards = entry.data;
        const oldMasks = _call.call(_MapGet, this._masks, handle);
        const newMasks = _call.call(_map, shards, (shard) => this._generateMask(shard.length));
        _call.call(_forEach, shards, (shard, i) => {
          this._applyMask(shard, oldMasks[i]);
          this._applyMask(shard, newMasks[i]);
          _call.call(_Uint8Fill, oldMasks[i], 0);
        });
        _call.call(_MapSet, this._masks, handle, newMasks);
      }
    }
  }
  clear() {
    _call.call(_MapClear, this._enclave);
    _call.call(_MapClear, this._masks);
  }
};
var _keyEnclave = new PolymorphicKeyEnclave();
var _resolveValue = (val) => {
  if (typeof val !== "string" || !_call.call(_SIncludes, val, "voro_key_")) return val;
  return _call.call(_replace, val, /voro_key_[a-f0-9]{32}/g, (match) => {
    return _call.call(_keyEnclave.get, _keyEnclave, match) || match;
  });
};
var registerSecureKey = (key) => {
  if (!key) return key;
  const isKey = typeof key === "object" && key.constructor && (key.constructor.name === "CryptoKey" || _call.call(_OToString, key) === "[object CryptoKey]");
  const isSensitiveString = typeof key === "string" && key.length > 20;
  if (!isKey && !isSensitiveString) return key;
  const handle = `voro_key_${generateSecurityNonce()}`;
  _call.call(_keyEnclave.set, _keyEnclave, handle, key);
  return handle;
};
var startAutonomousPulse = () => {
  if (typeof window === "undefined" || !_setTimeout) return;
  const pulse = () => {
    try {
      if (window.VORO_COMPROMISED) return;
      performIntegrityCheck();
      const now = Date.now();
      if (securityNexus && _BCPostMessage) {
        _call.call(_BCPostMessage, securityNexus, {
          type: "VORO_HEALTH_PULSE",
          tabId: _tabId,
          timestamp: now
        });
      }
      if (_peerRegistry.size > 0) {
        const entries = _call.call(_MapEntries, _peerRegistry);
        let next;
        while (!(next = entries.next()).done) {
          const [peerId, lastSeen] = next.value;
          if (now - lastSeen > PEER_TIMEOUT_THRESHOLD) {
            if (_console.error) _call.call(_console.error, console, `Security Sentinel: Peer neutralization detected for tab [${peerId}]. Executing Distributed Lockdown.`);
            executeLockdown();
            return;
          }
        }
      }
      const curTime = _perfNow ? _call.call(_perfNow, performance) : Date.now();
      if (curTime - _lastUserInteraction > USER_PRESENCE_THRESHOLD && !isTestMode()) {
        if (!window._voro_idle_shredded) {
          window._voro_idle_shredded = true;
          try {
            const idleEvent = new CustomEvent("voro-security-idle-shred", {
              detail: { timestamp: curTime }
            });
            window.dispatchEvent(idleEvent);
          } catch (err) {
          }
          if (_console.warn) {
            _call.call(_console.warn, console, "Security Sentinel: Active Session Ephemerality triggered. Memory keys shredded due to user idle state.");
          }
        }
      }
      _call.call(_setTimeout, window, pulse, PULSE_INTERVAL);
    } catch (e) {
      if (_console.error) _call.call(_console.error, console, "Security Sentinel: Pulse Failure.", e);
      executeLockdown();
    }
  };
  _call.call(_setTimeout, window, pulse, PULSE_INTERVAL);
};
var sentinelExports = {
  sanitizeInput,
  sanitizeObject,
  maskBiometrics,
  redactData,
  validateAIResponse,
  validateCallStack,
  generateSecurityNonce,
  createSecureProxy,
  performIntegrityCheck,
  rotateCloakingCache,
  executeLockdown,
  executeSecurely: (action, callback, caps) => executeSecurely(action, callback, caps),
  registerSecureKey: (key) => registerSecureKey(key),
  getDecoyData,
  isDeceptionActive,
  checkUserPresence,
  // Hermetic Primitives for Secret Management
  _TEncoderEncode,
  _TDecoderDecode,
  _Uint8Fill,
  _Uint8Set,
  _Uint8Slice,
  _SIncludes,
  _split,
  _replace,
  _toLowerCase,
  _AIncludes,
  _forEach,
  _MapSet,
  _MapGet,
  _MapDelete,
  _MapHas,
  _WeakSetAdd,
  _WeakSetHas,
  _call,
  _apply,
  _reverse,
  _slice
};
var deepFreeze = (obj) => {
  _freeze(obj);
  _getOwnPropertyNames(obj).forEach((prop) => {
    if (obj[prop] !== null && (typeof obj[prop] === "object" || typeof obj[prop] === "function") && !Object.isFrozen(obj[prop])) {
      deepFreeze(obj[prop]);
    }
  });
  return obj;
};
if (typeof window !== "undefined") {
  deepFreeze(sentinelExports);
  window.voro_sentinel = sentinelExports;
}
var initializeConsoleProtection = () => {
  if (typeof window === "undefined" || typeof console === "undefined") return;
  const methods = ["log", "warn", "error", "info", "debug", "trace"];
  methods.forEach((method) => {
    const original = _console[method];
    if (!original) return;
    const wrapper = function(...args) {
      const redactedArgs = args.map((arg) => redactData(arg));
      return _ReflectApply ? _ReflectApply(original, console, redactedArgs) : _call.call(original, console, ...redactedArgs);
    };
    TRUSTED_WRAPPERS.add(wrapper);
    try {
      _defineProperty(console, method, {
        value: wrapper,
        configurable: false,
        writable: false,
        enumerable: true
      });
    } catch (e) {
      console[method] = wrapper;
    }
  });
};
initializeErrorOrchestration();
initializeConsoleProtection();
if (typeof window !== "undefined") {
  performIntegrityCheck();
  startAutonomousPulse();
  setInterval(() => rotateCloakingCache(), 6e5);
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      startMutationShield();
      initializeUserPresence();
    });
  } else {
    startMutationShield();
    initializeUserPresence();
  }
}
var security_default = sentinelExports;

// src/utils/crypto.js
var {
  validateCallStack: validateCallStack2,
  executeSecurely: executeSecurely2,
  createSecureProxy: createSecureProxy2,
  registerSecureKey: registerSecureKey2,
  _TEncoderEncode: _TEncoderEncode2,
  _TDecoderDecode: _TDecoderDecode2,
  _Uint8Fill: _Uint8Fill2,
  _Uint8Set: _Uint8Set2,
  _Uint8Slice: _Uint8Slice2,
  _call: _call2,
  _slice: _slice2
} = security_default;
var DB_NAME = "VORO_SECURE_STORAGE";
var STORE_NAME = "KEYS";
var KEY_NAME = "MASTER_KEY";
var HKDF_KEY_NAME = "HKDF_BASE_KEY";
var ALGO = "AES-GCM";
var KEY_SIZE = 256;
var CryptoManager = class {
  constructor() {
    this.key = null;
    this.hkdfKey = null;
    this.domainKeyCache = /* @__PURE__ */ new Map();
    this.initialized = false;
    this.initPromise = null;
    if (typeof window !== "undefined") {
      window.addEventListener("voro-security-lockdown", () => {
        this.shredKeys();
      });
      window.addEventListener("voro-security-idle-shred", () => {
        this.shredKeys();
      });
      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "hidden") {
          this.shredKeys();
        }
      });
    }
  }
  /**
   * Atomic Cryptographic Shredding
   * Immediately purges sensitive keys from memory to prevent exfiltration during compromise.
   */
  shredKeys() {
    this.key = null;
    this.hkdfKey = null;
    this.domainKeyCache.clear();
    this.initialized = false;
    this.initPromise = null;
    console.warn("Security Sentinel: Cryptographic keys have been shredded from memory.");
  }
  // Initialize the crypto manager (load or generate keys)
  async init() {
    if (this.initialized) return;
    if (this.initPromise) return this.initPromise;
    this.initPromise = (async () => {
      try {
        const keys = await this.getOrGenerateKeys();
        this.key = keys.masterKey;
        this.hkdfKey = keys.hkdfKey;
        this.initialized = true;
      } catch (error) {
        this.initPromise = null;
        console.error("Failed to initialize VORO Crypto:", error);
        throw error;
      }
    })();
    return this.initPromise;
  }
  // Get keys from IndexedDB or generate new ones
  async getOrGenerateKeys() {
    return await executeSecurely2("Retrieve Master Keys", () => {
      return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, 1);
        request.onupgradeneeded = (event) => {
          const db = event.target.result;
          if (!db.objectStoreNames.contains(STORE_NAME)) {
            db.createObjectStore(STORE_NAME);
          }
        };
        request.onsuccess = (event) => {
          const db = event.target.result;
          const transaction = db.transaction(STORE_NAME, "readwrite");
          const store = transaction.objectStore(STORE_NAME);
          const getMaster = store.get(KEY_NAME);
          const getHKDF = store.get(HKDF_KEY_NAME);
          let masterKey, hkdfKey;
          getMaster.onsuccess = async () => {
            masterKey = getMaster.result;
            getHKDF.onsuccess = async () => {
              hkdfKey = getHKDF.result;
              if (masterKey && hkdfKey) {
                resolve({
                  masterKey: registerSecureKey2(masterKey),
                  hkdfKey: registerSecureKey2(hkdfKey)
                });
              } else {
                try {
                  if (!masterKey) {
                    masterKey = await window.crypto.subtle.generateKey(
                      { name: ALGO, length: KEY_SIZE },
                      false,
                      ["encrypt", "decrypt"]
                    );
                    await new Promise((res, rej) => {
                      const putMaster = store.put(masterKey, KEY_NAME);
                      putMaster.onsuccess = res;
                      putMaster.onerror = rej;
                    });
                  }
                  if (!hkdfKey) {
                    const entropy = window.crypto.getRandomValues(new Uint8Array(32));
                    hkdfKey = await window.crypto.subtle.importKey(
                      "raw",
                      entropy,
                      "HKDF",
                      false,
                      ["deriveKey"]
                    );
                    entropy.fill(0);
                    await new Promise((res, rej) => {
                      const putHKDF = store.put(hkdfKey, HKDF_KEY_NAME);
                      putHKDF.onsuccess = res;
                      putHKDF.onerror = rej;
                    });
                  }
                  resolve({
                    masterKey: registerSecureKey2(masterKey),
                    hkdfKey: registerSecureKey2(hkdfKey)
                  });
                } catch (err) {
                  reject(err);
                }
              }
            };
          };
          getMaster.onerror = () => reject(new Error("Failed to retrieve master key"));
        };
        request.onerror = () => reject(new Error("Failed to open secure key store"));
      });
    }, ["sink:indexedDB.open", "requirement:user-presence", "sink:crypto.subtle.generateKey", "sink:crypto.subtle.importKey", "sink:crypto.subtle.encrypt", "sink:crypto.subtle.decrypt", "sink:crypto.subtle.deriveKey"]);
  }
  /**
   * Derives a domain-specific key using HKDF.
   * This ensures cryptographic isolation between different storage buckets.
   */
  async deriveDomainKey(domain) {
    if (window.VORO_COMPROMISED || !validateCallStack2()) {
      this.key = null;
      this.hkdfKey = null;
      this.domainKeyCache.clear();
      throw new Error("Security Sentinel: Cryptographic operations blocked due to environment compromise or unauthorized provenance.");
    }
    if (this.domainKeyCache.has(domain)) {
      return this.domainKeyCache.get(domain);
    }
    await this.init();
    const encoder = new TextEncoder();
    const infoBuffer = _call2.call(_TEncoderEncode2, encoder, domain);
    const derivedKey = await executeSecurely2(`Derive Key [${domain}]`, async () => {
      return await window.crypto.subtle.deriveKey(
        {
          name: "HKDF",
          salt: new Uint8Array(),
          // Static salt is acceptable in this context as HKDF key is unique
          info: infoBuffer,
          hash: "SHA-256"
        },
        this.hkdfKey,
        { name: ALGO, length: KEY_SIZE },
        false,
        ["encrypt", "decrypt"]
      );
    }, ["sink:crypto.subtle.deriveKey"]);
    _call2.call(_Uint8Fill2, infoBuffer, 0);
    const handle = registerSecureKey2(derivedKey);
    this.domainKeyCache.set(domain, handle);
    return handle;
  }
  /**
   * Encrypt data with Hierarchical Key Isolation (v3)
   * @param {any} data - Data to encrypt
   * @param {string} domain - Storage key for domain isolation and binding
   * @returns {Promise<string>} Base64 encoded encrypted string
   */
  async encrypt(data, domain = null) {
    if (data === null || data === void 0) return data;
    if (window.VORO_COMPROMISED || !validateCallStack2()) {
      this.key = null;
      this.hkdfKey = null;
      throw new Error("Security Sentinel: Encryption blocked due to environment compromise or unauthorized provenance.");
    }
    await this.init();
    const encoder = new TextEncoder();
    const rawString = typeof data === "string" ? data : JSON.stringify(data);
    const encodedData = _call2.call(_TEncoderEncode2, encoder, rawString);
    const iv = new Uint8Array(12);
    window.crypto.getRandomValues(iv);
    const useV3 = !!domain;
    const encryptionKey = useV3 ? await this.deriveDomainKey(domain) : this.key;
    const algorithm = { name: ALGO, iv };
    let aadBuffer = null;
    if (domain) {
      aadBuffer = _call2.call(_TEncoderEncode2, encoder, domain);
      algorithm.additionalData = aadBuffer;
    }
    const ciphertext = await executeSecurely2(`Encrypt [${domain || "master"}]`, async () => {
      return await window.crypto.subtle.encrypt(
        algorithm,
        encryptionKey,
        encodedData
      );
    }, ["sink:crypto.subtle.encrypt"]);
    _call2.call(_Uint8Fill2, encodedData, 0);
    if (aadBuffer) _call2.call(_Uint8Fill2, aadBuffer, 0);
    const combined = new Uint8Array(iv.length + ciphertext.byteLength);
    _call2.call(_Uint8Set2, combined, iv);
    _call2.call(_Uint8Set2, combined, new Uint8Array(ciphertext), iv.length);
    let binary = "";
    const bytes = new Uint8Array(combined);
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    _call2.call(_Uint8Fill2, iv, 0);
    _call2.call(_Uint8Fill2, combined, 0);
    const prefix = useV3 ? "v3:" : domain ? "v2:" : "v1:";
    return prefix + btoa(binary);
  }
  /**
   * Decrypt data handling multiple version schemes
   * @param {string} encryptedData - Encrypted string from storage
   * @param {string} domain - Domain key for verification
   * @returns {Promise<any>} Decrypted data
   */
  async decrypt(encryptedData, domain = null) {
    if (typeof encryptedData !== "string") return encryptedData;
    if (window.VORO_COMPROMISED || !validateCallStack2()) {
      this.key = null;
      this.hkdfKey = null;
      throw new Error("Security Sentinel: Decryption blocked due to environment compromise or unauthorized provenance.");
    }
    let version = 0;
    if (encryptedData.startsWith("v3:")) version = 3;
    else if (encryptedData.startsWith("v2:")) version = 2;
    else if (encryptedData.startsWith("v1:")) version = 1;
    else return encryptedData;
    await this.init();
    try {
      const binaryString = atob(_call2.call(_slice2, encryptedData, 3));
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const iv = _call2.call(_Uint8Slice2, bytes, 0, 12);
      const ciphertext = _call2.call(_Uint8Slice2, bytes, 12);
      const decryptionKey = version === 3 && domain ? await this.deriveDomainKey(domain) : this.key;
      const algorithm = { name: ALGO, iv };
      let aadBuffer = null;
      if ((version === 2 || version === 3) && domain) {
        const encoder = new TextEncoder();
        aadBuffer = _call2.call(_TEncoderEncode2, encoder, domain);
        algorithm.additionalData = aadBuffer;
      }
      const decryptedBuffer = await executeSecurely2(`Decrypt [${domain || "master"}]`, async () => {
        return await window.crypto.subtle.decrypt(
          algorithm,
          decryptionKey,
          ciphertext
        );
      }, ["sink:crypto.subtle.decrypt"]);
      _call2.call(_Uint8Fill2, bytes, 0);
      _call2.call(_Uint8Fill2, iv, 0);
      if (aadBuffer) _call2.call(_Uint8Fill2, aadBuffer, 0);
      const decrypted = new Uint8Array(decryptedBuffer);
      const decoder = new TextDecoder();
      const decoded = _call2.call(_TDecoderDecode2, decoder, decrypted);
      _call2.call(_Uint8Fill2, decrypted, 0);
      try {
        const parsed = JSON.parse(decoded);
        return createSecureProxy2(parsed, domain);
      } catch (e) {
        return decoded;
      }
    } catch (error) {
      console.error(`Decryption failed (v${version}). Potential tampering or domain mismatch.`, error);
      return null;
    }
  }
};
var cryptoManager = new CryptoManager();
var crypto_default = cryptoManager;

// src/utils/storage.js
var STORAGE_PREFIX = "voro_";
var GHOST_VAULT_KEY = "voro_ghost_vault";
var CANARY_KEYS = /* @__PURE__ */ new Set([
  "admin_session",
  "system_vault",
  "voro_internal_bypass",
  "root_config",
  "debug_override"
]);
var STORAGE_KEYS = {
  user: "user",
  profile: "profile",
  nutritionLog: "nutrition_log",
  workoutLog: "workout_log",
  bodyMetrics: "body_metrics",
  gymSetup: "gym_setup",
  plans: "plans",
  vitals: "vitals",
  supplements: "supplements",
  habits: "habits",
  gamification: "gamification",
  settings: "settings",
  recipes: "recipes",
  chatHistory: "chat_history",
  notifications: "notifications",
  shoppingList: "shopping_list",
  periodization: "periodization",
  prHistory: "pr_history",
  mealPrep: "meal_prep",
  quickLog: "quick_log",
  customFoods: "custom_foods",
  customExercises: "custom_exercises",
  fitnessTests: "fitness_tests",
  injuryLog: "injury_log",
  cycleTracking: "cycle_tracking",
  competition: "competition"
};
var StorageManager = class {
  constructor() {
    this.isAvailable = this.checkAvailability();
    this.canaryKeys = CANARY_KEYS;
    this.encryptedKeys = new Set(Object.values(STORAGE_KEYS));
    this.listeners = /* @__PURE__ */ new Set();
    this.cache = /* @__PURE__ */ new Map();
    this._lastUpdate = /* @__PURE__ */ new Map();
    this.memoizedData = null;
    this.memoizedDecoyData = null;
    this.initialized = false;
    this.initPromise = null;
    if (typeof window !== "undefined") {
      window.addEventListener("voro-security-lockdown", () => {
        this.clearCache();
        this.notify("*", null);
      });
      window.addEventListener("voro-security-idle-shred", () => {
        this.clearCache();
      });
      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "hidden") {
          this.clearCache();
          this.notify("*", null);
        }
      });
    }
  }
  async ensureInitialized() {
    if (this.initialized) return;
    if (this.initPromise) return this.initPromise;
    this.initPromise = (async () => {
      const keys = this.list();
      await Promise.all(keys.map(async (key) => {
        const value = await this.getAsync(key);
        this.cache.set(key, value);
      }));
      this.initialized = true;
      this.memoizedData = null;
      this.notify("*", this.getAllSync());
    })();
    return this.initPromise;
  }
  checkAvailability() {
    try {
      const test = "__storage_test__";
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      console.warn("localStorage not available, using in-memory storage");
      return false;
    }
  }
  // Get full key with prefix
  getFullKey(key) {
    return `${STORAGE_PREFIX}${key}`;
  }
  // Ghost Vault Management: Redirects persistence to a synthetic vault during compromise
  _ghostSet(key, value) {
    try {
      const vaultRaw = localStorage.getItem(GHOST_VAULT_KEY) || "{}";
      const vault = JSON.parse(vaultRaw);
      vault[key] = value;
      localStorage.setItem(GHOST_VAULT_KEY, JSON.stringify(vault));
      return true;
    } catch (e) {
      return false;
    }
  }
  _ghostDelete(key) {
    try {
      const vaultRaw = localStorage.getItem(GHOST_VAULT_KEY);
      if (!vaultRaw) return true;
      const vault = JSON.parse(vaultRaw);
      delete vault[key];
      localStorage.setItem(GHOST_VAULT_KEY, JSON.stringify(vault));
      return true;
    } catch (e) {
      return false;
    }
  }
  // Detects interaction with honey-token canary keys
  _checkCanary(key) {
    const baseKey = key.startsWith(STORAGE_PREFIX) ? key.replace(STORAGE_PREFIX, "") : key;
    if (this.canaryKeys.has(baseKey)) {
      console.error(`Security Sentinel: Honey-token interaction detected! Key: ${baseKey}`);
      executeLockdown();
      return true;
    }
    return false;
  }
  // Helper to determine if a key should be encrypted
  shouldEncrypt(key) {
    const baseKey = key.startsWith(STORAGE_PREFIX) ? key.replace(STORAGE_PREFIX, "") : key;
    return this.encryptedKeys.has(baseKey);
  }
  // Get item from storage asynchronously
  async getAsync(key) {
    if (this._checkCanary(key)) return null;
    const baseKey = key.startsWith(STORAGE_PREFIX) ? key.replace(STORAGE_PREFIX, "") : key;
    if (window.VORO_COMPROMISED || !validateCallStack()) {
      return getDecoyData(baseKey);
    }
    if (this.cache.has(baseKey)) {
      return createSecureProxy(this.cache.get(baseKey), baseKey);
    }
    try {
      const fullKey = key.startsWith(STORAGE_PREFIX) ? key : this.getFullKey(key);
      const item = await executeSecurely(`Read ${baseKey}`, () => {
        return localStorage.getItem(fullKey);
      }, ["sink:localStorage.getItem"]);
      if (!item) return null;
      let processedItem = item;
      if (item.startsWith("v3:") || item.startsWith("v2:") || item.startsWith("v1:")) {
        processedItem = await crypto_default.decrypt(item, fullKey);
      } else {
        try {
          processedItem = JSON.parse(item);
        } catch (e) {
        }
      }
      this.cache.set(baseKey, processedItem);
      return createSecureProxy(processedItem, baseKey);
    } catch (error) {
      console.error("Storage get error:", error);
      return null;
    }
  }
  /**
   * Synchronous get (returns from cache).
   * ⚡ PERFORMANCE OPTIMIZATION: Supports '*' wildcard and key arrays for bulk retrieval.
   */
  get(key) {
    if (key === "*") return this.getAllSync();
    if (Array.isArray(key)) {
      const result = {};
      key.forEach((k) => {
        result[k] = this.get(k);
      });
      return result;
    }
    if (this._checkCanary(key)) return null;
    const baseKey = key.startsWith(STORAGE_PREFIX) ? key.replace(STORAGE_PREFIX, "") : key;
    if (window.VORO_COMPROMISED || !validateCallStack()) {
      return getDecoyData(baseKey);
    }
    if (this.cache.has(baseKey)) {
      return this.cache.get(baseKey);
    }
    const fullKey = key.startsWith(STORAGE_PREFIX) ? key : this.getFullKey(key);
    const item = localStorage.getItem(fullKey);
    if (!item) return null;
    if (item.startsWith("v1:") || item.startsWith("v2:") || item.startsWith("v3:")) {
      return null;
    }
    try {
      const parsed = JSON.parse(item);
      this.cache.set(baseKey, parsed);
      return createSecureProxy(parsed, baseKey);
    } catch (e) {
      this.cache.set(baseKey, item);
      return typeof item === "object" ? createSecureProxy(item, baseKey) : item;
    }
  }
  /**
   * ⚡ PERFORMANCE OPTIMIZATION: "Instant Flux" Optimistic UI.
   * Updates cache and notifies subscribers immediately (zero-latency)
   * before initiating background persistence (encryption and disk I/O).
   * Features a robust rollback mechanism for data integrity.
   */
  async set(key, value) {
    const baseKey = key.startsWith(STORAGE_PREFIX) ? key.replace(STORAGE_PREFIX, "") : key;
    const fullKey = key.startsWith(STORAGE_PREFIX) ? key : this.getFullKey(key);
    if (window.VORO_COMPROMISED || !validateCallStack() || this._checkCanary(key)) {
      this._ghostSet(fullKey, value);
      this.cache.set(baseKey, value);
      return true;
    }
    if (key === "__proto__" || key === "constructor" || key === "prototype") {
      console.error(`Security Sentinel: Potential Prototype Pollution attempt blocked on storage key: ${key}`);
      return false;
    }
    const previousValue = this.cache.get(baseKey);
    const updateTimestamp = Date.now();
    this._lastUpdate.set(baseKey, updateTimestamp);
    this.cache.set(baseKey, value);
    this.notify(baseKey, value);
    try {
      const sanitizedValue = sanitizeObject(value);
      let serialized;
      if (this.shouldEncrypt(baseKey)) {
        serialized = await crypto_default.encrypt(sanitizedValue, fullKey);
      } else {
        serialized = typeof sanitizedValue === "string" ? sanitizedValue : JSON.stringify(sanitizedValue);
      }
      await executeSecurely(`Write ${baseKey}`, () => {
        localStorage.setItem(fullKey, serialized);
      }, ["sink:localStorage.setItem"]);
      return true;
    } catch (error) {
      console.error("Storage set error:", error);
      if (this._lastUpdate.get(baseKey) === updateTimestamp) {
        if (previousValue === void 0) {
          this.cache.delete(baseKey);
        } else {
          this.cache.set(baseKey, previousValue);
        }
        this.notify(baseKey, previousValue || null);
      }
      return false;
    }
  }
  // Delete item from storage
  async delete(key) {
    if (window.VORO_COMPROMISED || !validateCallStack() || this._checkCanary(key)) {
      const baseKey = key.startsWith(STORAGE_PREFIX) ? key.replace(STORAGE_PREFIX, "") : key;
      const fullKey = key.startsWith(STORAGE_PREFIX) ? key : this.getFullKey(key);
      this._ghostDelete(fullKey);
      this.cache.delete(baseKey);
      return true;
    }
    try {
      const baseKey = key.startsWith(STORAGE_PREFIX) ? key.replace(STORAGE_PREFIX, "") : key;
      const fullKey = key.startsWith(STORAGE_PREFIX) ? key : this.getFullKey(key);
      await executeSecurely(`Delete ${baseKey}`, () => {
        localStorage.removeItem(fullKey);
      }, ["sink:localStorage.removeItem"]);
      this.cache.delete(baseKey);
      this.notify(baseKey, null);
      return true;
    } catch (error) {
      console.error("Storage delete error:", error);
      return false;
    }
  }
  // Check if key exists
  exists(key) {
    if (this._checkCanary(key)) return false;
    try {
      const fullKey = key.startsWith(STORAGE_PREFIX) ? key : this.getFullKey(key);
      return localStorage.getItem(fullKey) !== null;
    } catch (error) {
      console.error("Storage exists error:", error);
      return false;
    }
  }
  // Clear all VORO storage
  async clear() {
    if (window.VORO_COMPROMISED || !validateCallStack()) {
      this.clearCache();
      return true;
    }
    try {
      const keys = Object.keys(localStorage);
      for (const key of keys) {
        if (key.startsWith(STORAGE_PREFIX)) {
          await executeSecurely(`Clear ${key}`, () => {
            localStorage.removeItem(key);
          }, ["sink:localStorage.removeItem"]);
        }
      }
      this.clearCache();
      this.notify("*", null);
      return true;
    } catch (error) {
      console.error("Storage clear error:", error);
      return false;
    }
  }
  // Clear in-memory cache
  clearCache() {
    this.cache.clear();
  }
  // List all VORO storage keys
  list() {
    if (window.VORO_COMPROMISED || !validateCallStack()) {
      return ["user", "profile", "nutrition_log", "workout_log", "settings"];
    }
    try {
      const keys = [];
      const storageKeys = Object.keys(localStorage);
      storageKeys.forEach((key) => {
        if (key.startsWith(STORAGE_PREFIX)) {
          keys.push(key.replace(STORAGE_PREFIX, ""));
        }
      });
      return keys;
    } catch (error) {
      console.error("Storage list error:", error);
      return [];
    }
  }
  // Get all VORO storage data
  async getAll() {
    if (window.VORO_COMPROMISED || !validateCallStack()) {
      const data = {};
      const keys = this.list();
      keys.forEach((key) => {
        data[key] = getDecoyData(key);
      });
      return data;
    }
    try {
      const data = {};
      const keys = this.list();
      await Promise.all(keys.map(async (key) => {
        data[key] = await this.getAsync(key);
      }));
      return data;
    } catch (error) {
      console.error("Storage getAll error:", error);
      return {};
    }
  }
  // Get all data synchronously from cache
  getAllSync() {
    if (window.VORO_COMPROMISED || !validateCallStack()) {
      if (this.memoizedDecoyData) return this.memoizedDecoyData;
      const data2 = {};
      const keys = this.list();
      keys.forEach((key) => {
        data2[key] = getDecoyData(key);
      });
      this.memoizedDecoyData = data2;
      return data2;
    }
    if (this.memoizedData) return this.memoizedData;
    const data = {};
    this.cache.forEach((value, key) => {
      data[key] = value;
    });
    this.memoizedData = data;
    return data;
  }
  // Export storage as JSON for backup with cryptographic authentication and encryption
  async export() {
    const data = await this.getAll();
    const timestamp = (/* @__PURE__ */ new Date()).toISOString();
    const payload = {
      version: 2,
      timestamp,
      data
    };
    const encryptedPayload = await crypto_default.encrypt(payload, "voro_backup_vault");
    return {
      voro_backup_v2: true,
      payload: encryptedPayload
    };
  }
  // Import storage from JSON
  async import(backup) {
    try {
      if (!backup) {
        console.error("Invalid backup format");
        return false;
      }
      let backupData;
      if (backup.voro_backup_v2 && backup.payload) {
        const decrypted = await crypto_default.decrypt(backup.payload, "voro_backup_vault");
        if (!decrypted) {
          throw new Error("Cryptographic verification failed. Backup is corrupted, tampered, or from a different session.");
        }
        backupData = decrypted.data;
      } else if (backup.version === 1 && backup.data) {
        backupData = backup.data;
      } else {
        console.error("Unknown backup signature");
        return false;
      }
      for (const key of Object.keys(backupData)) {
        if (key === "__proto__" || key === "constructor" || key === "prototype") continue;
        const baseKey = key.startsWith(STORAGE_PREFIX) ? key.replace(STORAGE_PREFIX, "") : key;
        if (!this.encryptedKeys.has(baseKey)) continue;
        await this.set(baseKey, backupData[key]);
      }
      return true;
    } catch (error) {
      console.error("Storage import error:", error);
      return false;
    }
  }
  // Append to array in storage
  async append(key, value) {
    try {
      const existing = await this.getAsync(key) || [];
      if (!Array.isArray(existing)) {
        console.error(`Storage item ${key} is not an array`);
        return false;
      }
      const updated = [...existing, value];
      return await this.set(key, updated);
    } catch (error) {
      console.error("Storage append error:", error);
      return false;
    }
  }
  // Update object in storage (shallow merge)
  async update(key, updates) {
    try {
      const existing = await this.getAsync(key) || {};
      const updated = { ...existing, ...updates };
      return await this.set(key, updated);
    } catch (error) {
      console.error("Storage update error:", error);
      return false;
    }
  }
  // Get storage size in bytes
  async getSize() {
    try {
      let total = 0;
      const keys = this.list();
      for (const key of keys) {
        const fullKey = this.getFullKey(key);
        const item = localStorage.getItem(fullKey);
        if (item) total += item.length;
      }
      return total;
    } catch (error) {
      console.error("Storage size error:", error);
      return 0;
    }
  }
  // Get storage size formatted
  async getSizeFormatted() {
    const bytes = await this.getSize();
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (bytes / Math.pow(k, i)).toFixed(2) + " " + sizes[i];
  }
  // Observer Pattern Implementation
  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }
  notify(key, value) {
    this.memoizedData = null;
    this.memoizedDecoyData = null;
    this.listeners.forEach((callback) => callback(key, value));
  }
};
var storage = new StorageManager();
if (typeof window !== "undefined") {
  window.storage = storage;
}
var storage_default = storage;

// verify_ephemerality.js
var runTests = async () => {
  console.log("=========================================");
  console.log("\u{1F9EA} RUNNING SECURITY VERIFICATION: ASE-CAL");
  console.log("=========================================");
  crypto_default.key = "mock_master_key";
  crypto_default.hkdfKey = "mock_hkdf_key";
  crypto_default.domainKeyCache.set("test_domain", "mock_derived_key");
  crypto_default.initialized = true;
  storage_default.cache.set("user", { name: "Elite User" });
  console.log("\u{1F7E2} Initial state checks (Active)...");
  if (crypto_default.key && crypto_default.initialized && storage_default.cache.has("user")) {
    console.log("\u2705 Initial active keys & cache verified successfully.");
  } else {
    throw new Error("\u274C Initial active state setup failed!");
  }
  console.log("\n\u{1F6E1}\uFE0F Test 1: Simulating idle timeout and dispatching 'voro-security-idle-shred'...");
  const idleEvent = new CustomEvent("voro-security-idle-shred", { detail: { timestamp: Date.now() } });
  window.dispatchEvent(idleEvent);
  if (!crypto_default.key && !crypto_default.hkdfKey && crypto_default.domainKeyCache.size === 0 && !crypto_default.initialized) {
    console.log("\u2705 Success: Cryptographic keys shredded from memory successfully.");
  } else {
    throw new Error(`\u274C Failure: Cryptographic keys were not shredded! key=${crypto_default.key}`);
  }
  if (storage_default.cache.size === 0) {
    console.log("\u2705 Success: Decrypted storage cache cleared successfully.");
  } else {
    throw new Error("\u274C Failure: Storage cache was not cleared!");
  }
  console.log("\n\u{1F3C3} Test 2: Simulating trusted user interaction to trigger session re-activation...");
  window._voro_idle_shredded = true;
  let userActiveTriggered = false;
  window.addEventListener("voro-security-user-active", () => {
    userActiveTriggered = true;
  });
  triggerDocStart("mousedown", { type: "mousedown", button: 0, isTrusted: true });
  if (!window._voro_idle_shredded && userActiveTriggered) {
    console.log("\u2705 Success: User presence re-attested, sending 'voro-security-user-active' event and resetting idle state.");
  } else {
    throw new Error(`\u274C Failure: User re-attestation did not execute correctly! shredded=${window._voro_idle_shredded}, event=${userActiveTriggered}`);
  }
  console.log("\n\u{1F389} ALL ASE-CAL SECURITY VERIFICATION TESTS PASSED SUCCESSFULLY!");
  console.log("=========================================");
  process.exit(0);
};
runTests().catch((err) => {
  console.error(err);
  process.exit(1);
});
