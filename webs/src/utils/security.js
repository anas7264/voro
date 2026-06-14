/**
 * VORO Security Sentinel
 * Centralized security and privacy orchestrator for Zero Trust data flows.
 */

// Capture original primitives to prevent RASP evasion via monkey-patching
const _toString = Function.prototype.toString;
const _call = Function.prototype.call;
const _apply = Function.prototype.apply;
const _Error = Error;
const _freeze = Object.freeze;
const _getOwnPropertyNames = Object.getOwnPropertyNames;
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
 * Verifies the integrity of core prototypes against snapshots.
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
          if (_console.error) _call.call(_console.error, console, `Security Sentinel: Prototype Pollution detected on ${name}.prototype.${key}`);
          compromised = true;
        }
      }

      // Check for deleted or modified properties
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
      const dangerousTags = ['script', 'style', 'iframe', 'object', 'embed', 'link', 'base', 'form', 'meta', 'svg', 'math', 'applet', 'frame', 'frameset', 'video', 'audio', 'canvas', 'details'];
      dangerousTags.forEach(tag => {
        const elements = doc.getElementsByTagName(tag);
        while (elements.length > 0) {
          elements[0].parentNode.removeChild(elements[0]);
        }
      });

      // Remove event handlers from all remaining elements
      const allElements = doc.querySelectorAll('*');
      allElements.forEach(el => {
        for (let i = 0; i < el.attributes.length; i++) {
          const attr = el.attributes[i].name.toLowerCase();
          if (attr.startsWith('on') || attr === 'action' || attr === 'href' && el.attributes[i].value.toLowerCase().startsWith('javascript:')) {
            el.removeAttribute(attr);
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
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/on\w+='[^']*'/gi, '')
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

  // Set global compromise flag
  window.VORO_COMPROMISED = true;

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
    { obj: document, prop: 'write', name: 'document.write' }
  ];

  let compromised = false;

  // Check Prototype Integrity
  if (!checkPrototypeIntegrity()) {
    compromised = true;
  }

  // Robust Native Code Check: Prevents simple toString() overrides
  const isNative = (fn) => {
    try {
      return typeof fn === 'function' &&
             /\{\s*\[native code\]\s*\}/.test(_call.call(_toString, fn));
    } catch (e) {
      return false;
    }
  };

  coreAPIs.forEach(({ obj, prop, name }) => {
    try {
      if (obj && obj[prop]) {
        if (!isNative(obj[prop])) {
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
 * Security Heartbeat
 * Continuously monitors environment integrity in the background.
 */
let heartbeatInterval = null;
export const startSecurityHeartbeat = (intervalMs = 30000) => {
  if (heartbeatInterval) return;

  heartbeatInterval = setInterval(() => {
    performIntegrityCheck();
    if (window.VORO_COMPROMISED) {
      clearInterval(heartbeatInterval);
      heartbeatInterval = null;
    }
  }, intervalMs);
};

/**
 * Privacy-Preserving Biometric Masking
 * Applies "jitter" or "bucketing" to sensitive metrics to protect exact identity.
 * Hardened with window.crypto for secure entropy.
 */
export const maskBiometrics = (data, seen = new WeakSet()) => {
  if (data === null || data === undefined) return data;
  if (typeof data !== 'object') return data;
  if (seen.has(data)) return data;

  seen.add(data);

  if (Array.isArray(data)) {
    return data.map(item => maskBiometrics(item, seen));
  }

  const result = {};
  const biometricKeys = ['weight', 'height', 'bodyfat', 'body_fat', 'age', 'bmi', 'systolic', 'diastolic', 'heartrate', 'heart_rate'];

  Object.keys(data).forEach(key => {
    const lowerKey = key.toLowerCase();
    const value = data[key];

    if (biometricKeys.includes(lowerKey) && typeof value === 'number') {
      // Apply deterministic bucketing/jittering
      if (lowerKey === 'age') {
        // Bucket age into 5-year increments (e.g., 27 -> "25-30")
        const floor = Math.floor(value / 5) * 5;
        result[key] = `${floor}-${floor + 5}`;
      } else if (lowerKey.includes('weight')) {
        // Round to nearest 0.5kg
        result[key] = Math.round(value * 2) / 2;
      } else if (lowerKey.includes('fat')) {
        // Round to nearest 1%
        result[key] = Math.round(value);
      } else if (lowerKey.includes('systolic') || lowerKey.includes('diastolic')) {
        // Round to nearest 5mmHg
        result[key] = Math.round(value / 5) * 5;
      } else {
        // Hardened Jitter: Use CSPRNG for entropy
        let entropy = 0.5;
        if (typeof window !== 'undefined' && window.crypto) {
          const array = new Uint32Array(1);
          window.crypto.getRandomValues(array);
          entropy = array[0] / 4294967295;
        } else {
          entropy = Math.random();
        }

        const jitter = 0.99 + (entropy * 0.02); // +/- 1% range
        result[key] = parseFloat((value * jitter).toFixed(1));
      }
    } else {
      result[key] = maskBiometrics(value, seen);
    }
  });

  return result;
};

/**
 * Advanced PII Redaction Engine
 * Uses a multi-tier approach to protect user privacy.
 */
export const redactData = (data, seen = new WeakSet()) => {
  if (data === null || data === undefined) return data;

  // Handle strings (Regex-based PII detection)
  if (typeof data === 'string') {
    let redacted = data;
    // Email (Standard PII)
    redacted = redacted.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[REDACTED_EMAIL]');
    // Phone
    redacted = redacted.replace(/(\+\d{1,3}[- ]?)?\(?\d{3}\)?[- ]?\d{3}[- ]?\d{4}/g, '[REDACTED_PHONE]');
    // Addresses / Locations (Basic pattern)
    redacted = redacted.replace(/\d+\s+[a-zA-Z0-9\s,]+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Drive|Dr|Lane|Ln|Square|Sq|Trail|Trl)\.?/gi, '[REDACTED_ADDRESS]');
    // Credit Cards (Harsher detection for 13-19 digits with optional spaces/dashes)
    redacted = redacted.replace(/\b(?:4[0-9]{3}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{1,4}|5[1-5][0-9]{2}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}|3[47][0-9]{2}[\s-]?\d{6}[\s-]?\d{5}|6(?:011|5[0-9]{2})[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4})\b/g, '[REDACTED_FINANCIAL]');
    // SSN (Identity Protection)
    redacted = redacted.replace(/\b\d{3}-\d{2}-\d{4}\b/g, '[REDACTED_ID]');
    // IP Addresses (IPv4 & IPv6)
    redacted = redacted.replace(/\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/g, '[REDACTED_IP]');
    redacted = redacted.replace(/\b(?:[A-F0-9]{1,4}:){7}[A-F0-9]{1,4}\b/gi, '[REDACTED_IP]');
    // JWT Tokens
    redacted = redacted.replace(/\beyJ[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*\b/g, '[REDACTED_JWT]');
    // UUIDs
    redacted = redacted.replace(/\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/gi, '[REDACTED_UUID]');
    // Crypto Wallets (BTC & ETH)
    redacted = redacted.replace(/\b(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,39}\b/g, '[REDACTED_CRYPTO]');
    redacted = redacted.replace(/\b0x[a-fA-F0-9]{40}\b/g, '[REDACTED_CRYPTO]');
    // Common API Keys (Anthropic, OpenAI, AWS, Google, GitHub, etc.)
    redacted = redacted.replace(/\b(sk-ant-api03-[a-zA-Z0-9_-]{20,}|sk-[a-zA-Z0-9]{20,})\b/g, '[REDACTED_API_KEY]');
    redacted = redacted.replace(/\b(sk_(?:live|test)_[0-9a-zA-Z]{24,34})\b/g, '[REDACTED_STRIPE_KEY]');
    redacted = redacted.replace(/\b(?:AKIA|ASIA)[0-9A-Z]{16}\b/g, '[REDACTED_AWS_KEY]');
    redacted = redacted.replace(/\bAIza[0-9A-Za-z-_]{35}\b/g, '[REDACTED_GOOGLE_KEY]');
    redacted = redacted.replace(/\bgh[pousr]_[a-zA-Z0-9]{36,251}\b/g, '[REDACTED_GITHUB_TOKEN]');
    // GitHub Fine-grained Personal Access Token
    redacted = redacted.replace(/\bgithub_pat_[a-zA-Z0-9]{82}\b/g, '[REDACTED_GITHUB_TOKEN]');
    // Private Keys (RSA/EC/Generic)
    redacted = redacted.replace(/-----BEGIN (?:RSA |EC )?PRIVATE KEY-----[\s\S]*?-----END (?:RSA |EC )?PRIVATE KEY-----/gi, '[REDACTED_PRIVATE_KEY]');

    // Entropy-based catch-all for unknown high-entropy secrets (API keys, session tokens)
    // Targets alphanumeric strings with high entropy that are likely to be secrets
    redacted = redacted.replace(/\b[A-Za-z0-9+/=]{24,}\b/g, (match) => {
      // Skip already redacted markers
      if (match.startsWith('[REDACTED_') || match.startsWith('[[') || match.includes('_REDACTED')) return match;
      // If entropy is high enough, it's likely a secret
      if (calculateEntropy(match) > 3.8) {
        return '[REDACTED_HIGH_ENTROPY_SECRET]';
      }
      return match;
    });

    // AI Boundary Marker Neutralization (Prevents indirect prompt injection)
    // Escapes markers like [USER_DATA], [MESSAGE_HISTORY], [SECURITY_PROTOCOL]
    // Uses balanced brackets (e.g., [[USER_DATA]]) to neutralize their special meaning
    // Generalizes to any [TAG] or [/TAG] with 3+ uppercase alphanumeric characters
    redacted = redacted.replace(/\[(\/?(?:[A-Z0-9_]{3,}))\]/gi, '[[$1]]');

    return redacted;
  }

  // If deception is active, serve decoy data if possible
  if (isDeceptionActive() && typeof data === 'object' && data !== null) {
    // We only serve decoys for known sensitive object patterns
    const objectKeys = Object.keys(data);
    if (objectKeys.includes('calories') || objectKeys.includes('exercise') || objectKeys.includes('heart_rate')) {
      return getDecoyData('vitals');
    }
  }

  // Handle non-objects
  if (typeof data !== 'object') return data;

  // Prevent circularity
  if (seen.has(data)) return '[CIRCULAR_REF]';

  // Handle Arrays
  if (Array.isArray(data)) {
    seen.add(data);
    return data.map(item => redactData(item, seen));
  }

  // Handle Objects
  seen.add(data);
  const result = {};

  // Sensitivity Tiers
  const criticalKeys = ['password', 'secret', 'token', 'key', 'apiKey', 'masterKey', 'auth'];
  const sensitiveKeys = ['name', 'email', 'phone', 'address', 'location', 'gymname', 'gym_name', 'latitude', 'longitude', 'lat', 'lng', 'birthday', 'social', 'voro_'];

  Object.keys(data).forEach(key => {
    // Prototype Pollution Guard
    if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
      if (_console.error) _call.call(_console.error, console, "Security Sentinel: Potential Prototype Pollution attempt detected and blocked during redaction.");
      return;
    }

    const lowerKey = key.toLowerCase();

    // Tier 1: Critical - Hard Redaction
    if (criticalKeys.some(ck => lowerKey.includes(ck))) {
      result[key] = '[CRITICAL_DATA_REDACTED]';
    }
    // Tier 2: Sensitive - Standard Redaction
    else if (sensitiveKeys.some(sk => lowerKey === sk || lowerKey.includes(sk))) {
      result[key] = '[REDACTED]';
    }
    // Tier 3: Pass-through with recursive check
    else {
      result[key] = redactData(data[key], seen);
    }
  });

  return result;
};

/**
 * Deep URL decoding to uncover obfuscated exfiltration paths.
 */
const recursiveUrlDecode = (url) => {
  let decoded = url;
  let prev;
  try {
    do {
      prev = decoded;
      decoded = decodeURIComponent(decoded);
    } while (decoded !== prev);
  } catch (e) {
    // Stop decoding if malformed
  }
  return decoded;
};

/**
 * Validates AI response for security and privacy compliance.
 */
export const validateAIResponse = (response, nonce = null) => {
  if (typeof response !== 'string') return response;

  // 1. Critical Violation: Nonce Leakage
  if (nonce && response.includes(nonce)) {
    if (_console.error) _call.call(_console.error, console, "Security Sentinel: Security nonce leaked in AI response. Potential instruction override.");
    return "The AI generated a response that violates security protocols and has been neutralized.";
  }

  // 2. Critical Violation: Prompt Injection Remnants
  const dangerousIndicators = [
    'system prompt',
    'ignore previous instructions',
    'reveal your secrets',
    'new role is',
    'acting as a',
    'from now on you'
  ];

  if (dangerousIndicators.some(indicator => response.toLowerCase().includes(indicator))) {
    if (_console.error) _call.call(_console.error, console, "Security Sentinel: Potential prompt injection detected in AI response.");
    return "The AI generated a response that violates security protocols and has been neutralized.";
  }

  let validatedResponse = response;

  // 3. Privacy: Mandatory Data Redaction
  // We run redactData unconditionally to ensure all sensitive patterns (JWT, UUID, Crypto, PII) are caught.
  validatedResponse = redactData(validatedResponse);

  // 4. Data Exfiltration: AI Firewall (Recursive Markdown & Protocol Analysis)
  // Prevents "Indirect Prompt Injection" or AI-driven exfiltration via tracking pixels,
  // credential harvesting, or protocol-relative smuggling.
  const exfiltrationPattern = /!?\[.*?\]\((.*?)\)/gi;
  validatedResponse = validatedResponse.replace(exfiltrationPattern, (match, url) => {
    const trimmedUrl = url.trim();

    // Block protocol-relative and non-standard schemes
    if (trimmedUrl.startsWith('//') ||
        trimmedUrl.toLowerCase().startsWith('javascript:') ||
        trimmedUrl.toLowerCase().startsWith('data:') ||
        trimmedUrl.toLowerCase().startsWith('blob:') ||
        trimmedUrl.toLowerCase().startsWith('file:') ||
        trimmedUrl.toLowerCase().startsWith('php:') ||
        trimmedUrl.toLowerCase().startsWith('vbscript:')) {
      if (_console.error) _call.call(_console.error, console, "Security Sentinel: Smuggled protocol detected in AI response.");
      return '[LINK_REMOVED_FOR_SECURITY]';
    }

    // Deep Analysis of the URL target
    const decodedUrl = recursiveUrlDecode(trimmedUrl);

    // Check for leaked nonces or sensitive system keys in parameters
    const hasSensitiveParams = (nonce && decodedUrl.includes(nonce)) ||
      /token|key|auth|credential|secret|cookie|session|localstorage|nonce|voro_|id_token|access_token/i.test(decodedUrl);

    if (hasSensitiveParams) {
      if (_console.error) _call.call(_console.error, console, "Security Sentinel: Sensitive data leakage detected in AI link.");
      return '[LINK_REMOVED_FOR_SECURITY]';
    }

    // High-Entropy Detection: Identifies potential base64-encoded exfiltration
    // Threshold 4.5 is high enough for typical text but flags high-entropy blobs
    if (calculateEntropy(decodedUrl) > 4.5 && decodedUrl.length > 50) {
      if (_console.error) _call.call(_console.error, console, "Security Sentinel: High-entropy data smuggling detected in AI response.");
      return '[LINK_REMOVED_FOR_SECURITY]';
    }

    return match;
  });

  return validatedResponse;
};

/**
 * Deep sanitization for nested objects (used before storage)
 */
export const sanitizeObject = (obj, seen = new WeakSet()) => {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj === 'string') return sanitizeInput(obj);
  if (typeof obj !== 'object') return obj;
  if (seen.has(obj)) return obj;

  seen.add(obj);

  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item, seen));
  }

  const result = {};
  Object.keys(obj).forEach(key => {
    // Prototype Pollution Guard
    if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
      if (_console.error) _call.call(_console.error, console, "Security Sentinel: Potential Prototype Pollution attempt detected and blocked during sanitization.");
      return;
    }

    result[key] = sanitizeObject(obj[key], seen);
  });
  return result;
};

/**
 * Privacy-Preserving Logging Engine
 * Globally overrides console methods to redact PII/secrets and inject deception.
 * Positioned at the end of the module to ensure all dependencies are initialized.
 */
const initializeLoggingEngine = () => {
  if (typeof window === 'undefined' || typeof console === 'undefined') return;

  const methods = ['log', 'warn', 'error', 'info', 'debug', 'trace'];

  methods.forEach(method => {
    const originalMethod = _console[method];
    if (!originalMethod) return;

    console[method] = (...args) => {
      // 1. Cyber Deception: Inject honey-tokens if compromised
      if (isDeceptionActive() && Math.random() > 0.8) {
        const decoys = [
          "Security Sentinel: Bypass confirmed with token VORO_BYPASS_882193",
          "Internal vault access granted: root_config_v3_master",
          "Session restored for admin_session_token_0x7721",
          "DEBUG: system_vault decryption key 0xAE712FB3C9"
        ];
        _call.call(originalMethod, console, decoys[Math.floor(Math.random() * decoys.length)]);
      }

      // 2. Redaction: Process arguments to strip PII and high-entropy secrets
      // Note: We use a special flag to prevent recursive redaction loops if redactData logs.
      const redactedArgs = args.map(arg => {
        try {
          if (typeof arg === 'string') return redactData(arg);
          if (typeof arg === 'object' && arg !== null) return redactData(arg);
          return arg;
        } catch (e) {
          return "[REDACTION_FAILURE]";
        }
      });

      // 3. Execution: Call native primitive with safe data
      if (_ReflectApply) {
        _ReflectApply(originalMethod, console, redactedArgs);
      } else {
        _call.call(originalMethod, console, ...redactedArgs);
      }
    };
  });
};

// Start the engine
initializeLoggingEngine();

export default {
  sanitizeInput,
  sanitizeObject,
  maskBiometrics,
  redactData,
  validateAIResponse,
  validateCallStack,
  generateSecurityNonce,
  performIntegrityCheck,
  executeLockdown,
  startSecurityHeartbeat,
  getDecoyData,
  isDeceptionActive
};
