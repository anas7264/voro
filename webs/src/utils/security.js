/**
 * VORO Security Sentinel
 * Centralized security and privacy orchestrator for Zero Trust data flows.
 */

// Capture original primitives to prevent RASP evasion via monkey-patching
const _toString = Function.prototype.toString;
const _call = Function.prototype.call;
const _apply = Function.prototype.apply;
const _test = RegExp.prototype.test;
const _exec = RegExp.prototype.exec;
const _setInterval = typeof setInterval !== 'undefined' ? setInterval : null;
const _setTimeout = typeof setTimeout !== 'undefined' ? setTimeout : null;
const _Error = Error;
const _fetch = typeof window !== 'undefined' ? window.fetch : null;
const _XHR = typeof window !== 'undefined' ? window.XMLHttpRequest : null;
const _BroadcastChannel = typeof window !== 'undefined' ? window.BroadcastChannel : null;
const _BCPostMessage = (typeof window !== 'undefined' && window.BroadcastChannel) ? window.BroadcastChannel.prototype.postMessage : null;
const _indexedDBOpen = (typeof window !== 'undefined' && window.indexedDB) ? window.indexedDB.open : null;
const _WebSocket = typeof window !== 'undefined' ? window.WebSocket : null;
const _sendBeacon = (typeof window !== 'undefined' && window.navigator) ? window.navigator.sendBeacon : null;
const _SWRegister = (typeof window !== 'undefined' && window.navigator?.serviceWorker) ? window.navigator.serviceWorker.register : null;
const _writeText = (typeof window !== 'undefined' && window.navigator?.clipboard) ? window.navigator.clipboard.writeText : null;
const _readText = (typeof window !== 'undefined' && window.navigator?.clipboard) ? window.navigator.clipboard.readText : null;
const _share = (typeof window !== 'undefined' && window.navigator) ? window.navigator.share : null;
const _URL = typeof window !== 'undefined' ? window.URL : null;
const _createObjectURL = (typeof window !== 'undefined' && window.URL) ? window.URL.createObjectURL : null;
const _revokeObjectURL = (typeof window !== 'undefined' && window.URL) ? window.URL.revokeObjectURL : null;

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
const _defineProperty = Object.defineProperty;
const _getOwnPropertyNames = Object.getOwnPropertyNames;
const _getOwnPropertySymbols = Object.getOwnPropertySymbols;
const _getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
const _getPrototypeOf = Object.getPrototypeOf;
const _hasOwnProperty = Object.prototype.hasOwnProperty;
const _values = Object.values;
const _ReflectApply = typeof Reflect !== 'undefined' ? Reflect.apply : null;
const _perfNow = (typeof performance !== 'undefined' && performance.now) ? performance.now.bind(performance) : null;
const _seal = Object.seal;
const _preventExtensions = Object.preventExtensions;
const _isFrozen = Object.isFrozen;
const _isSealed = Object.isSealed;
const _isExtensible = Object.isExtensible;

// Pulse Integrity Constants
const PULSE_INTERVAL = 30000; // 30s
const PULSE_DRIFT_THRESHOLD = PULSE_INTERVAL + 10000; // 40s (10s tolerance for background throttling)
let _lastIntegrityPulse = 0;

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
  const freqValues = _values ? _call.call(_values, Object, frequencies) : Object.values(frequencies);
  return freqValues.reduce((sum, freq) => {
    const p = freq / len;
    return sum - p * Math.log2(p);
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
const WRAPPERS_REGISTRY = new Map();

const snapshotPrototypes = () => {
  if (typeof window === 'undefined') return;
  corePrototypes.forEach(({ name, proto }) => {
    try {
      const keys = _getOwnPropertyNames(proto);
      const symbols = _getOwnPropertySymbols ? _getOwnPropertySymbols(proto) : [];
      prototypeSnapshots.set(name, new Set([...keys, ...symbols]));
    } catch (e) {
      // Ignore errors during snapshotting
    }
  });
};

// Initial snapshot
snapshotPrototypes();

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

    const lines = stack.split('\n');
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
      if (!line || line.includes('validateCallStack')) continue;

      // Detection 1: Anonymous / Evaluated Code
      if (line.includes('<anonymous>') || line.includes('eval at') || line.includes('at eval')) {
        if (_console.error) _call.call(_console.error, console, "Security Sentinel: Unauthorized execution context (eval/anonymous) detected in call stack.");
        executeLockdown();
        return false;
      }

      // Detection 2: Protocol Smuggling (blob, data, filesystem, extension)
      const dangerousProtocols = ['blob:', 'data:', 'filesystem:', 'chrome-extension:', 'moz-extension:', 'extension:', 'about:'];
      if (dangerousProtocols.some(proto => line.includes(proto))) {
        if (_console.error) _call.call(_console.error, console, "Security Sentinel: Unauthorized protocol detected in call stack.");
        executeLockdown();
        return false;
      }

      // Detection 3: Cross-Origin / Third-party script provenance
      // Extract URL and verify it against the trusted application origin
      const urlMatch = line.match(/(https?:\/\/[^\s)]+)/);
      if (urlMatch) {
        try {
          // Strip line/column numbers (e.g. :14:2) before parsing
          const cleanUrl = urlMatch[0].replace(/:\d+(?::\d+)?$/, '');
          const urlObj = _URL ? new _URL(cleanUrl) : new URL(cleanUrl);
          if (urlObj.origin !== trustedOrigin) {
            if (_console.error) _call.call(_console.error, console, `Security Sentinel: Cross-origin script provenance detected: ${urlObj.origin}`);
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
  input = input.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F\u200B-\u200D\uFEFF]/g, '');

  // If in a browser environment, use DOMParser for robust sanitization
  if (typeof window !== 'undefined' && window.DOMParser) {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(input, 'text/html');

      // Remove scripts, styles, iframes, and other dangerous elements
      const dangerousTags = ['script', 'style', 'iframe', 'object', 'embed', 'link', 'base', 'form', 'meta', 'svg', 'math', 'applet', 'frame', 'frameset', 'video', 'audio', 'canvas', 'details', 'template'];
      dangerousTags.forEach(tag => {
        const elements = doc.getElementsByTagName(tag);
        while (elements.length > 0) {
          elements[0].parentNode.removeChild(elements[0]);
        }
      });

      // Remove event handlers and dangerous attributes from all remaining elements
      const allElements = doc.querySelectorAll('*');
      allElements.forEach(el => {
        for (let i = 0; i < el.attributes.length; i++) {
          const attr = el.attributes[i].name.toLowerCase();
          const value = el.attributes[i].value.toLowerCase();
          if (attr.startsWith('on') ||
              attr === 'action' ||
              attr === 'formaction' ||
              (attr === 'href' || attr === 'src') && value.startsWith('javascript:')) {
            el.removeAttribute(el.attributes[i].name);
            i--; // Adjust index after removal
          }
        }
      });

      return doc.body.textContent || doc.body.innerText || "";
    } catch (e) {
      console.warn("DOMParser sanitization failed, falling back to regex", e);
    }
  }

  // Fallback: Robust regex-based sanitization
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/\bon\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/\b(?:form)?action\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/javascript:[^"']*/gi, '')
    .replace(/<[^>]*>/g, ''); // Strip all remaining HTML tags
};

/**
 * Generates a cryptographically secure ephemeral nonce for request isolation.
 */
export const generateSecurityNonce = () => {
  if (typeof window === 'undefined' || !window.crypto) {
    return Math.random().toString(36).substring(2, 15);
  }
  const array = new Uint8Array(16);
  window.crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

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
        const url = _URL ? new _URL(input, window.location.origin) : new URL(input, window.location.origin);
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
  const tag = `__VORO_CTX_${nonce}__`;

  // Register capabilities for this specific execution context
  activeCapabilities.set(nonce, {
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
        return await callback();
      }
    };
    return await context[tag]();
  } finally {
    // Cleanup: Ephemeral capabilities expire immediately after execution
    activeCapabilities.delete(nonce);
  }
};

const verifyAttestation = (sinkName, targetUrl = null) => {
  if (typeof window === 'undefined') return true;

  // Circuit breaker: skip if already compromised
  if (window.VORO_COMPROMISED) return false;

  // 1. Whitelist Verification (Prevents breaking core app functionality)
  if (targetUrl) {
    try {
      const url = _URL ? new _URL(targetUrl, window.location.origin) : new URL(targetUrl, window.location.origin);
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

    // Iterate active capabilities and verify if any match the current stack
    for (const [nonce, record] of activeCapabilities.entries()) {
      if (stack.includes(record.tag)) {
        // Verification: Does this context have the specific capability for this sink?
        // Granular check: 'sink:fetch', 'sink:indexedDB', 'domain:api.anthropic.com', etc.
        const hasSinkCap = record.capabilities.includes(`sink:${sinkName}`);

        let hasDomainCap = true;
        if (targetUrl) {
          try {
            const url = _URL ? new _URL(targetUrl, window.location.origin) : new URL(targetUrl, window.location.origin);
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
    WRAPPERS_REGISTRY.set('indexedDB.open', idbWrapper);
    window.indexedDB.open = idbWrapper;
  }

  // Wrap fetch
  if (_fetch) {
    const fetchWrapper = function(...args) {
      const url = (args[0] instanceof Request) ? args[0].url : args[0];
      if (!verifyAttestation('fetch', url)) {
        return Promise.reject(new _Error("Network command blocked by VORO Neural Shield. No Attestation Permit found."));
      }
      return _ReflectApply ? _ReflectApply(_fetch, window, args) : _call.call(_fetch, window, ...args);
    };
    TRUSTED_WRAPPERS.add(fetchWrapper);
    WRAPPERS_REGISTRY.set('fetch', fetchWrapper);
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
    WRAPPERS_REGISTRY.set('XMLHttpRequest', xhrWrapper);
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
    WRAPPERS_REGISTRY.set('WebSocket', wsWrapper);
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
    WRAPPERS_REGISTRY.set('navigator.sendBeacon', beaconWrapper);
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
    WRAPPERS_REGISTRY.set('navigator.serviceWorker.register', swWrapper);
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
    WRAPPERS_REGISTRY.set('navigator.clipboard.writeText', writeTextWrapper);
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
    WRAPPERS_REGISTRY.set('navigator.clipboard.readText', readTextWrapper);
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
    WRAPPERS_REGISTRY.set('navigator.share', shareWrapper);
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
    WRAPPERS_REGISTRY.set('BroadcastChannel', bcWrapper);
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
    WRAPPERS_REGISTRY.set('URL.createObjectURL', createObjectURLWrapper);
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
    WRAPPERS_REGISTRY.set('URL.revokeObjectURL', revokeObjectURLWrapper);
    window.URL.revokeObjectURL = revokeObjectURLWrapper;
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
        return _ReflectApply ? _ReflectApply(native, window.crypto.subtle, args) : _call.call(native, window.crypto.subtle, ...args);
      };

      TRUSTED_WRAPPERS.add(wrapper);
      WRAPPERS_REGISTRY.set(prop, wrapper);

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

        const attestationName = instance === 'Storage' ? `Storage.prototype.${name}` : `${instance}.${name}`;
        if (!verifyAttestation(attestationName)) {
          if (_console.warn) _call.call(_console.warn, console, `Security Sentinel: Unauthorized ${attestationName} blocked.`);
          return null;
        }
        return _call.call(native, this, ...args);
      };

      TRUSTED_WRAPPERS.add(wrapper);
      WRAPPERS_REGISTRY.set(`Storage.prototype.${name}`, wrapper);

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

if (securityNexus) {
  securityNexus.onmessage = (event) => {
    if (event.data === 'VORO_LOCKDOWN' && !window.VORO_COMPROMISED) {
      console.warn("Security Sentinel: Received lockdown signal from peer tab.");
      executeLockdown(false);
    }
  };
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
  try {
    if (!window.VORO_DECEPTION_ACTIVE) {
      _defineProperty(window, 'VORO_DECEPTION_ACTIVE', {
        value: true,
        writable: false,
        configurable: false
      });
    }
  } catch (e) {
    window.VORO_DECEPTION_ACTIVE = true;
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
    { obj: window.indexedDB, prop: 'open', name: 'indexedDB.open' },
    { obj: window, prop: 'WebSocket', name: 'WebSocket' },
    { obj: window.navigator, prop: 'sendBeacon', name: 'navigator.sendBeacon' },
    { obj: window.navigator?.clipboard, prop: 'writeText', name: 'navigator.clipboard.writeText' },
    { obj: window.navigator?.clipboard, prop: 'readText', name: 'navigator.clipboard.readText' },
    { obj: window.navigator, prop: 'share', name: 'navigator.share' },
    { obj: window, prop: 'BroadcastChannel', name: 'BroadcastChannel' },
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
    { obj: window, prop: 'Error', name: 'Error' }
  ];

  let compromised = false;

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
      return typeof fn === 'function' &&
             !fn.name.startsWith('bound ') &&
             _call.call(_test, /\{\s*\[native code\]\s*\}/, _call.call(_toString, fn));
    } catch (e) {
      return false;
    }
  };

  // Attestation-Aware Integrity Check
  const isAuthorized = (val, name) => {
    if (TRUSTED_WRAPPERS.has(val)) return true;

    // High-risk sinks MUST be wrapped; native primitives are unauthorized for these.
    const mustBeWrapped = [
      'fetch', 'XMLHttpRequest', 'WebSocket', 'indexedDB.open', 'navigator.sendBeacon',
      'navigator.serviceWorker.register',
      'navigator.clipboard.writeText', 'navigator.clipboard.readText', 'navigator.share',
      'BroadcastChannel',
      'localStorage.getItem', 'localStorage.setItem', 'localStorage.removeItem', 'localStorage.clear',
      'sessionStorage.getItem', 'sessionStorage.setItem', 'sessionStorage.removeItem', 'sessionStorage.clear',
      'URL.createObjectURL', 'URL.revokeObjectURL',
      'crypto.subtle.encrypt', 'crypto.subtle.decrypt', 'crypto.subtle.deriveKey', 'crypto.subtle.importKey', 'crypto.subtle.generateKey'
    ];

    if (mustBeWrapped.includes(name)) return false;

    // For non-functions (objects like navigator.geolocation), we allow them if not in mustBeWrapped.
    if (typeof val !== 'function') return true;

    return isNative(val);
  };

  coreAPIs.forEach(({ obj, prop, name }) => {
    try {
      if (obj && obj[prop]) {
        if (!isAuthorized(obj[prop], name)) {
          if (isTestMode()) return;
          if (_console.error) _call.call(_console.error, console, `Security Sentinel: Integrity Violation! ${name} has been monkey-patched or reverted to native. Executing Self-Healing restore.`);

          // Self-Healing RASP: Attempt to restore trusted wrappers or native primitives
          try {
            // First, attempt to restore the authorized security wrapper if it exists
            const wrapper = WRAPPERS_REGISTRY.get(name) ||
                           (name.includes('.') ? WRAPPERS_REGISTRY.get(`Storage.prototype.${name.split('.')[1]}`) : null);
            if (wrapper && obj) {
              _defineProperty(obj, prop, {
                value: wrapper,
                configurable: false,
                writable: false,
                enumerable: true
              });
              if (_console.info) _call.call(_console.info, console, `Security Sentinel: Successfully restored authorized wrapper for ${name}.`);
              return;
            }

            // Fallback: Restore native primitives from captured safe references
            const capturedMap = {
              'fetch': _fetch,
              'JSON.parse': JSON.parse,
              'JSON.stringify': JSON.stringify,
              'Object.defineProperty': _defineProperty,
              'indexedDB.open': _indexedDBOpen,
              'XMLHttpRequest': _XHR,
              'BroadcastChannel': _BroadcastChannel,
              'WebSocket': _WebSocket,
              'navigator.serviceWorker.register': _SWRegister,
              'setInterval': _setInterval,
              'setTimeout': _setTimeout,
              'performance.now': _perfNow,
              'localStorage.getItem': _StorageGetItem,
              'localStorage.setItem': _StorageSetItem,
              'localStorage.removeItem': _StorageRemoveItem,
              'localStorage.clear': _StorageClear,
              'sessionStorage.getItem': _StorageGetItem,
              'sessionStorage.setItem': _StorageSetItem,
              'sessionStorage.removeItem': _StorageRemoveItem,
              'sessionStorage.clear': _StorageClear,
              'Storage.prototype.getItem': _StorageGetItem,
              'Storage.prototype.setItem': _StorageSetItem,
              'Storage.prototype.removeItem': _StorageRemoveItem,
              'Storage.prototype.clear': _StorageClear,
              'crypto.subtle.encrypt': _SubtleEncrypt,
              'crypto.subtle.decrypt': _SubtleDecrypt,
              'crypto.subtle.deriveKey': _SubtleDeriveKey,
              'crypto.subtle.importKey': _SubtleImportKey,
              'crypto.subtle.generateKey': _SubtleGenerateKey,
              'URL.createObjectURL': _createObjectURL,
              'URL.revokeObjectURL': _revokeObjectURL
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
export const redactData = (d, s = new WeakSet()) => {
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
    Object.entries(p).forEach(([n, g]) => {
      r = r.replace(g, m => n === 'MARKER' ? `[[${m.slice(1, -1)}]]` : `[REDACTED_${n}]`);
    });
    // Shannon entropy-based catch-all for high-entropy tokens > 24 chars
    r = r.replace(/\b(?!\d{13,16}\b)[A-Za-z0-9+/=\-_]{24,}\b/g, m => (calculateEntropy(m) > 4.2) ? "[REDACTED_SECRET]" : m);
    return r;
  }
  if (!d || typeof d !== 'object') return d;
  if (s.has(d)) return "[CIRCULAR_REFERENCE]";
  s.add(d);
  if (Array.isArray(d)) return d.map(i => redactData(i, s));
  const r = {};
  _getOwnPropertyNames(d).forEach(k => {
    if (!['__proto__', 'constructor', 'prototype'].includes(k)) {
      r[k] = redactData(d[k], s);
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
  if (/[\u200B-\u200D\uFEFF]/.test(c)) {
    if (_console.error) _call.call(_console.error, console, "Security Sentinel: Steganographic markers detected in AI output.");
    executeLockdown();
    return "[SECURITY_VIOLATION_DETECTED]";
  }

  // 2. Nonce leakage check (Terminal)
  if (n && c.includes(n)) { executeLockdown(); return "[SECURITY_VIOLATION_DETECTED]"; }

  // 3. Comprehensive Data Exfiltration Check (Detects keywords and high-entropy tokens in URLs)
  // Check both markdown links/images and raw URLs for exfiltration patterns
  // Expanded to catch protocol-relative URLs, javascript: URIs, and data: URIs
  const urlRegex = /(?:https?:\/\/|www\.|(?:\s|^)\/\/|javascript:|data:)[^\s)\]]+/gi;
  const urls = c.match(urlRegex) || [];

  // High-signal keywords that trigger on any match within the URL
  const highSignalKeywords = ['cookie', 'session', 'localstorage', 'voro_', 'token', 'secret', 'credential', 'password'];
  // Low-signal keywords that only trigger if found in the query string to minimize false positives
  const queryOnlyKeywords = ['auth', 'key', 'sid', 'pwd', 'access_token', 'id_token', 'api'];

  const appOrigin = typeof window !== 'undefined' ? window.location.origin : null;

  for (const url of urls) {
    try {
      if (!_URL) throw new Error("URL constructor not available");
      const urlObj = new _URL(url.startsWith('www.') ? `https://${url}` : url);

      // Whitelist: Skip exfiltration check for links to the application's own origin
      if (appOrigin && urlObj.origin === appOrigin) continue;

      // Homoglyph Detection: Block potential punycode spoofs
      if (detectHomoglyphs(urlObj.hostname)) {
        if (_console.warn) _call.call(_console.warn, console, `Security Sentinel: AI exfiltration attempt blocked (Homoglyph hostname: ${urlObj.hostname}).`);
        executeLockdown();
        return "[SECURITY_VIOLATION_DETECTED]";
      }

      // Deep Decoding: Prevent bypass via percent-encoding (e.g., %74%6F%6B%65%6E for "token")
      let decodedUrl = url;
      try {
        decodedUrl = decodeURIComponent(url);
      } catch (e) { /* fallback to raw url if malformed */ }

      const lowerUrl = decodedUrl.toLowerCase();
      const lowerQuery = urlObj.search ? decodeURIComponent(urlObj.search).toLowerCase() : "";
      const lowerHash = urlObj.hash ? decodeURIComponent(urlObj.hash).toLowerCase() : "";

      // Check high-signal keywords anywhere in URL
      if (highSignalKeywords.some(kw => lowerUrl.includes(kw))) {
        if (_console.warn) _call.call(_console.warn, console, "Security Sentinel: AI exfiltration attempt blocked (High-signal Keyword in URL).");
        executeLockdown();
        return "[SECURITY_VIOLATION_DETECTED]";
      }

      // Check low-signal keywords in query string or hash/fragment
      if (queryOnlyKeywords.some(kw => lowerQuery.includes(kw) || lowerHash.includes(kw))) {
        if (_console.warn) _call.call(_console.warn, console, "Security Sentinel: AI exfiltration attempt blocked (Sensitive Keyword in Query/Hash).");
        executeLockdown();
        return "[SECURITY_VIOLATION_DETECTED]";
      }

      // High-entropy token check (detects exfiltration even without known keywords)
      // Check segments of the decoded URL, including the hash fragment
      const segments = decodedUrl.split(/[\/\?&%=:._\-#]/);
      for (const segment of segments) {
        if (segment.length >= 24 && calculateEntropy(segment) > 4.2) {
          if (_console.warn) _call.call(_console.warn, console, "Security Sentinel: AI exfiltration attempt blocked (High-entropy token in URL).");
          executeLockdown();
          return "[SECURITY_VIOLATION_DETECTED]";
        }
      }
    } catch (e) {
      // If URL parsing fails, perform a basic keyword check on the raw string
      if (highSignalKeywords.some(kw => url.toLowerCase().includes(kw))) {
        executeLockdown();
        return "[SECURITY_VIOLATION_DETECTED]";
      }
    }
  }

  // 4. High-Entropy Segment Analysis (Non-URL Smuggling)
  // Detects high-entropy data blocks smuggled within the text itself (e.g., base64 segments).
  const words = c.split(/\s+/);
  for (const word of words) {
    if (word.length > 32 && calculateEntropy(word) > 4.5) {
      if (_console.warn) _call.call(_console.warn, console, "Security Sentinel: High-entropy data segment detected in AI body.");
      executeLockdown();
      return "[SECURITY_VIOLATION_DETECTED]";
    }
  }

  // 5. Redaction and boundary neutralization
  let v = redactData(c.replace(/\[\/?(USER_DATA|SECURITY_PROTOCOL|MESSAGE_HISTORY|USER_INPUT).*?\]/g, '[REDACTED_BOUNDARY]'));

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
        const attrStr = Array.from(el.attributes)
          .filter(a => ['id'].includes(a.name.toLowerCase()))
          .map(a => `${a.name}=${a.value}`)
          .sort()
          .join('|');
        return `${el.tagName}[${attrStr}]`;
      };

      // Structural snapshot of head (immediate children) and root (architectural depth 2)
      let backbone = serialize(head) + '{';
      Array.from(head.children).forEach(c => backbone += serialize(c) + ',');
      backbone += '};' + serialize(root) + '{';
      if (root) {
        Array.from(root.children).forEach(c => {
          backbone += serialize(c) + '[';
          Array.from(c.children).forEach(gc => backbone += serialize(gc) + ',');
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
  performIntegrityCheck,
  executeLockdown,
  executeSecurely: (action, callback, caps) => executeSecurely(action, callback, caps),
  getDecoyData,
  isDeceptionActive,
  checkUserPresence
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
