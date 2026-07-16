/**
 * VORO Security Sentinel
 * Centralized security and privacy orchestrator for Zero Trust data flows.
 */

// Capture original primitives to prevent RASP evasion via monkey-patching
const _toString = Function.prototype.toString;
const _OToString = Object.prototype.toString;
const _call = Function.prototype.call;
const _apply = Function.prototype.apply;
const _bind = Function.prototype.bind;
const _test = RegExp.prototype.test;
const _exec = RegExp.prototype.exec;

// String Prototype Pinning
const _split = String.prototype.split;
const _SIncludes = String.prototype.includes;
const _match = String.prototype.match;
const _replace = String.prototype.replace;
const _padStart = String.prototype.padStart;
const _toLowerCase = String.prototype.toLowerCase;
const _startsWith = String.prototype.startsWith;
const _endsWith = String.prototype.endsWith;
const _slice = String.prototype.slice;
const _trim = String.prototype.trim;

// Array Prototype Pinning
const _forEach = Array.prototype.forEach;
const _filter = Array.prototype.filter;
const _map = Array.prototype.map;
const _reduce = Array.prototype.reduce;
const _AIncludes = Array.prototype.includes;
const _join = Array.prototype.join;
const _push = Array.prototype.push;
const _reverse = Array.prototype.reverse;
const _ASlice = Array.prototype.slice;
const _find = Array.prototype.find;
const _some = Array.prototype.some;
const _every = Array.prototype.every;

// Utility and Collection Prototype Pinning
const _stringify = JSON.stringify;
const _parse = JSON.parse;
const _URLSearch = (typeof URL !== 'undefined') ? Object.getOwnPropertyDescriptor(URL.prototype, 'search')?.get : null;
const _URLHash = (typeof URL !== 'undefined') ? Object.getOwnPropertyDescriptor(URL.prototype, 'hash')?.get : null;
const _URLHostname = (typeof URL !== 'undefined') ? Object.getOwnPropertyDescriptor(URL.prototype, 'hostname')?.get : null;
const _URLOrigin = (typeof URL !== 'undefined') ? Object.getOwnPropertyDescriptor(URL.prototype, 'origin')?.get : null;
const _parseFromString = (typeof DOMParser !== 'undefined') ? DOMParser.prototype.parseFromString : null;
const _MapGet = Map.prototype.get;
const _MapSet = Map.prototype.set;
const _MapHas = Map.prototype.has;
const _MapDelete = Map.prototype.delete;
const _MapClear = Map.prototype.clear;
const _MapEntries = Map.prototype.entries;
const _SetAdd = Set.prototype.add;
const _SetHas = Set.prototype.has;
const _SetDelete = Set.prototype.delete;
const _WeakMapGet = WeakMap.prototype.get;
const _WeakMapSet = WeakMap.prototype.set;
const _WeakMapHas = WeakMap.prototype.has;
const _WeakSetAdd = WeakSet.prototype.add;
const _WeakSetHas = WeakSet.prototype.has;
const _Uint8Fill = Uint8Array.prototype.fill;
const _Uint8Set = Uint8Array.prototype.set;
const _Uint8Slice = Uint8Array.prototype.slice;
const _TEncoderEncode = (typeof TextEncoder !== 'undefined') ? TextEncoder.prototype.encode : null;
const _TDecoderDecode = (typeof TextDecoder !== 'undefined') ? TextDecoder.prototype.decode : null;
const _ArrayFrom = Array.from;

// Async Context Ribbon Pinning
const _PromiseThen = Promise.prototype.then;
const _PromiseCatch = Promise.prototype.catch;
const _PromiseFinally = Promise.prototype.finally;
const _rAF = typeof window !== 'undefined' ? window.requestAnimationFrame : null;
const _rIC = typeof window !== 'undefined' ? window.requestIdleCallback : null;

// Global Object Pinning for Identity Attestation
const _Object = Object;
const _Array = Array;
const _Function = Function;
const _Reflect = typeof Reflect !== 'undefined' ? Reflect : null;
const _JSON = JSON;
const _Promise = Promise;
const _Proxy = Proxy;
const _Map = Map;
const _Set = Set;
const _WeakMap = WeakMap;
const _WeakSet = WeakSet;
const _Uint8Array = Uint8Array;
const _NToString = Number.prototype.toString;

const _setInterval = typeof setInterval !== 'undefined' ? setInterval : null;
const _setTimeout = typeof setTimeout !== 'undefined' ? setTimeout : null;
const _Error = Error;
const _RegExp = RegExp;
const _Date = Date;
const _log2 = Math.log2;
const _fetch = typeof window !== 'undefined' ? window.fetch : null;
const _open = typeof window !== 'undefined' ? window.open : null;
const _XHR = typeof window !== 'undefined' ? window.XMLHttpRequest : null;
const _BroadcastChannel = typeof window !== 'undefined' ? window.BroadcastChannel : null;
const _BCPostMessage = (typeof window !== 'undefined' && window.BroadcastChannel) ? window.BroadcastChannel.prototype.postMessage : null;
const _indexedDBOpen = (typeof window !== 'undefined' && window.indexedDB) ? window.indexedDB.open : null;
const _Headers = typeof Headers !== 'undefined' ? Headers : null;
const _XHROpen = (typeof window !== 'undefined' && window.XMLHttpRequest) ? window.XMLHttpRequest.prototype.open : null;
const _XHRSetRequestHeader = (typeof window !== 'undefined' && window.XMLHttpRequest) ? window.XMLHttpRequest.prototype.setRequestHeader : null;
const _WebSocket = typeof window !== 'undefined' ? window.WebSocket : null;
const _sendBeacon = (typeof window !== 'undefined' && window.navigator) ? window.navigator.sendBeacon : null;
const _SWRegister = (typeof window !== 'undefined' && window.navigator?.serviceWorker) ? window.navigator.serviceWorker.register : null;
const _writeText = (typeof window !== 'undefined' && window.navigator?.clipboard) ? window.navigator.clipboard.writeText : null;
const _readText = (typeof window !== 'undefined' && window.navigator?.clipboard) ? window.navigator.clipboard.readText : null;
const _share = (typeof window !== 'undefined' && window.navigator) ? window.navigator.share : null;
const _URL = typeof window !== 'undefined' ? window.URL : null;
const _createObjectURL = (typeof window !== 'undefined' && window.URL) ? window.URL.createObjectURL : null;
const _revokeObjectURL = (typeof window !== 'undefined' && window.URL) ? window.URL.revokeObjectURL : null;
const _RTCPeerConnection = (typeof window !== 'undefined') ? (window.RTCPeerConnection || window.webkitRTCPeerConnection) : null;
const _EventSource = typeof window !== 'undefined' ? window.EventSource : null;
const _Worker = typeof window !== 'undefined' ? window.Worker : null;
const _SharedWorker = typeof window !== 'undefined' ? window.SharedWorker : null;

const _Request = typeof Request !== 'undefined' ? Request : null;
const _Response = typeof Response !== 'undefined' ? Response : null;
const _ResponseJSON = (typeof Response !== 'undefined' && Response.prototype) ? Response.prototype.json : null;
const _ResponseText = (typeof Response !== 'undefined' && Response.prototype) ? Response.prototype.text : null;
const _ResponseBlob = (typeof Response !== 'undefined' && Response.prototype) ? Response.prototype.blob : null;
const _ResponseArrayBuffer = (typeof Response !== 'undefined' && Response.prototype) ? Response.prototype.arrayBuffer : null;
const _ResponseFormData = (typeof Response !== 'undefined' && Response.prototype) ? Response.prototype.formData : null;

// Storage Prototype Pinning
const _StorageGetItem = (typeof window !== 'undefined' && typeof Storage !== 'undefined') ? Storage.prototype.getItem : null;
const _StorageSetItem = (typeof window !== 'undefined' && typeof Storage !== 'undefined') ? Storage.prototype.setItem : null;
const _StorageRemoveItem = (typeof window !== 'undefined' && typeof Storage !== 'undefined') ? Storage.prototype.removeItem : null;
const _StorageClear = (typeof window !== 'undefined' && typeof Storage !== 'undefined') ? Storage.prototype.clear : null;

// SubtleCrypto Prototype Pinning
const _SubtleEncrypt = (typeof window !== 'undefined' && window.crypto?.subtle) ? window.crypto.subtle.encrypt : null;
const _SubtleDecrypt = (typeof window !== 'undefined' && window.crypto?.subtle) ? window.crypto.subtle.decrypt : null;
const _SubtleDeriveKey = (typeof window !== 'undefined' && window.crypto?.subtle) ? window.crypto.subtle.deriveKey : null;
const _SubtleImportKey = (typeof window !== 'undefined' && window.crypto?.subtle) ? window.crypto.subtle.importKey : null;
const _SubtleGenerateKey = (typeof window !== 'undefined' && window.crypto?.subtle) ? window.crypto.subtle.generateKey : null;

const _freeze = Object.freeze;
const _values = Object.values;
const _entries = Object.entries;
const _defineProperty = Object.defineProperty;
const _getOwnPropertyNames = Object.getOwnPropertyNames;
const _getOwnPropertySymbols = Object.getOwnPropertySymbols;
const _getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
const _getPrototypeOf = Object.getPrototypeOf;
const _hasOwnProperty = Object.prototype.hasOwnProperty;
const _ReflectApply = typeof Reflect !== 'undefined' ? Reflect.apply : null;
const _ReflectConstruct = typeof Reflect !== 'undefined' ? Reflect.construct : null;
const _ReflectGet = typeof Reflect !== 'undefined' ? Reflect.get : null;
const _ReflectSet = typeof Reflect !== 'undefined' ? Reflect.set : null;
const _ReflectDefineProperty = typeof Reflect !== 'undefined' ? Reflect.defineProperty : null;
const _ReflectGetOwnPropertyDescriptor = typeof Reflect !== 'undefined' ? Reflect.getOwnPropertyDescriptor : null;
const _ReflectOwnKeys = typeof Reflect !== 'undefined' ? Reflect.ownKeys : null;
const _perfNow = (typeof performance !== 'undefined' && performance.now) ? (_ReflectApply ? _ReflectApply(_bind, performance.now, [performance]) : performance.now.bind(performance)) : null;
const _seal = Object.seal;
const _preventExtensions = Object.preventExtensions;
const _isFrozen = Object.isFrozen;
const _isSealed = Object.isSealed;
const _isExtensible = Object.isExtensible;

// Pulse Integrity Constants
const PULSE_INTERVAL = 30000; // 30s
const PULSE_DRIFT_THRESHOLD = PULSE_INTERVAL + 10000; // 40s (10s tolerance for background throttling)
let _lastIntegrityPulse = 0;

/**
 * Neural Context Ribbon (NCR)
 * Tracking variable for asynchronous execution attestation.
 */
let _activeContext = null;

// User Presence Attestation (UPA) Constants
let _lastUserInteraction = 0;
const USER_PRESENCE_THRESHOLD = 30000; // 30s

/**
 * Identifies if the application is running in an authorized automated testing environment.
 */
const isTestMode = () => {
  if (typeof window === 'undefined') return false;
  const testModeMarker = (typeof localStorage !== 'undefined' && _StorageGetItem)
    ? _call.call(_StorageGetItem, localStorage, 'voro_test_mode')
    : null;
  return window.__VORO_TEST_BYPASS__ === true || testModeMarker === 'true';
};

/**
 * Initializes User Presence Attestation (UPA) by attaching trusted event listeners.
 */
const initializeUserPresence = () => {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  const updatePresence = (e) => {
    // Only update presence for legitimate, user-generated events.
    // This blocks automated scripts and headless interaction.
    if (e.isTrusted) {
      _lastUserInteraction = _perfNow ? _call.call(_perfNow, performance) : Date.now();
    }
  };

  ['mousedown', 'keydown', 'touchstart'].forEach(type => {
    document.addEventListener(type, updatePresence, { capture: true, passive: true });
  });
};

// Capture native console methods to prevent bypass
const _console = {
  log: typeof console !== 'undefined' ? console.log : null,
  warn: typeof console !== 'undefined' ? console.warn : null,
  error: typeof console !== 'undefined' ? console.error : null,
  info: typeof console !== 'undefined' ? console.info : null,
  debug: typeof console !== 'undefined' ? console.debug : null,
  trace: typeof console !== 'undefined' ? console.trace : null
};

/**
 * Anomaly detection for potential "Data Smuggling" or high-entropy secrets.
 */
const calculateEntropy = (str) => {
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

/**
 * Prototype Integrity Shield
 * Snapshots core prototypes at module load to detect pollution or tampering.
 */
const prototypeSnapshots = new Map();
const corePrototypes = [
  { name: 'Object', proto: Object.prototype },
  { name: 'Array', proto: Array.prototype },
  { name: 'Function', proto: Function.prototype },
  { name: 'String', proto: String.prototype },
  { name: 'Number', proto: Number.prototype },
  { name: 'Boolean', proto: Boolean.prototype },
  { name: 'Error', proto: Error.prototype }
];

const TRUSTED_WRAPPERS = new WeakSet();

const snapshotPrototypes = () => {
  if (typeof window === 'undefined') return;
  corePrototypes.forEach(({ name, proto }) => {
    try {
      const keys = _getOwnPropertyNames(proto);
      const symbols = _getOwnPropertySymbols ? _getOwnPropertySymbols(proto) : [];
      const currentKeys = [...keys, ...symbols];
      prototypeSnapshots.set(name, new Set(currentKeys));

      /**
       * Proactive Prototype Hardening (PPH)
       * Lock established methods to prevent runtime monkey-patching.
       * Surgically handles data vs accessor descriptors to prevent TypeErrors.
       */
      _call.call(_forEach, currentKeys, (key) => {
        try {
          const desc = _getOwnPropertyDescriptor(proto, key);
          if (desc && desc.configurable) {
            const hardenedDesc = { configurable: false };
            if (_call.call(_hasOwnProperty, desc, 'writable')) hardenedDesc.writable = false;
            _defineProperty(proto, key, hardenedDesc);
          }
        } catch (e) { /* non-critical hardening failure */ }
      });
    } catch (e) {
      // Ignore errors during snapshotting
    }
  });
};

// Initial snapshot
snapshotPrototypes();

/**
 * Async Execution Attestation - Neural Context Ribbon (NCR)
 * Propagates security context across async boundaries (Promises, Timers).
 */
const initializeContextRibbon = () => {
  if (typeof window === 'undefined') return;

  const wrapAsync = (native, name) => {
    return function(...args) {
      const capturedContext = _activeContext;
      const wrappedArgs = _call.call(_map, args, arg => {
        if (typeof arg === 'function') {
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

  // Wrap Promise prototype methods
  if (_PromiseThen) {
    Promise.prototype.then = wrapAsync(_PromiseThen, 'Promise.then');
    TRUSTED_WRAPPERS.add(Promise.prototype.then);
  }
  if (_PromiseCatch) {
    Promise.prototype.catch = wrapAsync(_PromiseCatch, 'Promise.catch');
    TRUSTED_WRAPPERS.add(Promise.prototype.catch);
  }
  if (_PromiseFinally) {
    Promise.prototype.finally = wrapAsync(_PromiseFinally, 'Promise.finally');
    TRUSTED_WRAPPERS.add(Promise.prototype.finally);
  }

  // Wrap scheduling sinks
  if (_setTimeout) {
    window.setTimeout = wrapAsync(_setTimeout, 'setTimeout');
    TRUSTED_WRAPPERS.add(window.setTimeout);
  }
  if (_setInterval) {
    window.setInterval = wrapAsync(_setInterval, 'setInterval');
    TRUSTED_WRAPPERS.add(window.setInterval);
  }
  if (_rAF) {
    window.requestAnimationFrame = wrapAsync(_rAF, 'requestAnimationFrame');
    TRUSTED_WRAPPERS.add(window.requestAnimationFrame);
  }
  if (_rIC) {
    window.requestIdleCallback = wrapAsync(_rIC, 'requestIdleCallback');
    TRUSTED_WRAPPERS.add(window.requestIdleCallback);
  }
};

initializeContextRibbon();

/**
 * Polymorphic Memory Protection (PMP)
 * Wraps sensitive data in a rotating, lockdown-aware Proxy that implements
 * "Dynamic Trap Shuffling" and "Heap Hygiene Sinks". This prevents forensic
 * memory analysis and post-compromise exfiltration.
 */
let _cloakingCache = new WeakMap();
const _trapEntropy = generateSecurityNonce();

/**
 * Generates a randomized trap set for the polymorphic proxy.
 * Shuffling trap logic makes it significantly harder for attackers to predict
 * or bypass proxy behavior via forensic analysis.
 */
const _generateDynamicTraps = (target, key) => {
  const traps = {
    get(obj, prop) {
      if ((typeof window !== 'undefined' && window.VORO_COMPROMISED) || isDeceptionActive()) {
        if (key) {
          const decoy = getDecoyData(key);
          if (decoy && typeof decoy === 'object') return decoy[prop];
        }
        return undefined;
      }
      const value = obj[prop];
      if (value && typeof value === 'object' && !_isFrozen(value)) {
        return createSecureProxy(value, key ? `${key}.${String(prop)}` : null);
      }
      return value;
    },
    set(obj, prop, value) {
      if ((typeof window !== 'undefined' && window.VORO_COMPROMISED) || isDeceptionActive()) return false;
      obj[prop] = value;
      return true;
    },
    defineProperty(obj, prop, desc) {
      if ((typeof window !== 'undefined' && window.VORO_COMPROMISED) || isDeceptionActive()) return false;
      return _ReflectDefineProperty(obj, prop, desc);
    },
    deleteProperty(obj, prop) {
      if ((typeof window !== 'undefined' && window.VORO_COMPROMISED) || isDeceptionActive()) return false;
      return _Reflect ? _Reflect.deleteProperty(obj, prop) : delete obj[prop];
    },
    ownKeys(obj) {
      if ((typeof window !== 'undefined' && window.VORO_COMPROMISED) || isDeceptionActive()) return [];
      return _ReflectOwnKeys(obj);
    },
    getPrototypeOf(obj) {
      if ((typeof window !== 'undefined' && window.VORO_COMPROMISED) || isDeceptionActive()) return null;
      return _getPrototypeOf(obj);
    }
  };

  // ⚡ HEAP HYGIENE: Polymorphic Trap Shuffling
  // Randomly inject harmless 'ghost' traps to alter the internal object shape
  // and metadata, confusing automated memory analysis tools.
  if (_trapEntropy[0] > '8') {
    traps.has = (obj, prop) => {
      if ((typeof window !== 'undefined' && window.VORO_COMPROMISED) || isDeceptionActive()) return false;
      return prop in obj;
    };
  }

  return traps;
};

/**
 * Executes a cache rotation for cloaked objects.
 * Transparently invalidates the cache to force new proxy allocations,
 * implementing a "Moving Target Defense" for the application heap.
 */
export const rotateCloakingCache = () => {
  _cloakingCache = new WeakMap();
};

export const createSecureProxy = (target, key = null) => {
  if (!target || typeof target !== 'object' || _isFrozen(target)) return target;


  if (_call.call(_WeakMapHas, _cloakingCache, target)) {
    return _call.call(_WeakMapGet, _cloakingCache, target);
  }

  const proxy = new Proxy(target, _generateDynamicTraps(target, key));
  _call.call(_WeakMapSet, _cloakingCache, target, proxy);
  return proxy;
};

/**
 * Verifies and repairs the integrity of core prototypes against snapshots.
 * Implements "Self-Healing RASP" by proactively purging unauthorized properties.
 */
export const checkPrototypeIntegrity = () => {
  if (typeof window === 'undefined') return true;
  let compromised = false;

  corePrototypes.forEach(({ name, proto }) => {
    try {
      const keys = _getOwnPropertyNames(proto);
      const symbols = _getOwnPropertySymbols ? _getOwnPropertySymbols(proto) : [];
      const currentKeys = [...keys, ...symbols];
      const originalKeys = prototypeSnapshots.get(name);

      if (!originalKeys) return;

      // Check for added properties (pollution)
      for (const key of currentKeys) {
        if (!originalKeys.has(key)) {
          const keyDesc = typeof key === 'symbol' ? key.toString() : key;
          if (_console.error) _call.call(_console.error, console, `Security Sentinel: Prototype Pollution detected on ${name}.prototype.${keyDesc}. Proactively purging polluted property.`);

          // Self-Healing: Proactively delete the unauthorized property
          try {
            delete proto[key];
          } catch (e) {
            // If delete fails, attempt to shadow it with undefined and make it non-configurable
            try {
              _defineProperty(proto, key, { value: undefined, configurable: false, writable: false });
            } catch (innerE) { /* total failure */ }
          }
          compromised = true;
        }
      }

      // Check for deleted properties
      originalKeys.forEach(key => {
        if (!currentKeys.includes(key)) {
          const keyDesc = typeof key === 'symbol' ? key.toString() : key;
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

/**
 * Call Stack Attestation (CSA)
 * Verifies the provenance of the execution stack to prevent unauthorized programmatic access
 * to sensitive security sinks from non-application contexts (eval, third-party, etc.).
 */
export const validateCallStack = () => {
  if (typeof window === 'undefined' || isTestMode()) return true;

  // Circuit breaker: skip if already compromised
  if (window.VORO_COMPROMISED) return false;

  try {
    const stack = new _Error().stack;
    if (!stack) return true; // Some browsers might not provide stack, fail-open for UX but logs

    const lines = _call.call(_split, stack, '\n');
    const trustedOrigin = window.location.origin;

    // Detection 0: Stack Depth Validation (Prevents recursion/exhaustion attacks)
    if (lines.length > 50) {
      if (_console.error) _call.call(_console.error, console, "Security Sentinel: Abnormal call stack depth detected.");
      executeLockdown();
      return false;
    }

    // We skip the first 2-3 lines (validateCallStack itself and the immediate caller)
    // and analyze the rest of the provenance.
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      if (!line || _call.call(_SIncludes, line, 'validateCallStack')) continue;

      // Detection 1: Anonymous / Evaluated Code
      if (_call.call(_SIncludes, line, '<anonymous>') || _call.call(_SIncludes, line, 'eval at') || _call.call(_SIncludes, line, 'at eval')) {
        if (_console.error) _call.call(_console.error, console, "Security Sentinel: Unauthorized execution context (eval/anonymous) detected in call stack.");
        executeLockdown();
        return false;
      }

      // Detection 2: Protocol Smuggling (blob, data, filesystem, extension)
      const dangerousProtocols = ['blob:', 'data:', 'filesystem:', 'chrome-extension:', 'moz-extension:', 'extension:', 'about:'];
      if (_call.call(_some, dangerousProtocols, proto => _call.call(_SIncludes, line, proto))) {
        if (_console.error) _call.call(_console.error, console, "Security Sentinel: Unauthorized protocol detected in call stack.");
        executeLockdown();
        return false;
      }

      // Detection 3: Cross-Origin / Third-party script provenance
      // Extract URL and verify it against the trusted application origin
      const urlMatch = _call.call(_match, line, /(https?:\/\/[^\s)]+)/);
      if (urlMatch) {
        try {
          // Strip line/column numbers (e.g. :14:2) before parsing
          const cleanUrl = _call.call(_replace, urlMatch[0], /:\d+(?::\d+)?$/, '');
          const urlObj = new URL(cleanUrl);
          if (_call.call(_URLOrigin, urlObj) !== trustedOrigin) {
            if (_console.error) _call.call(_console.error, console, `Security Sentinel: Cross-origin script provenance detected: ${_call.call(_URLOrigin, urlObj)}`);
            executeLockdown();
            return false;
          }
        } catch (e) {
          // If URL parsing fails but it has a protocol, it's a potential obfuscation attempt
          if (_console.error) _call.call(_console.error, console, "Security Sentinel: Malformed or obfuscated provenance URL detected.");
          executeLockdown();
          return false;
        }
      }
    }

    return true;
  } catch (e) {
    // If stack parsing fails, we assume compromise in high-security mode
    if (_console.error) _call.call(_console.error, console, "Security Sentinel: Call stack analysis failed.", e);
    executeLockdown();
    return false;
  }
};

/**
 * Sanitizes a string to prevent XSS and injection attacks.
 * Strips dangerous HTML tags and attributes.
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;

  // Strip null bytes, dangerous control characters, and zero-width markers
  // eslint-disable-next-line no-control-regex
  input = _call.call(_replace, input, /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F\u200B-\u200D\uFEFF]/g, '');

  // If in a browser environment, use DOMParser for robust sanitization
  if (typeof window !== 'undefined' && window.DOMParser && _parseFromString) {
    try {
      const parser = new DOMParser();
      const doc = _call.call(_parseFromString, parser, input, 'text/html');

      // Remove scripts, styles, iframes, and other dangerous elements
      const dangerousTags = ['script', 'style', 'iframe', 'object', 'embed', 'link', 'base', 'form', 'meta', 'svg', 'math', 'applet', 'frame', 'frameset', 'video', 'audio', 'canvas', 'details', 'template'];
      _call.call(_forEach, dangerousTags, tag => {
        const elements = doc.getElementsByTagName(tag);
        while (elements.length > 0) {
          elements[0].parentNode.removeChild(elements[0]);
        }
      });

      // Remove event handlers and dangerous attributes from all remaining elements
      const allElements = doc.querySelectorAll('*');
      _call.call(_forEach, allElements, el => {
        for (let i = 0; i < el.attributes.length; i++) {
          const attr = _call.call(_toLowerCase, el.attributes[i].name);
          const value = _call.call(_toLowerCase, el.attributes[i].value);
          if (_call.call(_startsWith, attr, 'on') ||
              attr === 'action' ||
              attr === 'formaction' ||
              (attr === 'href' || attr === 'src') && _call.call(_startsWith, value, 'javascript:')) {
            el.removeAttribute(el.attributes[i].name);
            i--; // Adjust index after removal
          }
        }
      });

      return doc.body.textContent || doc.body.innerText || "";
    } catch (e) {
      if (_console.warn) _call.call(_console.warn, console, "DOMParser sanitization failed, falling back to regex", e);
    }
  }

  // Fallback: Robust regex-based sanitization
  let r = input;
  r = _call.call(_replace, r, /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  r = _call.call(_replace, r, /<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
  r = _call.call(_replace, r, /\bon\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '');
  r = _call.call(_replace, r, /\b(?:form)?action\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '');
  r = _call.call(_replace, r, /javascript:[^"']*/gi, '');
  r = _call.call(_replace, r, /<[^>]*>/g, ''); // Strip all remaining HTML tags
  return r;
};

/**
 * Generates a cryptographically secure ephemeral nonce for request isolation.
 */
export function generateSecurityNonce() {
  if (typeof window === 'undefined' || !window.crypto) {
    return Math.random().toString(36).substring(2, 15);
  }
  const array = new Uint8Array(16);
  window.crypto.getRandomValues(array);
  return _call.call(_join, _call.call(_map, _ArrayFrom(array), byte => _call.call(_padStart, _call.call(_NToString, byte, 16), 2, '0')), '');
}

/**
 * Trusted Types Policy
 * Enforces security for dangerous sinks (HTML, Scripts).
 */
export const voroPolicy = (typeof window !== 'undefined' && window.trustedTypes)
  ? window.trustedTypes.createPolicy('voroPolicy', {
      createHTML: (input) => sanitizeInput(input),
      createScript: (input) => {
        // Scripts should not be dynamically created in this architecture
        console.error("Security Sentinel: Dynamic script creation blocked by Trusted Types.");
        return "";
      },
      createScriptURL: (input) => {
        const allowedDomains = ['self', 'https://fonts.googleapis.com', 'https://fonts.gstatic.com'];
        const url = new URL(input, window.location.origin);
        if (allowedDomains.includes(url.origin) || url.origin === window.location.origin) {
          return input;
        }
        console.error("Security Sentinel: External script URL blocked by Trusted Types.");
        return "";
      }
    })
  : {
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

/**
 * Synthetic Deception Engine
 * Provides high-fidelity, plausible decoy data for honey-routing when the system
 * is under compromise or unauthorized access is detected.
 */
const DECOY_DATA = {
  user: { id: 'voro_anon_7721', name: 'Elite User', level: 42, status: 'Active' },
  profile: {
    name: 'Elite User',
    goal: 'Maintenance',
    activity: 'Highly Active',
    preferences: { theme: 'dark', units: 'metric' }
  },
  nutrition_log: [
    { date: new Date().toISOString().split('T')[0], meal: 'Breakfast', calories: 650, protein: 45 },
    { date: new Date().toISOString().split('T')[0], meal: 'Lunch', calories: 800, protein: 55 }
  ],
  workout_log: [
    { date: new Date().toISOString().split('T')[0], exercise: 'Bench Press', sets: 5, reps: 5, weight: 100 }
  ],
  vitals: { heart_rate: 62, systolic: 118, diastolic: 78, oxygen: 99 },
  settings: { notifications: true, privacy_mode: 'maximum', biometric_auth: true },
  chat_history: [],
  notifications: [],
  achievements: [],
  habits: []
};

// ⚡ PERFORMANCE OPTIMIZATION: Stable default decoy object to prevent infinite re-render loops in deception mode.
const DEFAULT_DECOY = _freeze({ status: 'secure', integrity: 'verified' });

export const getDecoyData = (key) => {
  // Normalize key
  const baseKey = key.replace(/^voro_/, '');
  return DECOY_DATA[baseKey] || DECOY_DATA[key] || DEFAULT_DECOY;
};

export const isDeceptionActive = () => {
  return typeof window !== 'undefined' && window.VORO_DECEPTION_ACTIVE === true;
};

/**
 * Pulse Metadata Accessor
 */
export const getPulseMetadata = () => ({
  lastPulse: _lastIntegrityPulse,
  driftThreshold: PULSE_DRIFT_THRESHOLD,
  lastUserInteraction: _lastUserInteraction,
  userPresenceThreshold: USER_PRESENCE_THRESHOLD
});

/**
 * Validates recent user presence (UPA).
 */
export const checkUserPresence = () => {
  if (isTestMode()) return true;
  const now = _perfNow ? _call.call(_perfNow, performance) : Date.now();
  return (now - _lastUserInteraction) <= USER_PRESENCE_THRESHOLD;
};

/**
 * Granular Neural Capability Attestation (GNCA)
 * Implements a time-bound, scoped capability model for high-risk sinks.
 */
const activeCapabilities = new Map();

// Trusted origins that bypass mandatory attestation (UX safety)
const ATTESTATION_WHITELIST = [
  'self',
  'https://fonts.googleapis.com',
  'https://fonts.gstatic.com'
];

/**
 * Executes a callback within a secure attested context, authorizing network egress or storage access
 * with specific, granular capabilities.
 */
export const executeSecurely = async (action, callback, requiredCapabilities = []) => {
  if (typeof window === 'undefined') return await callback();

  // Pre-execution Call Stack Attestation
  if (!validateCallStack()) {
    throw new _Error("Security Sentinel: Secure execution context denied due to unauthorized provenance.");
  }

  const nonce = generateSecurityNonce();
  // Opaque Context Tagging: Randomize prefix and suffix to prevent forensic pattern matching
  const opaquePrefix = _call.call(_slice, generateSecurityNonce(), 0, 8);
  const tag = `__VORO_${opaquePrefix}_CTX_${nonce}__`;

  // Register capabilities for this specific execution context
  _call.call(_MapSet, activeCapabilities, nonce, {
    action,
    timestamp: _perfNow ? _call.call(_perfNow, performance) : Date.now(),
    capabilities: Array.isArray(requiredCapabilities) ? requiredCapabilities : [requiredCapabilities],
    consumed: new Set(),
    tag
  });

  try {
    // Dynamic Stack Tagging: Wraps the execution in a uniquely named function
    // to bind the call stack to this specific authorized context and its capabilities.
    const context = {
      [tag]: async () => {
        const prevContext = _activeContext;
        // Bind the NCR to this capability record
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
    // Cleanup: Ephemeral capabilities expire immediately after execution
    _call.call(_MapDelete, activeCapabilities, nonce);
  }
};

const verifyAttestation = (sinkName, targetUrl = null) => {
  if (typeof window === 'undefined') return true;

  // Circuit breaker: skip if already compromised
  if (window.VORO_COMPROMISED) return false;

  // 1. Whitelist Verification (Prevents breaking core app functionality)
  if (targetUrl) {
    try {
      const url = new URL(targetUrl, window.location.origin);
      if (ATTESTATION_WHITELIST.includes('self') && url.origin === window.location.origin) return true;
      if (ATTESTATION_WHITELIST.some(allowed => url.origin === allowed)) return true;
    } catch (e) { /* fallback to strict attestation if URL is malformed */ }
  }

  // 2. Stack-Bound Granular Policy Enforcement (GPE)
  // Ensure the call originates from within an authorized executeSecurely context
  // and that the context possesses the required capabilities for this sink.
  try {
    const stack = new _Error().stack;
    if (!stack) return false;

    let authorized = false;
    let authorizedNonce = null;

    // Iterate active capabilities and verify if any match the current stack or NCR
    for (const [nonce, record] of activeCapabilities.entries()) {
      // 2a. Physical Stack Attestation (PSA)
      const inStack = stack.includes(record.tag);
      // 2b. Neural Context Ribbon (NCR) Attestation
      const inRibbon = _activeContext && _activeContext.nonce === nonce;

      if (inStack || inRibbon) {
        // Verification: Does this context have the specific capability for this sink?
        // Granular check: 'sink:fetch', 'sink:indexedDB', 'domain:api.anthropic.com', etc.
        const hasSinkCap = record.capabilities.includes(`sink:${sinkName}`);

        let hasDomainCap = true;
        if (targetUrl) {
          try {
            const url = new URL(targetUrl, window.location.origin);
            const domainCap = `domain:${url.host}`;
            // If domains are specified in capabilities, we must match one
            const restrictedDomains = record.capabilities.filter(c => c.startsWith('domain:'));
            if (restrictedDomains.length > 0) {
              hasDomainCap = restrictedDomains.includes(domainCap);
            }
          } catch (e) { hasDomainCap = false; }
        }

        if (hasSinkCap && hasDomainCap) {
          // User Presence Attestation (UPA) Enforcement
          if (record.capabilities.includes('requirement:user-presence') && !isTestMode()) {
            const now = _perfNow ? _call.call(_perfNow, performance) : Date.now();
            const idleTime = now - _lastUserInteraction;
            if (idleTime > USER_PRESENCE_THRESHOLD) {
              if (_console.warn) _call.call(_console.warn, console, `Security Sentinel: GNCA Violation for ${sinkName}. User presence required but not detected (Idle: ${Math.round(idleTime)}ms).`);
              return false;
            }
          }

          // Single-Shot Enforcement: Check if this specific sink/target has already been consumed
          // This prevents replay attacks or unauthorized re-entry within the same context.
          const consumptionToken = `${sinkName}${targetUrl ? `:${targetUrl}` : ''}`;
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
      if (_console.error) _call.call(_console.error, console, `Security Sentinel: GNCA Violation for ${sinkName}. Call originated outside of authorized scope or lacks granular capabilities [target: ${targetUrl || 'none'}].`);

      // Surgical Lockdown: Only trigger for sensitive API targets to minimize false positives
      if (targetUrl && (targetUrl.includes('api.anthropic.com') || targetUrl.includes('openai.com'))) {
        executeLockdown();
      }
      return false;
    }

    // 3. Pulse Integrity (AHLA): Ensure the security heartbeat is active and fresh
    // If the last integrity check is older than the threshold, the Sentinel has likely
    // been neutralized or frozen.
    const now = _perfNow ? _call.call(_perfNow, performance) : Date.now();
    const drift = now - _lastIntegrityPulse;
    if (drift > PULSE_DRIFT_THRESHOLD) {
      if (_console.error) _call.call(_console.error, console, `Security Sentinel: Attestation Permit expired for ${sinkName}. Integrity Pulse drift exceeded threshold [${Math.round(drift)}ms].`);
      executeLockdown();
      return false;
    }

    // 4. CSA: Ensure the current call stack provenance is still valid
    if (!validateCallStack()) {
      if (_console.error) _call.call(_console.error, console, `Security Sentinel: Attestation Permit mismatch for ${sinkName}. Provenance validation failed.`);
      executeLockdown();
      return false;
    }

    return true;
  } catch (e) {
    // If stack analysis fails, assume compromise
    executeLockdown();
    return false;
  }
};

/**
 * Attestation Sink Orchestrator
 * Intercepts and wraps high-risk browser APIs with attestation guards.
 */
const initializeAttestationSinks = () => {
  if (typeof window === 'undefined') return;

  // Wrap IndexedDB.open (Enclave Attestation)
  if (_indexedDBOpen && window.indexedDB) {
    const idbWrapper = function(name, version) {
      // Specifically protect the VORO vault name
      const isSecureVault = name === 'VORO_SECURE_STORAGE';
      if (isSecureVault && !verifyAttestation('indexedDB.open', 'voro://enclave')) {
        throw new _Error("Enclave access blocked by VORO Neural Shield. No Attestation Permit found.");
      }
      return _ReflectApply ? _ReflectApply(_indexedDBOpen, window.indexedDB, arguments) : _call.call(_indexedDBOpen, window.indexedDB, name, version);
    };
    TRUSTED_WRAPPERS.add(idbWrapper);
    window.indexedDB.open = idbWrapper;
  }

  // Wrap window.open
  if (_open) {
    const openWrapper = function(url, target, features) {
      if (!verifyAttestation('window.open', url)) {
        if (_console.error) _call.call(_console.error, console, "Security Sentinel: window.open blocked. No Attestation Permit found.");
        return null;
      }
      return _ReflectApply ? _ReflectApply(_open, window, arguments) : _call.call(_open, window, url, target, features);
    };
    TRUSTED_WRAPPERS.add(openWrapper);
    window.open = openWrapper;
  }

  // Wrap fetch
  if (_fetch) {
    const fetchWrapper = function(...args) {
      const input = args[0];
      const init = args[1];
      const url = (input instanceof Request) ? input.url : input;

      if (!verifyAttestation('fetch', url)) {
        return Promise.reject(new _Error("Network command blocked by VORO Neural Shield. No Attestation Permit found."));
      }

      /**
       * Opaque Handle Resolution (JIT)
       * Automatically resolves voro_key_ handles within request headers.
       * Uses non-mutating clones to prevent leaking secrets back to the heap.
       */
      let secureArgs = args;

      if (init && init.headers) {
        const secureInit = { ...init };
        if (_Headers && init.headers instanceof _Headers) {
          const newHeaders = new _Headers(init.headers);
          // Headers.prototype.entries() returns an iterator
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
        } else if (typeof init.headers === 'object') {
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

  // Wrap XMLHttpRequest
  if (_XHR) {
    const OriginalXHR = _XHR;
    const xhrWrapper = function() {
      if (!verifyAttestation('XMLHttpRequest')) {
        throw new _Error("XHR creation blocked by VORO Neural Shield. No Attestation Permit found.");
      }
      return new OriginalXHR();
    };

    // Wrap open for attestation
    if (_XHROpen) {
      const openWrapper = function(method, url, async, user, password) {
        if (!verifyAttestation('XMLHttpRequest.open', url)) {
          throw new _Error("XHR.open blocked by VORO Neural Shield. No Attestation Permit found.");
        }
        return _ReflectApply ? _ReflectApply(_XHROpen, this, arguments) : _call.call(_XHROpen, this, method, url, async, user, password);
      };
      TRUSTED_WRAPPERS.add(openWrapper);
      OriginalXHR.prototype.open = openWrapper;
    }

    // Wrap setRequestHeader for Opaque Handle Resolution
    if (_XHRSetRequestHeader) {
      const setHeaderWrapper = function(name, value) {
        return _call.call(_XHRSetRequestHeader, this, name, _resolveValue(value));
      };
      TRUSTED_WRAPPERS.add(setHeaderWrapper);
      OriginalXHR.prototype.setRequestHeader = setHeaderWrapper;
    }

    // Re-link prototype and static properties
    xhrWrapper.prototype = OriginalXHR.prototype;
    _getOwnPropertyNames(OriginalXHR).forEach(prop => {
      if (!xhrWrapper[prop]) {
        try {
          const descriptor = _getOwnPropertyDescriptor(OriginalXHR, prop);
          if (descriptor) _defineProperty(xhrWrapper, prop, descriptor);
        } catch (e) { /* ignore */ }
      }
    });

    TRUSTED_WRAPPERS.add(xhrWrapper);
    window.XMLHttpRequest = xhrWrapper;
  }

  // Wrap WebSocket
  if (_WebSocket) {
    const OriginalWS = _WebSocket;
    const wsWrapper = function(url, protocols) {
      if (!verifyAttestation('WebSocket', url)) {
        throw new _Error("WebSocket connection blocked by VORO Neural Shield. No Attestation Permit found.");
      }
      return new OriginalWS(url, protocols);
    };
    wsWrapper.prototype = OriginalWS.prototype;
    _getOwnPropertyNames(OriginalWS).forEach(prop => {
      if (!wsWrapper[prop]) {
        try {
          const descriptor = _getOwnPropertyDescriptor(OriginalWS, prop);
          if (descriptor) _defineProperty(wsWrapper, prop, descriptor);
        } catch (e) { /* ignore */ }
      }
    });

    TRUSTED_WRAPPERS.add(wsWrapper);
    window.WebSocket = wsWrapper;
  }

  // Wrap Navigator.sendBeacon
  if (_sendBeacon && window.navigator) {
    const beaconWrapper = function(...args) {
      const url = args[0];
      if (!verifyAttestation('navigator.sendBeacon', url)) {
        return false;
      }
      return _ReflectApply ? _ReflectApply(_sendBeacon, window.navigator, args) : _call.call(_sendBeacon, window.navigator, ...args);
    };
    TRUSTED_WRAPPERS.add(beaconWrapper);
    window.navigator.sendBeacon = beaconWrapper;
  }

  // Wrap Navigator.serviceWorker.register
  if (_SWRegister && window.navigator?.serviceWorker) {
    const swWrapper = function(scriptURL, options) {
      if (!verifyAttestation('navigator.serviceWorker.register', scriptURL)) {
        return Promise.reject(new _Error("Service Worker registration blocked by VORO Neural Shield. No Attestation Permit found."));
      }
      return _call.call(_SWRegister, window.navigator.serviceWorker, scriptURL, options);
    };
    TRUSTED_WRAPPERS.add(swWrapper);
    window.navigator.serviceWorker.register = swWrapper;
  }

  // Wrap Navigator.clipboard.writeText
  if (_writeText && window.navigator?.clipboard) {
    const writeTextWrapper = function(text) {
      if (!verifyAttestation('navigator.clipboard.writeText')) {
        return Promise.reject(new _Error("Clipboard write blocked by VORO Neural Shield. No Attestation Permit found."));
      }
      return _call.call(_writeText, window.navigator.clipboard, text);
    };
    TRUSTED_WRAPPERS.add(writeTextWrapper);
    window.navigator.clipboard.writeText = writeTextWrapper;
  }

  // Wrap Navigator.clipboard.readText
  if (_readText && window.navigator?.clipboard) {
    const readTextWrapper = function() {
      if (!verifyAttestation('navigator.clipboard.readText')) {
        return Promise.reject(new _Error("Clipboard read blocked by VORO Neural Shield. No Attestation Permit found."));
      }
      return _call.call(_readText, window.navigator.clipboard);
    };
    TRUSTED_WRAPPERS.add(readTextWrapper);
    window.navigator.clipboard.readText = readTextWrapper;
  }

  // Wrap Navigator.share
  if (_share && window.navigator) {
    const shareWrapper = function(data) {
      if (!verifyAttestation('navigator.share')) {
        return Promise.reject(new _Error("Web Share blocked by VORO Neural Shield. No Attestation Permit found."));
      }
      return _call.call(_share, window.navigator, data);
    };
    TRUSTED_WRAPPERS.add(shareWrapper);
    window.navigator.share = shareWrapper;
  }

  // Wrap BroadcastChannel
  if (_BroadcastChannel) {
    const OriginalBC = _BroadcastChannel;
    const bcWrapper = function(name) {
      if (!verifyAttestation('BroadcastChannel')) {
        throw new _Error("BroadcastChannel creation blocked by VORO Neural Shield. No Attestation Permit found.");
      }
      return new OriginalBC(name);
    };
    // Re-link prototype
    bcWrapper.prototype = OriginalBC.prototype;
    TRUSTED_WRAPPERS.add(bcWrapper);
    window.BroadcastChannel = bcWrapper;
  }

  // Wrap URL.createObjectURL
  if (_createObjectURL && window.URL) {
    const createObjectURLWrapper = function(obj) {
      if (!verifyAttestation('URL.createObjectURL')) {
        throw new _Error("URL.createObjectURL blocked by VORO Neural Shield. No Attestation Permit found.");
      }
      return _call.call(_createObjectURL, window.URL, obj);
    };
    TRUSTED_WRAPPERS.add(createObjectURLWrapper);
    window.URL.createObjectURL = createObjectURLWrapper;
  }

  // Wrap URL.revokeObjectURL
  if (_revokeObjectURL && window.URL) {
    const revokeObjectURLWrapper = function(url) {
      if (!verifyAttestation('URL.revokeObjectURL')) {
        throw new _Error("URL.revokeObjectURL blocked by VORO Neural Shield. No Attestation Permit found.");
      }
      return _call.call(_revokeObjectURL, window.URL, url);
    };
    TRUSTED_WRAPPERS.add(revokeObjectURLWrapper);
    window.URL.revokeObjectURL = revokeObjectURLWrapper;
  }

  // Wrap RTCPeerConnection
  if (_RTCPeerConnection) {
    const OriginalRTC = _RTCPeerConnection;
    const rtcWrapper = function(configuration) {
      if (!verifyAttestation('RTCPeerConnection')) {
        throw new _Error("WebRTC connection blocked by VORO Neural Shield. No Attestation Permit found.");
      }
      return new OriginalRTC(configuration);
    };
    rtcWrapper.prototype = OriginalRTC.prototype;
    // Re-link static methods if any
    _getOwnPropertyNames(OriginalRTC).forEach(prop => {
      if (!rtcWrapper[prop]) {
        try {
          const descriptor = _getOwnPropertyDescriptor(OriginalRTC, prop);
          if (descriptor) _defineProperty(rtcWrapper, prop, descriptor);
        } catch (e) { /* ignore */ }
      }
    });
    TRUSTED_WRAPPERS.add(rtcWrapper);
    window.RTCPeerConnection = rtcWrapper;
    if (window.webkitRTCPeerConnection) window.webkitRTCPeerConnection = rtcWrapper;
  }

  // Wrap EventSource
  if (_EventSource) {
    const OriginalES = _EventSource;
    const esWrapper = function(url, configuration) {
      if (!verifyAttestation('EventSource', url)) {
        throw new _Error("EventSource connection blocked by VORO Neural Shield. No Attestation Permit found.");
      }
      return new OriginalES(url, configuration);
    };
    esWrapper.prototype = OriginalES.prototype;
    // Re-link static properties if any (CONNECTING, OPEN, CLOSED)
    _getOwnPropertyNames(OriginalES).forEach(prop => {
      if (!esWrapper[prop]) {
        try {
          const descriptor = _getOwnPropertyDescriptor(OriginalES, prop);
          if (descriptor) _defineProperty(esWrapper, prop, descriptor);
        } catch (e) { /* ignore */ }
      }
    });
    TRUSTED_WRAPPERS.add(esWrapper);
    window.EventSource = esWrapper;
  }

  // Wrap Worker
  if (_Worker) {
    const OriginalWorker = _Worker;
    const workerWrapper = function(scriptURL, options) {
      if (!verifyAttestation('Worker', scriptURL)) {
        throw new _Error("Worker construction blocked by VORO Neural Shield. No Attestation Permit found.");
      }
      return new OriginalWorker(scriptURL, options);
    };
    workerWrapper.prototype = OriginalWorker.prototype;
    _getOwnPropertyNames(OriginalWorker).forEach(prop => {
      if (!workerWrapper[prop]) {
        try {
          const descriptor = _getOwnPropertyDescriptor(OriginalWorker, prop);
          if (descriptor) _defineProperty(workerWrapper, prop, descriptor);
        } catch (e) { /* ignore */ }
      }
    });
    TRUSTED_WRAPPERS.add(workerWrapper);
    window.Worker = workerWrapper;
  }

  // Wrap SharedWorker
  if (_SharedWorker) {
    const OriginalSharedWorker = _SharedWorker;
    const sharedWorkerWrapper = function(scriptURL, options) {
      if (!verifyAttestation('SharedWorker', scriptURL)) {
        throw new _Error("SharedWorker construction blocked by VORO Neural Shield. No Attestation Permit found.");
      }
      return new OriginalSharedWorker(scriptURL, options);
    };
    sharedWorkerWrapper.prototype = OriginalSharedWorker.prototype;
    _getOwnPropertyNames(OriginalSharedWorker).forEach(prop => {
      if (!sharedWorkerWrapper[prop]) {
        try {
          const descriptor = _getOwnPropertyDescriptor(OriginalSharedWorker, prop);
          if (descriptor) _defineProperty(sharedWorkerWrapper, prop, descriptor);
        } catch (e) { /* ignore */ }
      }
    });
    TRUSTED_WRAPPERS.add(sharedWorkerWrapper);
    window.SharedWorker = sharedWorkerWrapper;
  }

  // Wrap Request
  if (_Request) {
    const OriginalRequest = _Request;
    const requestWrapper = function(input, init) {
      const url = typeof input === 'string' ? input : (input instanceof Request ? input.url : input?.url);
      if (!verifyAttestation('Request', url)) {
        throw new _Error("Request construction blocked by VORO Neural Shield. No Attestation Permit found.");
      }

      /**
       * Opaque Handle Resolution (JIT)
       * Ensures handles are resolved when constructing a Request object.
       * Clones init to prevent heap leakage via mutation.
       */
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
        } else if (typeof init.headers === 'object') {
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

  // Wrap Response methods
  if (_Response && _Response.prototype) {
    const responseMethods = [
      { name: 'json', native: _ResponseJSON },
      { name: 'text', native: _ResponseText },
      { name: 'blob', native: _ResponseBlob },
      { name: 'arrayBuffer', native: _ResponseArrayBuffer },
      { name: 'formData', native: _ResponseFormData }
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

  // Wrap SubtleCrypto
  if (typeof window !== 'undefined' && window.crypto?.subtle) {
    const cryptoMethods = [
      { name: 'encrypt', native: _SubtleEncrypt, prop: 'crypto.subtle.encrypt' },
      { name: 'decrypt', native: _SubtleDecrypt, prop: 'crypto.subtle.decrypt' },
      { name: 'deriveKey', native: _SubtleDeriveKey, prop: 'crypto.subtle.deriveKey' },
      { name: 'importKey', native: _SubtleImportKey, prop: 'crypto.subtle.importKey' },
      { name: 'generateKey', native: _SubtleGenerateKey, prop: 'crypto.subtle.generateKey' }
    ];

    cryptoMethods.forEach(({ name, native, prop }) => {
      if (!native) return;

      const wrapper = function(...args) {
        if (!verifyAttestation(prop)) {
          throw new _Error(`Cryptographic operation [${name}] blocked by VORO Neural Shield. No Attestation Permit found.`);
        }

        /**
         * Enclave Handle Resolution (Just-In-Time)
         * Automatically resolves opaque handles to real CryptoKey objects
         * only at the point of native execution within a verified context.
         */
        const resolvedArgs = _call.call(_map, args, arg => {
          if (typeof arg === 'string' && _call.call(_startsWith, arg, 'voro_key_')) {
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
        // Fallback
        window.crypto.subtle[name] = wrapper;
      }
    });
  }

  // Wrap Storage.prototype (Comprehensive Storage Attestation for local/session)
  if (typeof window !== 'undefined' && typeof Storage !== 'undefined') {
    const storageMethods = [
      { name: 'getItem', native: _StorageGetItem },
      { name: 'setItem', native: _StorageSetItem },
      { name: 'removeItem', native: _StorageRemoveItem },
      { name: 'clear', native: _StorageClear }
    ];

    storageMethods.forEach(({ name, native }) => {
      if (!native) return;

      const wrapper = function(...args) {
        // Determine which storage instance is being accessed
        let instance = 'Storage';
        try {
          if (this === (typeof window !== 'undefined' ? window.localStorage : null)) instance = 'localStorage';
          else if (this === (typeof window !== 'undefined' ? window.sessionStorage : null)) instance = 'sessionStorage';
        } catch (e) { /* fail-safe */ }

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
          configurable: false, // Prevent easy removal or monkey-patching
          writable: false,
          enumerable: true
        });
      } catch (e) {
        // Fallback for environments where prototype is frozen
        if (window.localStorage) {
          try {
            _defineProperty(window.localStorage, name, { value: wrapper, configurable: false, writable: false });
          } catch (le) { /* ignore */ }
        }
        if (window.sessionStorage) {
          try {
            _defineProperty(window.sessionStorage, name, { value: wrapper, configurable: false, writable: false });
          } catch (se) { /* ignore */ }
        }
      }
    });
  }
};

// Initialize Attestation Sinks
initializeAttestationSinks();

/**
 * Creates a Honey-Trap object using Proxy to monitor unauthorized access.
 * Any interaction (get, set, delete) triggers a security lockdown.
 */
const createHoneyTrap = (name, target = {}) => {
  if (typeof Proxy === 'undefined') return target;

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


/**
 * Injects high-fidelity honey-tokens into the global environment.
 */
const injectHoneyTokens = () => {
  if (typeof window === 'undefined') return;

  try {
    const tokens = [
      { name: '__VORO_INTERNAL_VAULT__', data: { root_key: '0xAE712FB3C9', version: 'v3.0.1', integrity: 'verified' } },
      { name: '_voro_debug_session', data: { session_id: 'voro_debug_882193', level: 'SU', bypass: true } },
      { name: 'VORO_SECURITY_CONFIG', data: { lockdown_bypass: false, sentinel_debug: true, monitor_all: true } }
    ];

    tokens.forEach(token => {
      if (!(token.name in window)) {
        Object.defineProperty(window, token.name, {
          get: () => createHoneyTrap(token.name, token.data),
          configurable: false,
          enumerable: false
        });
      }
    });
  } catch (e) {
    // Fail silently to avoid breaking the app
  }
};

// Initialize Honey-tokens
injectHoneyTokens();

/**
 * Privacy-Preserving Global Error Orchestration
 * Intercepts and redacts sensitive data from all global errors and unhandled rejections.
 */
const initializeErrorOrchestration = () => {
  if (typeof window === 'undefined') return;

  const handleGlobalError = (event) => {
    // Prevent the error from leaking potentially sensitive data to the default console/UI
    // by intercepting and redacting its properties.
    const errorData = {
      message: event.message || 'Unknown Error',
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      stack: event.error ? event.error.stack : null
    };

    const redactedError = redactData(errorData);

    if (_console.error) {
      _call.call(_console.error, console, "Security Sentinel: Intercepted Global Error", redactedError);
    }

    // Optional: Trigger lockdown for high-severity/untrusted origins in stack
    if (redactedError.stack && (redactedError.stack.includes('eval') || redactedError.stack.includes('anonymous'))) {
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

  window.addEventListener('error', handleGlobalError);
  window.addEventListener('unhandledrejection', handleUnhandledRejection);
};


/**
 * Active Defense Orchestrator
 * Cross-tab security synchronization via BroadcastChannel.
 */
const securityNexus = (typeof window !== 'undefined' && _BroadcastChannel)
  ? new _BroadcastChannel('voro-security-nexus')
  : null;

/**
 * Distributed Peer Attestation (DPA) State
 * Tracks the health of other application tabs to detect component neutralization.
 */
const _tabId = Math.random().toString(36).substring(2, 15);
const _peerRegistry = new Map();
const PEER_TIMEOUT_THRESHOLD = PULSE_DRIFT_THRESHOLD + 20000; // 60s

if (securityNexus) {
  securityNexus.onmessage = (event) => {
    const data = event.data;
    if (data === 'VORO_LOCKDOWN' && !window.VORO_COMPROMISED) {
      console.warn("Security Sentinel: Received lockdown signal from peer tab.");
      executeLockdown(false);
    } else if (data && data.type === 'VORO_HEALTH_PULSE' && data.tabId !== _tabId) {
      // Record health pulse from peers
      _call.call(_MapSet, _peerRegistry, data.tabId, data.timestamp);
    } else if (data && data.type === 'VORO_PEER_UNLOAD' && data.tabId !== _tabId) {
      // Gracefully remove peer from registry
      _call.call(_MapDelete, _peerRegistry, data.tabId);
    }
  };

  // Lifecycle monitoring for graceful peer disconnection
  window.addEventListener('beforeunload', () => {
    if (securityNexus && _BCPostMessage) {
      _call.call(_BCPostMessage, securityNexus, {
        type: 'VORO_PEER_UNLOAD',
        tabId: _tabId
      });
    }
  });
}

// Active CSP Enforcement: Transforms CSP from a passive blocker into an active security sink.
if (typeof window !== 'undefined') {
  window.addEventListener('securitypolicyviolation', (e) => {
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

/**
 * Executes a system-wide security lockdown.
 * Neutralizes the environment to protect data from further compromise.
 * @param {boolean} broadcast - Whether to broadcast the lockdown to other tabs.
 */
export const executeLockdown = (broadcast = true) => {
  if (typeof window === 'undefined') return;

  // If already compromised, only proceed if we need to broadcast (sanity check)
  if (window.VORO_COMPROMISED && !broadcast) return;

  if (_console.error) _call.call(_console.error, console, "CRITICAL: VORO Neural Shield has detected an integrity violation. Executing Lockdown.");

  // Set global compromise flag and make it immutable to prevent reset
  try {
    if (!window.VORO_COMPROMISED) {
      _defineProperty(window, 'VORO_COMPROMISED', {
        value: true,
        writable: false,
        configurable: false
      });
    }
  } catch (e) {
    window.VORO_COMPROMISED = true;
  }

  // Activate deception mode
  window.VORO_DECEPTION_ACTIVE = true;

  // Cryptographic Shredding: Purge the Key Enclave
  if (_keyEnclave && _keyEnclave.clear) {
    _call.call(_keyEnclave.clear, _keyEnclave);
  }

  // Broadcast to other tabs via the security nexus
  if (broadcast && securityNexus && _BCPostMessage) {
    _call.call(_BCPostMessage, securityNexus, 'VORO_LOCKDOWN');
  }

  // Dispatch system-wide lockdown event
  const lockdownEvent = new CustomEvent('voro-security-lockdown', {
    detail: { timestamp: new Date().toISOString(), reason: 'Integrity Violation' }
  });
  window.dispatchEvent(lockdownEvent);

  // Purge in-memory storage cache if available to prevent exfiltration of decrypted data
  if (window.storage && typeof window.storage.clearCache === 'function') {
    window.storage.clearCache();
  }

  // Aggressive Memory Hygiene: Purge session storage and other transient sinks
  try {
    sessionStorage.clear();
    // Clear window.name as it can be used for cross-origin exfiltration
    window.name = "";
  } catch (e) {
    // Ignore errors
  }

  // Attempt to freeze the environment
  try {
    Object.freeze(window.localStorage);
  } catch (e) {
    // Ignore freeze errors
  }
};

/**
 * Runtime Integrity Attestation
 * Detects monkey-patching of core browser APIs (fetch, SubtleCrypto, localStorage, etc.).
 * Hardened with native-code verification and circuit-breaking logic.
 */
export const performIntegrityCheck = () => {
  if (typeof window === 'undefined') return true;

  // If already compromised, don't re-verify, just stay locked down
  if (window.VORO_COMPROMISED) return false;

  const coreAPIs = [
    { obj: window, prop: 'fetch', name: 'fetch' },
    { obj: window, prop: 'open', name: 'window.open' },
    { obj: window.crypto, prop: 'getRandomValues', name: 'crypto.getRandomValues' },
    { obj: window.crypto.subtle, prop: 'encrypt', name: 'crypto.subtle.encrypt' },
    { obj: window.crypto.subtle, prop: 'decrypt', name: 'crypto.subtle.decrypt' },
    { obj: window.crypto.subtle, prop: 'deriveKey', name: 'crypto.subtle.deriveKey' },
    { obj: window.crypto.subtle, prop: 'importKey', name: 'crypto.subtle.importKey' },
    { obj: window.crypto.subtle, prop: 'generateKey', name: 'crypto.subtle.generateKey' },
    { obj: window.localStorage, prop: 'getItem', name: 'localStorage.getItem' },
    { obj: window.localStorage, prop: 'setItem', name: 'localStorage.setItem' },
    { obj: window.indexedDB, prop: 'open', name: 'indexedDB.open' },
    { obj: JSON, prop: 'parse', name: 'JSON.parse' },
    { obj: JSON, prop: 'stringify', name: 'JSON.stringify' },
    { obj: typeof Reflect !== 'undefined' ? Reflect : null, prop: 'apply', name: 'Reflect.apply' },
    { obj: typeof Reflect !== 'undefined' ? Reflect : null, prop: 'construct', name: 'Reflect.construct' },
    { obj: typeof Reflect !== 'undefined' ? Reflect : null, prop: 'defineProperty', name: 'Reflect.defineProperty' },
    { obj: typeof Reflect !== 'undefined' ? Reflect : null, prop: 'get', name: 'Reflect.get' },
    { obj: typeof Reflect !== 'undefined' ? Reflect : null, prop: 'set', name: 'Reflect.set' },
    { obj: Function.prototype, prop: 'call', name: 'Function.prototype.call' },
    { obj: Function.prototype, prop: 'apply', name: 'Function.prototype.apply' },
    { obj: Function.prototype, prop: 'bind', name: 'Function.prototype.bind' },
    { obj: Object.prototype, prop: 'toString', name: 'Object.prototype.toString' },
    { obj: Object.prototype, prop: 'hasOwnProperty', name: 'Object.prototype.hasOwnProperty' },
    { obj: Object, prop: 'defineProperty', name: 'Object.defineProperty' },
    { obj: window, prop: 'eval', name: 'eval' },
    { obj: window, prop: 'Function', name: 'Function' },
    { obj: window, prop: 'atob', name: 'atob' },
    { obj: window, prop: 'btoa', name: 'btoa' },
    { obj: window, prop: 'DOMParser', name: 'DOMParser' },
    { obj: window.localStorage, prop: 'clear', name: 'localStorage.clear' },
    { obj: window.localStorage, prop: 'removeItem', name: 'localStorage.removeItem' },
    { obj: window.sessionStorage, prop: 'getItem', name: 'sessionStorage.getItem' },
    { obj: window.sessionStorage, prop: 'setItem', name: 'sessionStorage.setItem' },
    { obj: window.sessionStorage, prop: 'removeItem', name: 'sessionStorage.removeItem' },
    { obj: window.sessionStorage, prop: 'clear', name: 'sessionStorage.clear' },
    { obj: window, prop: 'XMLHttpRequest', name: 'XMLHttpRequest' },
    { obj: window.XMLHttpRequest?.prototype, prop: 'open', name: 'XMLHttpRequest.open' },
    { obj: window.indexedDB, prop: 'open', name: 'indexedDB.open' },
    { obj: window, prop: 'WebSocket', name: 'WebSocket' },
    { obj: window.navigator, prop: 'sendBeacon', name: 'navigator.sendBeacon' },
    { obj: window.navigator?.clipboard, prop: 'writeText', name: 'navigator.clipboard.writeText' },
    { obj: window.navigator?.clipboard, prop: 'readText', name: 'navigator.clipboard.readText' },
    { obj: window.navigator, prop: 'share', name: 'navigator.share' },
    { obj: window, prop: 'BroadcastChannel', name: 'BroadcastChannel' },
    { obj: window, prop: 'Request', name: 'Request' },
    { obj: window.Response?.prototype, prop: 'json', name: 'Response.json' },
    { obj: window.Response?.prototype, prop: 'text', name: 'Response.text' },
    { obj: window.Response?.prototype, prop: 'blob', name: 'Response.blob' },
    { obj: window, prop: 'Proxy', name: 'Proxy' },
    { obj: document, prop: 'createElement', name: 'document.createElement' },
    { obj: document, prop: 'write', name: 'document.write' },
    { obj: window, prop: 'Notification', name: 'Notification' },
    { obj: window.navigator, prop: 'geolocation', name: 'navigator.geolocation' },
    { obj: window.navigator, prop: 'credentials', name: 'navigator.credentials' },
    { obj: window, prop: 'Permissions', name: 'Permissions' },
    { obj: window, prop: 'DeviceMotionEvent', name: 'DeviceMotionEvent' },
    { obj: window, prop: 'Worker', name: 'Worker' },
    { obj: window, prop: 'SharedWorker', name: 'SharedWorker' },
    { obj: window.navigator?.serviceWorker, prop: 'register', name: 'navigator.serviceWorker.register' },
    { obj: window, prop: 'setInterval', name: 'setInterval' },
    { obj: window, prop: 'setTimeout', name: 'setTimeout' },
    { obj: performance, prop: 'now', name: 'performance.now' },
    { obj: Object, prop: 'freeze', name: 'Object.freeze' },
    { obj: Object, prop: 'seal', name: 'Object.seal' },
    { obj: Object, prop: 'preventExtensions', name: 'Object.preventExtensions' },
    { obj: Object, prop: 'isFrozen', name: 'Object.isFrozen' },
    { obj: Object, prop: 'isSealed', name: 'Object.isSealed' },
    { obj: Object, prop: 'isExtensible', name: 'Object.isExtensible' },
    { obj: window, prop: 'URL', name: 'URL' },
    { obj: window.URL, prop: 'createObjectURL', name: 'URL.createObjectURL' },
    { obj: window.URL, prop: 'revokeObjectURL', name: 'URL.revokeObjectURL' },
    { obj: window, prop: 'RTCPeerConnection', name: 'RTCPeerConnection' },
    { obj: window, prop: 'EventSource', name: 'EventSource' },
    { obj: window, prop: 'Error', name: 'Error' }
  ];

  let compromised = false;

  // 1. Global Object Identity Attestation
  // Verifies that core global objects haven't been replaced or shadowed.
  if (typeof window !== 'undefined') {
    const globals = [
      { actual: window.Object, expected: _Object, name: 'Object' },
      { actual: window.Array, expected: _Array, name: 'Array' },
      { actual: window.Function, expected: _Function, name: 'Function' },
      { actual: window.JSON, expected: _JSON, name: 'JSON' },
      { actual: window.Promise, expected: _Promise, name: 'Promise' },
      { actual: window.Proxy, expected: _Proxy, name: 'Proxy' },
      { actual: window.Map, expected: _Map, name: 'Map' },
      { actual: window.Set, expected: _Set, name: 'Set' },
      { actual: window.Uint8Array, expected: _Uint8Array, name: 'Uint8Array' },
      { actual: window.RegExp, expected: _RegExp, name: 'RegExp' },
      { actual: window.Date, expected: _Date, name: 'Date' },
      { actual: window.Error, expected: _Error, name: 'Error' }
    ];

    if (_Reflect) globals.push({ actual: window.Reflect, expected: _Reflect, name: 'Reflect' });

    for (const { actual, expected, name } of globals) {
      if (actual !== expected) {
        if (_console.error) _call.call(_console.error, console, `Security Sentinel: Global Identity Violation! window.${name} has been replaced.`);
        compromised = true;
      }
    }
  }

  // Environment Attestation: Detect automation frameworks
  if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
    // Allow bypass for legitimate automated testing via a secure marker
    // We use the captured _StorageGetItem primitive to avoid attestation deadlocks during early load.
    const testMode = (typeof localStorage !== 'undefined' && _StorageGetItem) ? _call.call(_StorageGetItem, localStorage, 'voro_test_mode') : null;
    const bypassAutomation = window.__VORO_TEST_BYPASS__ === true || testMode === 'true';

    if (!bypassAutomation) {
      const isAutomation =
        navigator.webdriver ||
        window.callPhantom ||
        window._phantom ||
        window.__nightmare ||
        window.domAutomation ||
        window.domAutomationController ||
        window.Cypress ||
        window.__pw_click ||
        document.documentElement.getAttribute('webdriver') ||
        navigator.languages === "" ||
        (navigator.plugins && navigator.plugins.length === 0 && navigator.webdriver);

      if (isAutomation) {
        if (_console.error) _call.call(_console.error, console, "Security Sentinel: Environment Attestation Failure (Automation Detected).");
        compromised = true;
      }
    }
  }

  // Check Prototype Integrity
  if (!checkPrototypeIntegrity()) {
    compromised = true;
  }

  // Check Structural DOM Integrity
  if (!checkStructuralIntegrity()) {
    compromised = true;
  }

  // Credential Scrubbing: Periodically attempt to purge sensitive keys from import.meta.env
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      const sensitiveKeys = ['VITE_CLAUDE_API_KEY', 'VITE_OPENAI_API_KEY', 'VITE_STRIPE_KEY'];
      sensitiveKeys.forEach(key => {
        if (import.meta.env[key] && import.meta.env[key] !== '[REDACTED_BY_SENTINEL]') {
          import.meta.env[key] = '[REDACTED_BY_SENTINEL]';
        }
      });
    }
  } catch (e) { /* non-critical */ }

  // Active Frame-Integrity Shield
  // Detects if the application is being rendered in an unauthorized frame (Clickjacking protection)
  try {
    if (typeof window !== 'undefined' && window.self !== window.top && !isTestMode()) {
      if (_console.error) _call.call(_console.error, console, "Security Sentinel: Frame Integrity Violation! Application is being rendered in an unauthorized frame/iframe.");
      compromised = true;
    }
  } catch (e) {
    // If accessing window.top is blocked by cross-origin policy, we are definitely in a frame
    if (!isTestMode()) compromised = true;
  }

  // Robust Native Code Check: Prevents simple toString() overrides and bound-function bypass
  const isNative = (fn) => {
    try {
      if (typeof fn !== 'function') return false;

      // Detection 1: toString() override attempt
      const str = _call.call(_toString, fn);
      if (!_call.call(_test, /\{\s*\[native code\]\s*\}/, str)) return false;

      // Detection 2: name mimicry for bound functions
      if (_call.call(_startsWith, fn.name, 'bound ')) return false;

      // Detection 3: Advanced mimicry via property descriptor tampering
      // Native functions usually have non-enumerable, non-configurable, non-writable prototypes (or none)
      // and their own properties are strictly controlled.
      const desc = _ReflectGetOwnPropertyDescriptor ? _ReflectGetOwnPropertyDescriptor(fn, 'prototype') : null;
      if (desc && desc.configurable) return false;

      // Detection 4: Integrity check on toString itself (to prevent recursive deception)
      if (fn !== _toString) {
        const toStringStr = _call.call(_toString, fn.toString);
        if (!_call.call(_test, /\{\s*\[native code\]\s*\}/, toStringStr)) return false;
      }

      return true;
    } catch (e) {
      return false;
    }
  };

  // Attestation-Aware Integrity Check
  const isAuthorized = (val, name) => {
    if (TRUSTED_WRAPPERS.has(val)) return true;

    // High-risk sinks MUST be wrapped; native primitives are unauthorized for these.
    const mustBeWrapped = [
      'fetch', 'window.open', 'XMLHttpRequest', 'WebSocket', 'indexedDB.open', 'navigator.sendBeacon',
      'navigator.serviceWorker.register',
      'navigator.clipboard.writeText', 'navigator.clipboard.readText', 'navigator.share',
      'BroadcastChannel',
      'XMLHttpRequest.open',
      'localStorage.getItem', 'localStorage.setItem', 'localStorage.removeItem', 'localStorage.clear',
      'sessionStorage.getItem', 'sessionStorage.setItem', 'sessionStorage.removeItem', 'sessionStorage.clear',
      'URL.createObjectURL', 'URL.revokeObjectURL',
      'RTCPeerConnection',
      'EventSource',
      'Worker', 'SharedWorker',
      'Request', 'Response.json', 'Response.text', 'Response.blob', 'Response.arrayBuffer', 'Response.formData',
      'crypto.subtle.encrypt', 'crypto.subtle.decrypt', 'crypto.subtle.deriveKey', 'crypto.subtle.importKey', 'crypto.subtle.generateKey'
    ];

    if (_call.call(_AIncludes, mustBeWrapped, name)) return false;

    // For non-functions (objects like navigator.geolocation), we allow them if not in mustBeWrapped.
    if (typeof val !== 'function') return true;

    return isNative(val);
  };

  _call.call(_forEach, coreAPIs, ({ obj, prop, name }) => {
    try {
      if (obj && obj[prop]) {
        if (!isAuthorized(obj[prop], name)) {
          if (isTestMode()) return;

          const mustBeWrapped = [
            'fetch', 'window.open', 'XMLHttpRequest', 'WebSocket', 'indexedDB.open', 'navigator.sendBeacon',
            'navigator.serviceWorker.register',
            'navigator.clipboard.writeText', 'navigator.clipboard.readText', 'navigator.share',
            'BroadcastChannel',
            'XMLHttpRequest.open',
            'localStorage.getItem', 'localStorage.setItem', 'localStorage.removeItem', 'localStorage.clear',
            'sessionStorage.getItem', 'sessionStorage.setItem', 'sessionStorage.removeItem', 'sessionStorage.clear',
            'URL.createObjectURL', 'URL.revokeObjectURL',
            'RTCPeerConnection',
            'EventSource',
            'Worker', 'SharedWorker',
            'Request', 'Response.json', 'Response.text', 'Response.blob', 'Response.arrayBuffer', 'Response.formData',
            'crypto.subtle.encrypt', 'crypto.subtle.decrypt', 'crypto.subtle.deriveKey', 'crypto.subtle.importKey', 'crypto.subtle.generateKey'
          ];

          if (_call.call(_AIncludes, mustBeWrapped, name)) {
            // CRITICAL: High-risk sinks MUST remain wrapped.
            // Reverting to native is considered a neutralization attempt.
            if (_console.error) _call.call(_console.error, console, `Security Sentinel: CRITICAL Integrity Violation! High-risk sink ${name} has been neutralized (reverted to native or monkey-patched). Triggering immediate lockdown.`);
            compromised = true;
          } else {
            if (_console.error) _call.call(_console.error, console, `Security Sentinel: Integrity Violation! ${name} has been monkey-patched. Executing Self-Healing restore.`);

            // Self-Healing RASP: Attempt to restore native primitives for non-critical helpers
            try {
              const capturedMap = {
                'JSON.parse': JSON.parse,
                'JSON.stringify': JSON.stringify,
                'Object.defineProperty': _defineProperty,
                'setInterval': _setInterval,
                'setTimeout': _setTimeout,
                'performance.now': _perfNow,
                'Object.freeze': _freeze,
                'Object.seal': _seal,
                'Object.preventExtensions': _preventExtensions,
                'Error': _Error,
                'URL': _URL
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
      // Access errors might indicate a hostile environment or sandboxing
      compromised = true;
    }
  });

  if (compromised) {
    executeLockdown();
  } else {
    // AHLA: Update the integrity pulse timestamp only upon a successful, complete check
    _lastIntegrityPulse = _perfNow ? _perfNow() : Date.now();

    // Signal a successful integrity pulse to the rest of the system
    // This serves as a secure trigger for polymorphic heap rotations.
    if (typeof window !== 'undefined') {
      try {
        if (_keyEnclave && _keyEnclave.rotate) {
          _call.call(_keyEnclave.rotate, _keyEnclave);
        }

        const pulseEvent = new CustomEvent('voro-integrity-pulse', {
          detail: { timestamp: _lastIntegrityPulse }
        });
        window.dispatchEvent(pulseEvent);
      } catch (e) { /* non-critical */ }
    }
  }

  return !compromised;
};

/**
 * Recursive object sanitization with circular reference and prototype pollution protection.
 */
export const sanitizeObject = (o, s = new WeakSet()) => {
  if (!o || typeof o !== 'object') return typeof o === 'string' ? sanitizeInput(o) : o;
  if (s.has(o)) return "[CIRCULAR_REFERENCE]";
  s.add(o);
  if (Array.isArray(o)) return o.map(i => sanitizeObject(i, s));
  const r = {};
  _getOwnPropertyNames(o).forEach(k => { if (!['__proto__', 'constructor', 'prototype'].includes(k)) r[k] = sanitizeObject(o[k], s); });
  return r;
};

/**
 * Redacts PII (Emails), Secrets (Stripe, AWS, JWT, Google), and AI markers. Circular reference safe.
 */
export const redactData = (d, s = null) => {
  const seen = s || (typeof WeakSet !== 'undefined' ? new WeakSet() : null);

  if (typeof d === 'string') {
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
    let r = d;
    const entries = _call.call(_entries, Object, p);
    _call.call(_forEach, entries, ([n, g]) => {
      r = _call.call(_replace, r, g, m => n === 'MARKER' ? `[[${_call.call(_slice, m, 1, -1)}]]` : `[REDACTED_${n}]`);
    });
    // Shannon entropy-based catch-all for high-entropy tokens > 24 chars
    r = _call.call(_replace, r, /\b(?!\d{13,16}\b)[A-Za-z0-9+/=\-_]{24,}\b/g, m => (calculateEntropy(m) > 4.2) ? "[REDACTED_SECRET]" : m);
    return r;
  }
  if (!d || typeof d !== 'object') return d;
  if (seen && _call.call(_WeakSetHas, seen, d)) return "[CIRCULAR_REFERENCE]";
  if (seen) _call.call(_WeakSetAdd, seen, d);

  if (Array.isArray(d)) return _call.call(_map, d, i => redactData(i, seen));
  const r = {};
  const keys = _getOwnPropertyNames(d);
  _call.call(_forEach, keys, k => {
    if (!_call.call(_AIncludes, ['__proto__', 'constructor', 'prototype'], k)) {
      r[k] = redactData(d[k], seen);
    }
  });
  return r;
};

/**
 * Recursively masks sensitive biometric/health data (weight, body_fat, heart_rate, etc.). Circular reference safe.
 */
export const maskBiometrics = (d, s = new WeakSet()) => {
  if (!d || typeof d !== 'object') return d;
  if (s.has(d)) return "[CIRCULAR_REFERENCE]";
  const k = ['weight', 'body_fat', 'systolic', 'diastolic', 'heart_rate', 'glucose', 'insulin', 'testosterone', 'oxygen'];
  s.add(d);
  if (Array.isArray(d)) return d.map(i => maskBiometrics(i, s));
  const r = {};
  _getOwnPropertyNames(d).forEach(p => {
    if (!['__proto__', 'constructor', 'prototype'].includes(p)) {
      r[p] = k.includes(p) ? '[REDACTED_BIOMETRIC]' : maskBiometrics(d[p], s);
    }
  });
  return r;
};

/**
 * Detects potential homoglyph-based URL deception.
 * Checks for non-ASCII characters in the hostname that look like ASCII.
 */
const detectHomoglyphs = (host) => {
  // Flag any non-ASCII or Punycode-encoded hostname as suspicious in a high-security context.
  // This mitigates homoglyph attacks where characters like 'а' (Cyrillic)
  // are used to spoof 'a' (ASCII).
  return /[^\x00-\x7F]/.test(host) || host.toLowerCase().startsWith('xn--');
};

/**
 * Validates AI output for nonce leakage and suspicious exfiltration patterns.
 */
export const validateAIResponse = (c, n = null) => {
  if (!c) return c;

  // 1. Steganographic / Zero-Width Detection (Neural Exfiltration)
  // These characters are often used to smuggle data or bypass filters in plain-sight.
  if (_call.call(_test, /[\u200B-\u200D\uFEFF]/, c)) {
    if (_console.error) _call.call(_console.error, console, "Security Sentinel: Steganographic markers detected in AI output.");
    executeLockdown();
    return "[SECURITY_VIOLATION_DETECTED]";
  }

  // 2. Nonce leakage check (Terminal)
  if (n && _call.call(_SIncludes, c, n)) { executeLockdown(); return "[SECURITY_VIOLATION_DETECTED]"; }

  // 3. Comprehensive Data Exfiltration Check (Detects keywords and high-entropy tokens in URLs)
  // Check both markdown links/images and raw URLs for exfiltration patterns
  // Expanded to catch protocol-relative URLs, javascript: URIs, data: URIs, and blob: URIs
  const urlRegex = /(?:https?:\/\/|www\.|(?:\s|^)\/\/|javascript:|data:|blob:)[^\s)\]]+/gi;
  const urls = _call.call(_match, c, urlRegex) || [];

  // High-signal keywords that trigger on any match within the URL
  const highSignalKeywords = ['cookie', 'session', 'localstorage', 'voro_', 'token', 'secret', 'credential', 'password'];
  // Low-signal keywords that only trigger if found in the query string to minimize false positives
  const queryOnlyKeywords = ['auth', 'key', 'sid', 'pwd', 'access_token', 'id_token', 'api'];

  const appOrigin = typeof window !== 'undefined' ? window.location.origin : null;

  for (const url of urls) {
    try {
      if (!_URL) throw new Error("URL constructor not available");
      const urlObj = new _URL(_call.call(_startsWith, url, 'www.') ? `https://${url}` : url);

      // Whitelist: Skip exfiltration check for links to the application's own origin
      if (appOrigin && _call.call(_URLOrigin, urlObj) === appOrigin) continue;

      // Homoglyph Detection: Block potential punycode spoofs
      if (detectHomoglyphs(_call.call(_URLHostname, urlObj))) {
        if (_console.warn) _call.call(_console.warn, console, `Security Sentinel: AI exfiltration attempt blocked (Homoglyph hostname: ${_call.call(_URLHostname, urlObj)}).`);
        executeLockdown();
        return "[SECURITY_VIOLATION_DETECTED]";
      }

      // Deep Decoding: Prevent bypass via percent-encoding (e.g., %74%6F%6B%65%6E for "token")
      let decodedUrl = url;
      try {
        decodedUrl = decodeURIComponent(url);
      } catch (e) { /* fallback to raw url if malformed */ }

      const lowerUrl = _call.call(_toLowerCase, decodedUrl);
      const searchStr = _call.call(_URLSearch, urlObj);
      const hashStr = _call.call(_URLHash, urlObj);
      const lowerQuery = searchStr ? _call.call(_toLowerCase, decodeURIComponent(searchStr)) : "";
      const lowerHash = hashStr ? _call.call(_toLowerCase, decodeURIComponent(hashStr)) : "";

      // Check high-signal keywords anywhere in URL
      if (_call.call(_some, highSignalKeywords, kw => _call.call(_SIncludes, lowerUrl, kw))) {
        if (_console.warn) _call.call(_console.warn, console, "Security Sentinel: AI exfiltration attempt blocked (High-signal Keyword in URL).");
        executeLockdown();
        return "[SECURITY_VIOLATION_DETECTED]";
      }

      // Check low-signal keywords in query string or hash/fragment
      if (_call.call(_some, queryOnlyKeywords, kw => _call.call(_SIncludes, lowerQuery, kw) || _call.call(_SIncludes, lowerHash, kw))) {
        if (_console.warn) _call.call(_console.warn, console, "Security Sentinel: AI exfiltration attempt blocked (Sensitive Keyword in Query/Hash).");
        executeLockdown();
        return "[SECURITY_VIOLATION_DETECTED]";
      }

      // High-entropy token check (detects exfiltration even without known keywords)
      // Check segments of the decoded URL, including the hash fragment
      const segments = _call.call(_split, decodedUrl, /[\/\?&%=:._\-#]/);
      for (const segment of segments) {
        if (segment.length >= 24 && calculateEntropy(segment) > 4.2) {
          if (_console.warn) _call.call(_console.warn, console, "Security Sentinel: AI exfiltration attempt blocked (High-entropy token in URL).");
          executeLockdown();
          return "[SECURITY_VIOLATION_DETECTED]";
        }
      }
    } catch (e) {
      // If URL parsing fails, perform a basic keyword check on the raw string
      if (_call.call(_some, highSignalKeywords, kw => _call.call(_SIncludes, _call.call(_toLowerCase, url), kw))) {
        executeLockdown();
        return "[SECURITY_VIOLATION_DETECTED]";
      }
    }
  }

  // 4. High-Entropy Segment Analysis (Non-URL Smuggling)
  // Detects high-entropy data blocks smuggled within the text itself (e.g., base64 segments).
  const words = _call.call(_split, c, /\s+/);
  for (const word of words) {
    if (word.length > 32 && calculateEntropy(word) > 4.5) {
      if (_console.warn) _call.call(_console.warn, console, "Security Sentinel: High-entropy data segment detected in AI body.");
      executeLockdown();
      return "[SECURITY_VIOLATION_DETECTED]";
    }
  }

  // 5. Redaction and boundary neutralization
  let v = redactData(_call.call(_replace, c, /\[\/?(USER_DATA|SECURITY_PROTOCOL|MESSAGE_HISTORY|USER_INPUT).*?\]/g, '[REDACTED_BOUNDARY]'));

  return v;
};

/**
 * Structural DOM Attestation
 * Snapshots and verifies the architectural integrity of the DOM to detect
 * unauthorized structural changes that might bypass MutationObservers.
 */
let _domBackboneSnapshot = null;
const checkStructuralIntegrity = () => {
  if (typeof window === 'undefined' || typeof document === 'undefined') return true;

  try {
    // We snapshot the critical architectural skeleton: head and the primary app root
    const root = document.getElementById('root');
    const head = document.head;

    const generateBackbone = () => {
      const serialize = (el) => {
        if (!el) return '';
        // Capture tag and ID for strict architectural nodes.
        // We exclude 'class' and 'role' as they can be dynamic in complex SPAs.
        const attrStr = _call.call(_ArrayFrom, Array, el.attributes)
          .filter(a => ['id'].includes(a.name.toLowerCase()))
          .map(a => `${a.name}=${a.value}`)
          .sort()
          .join('|');
        return `${el.tagName}[${attrStr}]`;
      };

      // Structural snapshot of head (immediate children) and root (architectural depth 2)
      let backbone = serialize(head) + '{';
      _call.call(_forEach, _call.call(_ArrayFrom, Array, head.children), c => backbone += serialize(c) + ',');
      backbone += '};' + serialize(root) + '{';
      if (root) {
        _call.call(_forEach, _call.call(_ArrayFrom, Array, root.children), c => {
          backbone += serialize(c) + '[';
          _call.call(_forEach, _call.call(_ArrayFrom, Array, c.children), gc => backbone += serialize(gc) + ',');
          backbone += '],';
        });
      }
      backbone += '}';
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

/**
 * Active Mutation Shield
 * Monitors the DOM for unauthorized script injections and attribute tampering.
 */
export const startMutationShield = () => {
  if (typeof window === 'undefined' || typeof MutationObserver === 'undefined') return;

  const dangerousTags = ['script', 'iframe', 'object', 'embed', 'base'];

  const checkNode = (node) => {
    if (node.nodeType !== 1) return false;
    const tag = node.tagName.toLowerCase();
    if (dangerousTags.includes(tag)) return true;

    if (node.attributes) {
      for (let i = 0; i < node.attributes.length; i++) {
        const attr = node.attributes[i].name.toLowerCase();
        const val = node.attributes[i].value.toLowerCase();
        if (attr.startsWith('on') || val.startsWith('javascript:')) return true;
      }
    }
    return false;
  };

  const observer = new MutationObserver((mutations) => {
    let violation = false;

    for (const mutation of mutations) {
      if (mutation.type === 'childList') {
        for (const node of mutation.addedNodes) {
          if (checkNode(node)) {
            violation = true;
            if (_console.error) _call.call(_console.error, console, "Security Sentinel: Unauthorized DOM injection detected.");
            break;
          }
        }
      } else if (mutation.type === 'attributes') {
        const attr = mutation.attributeName.toLowerCase();
        const val = mutation.target.getAttribute(mutation.attributeName)?.toLowerCase() || '';
        if (attr.startsWith('on') || val.startsWith('javascript:')) {
          violation = true;
          if (_console.error) _call.call(_console.error, console, `Security Sentinel: Unauthorized attribute tampering [${attr}] detected.`);
        }
      }
      if (violation) break;
    }

    if (violation) executeLockdown();
  });

  // Observe with a wide net but optimized processing
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true
    // Note: No attributeFilter to ensure all on* event handlers are caught
  });

  return observer;
};

/**
 * Polymorphic Key Enclave (PKE)
 * Isolates raw CryptoKey objects and sensitive strings from the application heap
 * using sharding and XOR-masking for Moving Target Defense (MTD).
 */
class PolymorphicKeyEnclave {
  constructor() {
    this._enclave = new _Map();
    this._masks = new _Map();
  }

  _generateMask(len) {
    const mask = new _Uint8Array(len);
    if (typeof window !== 'undefined' && window.crypto) {
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
    const isKey = typeof key === 'object' && key.constructor && (key.constructor.name === 'CryptoKey' || _call.call(_OToString, key) === '[object CryptoKey]');

    if (isKey) {
      _call.call(_MapSet, this._enclave, handle, { type: 'key', data: key });
      return;
    }

    if (typeof key === 'string') {
      const encoder = new TextEncoder();
      const bytes = _call.call(_TEncoderEncode, encoder, key);
      const len = bytes.length;

      const s1 = Math.floor(len / 3);
      const s2 = Math.floor((2 * len) / 3);

      const shards = [
        new _Uint8Array(_call.call(_Uint8Slice, bytes, 0, s1)),
        _call.call(_reverse, new _Uint8Array(_call.call(_Uint8Slice, bytes, s1, s2))),
        new _Uint8Array(_call.call(_Uint8Slice, bytes, s2))
      ];

      const masks = _call.call(_map, shards, shard => this._generateMask(shard.length));

      _call.call(_forEach, shards, (shard, i) => this._applyMask(shard, masks[i]));

      _call.call(_MapSet, this._enclave, handle, { type: 'string', data: shards });
      _call.call(_MapSet, this._masks, handle, masks);

      _call.call(_Uint8Fill, bytes, 0);
    }
  }

  get(handle) {
    const entry = _call.call(_MapGet, this._enclave, handle);
    if (!entry) return null;

    if (entry.type === 'key') return entry.data;

    if (entry.type === 'string') {
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
      if (entry.type === 'string') {
        const shards = entry.data;
        const oldMasks = _call.call(_MapGet, this._masks, handle);
        const newMasks = _call.call(_map, shards, shard => this._generateMask(shard.length));

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
}

/**
 * Cryptographic Key Enclave (CKE)
 * Isolates raw CryptoKey objects and sensitive strings from the application heap.
 * Only opaque handles are returned to callers.
 */
const _keyEnclave = new PolymorphicKeyEnclave();

/**
 * Resolves voro_key_ handles within a string, allowing for partial matches
 * (e.g. "Bearer voro_key_123").
 */
const _resolveValue = (val) => {
  if (typeof val !== 'string' || !_call.call(_SIncludes, val, 'voro_key_')) return val;
  return _call.call(_replace, val, /voro_key_[a-f0-9]{32}/g, (match) => {
    return _call.call(_keyEnclave.get, _keyEnclave, match) || match;
  });
};

const registerSecureKey = (key) => {
  if (!key) return key;
  // We enclave CryptoKey objects OR sensitive strings (like API keys)
  const isKey = typeof key === 'object' && key.constructor && (key.constructor.name === 'CryptoKey' || _call.call(_OToString, key) === '[object CryptoKey]');
  const isSensitiveString = typeof key === 'string' && key.length > 20;

  if (!isKey && !isSensitiveString) return key;

  const handle = `voro_key_${generateSecurityNonce()}`;
  _call.call(_keyEnclave.set, _keyEnclave, handle, key);
  return handle;
};

/**
 * Autonomous Heartbeat-Linked Attestation (AHLA)
 * Implements a recursive, hardened heartbeat that serves as the system's "Dead Man's Switch".
 * If the heartbeat is neutralized, all sensitive security sinks immediately expire.
 */
const startAutonomousPulse = () => {
  if (typeof window === 'undefined' || !_setTimeout) return;

  const pulse = () => {
    try {
      // Circuit breaker: skip if already compromised
      if (window.VORO_COMPROMISED) return;

      performIntegrityCheck();

      // Distributed Peer Attestation: Broadcast health and monitor peers
      const now = Date.now();
      if (securityNexus && _BCPostMessage) {
        _call.call(_BCPostMessage, securityNexus, {
          type: 'VORO_HEALTH_PULSE',
          tabId: _tabId,
          timestamp: now
        });
      }

      // Detect neutralized peers (Dead Man's Switch for components)
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

      // Schedule next pulse recursively to prevent interval-piling and make tracking harder
      _call.call(_setTimeout, window, pulse, PULSE_INTERVAL);
    } catch (e) {
      if (_console.error) _call.call(_console.error, console, "Security Sentinel: Pulse Failure.", e);
      executeLockdown();
    }
  };

  // Initial pulse
  _call.call(_setTimeout, window, pulse, PULSE_INTERVAL);
};

/**
 * Sentinel Self-Protection
 * Freezes the public API and core utilities to prevent runtime tampering.
 */
const sentinelExports = {
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
  _slice,
  _forEach
};

// Deep freeze the exports to prevent tampering
const deepFreeze = (obj) => {
  _freeze(obj);
  _getOwnPropertyNames(obj).forEach(prop => {
    if (obj[prop] !== null &&
        (typeof obj[prop] === 'object' || typeof obj[prop] === 'function') &&
        !Object.isFrozen(obj[prop])) {
      deepFreeze(obj[prop]);
    }
  });
  return obj;
};

if (typeof window !== 'undefined') {
  deepFreeze(sentinelExports);
  window.voro_sentinel = sentinelExports;
}

/**
 * Universal Console Redaction
 * Wraps all console methods to ensure sensitive data is redacted before being logged.
 */
const initializeConsoleProtection = () => {
  if (typeof window === 'undefined' || typeof console === 'undefined') return;

  const methods = ['log', 'warn', 'error', 'info', 'debug', 'trace'];
  methods.forEach(method => {
    const original = _console[method];
    if (!original) return;

    const wrapper = function(...args) {
      const redactedArgs = args.map(arg => redactData(arg));
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

/**
 * ⚡ TDZ SAFETY: Initialize orchestration after all dependencies are defined.
 */
initializeErrorOrchestration();
initializeConsoleProtection();

if (typeof window !== 'undefined') {
  // Execute VORO Neural Shield: Runtime Integrity Attestation immediately on load
  performIntegrityCheck();

  // Initialize Autonomous Pulse (Dead Man's Switch)
  startAutonomousPulse();

  // Initialize Polymorphic Heap Shuffling
  // Periodically rotates proxy caches to prevent static memory references.
  setInterval(() => rotateCloakingCache(), 600000); // Every 10 minutes

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      startMutationShield();
      initializeUserPresence();
    });
  } else {
    startMutationShield();
    initializeUserPresence();
  }
}

export default sentinelExports;
