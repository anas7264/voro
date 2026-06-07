/**
 * VORO Security Sentinel
 * Centralized security and privacy orchestrator for Zero Trust data flows.
 */

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
      const dangerousTags = ['script', 'style', 'iframe', 'object', 'embed', 'link', 'base', 'form'];
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
 * Executes a system-wide security lockdown.
 * Neutralizes the environment to protect data from further compromise.
 */
export const executeLockdown = () => {
  if (typeof window === 'undefined') return;

  console.error("CRITICAL: VORO Neural Shield has detected an integrity violation. Executing Lockdown.");

  // Set global compromise flag
  window.VORO_COMPROMISED = true;

  // Dispatch system-wide lockdown event
  const lockdownEvent = new CustomEvent('voro-security-lockdown', {
    detail: { timestamp: new Date().toISOString(), reason: 'Integrity Violation' }
  });
  window.dispatchEvent(lockdownEvent);

  // Clear sensitive global references if they exist
  if (window.voroAIClient) {
    window.voroAIClient.apiKey = null;
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
    { obj: window.crypto.subtle, prop: 'encrypt', name: 'crypto.subtle.encrypt' },
    { obj: window.crypto.subtle, prop: 'decrypt', name: 'crypto.subtle.decrypt' },
    { obj: window.crypto.subtle, prop: 'deriveKey', name: 'crypto.subtle.deriveKey' },
    { obj: window.localStorage, prop: 'getItem', name: 'localStorage.getItem' },
    { obj: window.indexedDB, prop: 'open', name: 'indexedDB.open' },
    { obj: JSON, prop: 'parse', name: 'JSON.parse' },
    { obj: JSON, prop: 'stringify', name: 'JSON.stringify' },
    { obj: Object, prop: 'defineProperty', name: 'Object.defineProperty' },
    { obj: window, prop: 'eval', name: 'eval' },
    { obj: window, prop: 'Function', name: 'Function' }
  ];

  let compromised = false;

  // Robust Native Code Check: Prevents simple toString() overrides
  const isNative = (fn) => {
    return typeof fn === 'function' &&
           /\{\s*\[native code\]\s*\}/.test(Function.prototype.toString.call(fn));
  };

  coreAPIs.forEach(({ obj, prop, name }) => {
    try {
      if (obj && obj[prop]) {
        if (!isNative(obj[prop])) {
          console.error(`Security Sentinel: Integrity Violation! ${name} has been monkey-patched.`);
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
    // Credit Cards (Harsher detection for 13-19 digits and various delimiters, Luhn-like length check)
    redacted = redacted.replace(/\b(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|6(?:011|5[0-9]{2})[0-9]{12}|(?:2131|1800|35\d{3})\d{11})\b/g, '[REDACTED_FINANCIAL]');
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
    // Common API Keys (Anthropic, OpenAI, AWS, etc.)
    redacted = redacted.replace(/\b(sk-ant-api03-[a-zA-Z0-9_-]{20,}|sk-[a-zA-Z0-9]{20,})\b/g, '[REDACTED_API_KEY]');
    redacted = redacted.replace(/\bAKIA[0-9A-Z]{16}\b/g, '[REDACTED_AWS_KEY]');
    // Private Keys (RSA/EC/Generic)
    redacted = redacted.replace(/-----BEGIN (?:RSA |EC )?PRIVATE KEY-----[\s\S]*?-----END (?:RSA |EC )?PRIVATE KEY-----/gi, '[REDACTED_PRIVATE_KEY]');

    // AI Boundary Marker Neutralization (Prevents indirect prompt injection)
    // Escapes markers like [USER_DATA], [MESSAGE_HISTORY], [SECURITY_PROTOCOL]
    // Uses balanced brackets (e.g., [[USER_DATA]]) to neutralize their special meaning
    // Generalizes to any [TAG] or [/TAG] with 3+ uppercase alphanumeric characters
    redacted = redacted.replace(/\[(\/?(?:[A-Z0-9_]{3,}))\]/gi, '[[$1]]');

    return redacted;
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
  const sensitiveKeys = ['name', 'email', 'phone', 'address', 'location', 'gymname', 'gym_name', 'latitude', 'longitude', 'lat', 'lng', 'birthday', 'social'];

  Object.keys(data).forEach(key => {
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
 * Validates AI response for security and privacy compliance.
 */
export const validateAIResponse = (response, nonce = null) => {
  if (typeof response !== 'string') return response;

  // 1. Critical Violation: Nonce Leakage
  if (nonce && response.includes(nonce)) {
    console.error("Security Sentinel: Security nonce leaked in AI response. Potential instruction override.");
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
    console.error("Security Sentinel: Potential prompt injection detected in AI response.");
    return "The AI generated a response that violates security protocols and has been neutralized.";
  }

  let validatedResponse = response;

  // 3. Privacy: Mandatory Data Redaction
  // We run redactData unconditionally to ensure all sensitive patterns (JWT, UUID, Crypto, PII) are caught.
  validatedResponse = redactData(validatedResponse);

  // 4. Data Exfiltration: Markdown Check
  // Prevents the AI from tricking the user into clicking links or loading images
  // that exfiltrate data via URL parameters (tracking pixels, credential harvesting).
  // Security Note: We use replace() directly without test() to avoid regex lastIndex side effects.
  const exfiltrationPattern = /!?\[.*?\]\(((?:https?:|javascript:|\/\/).*?|data:.*?)\)/gi;
  validatedResponse = validatedResponse.replace(exfiltrationPattern, (match, url) => {
    // Check for presence of the session nonce or high-entropy security keywords in the URL
    const isSuspicious = (nonce && url.includes(nonce)) ||
      /token|key|auth|credential|secret|cookie|session|localstorage|nonce|voro_/i.test(url);

    if (isSuspicious) {
      console.error("Security Sentinel: Potential data exfiltration via markdown detected.");
      return '[MEDIA_REMOVED_FOR_SECURITY]';
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
    result[key] = sanitizeObject(obj[key], seen);
  });
  return result;
};

export default {
  sanitizeInput,
  sanitizeObject,
  maskBiometrics,
  redactData,
  validateAIResponse,
  generateSecurityNonce,
  performIntegrityCheck,
  executeLockdown,
  startSecurityHeartbeat
};
