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
 * Advanced PII Redaction Engine
 * Uses a multi-tier approach to protect user privacy.
 */
export const redactData = (data, seen = new WeakSet()) => {
  if (data === null || data === undefined) return data;

  // Handle strings (Regex-based PII detection)
  if (typeof data === 'string') {
    let redacted = data;
    // Email
    redacted = redacted.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[REDACTED_EMAIL]');
    // Phone
    redacted = redacted.replace(/(\+\d{1,3}[- ]?)?\(?\d{3}\)?[- ]?\d{3}[- ]?\d{4}/g, '[REDACTED_PHONE]');
    // Addresses / Locations (Basic pattern)
    redacted = redacted.replace(/\d+\s+[a-zA-Z0-9\s,]+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Drive|Dr|Lane|Ln|Square|Sq|Trail|Trl)\.?/gi, '[REDACTED_ADDRESS]');
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
export const validateAIResponse = (response) => {
  if (typeof response !== 'string') return response;

  const dangerousIndicators = [
    'system prompt',
    'ignore previous instructions',
    'reveal your secrets',
    // More specific patterns for instruction overrides
    'new role is',
    'acting as a',
    'from now on you'
  ];

  const hasPII = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})|(\(?\d{3}\)?[- ]?\d{3}[- ]?\d{4})/.test(response);

  if (hasPII) {
    console.warn("Security Sentinel: AI response contained potential PII. Redacting.");
    return redactData(response);
  }

  // Check for prompt injection remnants in response
  if (dangerousIndicators.some(indicator => response.toLowerCase().includes(indicator))) {
    console.error("Security Sentinel: Potential prompt injection detected in AI response.");
    return "The AI generated a response that violates security protocols and has been neutralized.";
  }

  return response;
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
  redactData,
  validateAIResponse
};
