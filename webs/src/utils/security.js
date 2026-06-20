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
const _WebSocket = typeof window !== 'undefined' ? window.WebSocket : null;
const _sendBeacon = (typeof window !== 'undefined' && window.navigator) ? window.navigator.sendBeacon : null;
const _freeze = Object.freeze;
const _defineProperty = Object.defineProperty;
const _getOwnPropertyNames = Object.getOwnPropertyNames;
const _getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
const _getPrototypeOf = Object.getPrototypeOf;
const _hasOwnProperty = Object.prototype.hasOwnProperty;
const _ReflectApply = typeof Reflect !== 'undefined' ? Reflect.apply : null;

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
  return Object.values(frequencies).reduce((sum, freq) => {
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
  { name: 'Boolean', proto: Boolean.prototype }
];

const TRUSTED_WRAPPERS = new WeakSet();

const snapshotPrototypes = () => {
  if (typeof window === 'undefined') return;
  corePrototypes.forEach(({ name, proto }) => {
    try {
      const keys = _getOwnPropertyNames(proto);
      prototypeSnapshots.set(name, new Set(keys));
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
      const currentKeys = _getOwnPropertyNames(proto);
      const originalKeys = prototypeSnapshots.get(name);

      if (!originalKeys) return;

      // Check for added properties (pollution)
      for (const key of currentKeys) {
        if (!originalKeys.has(key)) {
          if (_console.error) _call.call(_console.error, console, `Security Sentinel: Prototype Pollution detected on ${name}.prototype.${key}. Proactively purging polluted property.`);

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
          if (_console.error) _call.call(_console.error, console, `Security Sentinel: Prototype Tampering detected (deleted): ${name}.prototype.${key}`);
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
  if (typeof window === 'undefined') return true;

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
          const urlObj = new URL(cleanUrl);
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

  // Strip null bytes and dangerous control characters
  // eslint-disable-next-line no-control-regex
  input = input.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

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
      createScript: (input) => input,
      createScriptURL: (input) => input
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
  settings: { notifications: true, privacy_mode: 'maximum', biometric_auth: true }
};

export const getDecoyData = (key) => {
  // Normalize key
  const baseKey = key.replace(/^voro_/, '');
  return DECOY_DATA[baseKey] || DECOY_DATA[key] || { status: 'secure', integrity: 'verified' };
};

export const isDeceptionActive = () => {
  return typeof window !== 'undefined' && window.VORO_DECEPTION_ACTIVE === true;
};

/**
 * Neural Command Attestation (NCA)
 * Implements a capability-based security model for high-risk network sinks.
 */
let attestationPermitCount = 0;

// Trusted origins that bypass mandatory attestation (UX safety)
const ATTESTATION_WHITELIST = [
  'self',
  'https://fonts.googleapis.com',
  'https://fonts.gstatic.com'
];

/**
 * Executes a callback within a secure attested context, authorizing network egress.
 */
export const executeSecurely = async (action, callback) => {
  if (typeof window === 'undefined') return await callback();

  // Pre-execution Call Stack Attestation
  if (!validateCallStack()) {
    throw new _Error("Security Sentinel: Secure execution context denied due to unauthorized provenance.");
  }

  attestationPermitCount++;
  try {
    return await callback();
  } finally {
    attestationPermitCount--;
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

  // 2. Capability Check: Is there an active authorized context?
  if (attestationPermitCount <= 0) {
    if (_console.error) _call.call(_console.error, console, `Security Sentinel: Unauthorized network egress attempt via ${sinkName} to [${targetUrl || 'unknown'}]. Command denied (Missing Attestation Permit).`);

    // Surgical Lockdown: Only trigger for sensitive API targets to minimize false positives
    if (targetUrl && (targetUrl.includes('api.anthropic.com') || targetUrl.includes('openai.com'))) {
      executeLockdown();
    }
    return false;
  }

  // 3. Stack-Bound Attestation: Ensure the call originates from within an authorized executeSecurely context
  try {
    const stack = new _Error().stack;
    if (stack && !stack.includes('executeSecurely')) {
      if (_console.error) _call.call(_console.error, console, `Security Sentinel: Attestation Permit bypass detected for ${sinkName}. Call originated outside of authorized executeSecurely scope.`);
      executeLockdown();
      return false;
    }
  } catch (e) {
    // If stack analysis fails in this context, assume compromise
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
};

/**
 * Attestation Sink Orchestrator
 * Intercepts and wraps high-risk browser APIs with attestation guards.
 */
const initializeNetworkAttestation = () => {
  if (typeof window === 'undefined') return;

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
};

// Initialize Attestation Sinks
initializeNetworkAttestation();

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

// Initialize error orchestration
initializeErrorOrchestration();

/**
 * Active Defense Orchestrator
 * Cross-tab security synchronization via BroadcastChannel.
 */
const securityNexus = (typeof window !== 'undefined' && window.BroadcastChannel)
  ? new BroadcastChannel('voro-security-nexus')
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

  // Broadcast to other tabs via the security nexus
  if (broadcast && securityNexus) {
    securityNexus.postMessage('VORO_LOCKDOWN');
  }

  // Dispatch system-wide lockdown event
  const lockdownEvent = new CustomEvent('voro-security-lockdown', {
    detail: { timestamp: new Date().toISOString(), reason: 'Integrity Violation' }
  });
  window.dispatchEvent(lockdownEvent);

  // Clear sensitive global references if they exist
  if (window.voroAIClient) {
    window.voroAIClient.apiKey = null;
  }

  // Purge in-memory storage cache if available to prevent exfiltration of decrypted data
  if (window.storage && typeof window.storage.clearCache === 'function') {
    window.storage.clearCache();
  }

  // Aggressive Memory Hygiene: Purge session storage and other transient sinks
  try {
    sessionStorage.clear();
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
    { obj: window.sessionStorage, prop: 'setItem', name: 'sessionStorage.setItem' },
    { obj: window, prop: 'XMLHttpRequest', name: 'XMLHttpRequest' },
    { obj: window, prop: 'WebSocket', name: 'WebSocket' },
    { obj: window.navigator, prop: 'sendBeacon', name: 'navigator.sendBeacon' },
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
    { obj: window, prop: 'setTimeout', name: 'setTimeout' }
  ];

  let compromised = false;

  // Check Prototype Integrity
  if (!checkPrototypeIntegrity()) {
    compromised = true;
  }

  // Active Frame-Integrity Shield
  // Detects if the application is being rendered in an unauthorized frame (Clickjacking protection)
  try {
    if (typeof window !== 'undefined' && window.self !== window.top) {
      if (_console.error) _call.call(_console.error, console, "Security Sentinel: Frame Integrity Violation! Application is being rendered in an unauthorized frame/iframe.");
      compromised = true;
    }
  } catch (e) {
    // If accessing window.top is blocked by cross-origin policy, we are definitely in a frame
    compromised = true;
  }

  // Robust Native Code Check: Prevents simple toString() overrides
  const isNative = (fn) => {
    try {
      return typeof fn === 'function' &&
             _call.call(_test, /\{\s*\[native code\]\s*\}/, _call.call(_toString, fn));
    } catch (e) {
      return false;
    }
  };

  // Attestation-Aware Integrity Check
  const isAuthorized = (fn) => {
    if (TRUSTED_WRAPPERS.has(fn)) return true;
    return isNative(fn);
  };

  coreAPIs.forEach(({ obj, prop, name }) => {
    try {
      if (obj && obj[prop]) {
        if (!isAuthorized(obj[prop])) {
          if (_console.error) _call.call(_console.error, console, `Security Sentinel: Integrity Violation! ${name} has been monkey-patched.`);
          compromised = true;
        }
      }
    } catch (e) {
      // Access errors might indicate a hostile environment or sandboxing
      compromised = true;
    }
  });

  if (compromised) {
    executeLockdown();
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
      EMAIL: /[\w.-]+@[\w.-]+\.\w+/g,
      PHONE: /\b(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g,
      STRIPE: /sk_(?:live|test)_\w{24,34}/g,
      AWS: /AKIA\w{16}/g,
      JWT: /eyJ[\w=-]+\.eyJ[\w=-]+\.[\w-_.+/=]*/g,
      GOOGLE: /AIza[0-9A-Za-z-_]{35}/g,
      GITHUB: /gh[pk]_[a-zA-Z0-9]{36,255}/g,
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
    r = r.replace(/\b[A-Za-z0-9+/=]{24,}\b/g, m => (calculateEntropy(m) > 4.2) ? "[REDACTED_SECRET]" : m);
    return r;
  }
  if (!d || typeof d !== 'object') return d;
  if (s.has(d)) return "[CIRCULAR_REFERENCE]";
  s.add(d);
  if (Array.isArray(d)) return d.map(i => redactData(i, s));
  const r = {};
  _getOwnPropertyNames(d).forEach(k => {
    r[k] = redactData(d[k], s);
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
  _getOwnPropertyNames(d).forEach(p => r[p] = k.includes(p) ? '[REDACTED_BIOMETRIC]' : maskBiometrics(d[p], s));
  return r;
};

/**
 * Validates AI output for nonce leakage and suspicious exfiltration patterns.
 */
export const validateAIResponse = (c, n = null) => {
  if (!c) return c;
  if (n && c.includes(n)) { executeLockdown(); return "[SECURITY_VIOLATION_DETECTED]"; }
  let v = redactData(c.replace(/\[\/?(USER_DATA|SECURITY_PROTOCOL|MESSAGE_HISTORY|USER_INPUT).*?\]/g, '[REDACTED_BOUNDARY]'));
  if (/!\[.*?\]\(https?:\/\/.*?\?(?:cookie|session|localstorage|voro_).*?\)/gi.test(v)) { executeLockdown(); return "[SECURITY_VIOLATION_DETECTED]"; }
  return v;
};

/**
 * Background task to periodically verify runtime integrity (RASP).
 */
export const startSecurityHeartbeat = () => _setInterval && _setInterval(performIntegrityCheck, 30000);

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
  executeSecurely: (action, callback) => executeSecurely(action, callback),
  startSecurityHeartbeat,
  getDecoyData,
  isDeceptionActive
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

export default sentinelExports;
