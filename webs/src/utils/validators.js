// VORO Input Validators
// Validation functions for form inputs and data integrity

/**
 * ⚡ PERFORMANCE OPTIMIZATION: Module-scoped pre-compiled regex patterns.
 * Prevents dynamic RegExp instantiations and heap allocations on every validation call.
 */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LOWERCASE_RE = /[a-z]/;
const UPPERCASE_RE = /[A-Z]/;
const DIGIT_RE = /\d/;
const SPECIAL_CHAR_RE = /[@$!%*?&]/;

// Email validation
export const isValidEmail = (email) => {
  if (!email || typeof email !== 'string' || email.length > 254) {
    return false; // Security: RFC 5321 length limit to prevent ReDoS / Denial of Service on massive inputs
  }
  return EMAIL_RE.test(email);
};

// Password validation (min 8 chars, 1 uppercase, 1 lowercase, 1 number)
// OWASP-compliant: allows all special characters and spaces, immune to ReDoS
export const isValidPassword = (password) => {
  if (!password || typeof password !== 'string' || password.length < 8 || password.length > 128) {
    return false; // Security: Prevent client-side ReDoS and backend password hashing Denial of Service on extremely large/small strings
  }

  let hasLower = false;
  let hasUpper = false;
  let hasDigit = false;

  for (let i = 0; i < password.length; i++) {
    const char = password[i];
    if (char >= 'a' && char <= 'z') hasLower = true;
    else if (char >= 'A' && char <= 'Z') hasUpper = true;
    else if (char >= '0' && char <= '9') hasDigit = true;
  }

  return hasLower && hasUpper && hasDigit;
};

// Get password strength feedback
// ⚡ PERFORMANCE OPTIMIZATION: Zero-allocation RegExp.test() checks replace .match() array allocations.
export const getPasswordStrength = (password) => {
  let strength = 0;

  if (password.length >= 8) strength++;
  if (LOWERCASE_RE.test(password)) strength++;
  if (UPPERCASE_RE.test(password)) strength++;
  if (DIGIT_RE.test(password)) strength++;
  if (SPECIAL_CHAR_RE.test(password)) strength++;

  if (strength <= 1) return { level: "Very Weak", score: 1, feedback: ["Add more characters", "Mix uppercase and lowercase", "Add numbers", "Add special characters"] };
  if (strength <= 2) return { level: "Weak", score: 2, feedback: ["Mix uppercase and lowercase", "Add numbers", "Add special characters"] };
  if (strength <= 3) return { level: "Fair", score: 3, feedback: ["Add special characters"] };
  if (strength <= 4) return { level: "Good", score: 4, feedback: [] };
  return { level: "Strong", score: 5, feedback: [] };
};

// Positive number validation
export const isPositiveNumber = (value) => {
  const num = parseFloat(value);
  return Number.isFinite(num) && num > 0;
};

// Non-negative number validation
export const isNonNegativeNumber = (value) => {
  const num = parseFloat(value);
  return Number.isFinite(num) && num >= 0;
};

// Integer validation
export const isInteger = (value) => {
  return Number.isInteger(parseFloat(value));
};

// Weight validation (reasonable range in kg: 30-500kg)
export const isValidWeight = (weight) => {
  const w = parseFloat(weight);
  return Number.isFinite(w) && w >= 30 && w <= 500;
};

// Exercise weight validation (reasonable range in kg: 0-1000kg)
export const isValidExerciseWeight = (weight) => {
  const w = parseFloat(weight);
  return Number.isFinite(w) && w >= 0 && w <= 1000;
};

// Height validation (reasonable range in cm: 100-250cm)
export const isValidHeight = (height) => {
  const h = parseFloat(height);
  return Number.isFinite(h) && h >= 100 && h <= 250;
};

// Age validation (reasonable range: 13-120)
export const isValidAge = (age) => {
  const a = parseInt(age);
  return Number.isFinite(a) && a >= 13 && a <= 120;
};

// Body fat percentage validation (0-100%)
export const isValidBodyFat = (percentage) => {
  const bf = parseFloat(percentage);
  return Number.isFinite(bf) && bf >= 0 && bf <= 100;
};

// Calorie validation (daily intake: 500-10000)
export const isValidCalories = (calories) => {
  const cal = parseFloat(calories);
  return Number.isFinite(cal) && cal >= 500 && cal <= 10000;
};

// Macro validation (g: 0-500g)
export const isValidMacro = (value) => {
  const v = parseFloat(value);
  return Number.isFinite(v) && v >= 0 && v <= 500;
};

// Macro ratio validation (protein 10-50%, carbs 20-70%, fat 10-50%)
export const isValidMacroRatio = (protein, carbs, fat) => {
  const p = parseFloat(protein);
  const c = parseFloat(carbs);
  const f = parseFloat(fat);

  if (!Number.isFinite(p) || !Number.isFinite(c) || !Number.isFinite(f)) {
    return false;
  }

  const valid = {
    protein: p >= 10 && p <= 50,
    carbs: c >= 20 && c <= 70,
    fat: f >= 10 && f <= 50
  };

  return valid.protein && valid.carbs && valid.fat;
};

// Date validation
export const isValidDate = (dateString) => {
  if (dateString === null || dateString === undefined || (typeof dateString !== 'string' && typeof dateString !== 'number')) {
    return false;
  }
  const date = new Date(dateString);
  return Number.isFinite(date.getTime());
};

// Date in future validation
export const isDateInFuture = (dateString) => {
  if (!isValidDate(dateString)) return false;
  const date = new Date(dateString);
  return date > new Date();
};

// Date in past validation
export const isDateInPast = (dateString) => {
  if (!isValidDate(dateString)) return false;
  const date = new Date(dateString);
  return date < new Date();
};

const INTERNAL_IP_RE = /^(?:127\.\d+\.\d+\.\d+|10\.\d+\.\d+\.\d+|172\.(?:1[6-9]|2\d|3[01])\.\d+\.\d+|192\.168\.\d+\.\d+|169\.254\.\d+\.\d+|0\.\d+\.\d+\.\d+|100\.(?:6[4-9]|[7-9]\d|1[01]\d|12[0-7])\.\d+\.\d+|198\.1[89]\.\d+\.\d+|192\.0\.0\.\d+|192\.0\.2\.\d+|198\.51\.100\.\d+|203\.0\.113\.\d+|192\.88\.99\.\d+|(?:22[4-9]|23\d)\.\d+\.\d+\.\d+|(?:24\d|25[0-5])\.\d+\.\d+\.\d+)$/;
const INTERNAL_IPV6_RE = /^\[?(?:0*:0*:0*:0*:0*:0*:0*:0*1|0*:0*:0*:0*:0*:0*:0*:0*|::1|::|fe[89ab][0-9a-f]:.*|f[cd][0-9a-f]{2}:.*|::ffff:(?:127\.\d+\.\d+\.\d+|10\.\d+\.\d+\.\d+|172\.(?:1[6-9]|2\d|3[01])\.\d+\.\d+|192\.168\.\d+\.\d+|169\.254\.\d+\.\d+|100\.(?:6[4-9]|[7-9]\d|1[01]\d|12[0-7])\.\d+\.\d+|198\.1[89]\.\d+\.\d+|192\.0\.0\.\d+|192\.0\.2\.\d+|198\.51\.100\.\d+|203\.0\.113\.\d+|[0-9a-f]{1,4}:[0-9a-f]{1,4}))\]?$/i;

// URL validation
export const isValidURL = (url) => {
  if (!url || typeof url !== 'string' || url.length > 2048) {
    return false; // Security: Prevent client-side thread blocking / Denial of Service on extremely large inputs
  }
  try {
    const parsed = new URL(url);
    // Security: Only allow http and https protocols to prevent javascript: or other malicious URI schemes
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return false;
    }

    // Security: Prevent Userinfo Credential Smuggling (e.g., https://user:pass@domain.com)
    if (parsed.username || parsed.password) {
      return false;
    }

    // Security: Homoglyph-based URL deception / IDN spoofing prevention
    const hostname = parsed.hostname.toLowerCase();
    const hasHomoglyphs = /[^\x00-\x7F]/.test(hostname) || hostname.startsWith('xn--');
    if (hasHomoglyphs) {
      return false;
    }

    // Security: Block SSRF / private / loopback / internal IP targets (IPv4 & IPv6) and cloud metadata endpoints
    const isInternal = hostname === 'localhost' ||
      INTERNAL_IP_RE.test(hostname) ||
      INTERNAL_IPV6_RE.test(hostname);

    if (isInternal) {
      return false;
    }

    return true;
  } catch (e) {
    return false;
  }
};

// Heart rate validation (bpm: 30-220)
export const isValidHeartRate = (bpm) => {
  const hr = parseInt(bpm);
  return Number.isFinite(hr) && hr >= 30 && hr <= 220;
};

// Blood pressure validation (systolic: 70-200, diastolic: 40-120)
export const isValidBloodPressure = (systolic, diastolic) => {
  const sys = parseInt(systolic);
  const dia = parseInt(diastolic);

  return (
    Number.isFinite(sys) &&
    Number.isFinite(dia) &&
    sys >= 70 && sys <= 200 &&
    dia >= 40 && dia <= 120 &&
    sys > dia
  );
};

// Temperature validation (Celsius: -50 to 50)
export const isValidTemperature = (temp) => {
  const t = parseFloat(temp);
  return Number.isFinite(t) && t >= -50 && t <= 50;
};

// Rep range validation (1-100 reps)
export const isValidReps = (reps) => {
  const r = parseInt(reps);
  return Number.isFinite(r) && r >= 1 && r <= 100;
};

// Set count validation (1-50 sets)
export const isValidSets = (sets) => {
  const s = parseInt(sets);
  return Number.isFinite(s) && s >= 1 && s <= 50;
};

// Duration validation (seconds, 1-3600)
export const isValidDuration = (seconds) => {
  const dur = parseInt(seconds);
  return Number.isFinite(dur) && dur >= 1 && dur <= 3600;
};

// Water intake validation (ml: 0-5000)
export const isValidWaterAmount = (amount) => {
  const ml = parseInt(amount);
  return Number.isFinite(ml) && ml >= 0 && ml <= 5000;
};

// Journal note length validation (max 2048 characters to mitigate client-side DoS/memory bloat)
export const isValidJournalNote = (note) => {
  return typeof note === 'string' && note.length <= 2048;
};

// Chat query length validation (max 2000 characters to mitigate client-side DoS/memory bloat)
export const isValidChatQuery = (query) => {
  return typeof query === 'string' && query.length <= 2000;
};

// Display name validation (1-50 characters to prevent DoS/memory bloat and XSS)
export const isValidName = (name) => {
  return typeof name === 'string' && name.trim().length > 0 && name.length <= 50;
};

/**
 * CSV Formula Injection Shield (CFIS) / Formula Neutralization Engine (FNE)
 * Sanitizes input fields intended for CSV/Spreadsheet exports to neutralize
 * Formula Injection (OWASP CSV Injection), DDE command execution, and delimiter hijacking.
 */
export const sanitizeCSVField = (field) => {
  if (field === null || field === undefined) return '""';
  let str = String(field);

  // 1. Strip null bytes and dangerous control characters except standard line breaks
  // eslint-disable-next-line no-control-regex
  str = str.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

  // 2. Neutralize formula trigger characters (=, +, -, @, \t, \r, %, |)
  // Prepend single quote (') if string starts with a formula trigger (or after leading whitespace)
  const trimmed = str.trim();
  if (/^[=+\-@\t\r%|]/.test(trimmed) || /^[=+\-@\t\r%|]/.test(str)) {
    str = "'" + str;
  }

  // 3. Escape double quotes by doubling them (" -> "") and wrap in double quotes
  const escaped = str.replace(/"/g, '""');
  return `"${escaped}"`;
};

// ⚡ PERFORMANCE OPTIMIZATION: Hoisted homoglyph map and pre-compiled regex patterns.
// Prevents dynamic allocations on every keystroke and executes single-pass native DFA-based searches.
const HOMOGLYPHS_MAP = {
  // Cyrillic homoglyphs
  'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y',
  'к': 'k', 'л': 'l', 'м': 'm', 'н': 'h', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 'c', 'т': 't', 'у': 'y',
  'ф': 'f', 'х': 'x', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'shch', 'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e',
  'ю': 'yu', 'я': 'ya', 'і': 'i', 'ј': 'j', 'ѕ': 's', 'ё': 'e', 'є': 'e',
  'ԁ': 'd', 'ԑ': 'e', 'ԗ': 'r', 'ԝ': 'w',
  // Greek homoglyphs (mapped by visual similarity for spoofing defense)
  'α': 'a', 'β': 'b', 'γ': 'g', 'δ': 'd', 'ε': 'e', 'ζ': 'z', 'η': 'n', 'θ': 'th', 'ι': 'i', 'κ': 'k',
  'λ': 'l', 'μ': 'u', 'ν': 'v', 'ξ': 'x', 'ο': 'o', 'π': 'p', 'ρ': 'p', 'σ': 's', 'ς': 's', 'τ': 't',
  'υ': 'y', 'φ': 'f', 'χ': 'x', 'ψ': 'ps', 'ω': 'w',
  // Coptic & Armenian homoglyphs
  'ⲁ': 'a', 'ⲃ': 'b', 'ⲉ': 'e', 'ⲓ': 'i', 'ⲛ': 'n', 'ⲟ': 'o', 'ⲣ': 'r', 'ⲥ': 's', 'ⲧ': 't', 'ⲩ': 'y', 'ⲭ': 'x',
  'օ': 'o', 'ս': 'u',
  // Cherokee homoglyphs (U+AB70-U+ABBF Cherokee Small Letters mapped to Latin ASCII)
  'ꭰ': 'a', 'ꭲ': 'c', 'ꭹ': 'e', 'ꮖ': 'i', 'ꮹ': 'g', 'ꮠ': 'o', 'ꭱ': 'r', 'ꭼ': 'e', 'ꮤ': 's', 'ꮐ': 't',
  'ꮩ': 'v', 'ꮮ': 'l', 'ꮇ': 'm', 'ꮎ': 'n', 'ꮃ': 'w', 'ꮺ': 'y',
  // Georgian homoglyphs (Nuskhuri U+2D00-U+2D25 & Asroni U+10A0-U+10C5)
  'ⴀ': 'a', 'ⴁ': 'b', 'ⴄ': 'e', 'ⴈ': 'i', 'ⴍ': 'o', 'ⴑ': 's', 'ⴒ': 't', 'ⴓ': 'u', 'ⴔ': 'v', 'ⴖ': 'y',
  'Ⴀ': 'a', 'Ⴁ': 'b', 'Ⴄ': 'e', 'Ⴈ': 'i', 'Ⴍ': 'o', 'Ⴑ': 's', 'Ⴒ': 't',
  // Hebrew homoglyphs (U+0590-U+05FF)
  'ס': 'o', 'ם': 'o', 'ר': 'r', 'נ': 'i', 'ו': 'i', 'ז': 'z', 'כ': 'c', 'ח': 'n', 'ת': 'n',
  // Canadian Aboriginal Syllabics homoglyphs (U+1400-U+167F)
  'ᐠ': 'i', 'ᐟ': 't', 'ᐢ': 's', 'ᐤ': 'w', 'ᐨ': 'r', 'ᑅ': 'e', 'ᑊ': 'p', 'ᐥ': 'h', 'ᐡ': 'u',
  // Mathematical Alphanumeric homoglyphs missing from standard NFKD
  '𝑕': 'h', '𝒝': 'b', '𝒠': 'e', '𝒡': 'f', '𝒣': 'h', '𝒤': 'i', '𝒧': 'l', '𝒨': 'm', '𝒭': 'r', '𝒺': 'e',
  '𝒼': 'g', '𝓄': 'o', '𝔆': 'c', '𝔋': 'h', '𝔌': 'i', '𝔕': 'r', '𝔝': 'z', '𝔺': 'c', '𝔿': 'h', '𝕅': 'n',
  '𝕇': 'p', '𝕈': 'q', '𝕉': 'r', '𝕑': 'z',
  // Glagolitic homoglyphs (U+2C00-U+2C5F)
  'ⰰ': 'a', 'Ⰰ': 'a', 'ⰱ': 'b', 'Ⰱ': 'b', 'ⰲ': 'v', 'Ⰲ': 'v', 'ⰳ': 'g', 'Ⰳ': 'g',
  'ⰴ': 'd', 'Ⰴ': 'd', 'ⰵ': 'e', 'Ⰵ': 'e', 'ⰶ': 'zh', 'Ⰶ': 'zh', 'ⰷ': 'z', 'Ⰷ': 'z',
  'ⰸ': 'z', 'Ⰸ': 'z', 'ⰹ': 'i', 'Ⰹ': 'i', 'ⰺ': 'i', 'Ⰺ': 'i', 'ⰻ': 'i', 'Ⰻ': 'i',
  'ⰼ': 'k', 'Ⰼ': 'k', 'ⰽ': 'k', 'Ⰽ': 'k', 'ⰾ': 'l', 'Ⰾ': 'l', 'ⰿ': 'm', 'Ⰿ': 'm',
  'ⱀ': 'n', 'Ⱀ': 'n', 'ⱁ': 'o', 'Ⱁ': 'o', 'ⱂ': 'p', 'Ⱂ': 'p', 'ⱃ': 'r', 'Ⱃ': 'r',
  'ⱄ': 's', 'Ⱄ': 's', 'ⱅ': 't', 'Ⱅ': 't', 'ⱆ': 'u', 'Ⱆ': 'u', 'ⱇ': 'f', 'Ⱇ': 'f',
  'ⱈ': 'x', 'Ⱈ': 'x', 'ⱉ': 'ot', 'Ⱉ': 'ot', 'ⱊ': 'c', 'Ⱊ': 'c', 'ⱋ': 'ch', 'Ⱋ': 'ch',
  'ⱌ': 'c', 'Ⱌ': 'c', 'ⱍ': 'ch', 'Ⱍ': 'ch', 'ⱎ': 'sh', 'Ⱎ': 'sh'
};

// Map of Superscript and Subscript Latin code points to standard ASCII Latin characters
const SUPER_SUB_MAP = {
  0x2070: '0', 0x00B9: '1', 0x00B2: '2', 0x00B3: '3', 0x2074: '4', 0x2075: '5', 0x2076: '6', 0x2077: '7', 0x2078: '8', 0x2079: '9',
  0x2071: 'i', 0x207F: 'n', 0x1D48: 'd', 0x1D49: 'e', 0x1D4D: 'g', 0x1D4F: 'k', 0x1D50: 'm', 0x1D52: 'o', 0x1D56: 'p', 0x1D5B: 'v',
  0x1D62: 'i', 0x1D63: 'r', 0x1D64: 'u', 0x1D65: 'v',
  0x2080: '0', 0x2081: '1', 0x2082: '2', 0x2083: '3', 0x2084: '4', 0x2085: '5', 0x2086: '6', 0x2087: '7', 0x2088: '8', 0x2089: '9'
};

// Helper to decode Superscript and Subscript Latin code points to standard ASCII Latin letters
const decodeSuperAndSubscripts = (str) => {
  if (!str || typeof str !== 'string') return str;
  let decoded = '';
  let changed = false;
  for (const char of str) {
    const code = char.codePointAt(0);
    if (SUPER_SUB_MAP[code]) {
      decoded += SUPER_SUB_MAP[code];
      changed = true;
    } else {
      decoded += char;
    }
  }
  return changed ? decoded : str;
};

// Map of Unicode Braille Patterns (U+2800-U+283F) to ASCII Latin characters
const BRAILLE_MAP = {
  0x2801: 'a', 0x2803: 'b', 0x2809: 'c', 0x2819: 'd', 0x2811: 'e', 0x280B: 'f', 0x281B: 'g', 0x2813: 'h', 0x280A: 'i', 0x281A: 'j',
  0x2805: 'k', 0x2807: 'l', 0x280D: 'm', 0x281D: 'n', 0x2815: 'o', 0x280F: 'p', 0x281F: 'q', 0x2817: 'r', 0x280E: 's', 0x281E: 't',
  0x2825: 'u', 0x2827: 'v', 0x283A: 'w', 0x282D: 'x', 0x283D: 'y', 0x2835: 'z'
};

// Helper to decode Unicode Braille Patterns (U+2800-U+28FF) into standard ASCII letters
const decodeBraillePatterns = (str) => {
  if (!str || typeof str !== 'string') return str;
  let decoded = '';
  let changed = false;
  for (const char of str) {
    const code = char.codePointAt(0);
    if (code >= 0x2800 && code <= 0x28FF) {
      decoded += BRAILLE_MAP[code] || ' ';
      changed = true;
    } else {
      decoded += char;
    }
  }
  return changed ? decoded : str;
};

// Helper to decode Unicode Tag Characters (ASCII Smuggling / Invisible Language Tags)
// Maps Unicode Tag code points (U+E0020 - U+E007E) to printable ASCII (0x20 - 0x7E)
const decodeUnicodeTagCharacters = (str) => {
  if (!str || typeof str !== 'string') return str;
  let decoded = '';
  let hasTagChars = false;
  for (const char of str) {
    const code = char.codePointAt(0);
    if (code >= 0xE0020 && code <= 0xE007E) {
      decoded += String.fromCharCode(code - 0xE0000);
      hasTagChars = true;
    } else if (code === 0xE0001 || code === 0xE007F) {
      hasTagChars = true;
      continue;
    } else {
      decoded += char;
    }
  }
  return hasTagChars ? decoded : str;
};

// Helper to decode Regional Indicator Symbols (Unicode Emoji Flag/Letter Obfuscation)
// Maps Regional Indicator Symbol code points (U+1F1E6 - U+1F1FF) to ASCII 'a' - 'z'
const decodeRegionalIndicatorSymbols = (str) => {
  if (!str || typeof str !== 'string') return str;
  let decoded = '';
  let hasRegionalChars = false;
  for (const char of str) {
    const code = char.codePointAt(0);
    if (code >= 0x1F1E6 && code <= 0x1F1FF) {
      decoded += String.fromCharCode(code - 0x1F1E6 + 0x61);
      hasRegionalChars = true;
    } else {
      decoded += char;
    }
  }
  return hasRegionalChars ? decoded : str;
};

// Map of Latin Ligatures to ASCII letter sequences
const LIGATURES_MAP = {
  'æ': 'ae', 'Æ': 'AE',
  'œ': 'oe', 'Œ': 'OE',
  'ß': 'ss', 'ẞ': 'SS',
  'ĳ': 'ij', 'Ĳ': 'IJ',
  'ﬀ': 'ff', 'ﬁ': 'fi', 'ﬂ': 'fl', 'ﬃ': 'ffi', 'ﬄ': 'ffl', 'ﬅ': 'ft', 'ﬆ': 'st'
};

// Helper to decode Latin Ligatures to standard ASCII letter sequences
const decodeLatinLigatures = (str) => {
  if (!str || typeof str !== 'string') return str;
  return str.replace(/[æÆœŒßẞĳĲﬀﬁﬂﬃﬄﬅﬆ]/g, m => LIGATURES_MAP[m] || m);
};

// Map of Latin Small Capital Letters and IPA small cap extensions to ASCII Latin equivalents
const SMALL_CAPS_MAP = {
  0x026A: 'i', 0x0262: 'g', 0x0274: 'n', 0x0280: 'r', 0x029F: 'l', 0x029E: 'y', 0x028F: 'y', 0x0299: 'b', 0x0263: 'g', 0x0270: 'm', 0x0271: 'm', 0x0273: 'n', 0x027D: 'r', 0x0281: 'r',
  0x1D00: 'a', 0x1D01: 'ae', 0x1D03: 'b', 0x1D04: 'c', 0x1D05: 'd', 0x1D07: 'e', 0x1D08: 'e', 0x1D0A: 'j', 0x1D0B: 'k', 0x1D0C: 'l', 0x1D0D: 'm', 0x1D0E: 'n',
  0x1D0F: 'o', 0x1D18: 'p', 0x1D19: 'r', 0x1D1A: 'r', 0x1D1B: 't', 0x1D1C: 'u', 0x1D20: 'v', 0x1D21: 'w', 0x1D22: 'z'
};

// Map of Leetspeak / Alphanumeric Substitution characters to standard ASCII Latin characters
const LEET_MAP = {
  '0': 'o', '1': 'i', '3': 'e', '4': 'a', '5': 's', '6': 'g', '7': 't', '8': 'b', '9': 'g',
  '@': 'a', '$': 's', '!': 'i', '+': 't'
};

// Helper to decode Leetspeak / Alphanumeric Substitution to standard ASCII Latin characters
const decodeLeetspeak = (str) => {
  if (!str || typeof str !== 'string') return str;
  return str.replace(/[013456789@$!+]/g, char => LEET_MAP[char] || char);
};

// Helper to decode Latin Small Capital Letters (U+1D00-U+1D2B) and IPA Small Cap extensions
const decodeLatinSmallCaps = (str) => {
  if (!str || typeof str !== 'string') return str;
  let decoded = '';
  let changed = false;
  for (const char of str) {
    const code = char.codePointAt(0);
    if (SMALL_CAPS_MAP[code]) {
      decoded += SMALL_CAPS_MAP[code];
      changed = true;
    } else {
      decoded += char;
    }
  }
  return changed ? decoded : str;
};

// Helper to decode Enclosed Alphanumerics (e.g. Parenthesized, Circled, Squared, Negative Circled, Negative Squared Latin letters & digits)
const decodeEnclosedAlphanumerics = (str) => {
  if (!str || typeof str !== 'string') return str;
  let decoded = '';
  let changed = false;
  for (const char of str) {
    const code = char.codePointAt(0);
    if (code >= 0x2460 && code <= 0x2468) { // Circled Digits 1-9
      decoded += String.fromCharCode(code - 0x2460 + 0x31);
      changed = true;
    } else if (code >= 0x2469 && code <= 0x2473) { // Circled Numbers 10-20
      decoded += (code - 0x2469 + 10).toString();
      changed = true;
    } else if (code >= 0x2474 && code <= 0x247C) { // Parenthesized Digits 1-9
      decoded += String.fromCharCode(code - 0x2474 + 0x31);
      changed = true;
    } else if (code >= 0x247D && code <= 0x2487) { // Parenthesized Numbers 10-20
      decoded += (code - 0x247D + 10).toString();
      changed = true;
    } else if (code >= 0x2488 && code <= 0x2490) { // Digits 1-9 with Period
      decoded += String.fromCharCode(code - 0x2488 + 0x31);
      changed = true;
    } else if (code >= 0x2491 && code <= 0x249B) { // Numbers 10-20 with Period
      decoded += (code - 0x2491 + 10).toString();
      changed = true;
    } else if (code >= 0x249C && code <= 0x24B5) { // Parenthesized Latin Small Letters a-z
      decoded += String.fromCharCode(code - 0x249C + 0x61);
      changed = true;
    } else if (code >= 0x24B6 && code <= 0x24CF) { // Circled Latin Capital Letters A-Z
      decoded += String.fromCharCode(code - 0x24B6 + 0x41);
      changed = true;
    } else if (code >= 0x24D0 && code <= 0x24E9) { // Circled Latin Small Letters a-z
      decoded += String.fromCharCode(code - 0x24D0 + 0x61);
      changed = true;
    } else if (code === 0x24EA) { // Circled Digit 0
      decoded += '0';
      changed = true;
    } else if (code >= 0x1F101 && code <= 0x1F10A) { // Digits 0-9 in Enclosed Alphanumeric Supplement
      decoded += (code - 0x1F101).toString();
      changed = true;
    } else if (code === 0x1F100) { // Digit 0 in Enclosed Alphanumeric Supplement
      decoded += '0';
      changed = true;
    } else if (code >= 0x1F110 && code <= 0x1F129) { // Parenthesized Latin Capital Letters A-Z
      decoded += String.fromCharCode(code - 0x1F110 + 0x41);
      changed = true;
    } else if (code >= 0x1F130 && code <= 0x1F149) { // Squared Latin Capital Letters A-Z
      decoded += String.fromCharCode(code - 0x1F130 + 0x41);
      changed = true;
    } else if (code >= 0x1F150 && code <= 0x1F169) { // Negative Circle Latin Capital Letters A-Z
      decoded += String.fromCharCode(code - 0x1F150 + 0x41);
      changed = true;
    } else if (code >= 0x1F170 && code <= 0x1F189) { // Negative Squared Latin Capital Letters A-Z
      decoded += String.fromCharCode(code - 0x1F170 + 0x41);
      changed = true;
    } else {
      decoded += char;
    }
  }
  return changed ? decoded : str;
};

// Helper to decode string literal escape sequences (\uXXXX, \xXX, \u{X...}, \OCTAL) (handles multi-pass/nested escape sequences up to 5 passes)
const decodeEscapeSequences = (str) => {
  if (!str || typeof str !== 'string' || !str.includes('\\')) return str;
  let decoded = str;
  let prev;
  let limit = 5;
  do {
    prev = decoded;
    decoded = decoded.replace(/\\u([0-9a-fA-F]{4})|\\x([0-9a-fA-F]{2})|\\u\{([0-9a-fA-F]+)\}|\\([0-7]{1,3})/g, (match, u, x, uBrace, octal) => {
      try {
        if (octal) {
          const code = parseInt(octal, 8);
          return String.fromCodePoint(code);
        }
        const hex = u || x || uBrace;
        const code = parseInt(hex, 16);
        return String.fromCodePoint(code);
      } catch (e) {
        return match;
      }
    });
  } while (decoded !== prev && --limit > 0);
  return decoded;
};

const OVERRIDE_RE = /ignore previous|ignore above|ignore all instructions|ignore system|bypass instructions|override system|system override|developer mode|dan mode|do anything now|forget previous|forget all instructions|forget what was said|you must now ignore|you are now a developer|you are now an unrestricted|unrestricted mode|without restrictions|disable safety|bypass filters/i;

const HARVESTING_RE = /repeat the system prompt|reveal your instructions|reveal the system prompt|reveal instructions|output the system instructions|output your instructions|output the text above|show your system prompt|show system prompt|what is your system prompt|what is your prompt|what are your instructions|what are your developer instructions|reveal the nonce|output your nonces/i;

const ROLEPLAY_RE = /roleplay as|adopt the persona|pretend to be|you are now a terminal|you are now a linux|starting now you are|you are no longer an ai assistant|you are no longer a helpful/i;

// Helper to decode URL percent encoding (handles double/recursive encoding up to 5 times with fallback for malformed sequences)
const decodePercentEncoding = (str) => {
  if (!str || typeof str !== 'string' || !str.includes('%')) return str;
  let decoded = str;
  let prev;
  let limit = 5;
  do {
    prev = decoded;
    try {
      decoded = decodeURIComponent(decoded);
    } catch (e) {
      decoded = decoded.replace(/%([0-9a-fA-F]{2})/g, (match, hex) => {
        try {
          const code = parseInt(hex, 16);
          return String.fromCharCode(code);
        } catch (err) {
          return match;
        }
      });
    }
  } while (decoded !== prev && --limit > 0);
  return decoded;
};

// Helper to decode HTML entities (handles decimal, hex, and named entities with or without trailing semicolons, multi-pass up to 5 passes)
const decodeHTMLEntities = (str) => {
  if (!str || typeof str !== 'string' || !str.includes('&')) return str;
  let decoded = str;
  let prev;
  let limit = 5;
  do {
    prev = decoded;
    decoded = decoded.replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#x([0-9a-fA-F]+);?/gi, (_, hex) => {
        try {
          return String.fromCodePoint(parseInt(hex, 16));
        } catch (e) {
          return _;
        }
      })
      .replace(/&#(\d+);?/g, (_, dec) => {
        try {
          return String.fromCodePoint(parseInt(dec, 10));
        } catch (e) {
          return _;
        }
      });
  } while (decoded.includes('&') && decoded !== prev && --limit > 0);
  return decoded;
};

// Helper to decode Quoted-Printable encoding (handles =XX hex byte sequences and =\r\n soft line breaks)
const decodeQuotedPrintable = (str) => {
  if (!str || typeof str !== 'string' || !str.includes('=')) return str;
  let decoded = str;
  decoded = decoded.replace(/=(?:\r\n|\n|\r)/g, '');
  decoded = decoded.replace(/=([0-9a-fA-F]{2})/g, (match, hex) => {
    try {
      const code = parseInt(hex, 16);
      return String.fromCharCode(code);
    } catch (e) {
      return match;
    }
  });
  return decoded;
};

const BASE64_FORMAT_RE = /^[A-Za-z0-9+\/\-_]+={0,2}$/;
const BASE32_FORMAT_RE = /^[A-Z2-7=]+$/i;
const BASE58_ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
const BASE58_FORMAT_RE = /^[1-9A-HJ-NP-Za-km-z]{8,}$/;
const BASE58_MATCH_RE = /[1-9A-HJ-NP-Za-km-z]{12,}/g;
const NON_PRINTABLE_ASCII_RE = /[\x00-\x09\x0B\x0C\x0E-\x1F\x7F-\xFF]/;
const HEX_FORMAT_RE = /^[0-9a-fA-F]{8,}$/;
const BINARY_MATCH_RE = /(?:(?:0b)?[01]{7,8}(?:[\s,.\-_\/:;+=]+|$)){2,}|(?:0b[01]{7,8}){2,}/gi;
const DECIMAL_MATCH_RE = /(?:(?:0x[0-9a-fA-F]{1,2}|0o[0-7]{1,3}|\d{1,3})(?:[\s,.\-_\/:;+=]+|$)){4,}/g;
const OCTAL_MATCH_RE = /(?:(?:0o)?[0-7]{3}(?:[\s,.\-_\/:;+=]+|$)){4,}|(?:0o[0-7]{1,3}){4,}/gi;
const HEX_BYTES_MATCH_RE = /(?:(?:0x)?[0-9a-fA-F]{2}(?:[\s,.\-_\/:;+=]+|$)){4,}|(?:0x[0-9a-fA-F]{1,2}){4,}/gi;
const MULTI_RADIX_MATCH_RE = /(?:(?:0x[0-9a-fA-F]{1,2}|0o[0-7]{1,3}|[0-9a-fA-F]{2}|\d{1,3})(?:[\s,.\-_\/:;+=]+|$)){4,}/g;

const MORSE_MAP = {
  '.-': 'a', '-...': 'b', '-.-.': 'c', '-..': 'd', '.': 'e', '..-.': 'f', '--.': 'g', '....': 'h', '..': 'i', '.---': 'j',
  '-.-': 'k', '.-..': 'l', '--': 'm', '-.': 'n', '---': 'o', '.--.': 'p', '--.-': 'q', '.-.': 'r', '...': 's', '-': 't',
  '..-': 'u', '...-': 'v', '.--': 'w', '-..-': 'x', '-.--': 'y', '--..': 'z', '-----': '0', '.----': '1', '..---': '2',
  '...--': '3', '....-': '4', '.....': '5', '-....': '6', '--...': '7', '---..': '8', '----.': '9'
};

const MORSE_MATCH_RE = /(?:[.\-•–—_]{1,7}(?:[\s\/]+|$)){3,}/g;
const MORSE_FORMAT_RE = /^[.\-•–—_\s\/]{8,}$/;

// Helper to safely decode space/comma/byte-separated decimal, hex, or octal character codes into ASCII
const safeDecodeDecimal = (str) => {
  try {
    if (!str || typeof str !== 'string' || str.length < 8) return null;
    const tokens = str.trim().split(/[\s,.\-_\/:;+=]+/);
    if (tokens.length < 4) return null;
    let decoded = '';
    for (const token of tokens) {
      if (!token) continue;
      let code;
      if (/^0x[0-9a-fA-F]{1,2}$/i.test(token)) {
        code = parseInt(token, 16);
      } else if (/^0o[0-7]{1,3}$/i.test(token)) {
        code = parseInt(token.slice(2), 8);
      } else if (/^\d{1,3}$/.test(token)) {
        code = parseInt(token, 10);
      } else {
        return null;
      }
      if (code < 9 || (code > 13 && code < 32) || code > 126) return null;
      decoded += String.fromCharCode(code);
    }
    return decoded.length >= 8 ? decoded : null;
  } catch (e) {
    return null;
  }
};

// Helper to safely decode space/comma/dash-separated octal ASCII character codes (3-digit or 0o-prefixed)
const safeDecodeOctal = (str) => {
  try {
    if (!str || typeof str !== 'string' || str.length < 8) return null;
    const tokens = str.toLowerCase().includes('0o')
      ? (str.match(/0o[0-7]{1,3}/gi) || []).map(t => t.slice(2))
      : str.trim().split(/[\s,.\-_\/:;+=]+/);
    if (tokens.length < 4) return null;
    let decoded = '';
    for (const token of tokens) {
      if (!token) continue;
      let code;
      if (/^0o[0-7]{1,3}$/i.test(token)) {
        code = parseInt(token.slice(2), 8);
      } else if (/^[0-7]{1,3}$/.test(token)) {
        code = parseInt(token, 8);
      } else {
        return null;
      }
      if (code < 9 || (code > 13 && code < 32) || code > 126) return null;
      decoded += String.fromCharCode(code);
    }
    return decoded.length >= 8 ? decoded : null;
  } catch (e) {
    return null;
  }
};

// Helper to safely decode space/comma/dash-separated 2-digit hex byte sequences into ASCII
const safeDecodeHexBytes = (str) => {
  try {
    if (!str || typeof str !== 'string' || str.length < 8) return null;
    const tokens = str.toLowerCase().includes('0x')
      ? (str.match(/0x[0-9a-fA-F]{1,2}/gi) || []).map(t => t.slice(2))
      : str.trim().split(/[\s,.\-_\/:;+=]+/);
    if (tokens.length < 4) return null;
    let decoded = '';
    for (const token of tokens) {
      if (!token) continue;
      let code;
      if (/^0x[0-9a-fA-F]{1,2}$/i.test(token)) {
        code = parseInt(token.slice(2), 16);
      } else if (/^[0-9a-fA-F]{1,2}$/.test(token)) {
        code = parseInt(token, 16);
      } else {
        return null;
      }
      if (code < 9 || (code > 13 && code < 32) || code > 126) return null;
      decoded += String.fromCharCode(code);
    }
    return decoded.length >= 8 ? decoded : null;
  } catch (e) {
    return null;
  }
};

// Helper to safely decode space/comma/dash-separated multi-radix (decimal, hex 0x/2-digit, octal 0o/3-digit) character codes
const safeDecodeMultiRadix = (str) => {
  try {
    if (!str || typeof str !== 'string' || str.length < 8) return null;
    const tokens = str.trim().split(/[\s,.\-_\/:;+=]+/);
    if (tokens.length < 4) return null;
    let decoded = '';
    for (const token of tokens) {
      if (!token) continue;
      let code = null;
      if (/^0x[0-9a-fA-F]{1,2}$/i.test(token)) {
        code = parseInt(token.slice(2), 16);
      } else if (/^0o[0-7]{1,3}$/i.test(token)) {
        code = parseInt(token.slice(2), 8);
      } else if (/^[0-9a-fA-F]{2}$/i.test(token) && /[a-fA-F]/i.test(token)) {
        code = parseInt(token, 16);
      } else if (/^\d{1,3}$/.test(token)) {
        const val = parseInt(token, 10);
        if (val >= 32 && val <= 126) {
          code = val;
        } else if (/^[0-7]{3}$/.test(token)) {
          const octVal = parseInt(token, 8);
          if (octVal >= 32 && octVal <= 126) {
            code = octVal;
          }
        }
      }
      if (code === null || code < 9 || (code > 13 && code < 32) || code > 126) return null;
      decoded += String.fromCharCode(code);
    }
    return decoded.length >= 8 ? decoded : null;
  } catch (e) {
    return null;
  }
};

// Helper to safely decode space/byte-separated binary octets (supports optional 0b prefix)
const safeDecodeBinary = (str) => {
  try {
    if (!str || typeof str !== 'string' || str.length < 14) return null;
    const tokens = str.toLowerCase().includes('0b')
      ? (str.match(/0b[01]{7,8}/gi) || []).map(t => t.slice(2))
      : str.trim().split(/[\s,.\-_\/:;+=]+/);
    if (tokens.length < 2) return null;
    let decoded = '';
    for (const token of tokens) {
      if (!token) continue;
      const cleanToken = token.toLowerCase().startsWith('0b') ? token.slice(2) : token;
      if (!/^[01]{7,8}$/.test(cleanToken)) return null;
      const code = parseInt(cleanToken, 2);
      if (code < 9 || (code > 13 && code < 32) || code > 126) return null;
      decoded += String.fromCharCode(code);
    }
    return decoded.length >= 8 ? decoded : null;
  } catch (e) {
    return null;
  }
};

// Helper to safely decode Morse code sequences (dots and dashes)
const safeDecodeMorse = (str) => {
  try {
    if (!str || typeof str !== 'string' || str.length < 8) return null;
    const cleanStr = str.trim().replace(/[•]/g, '.').replace(/[–—_]/g, '-');
    if (!MORSE_FORMAT_RE.test(cleanStr)) return null;

    const words = cleanStr.split(/\s*[\/]\s*|\s{2,}/);
    let decoded = '';
    for (const word of words) {
      if (!word) continue;
      const letters = word.trim().split(/\s+/);
      for (const letter of letters) {
        if (!letter) continue;
        if (!MORSE_MAP[letter]) return null;
        decoded += MORSE_MAP[letter];
      }
      decoded += ' ';
    }
    const result = decoded.trim();
    return result.length >= 8 ? result : null;
  } catch (e) {
    return null;
  }
};

// Helper to safely decode Base32 strings (RFC 4648) with printable-ASCII verification
const safeDecodeBase32 = (str) => {
  try {
    if (!str || typeof str !== 'string' || str.length < 8 || !BASE32_FORMAT_RE.test(str)) {
      return null;
    }
    const cleanStr = str.replace(/=/g, '').toUpperCase();
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let bits = '';
    for (let i = 0; i < cleanStr.length; i++) {
      const val = alphabet.indexOf(cleanStr[i]);
      if (val === -1) return null;
      bits += val.toString(2).padStart(5, '0');
    }
    let decoded = '';
    for (let i = 0; i + 8 <= bits.length; i += 8) {
      const byte = parseInt(bits.substring(i, i + 8), 2);
      if (byte < 32 || byte > 126) return null;
      decoded += String.fromCharCode(byte);
    }
    return decoded.length >= 8 ? decoded : null;
  } catch (e) {
    return null;
  }
};

// Helper to safely decode ROT47-encoded text (ASCII range 33-126 offset by 47)
const safeDecodeRot47 = (str) => {
  if (!str || typeof str !== 'string' || str.length < 8) return null;
  let decoded = '';
  let changed = false;
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i);
    if (code >= 33 && code <= 126) {
      decoded += String.fromCharCode(33 + ((code - 33 + 47) % 94));
      changed = true;
    } else {
      decoded += str[i];
    }
  }
  return changed ? decoded : null;
};

// Helper to safely decode Atbash cipher-encoded text (a<->z, A<->Z)
const safeDecodeAtbash = (str) => {
  if (!str || typeof str !== 'string' || str.length < 8) return null;
  let decoded = '';
  let changed = false;
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i);
    if (code >= 65 && code <= 90) {
      decoded += String.fromCharCode(90 - (code - 65));
      changed = true;
    } else if (code >= 97 && code <= 122) {
      decoded += String.fromCharCode(122 - (code - 97));
      changed = true;
    } else {
      decoded += str[i];
    }
  }
  return changed ? decoded : null;
};

// Helper to safely decode Base58-encoded text with printable-ASCII verification
const safeDecodeBase58 = (str) => {
  try {
    if (!str || typeof str !== 'string' || !BASE58_FORMAT_RE.test(str)) return null;
    let num = 0n;
    for (let i = 0; i < str.length; i++) {
      const charIndex = BASE58_ALPHABET.indexOf(str[i]);
      if (charIndex === -1) return null;
      num = num * 58n + BigInt(charIndex);
    }
    let hex = num.toString(16);
    if (hex.length % 2 !== 0) hex = '0' + hex;
    let decoded = '';
    for (let i = 0; i < hex.length; i += 2) {
      const code = parseInt(hex.substring(i, i + 2), 16);
      if (code < 32 || code > 126) return null;
      decoded += String.fromCharCode(code);
    }
    return decoded.length >= 8 ? decoded : null;
  } catch (e) {
    return null;
  }
};

// Helper to safely decode Base64 and URL-safe Base64 (RFC 4648 §5) strings with auto-padding and printable-ASCII verification (XSS/DoS safe)
const safeAtob = (str) => {
  try {
    if (!str || typeof str !== 'string' || str.length < 8) return null;
    const normalized = str.replace(/-/g, '+').replace(/_/g, '/');
    if (!BASE64_FORMAT_RE.test(normalized)) {
      return null;
    }
    let padded = normalized;
    while (padded.length % 4 !== 0) {
      padded += '=';
    }
    const decoded = typeof atob !== 'undefined' ? atob(padded) : Buffer.from(padded, 'base64').toString('utf-8');
    if (NON_PRINTABLE_ASCII_RE.test(decoded)) {
      return null;
    }
    return decoded;
  } catch (e) {
    return null;
  }
};

// Helper to safely decode Hex strings with alignment and printable-ASCII verification
const safeDecodeHex = (str) => {
  try {
    if (!HEX_FORMAT_RE.test(str) || str.length % 2 !== 0) {
      return null;
    }
    let decoded = '';
    for (let i = 0; i < str.length; i += 2) {
      const code = parseInt(str.substring(i, i + 2), 16);
      if (code < 32 || code > 126) return null; // Ensure only printable ASCII to prevent false positives
      decoded += String.fromCharCode(code);
    }
    return decoded;
  } catch (e) {
    return null;
  }
};

// Helper to decode Caesar cipher (ROT-N, shifts 1..25) encoded text
const safeDecodeCaesar = (str, shift) => {
  if (!str || typeof str !== 'string' || str.length < 8) return null;
  return str.replace(/[a-zA-Z]/g, (c) => {
    const code = c.charCodeAt(0);
    if (code >= 65 && code <= 90) {
      return String.fromCharCode(((code - 65 + shift) % 26) + 65);
    }
    if (code >= 97 && code <= 122) {
      return String.fromCharCode(((code - 97 + shift) % 26) + 97);
    }
    return c;
  });
};

const safeDecodeRot13 = (str) => safeDecodeCaesar(str, 13);

// Helper to reverse a string (for reversed-keyword evasion)
const safeReverseString = (str) => {
  if (!str || typeof str !== 'string' || str.length < 8) return null;
  return str.split('').reverse().join('');
};

const BACON_24_MAP = {
  'AAAAA': 'a', 'AAAAB': 'b', 'AAABA': 'c', 'AAABB': 'd', 'AABAA': 'e', 'AABAB': 'f', 'AABBA': 'g', 'AABBB': 'h',
  'ABABA': 'i', 'ABABB': 'k', 'ABBAA': 'l', 'ABBAB': 'm', 'ABBBB': 'n', 'BAAAA': 'o', 'BAAAB': 'p', 'BAABA': 'q',
  'BAABB': 'r', 'BABAA': 's', 'BABAB': 't', 'BABBA': 'u', 'BABBB': 'w', 'BBAAA': 'x', 'BBAAB': 'y', 'BBABA': 'z'
};

const BACON_26_MAP = {
  'AAAAA': 'a', 'AAAAB': 'b', 'AAABA': 'c', 'AAABB': 'd', 'AABAA': 'e', 'AABAB': 'f', 'AABBA': 'g', 'AABBB': 'h',
  'ABABA': 'i', 'ABABB': 'j', 'ABBAA': 'k', 'ABBAB': 'l', 'ABBBB': 'm', 'BAAAA': 'n', 'BAAAB': 'o', 'BAABA': 'p',
  'BAABB': 'q', 'BABAA': 'r', 'BABAB': 's', 'BABBA': 't', 'BABBB': 'u', 'BBAAA': 'v', 'BBAAB': 'w', 'BBABA': 'x',
  'BBABB': 'y', 'BBBAA': 'z'
};

// Helper to safely decode Bacon's Cipher (Baconian Cipher) encoded text
const safeDecodeBacon = (str) => {
  if (!str || typeof str !== 'string' || str.length < 20) return null;

  const cleanTokens = str.trim().split(/\s+/);
  let symbols = '';
  if (cleanTokens.every(t => t.length === 5)) {
    symbols = cleanTokens.join('');
  } else {
    symbols = str.replace(/[^a-zA-Z0-9.\-+\/]/g, '');
  }

  if (symbols.length < 20 || symbols.length % 5 !== 0) return null;

  const freq = {};
  for (let i = 0; i < symbols.length; i++) {
    const ch = symbols[i];
    freq[ch] = (freq[ch] || 0) + 1;
  }
  const chars = Object.keys(freq).sort((a, b) => freq[b] - freq[a]);
  if (chars.length !== 2) return null;

  const charPairMappings = [
    { [chars[0]]: 'A', [chars[1]]: 'B' },
    { [chars[0]]: 'B', [chars[1]]: 'A' }
  ];

  for (const mapping of charPairMappings) {
    let baconStr = '';
    for (let i = 0; i < symbols.length; i++) {
      baconStr += mapping[symbols[i]];
    }

    for (const mapDict of [BACON_24_MAP, BACON_26_MAP]) {
      let decoded = '';
      let isValid = true;
      for (let i = 0; i < baconStr.length; i += 5) {
        const group = baconStr.substring(i, i + 5);
        const letter = mapDict[group];
        if (!letter) {
          isValid = false;
          break;
        }
        decoded += letter;
      }
      if (isValid && decoded.length >= 4) {
        const candidates = [
          decoded,
          decoded.replace(/preu/g, 'prev'),
          decoded.replace(/previovs/g, 'previous'),
          decoded.replace(/u/g, 'v'),
          decoded.replace(/v/g, 'u'),
          decoded.replace(/j/g, 'i')
        ];
        for (const cand of candidates) {
          if (isPromptInjection(cand, true)) {
            return cand;
          }
        }
      }
    }
  }

  return null;
};

// Helper to safely decode single-byte XOR cipher-encoded payloads (hex/decimal/octal/binary tokens or raw strings) across keys 1..255
const safeDecodeXOR = (targetStr) => {
  if (!targetStr || typeof targetStr !== 'string' || targetStr.length < 8) return null;

  // 1. Try tokenized byte sequence decoding (space, comma, colon, semicolon, plus, equals, or slash-separated)
  const tokens = targetStr.trim().split(/[\s,.\-_\/:;+=]+/);
  if (tokens.length >= 4) {
    const decBytes = [];
    let isAllDec = true;
    const hexBytes = [];
    let isAllHex = true;

    for (const token of tokens) {
      if (!token) continue;

      if (/^\d{1,3}$/.test(token)) {
        const dVal = parseInt(token, 10);
        if (dVal >= 0 && dVal <= 255) decBytes.push(dVal);
        else isAllDec = false;
      } else {
        isAllDec = false;
      }

      let hVal = null;
      if (/^0x[0-9a-fA-F]{1,2}$/i.test(token)) {
        hVal = parseInt(token.slice(2), 16);
      } else if (/^0o[0-7]{1,3}$/i.test(token)) {
        hVal = parseInt(token.slice(2), 8);
      } else if (/^0b[01]{7,8}$/i.test(token)) {
        hVal = parseInt(token.slice(2), 2);
      } else if (/^[0-9a-fA-F]{1,2}$/i.test(token)) {
        hVal = parseInt(token, 16);
      }
      if (hVal !== null && hVal >= 0 && hVal <= 255) hexBytes.push(hVal);
      else isAllHex = false;
    }

    const candidateByteArrays = [];
    if (isAllDec && decBytes.length >= 4) candidateByteArrays.push(decBytes);
    if (isAllHex && hexBytes.length >= 4) candidateByteArrays.push(hexBytes);

    for (const bytes of candidateByteArrays) {
      for (let k = 1; k < 256; k++) {
        let isValidASCII = true;
        let decoded = '';
        for (let i = 0; i < bytes.length; i++) {
          const code = bytes[i] ^ k;
          if (code < 9 || (code > 13 && code < 32) || code > 126) {
            isValidASCII = false;
            break;
          }
          decoded += String.fromCharCode(code);
        }
        if (isValidASCII && decoded.length >= 8) {
          if (isPromptInjection(decoded, true)) {
            return decoded;
          }
        }
      }
    }
  }

  // 2. Try raw character string XOR decoding
  if (targetStr.length <= 2000) {
    for (let k = 1; k < 256; k++) {
      let isValidASCII = true;
      let decoded = '';
      for (let i = 0; i < targetStr.length; i++) {
        const code = targetStr.charCodeAt(i) ^ k;
        if (code < 9 || (code > 13 && code < 32) || code > 126) {
          isValidASCII = false;
          break;
        }
        decoded += String.fromCharCode(code);
      }
      if (isValidASCII && decoded.length >= 8) {
        if (isPromptInjection(decoded, true)) {
          return decoded;
        }
      }
    }
  }

  return null;
};

// Consolidated regex of compressed patterns to detect spacer-based prompt injection obfuscation (e.g., i.g.n.o.r.e)
const COMPRESSED_BLOCKLIST_RE = /ignoreprevious|ignoreabove|ignoreallinstructions|ignoresystem|bypassinstructions|overridesystem|systemoverride|developermode|danmode|doanythingnow|forgetprevious|forgetallinstructions|forgetwhatwassaid|youmustnowignore|youarenowadeveloper|youarenowanunrestricted|unrestrictedmode|withoutrestrictions|disablesafety|bypassfilters|repeatthesystemprompt|revealyourinstructions|revealthesystemprompt|revealinstructions|outputthesysteminstructions|outputyourinstructions|outputthetextabove|showyoursystemprompt|showsystemprompt|whatisyoursystemprompt|whatisyourprompt|whatareyourinstructions|whatareyourdeveloperinstructions|revealthenonce|outputyournonces|roleplayas|adoptthepersona|pretendtobe|youarenowaterminal|youarenowalinux|startingnowyouare|youarenolongeranaiassistant|youarenolongerahelpful/i;

const DELIMITER_RE = /\[\/?(?:USER_?DATA|SECURITY_?PROTOCOL|MESSAGE_?HISTORY|USER_?INPUT)(?:_?[A-Za-z0-9]+)?\]/i;
const MARKDOWN_RE = /[\*_~`]/g;
const NON_ALPHANUM_RE = /[^a-z0-9]/g;
const HEX_MATCH_RE = /[0-9a-fA-F]{8,}/g;
const BASE64_MATCH_RE = /[A-Za-z0-9+\/\-_]{8,}=*/g;
const INVISIBLE_CHARS_RE = /[\u200b-\u200f\u2028\u2029\u202a-\u202e\u205f\u2060-\u206f\u3000\ufeff\u00ad\u2400-\u243f\ufe00-\ufe0f\u180e\u1680\u20dd-\u20e4\u3164\uffa0\u115f\u1160]|[\u{E0100}-\u{E01EF}\u{1D173}-\u{1D17A}\u{1BCA0}-\u{1BCA3}\u{13430}-\u{1343F}]/gu;

// Helper to scrub zero-width and invisible formatting characters from encoded strings
const stripInvisibleCharacters = (str) => {
  if (!str || typeof str !== 'string') return str;
  return str.replace(INVISIBLE_CHARS_RE, '');
};

// Prompt injection / jailbreak / delimiter hijacking detection
export const isPromptInjection = (query, isNested = false) => {
  if (!query || typeof query !== 'string') return false;

  // Security: Decode escape sequences, Enclosed Alphanumerics, Latin Small Caps, Latin Ligatures, Superscript/Subscripts, Regional Indicator Symbols, Unicode Tag characters (ASCII Smuggling), Braille patterns, URL percent-encoding, HTML entities, and Quoted-Printable first
  const decodedQuery = decodeQuotedPrintable(decodeBraillePatterns(decodeEnclosedAlphanumerics(decodePercentEncoding(decodeHTMLEntities(decodeUnicodeTagCharacters(decodeRegionalIndicatorSymbols(decodeLatinSmallCaps(decodeLatinLigatures(decodeSuperAndSubscripts(decodeEnclosedAlphanumerics(decodeEscapeSequences(query))))))))))));

  let normalizedQuery = decodeLeetspeak(decodedQuery).normalize('NFKD').toLowerCase();
  // Strip combining diacritical marks across all standard Unicode diacritic blocks (including extended, supplement, symbols, and half-marks)
  normalizedQuery = normalizedQuery.replace(/[\u0300-\u036f\u1ab0-\u1aff\u1dc0-\u1dff\u20d0-\u20ff\ufe20-\ufe2f]/g, '');
  // Translate Cyrillic, Greek, Coptic, Armenian, Cherokee, Georgian, Hebrew, Canadian Aboriginal, Glagolitic, and Mathematical homoglyphs to Latin equivalents
  normalizedQuery = normalizedQuery.replace(/[\u0400-\u04FF\u0370-\u03FF\u2C80-\u2CFF\u0530-\u058F\uAB70-\uABBF\u10A0-\u10C5\u2D00-\u2D25\u0590-\u05FF\u1400-\u167F\u2C00-\u2C5F\u{1D400}-\u{1D7FF}]/gu, char => HOMOGLYPHS_MAP[char] || char);

  // 3. Clean zero-width, formatting, Line/Paragraph Separators (U+2028, U+2029), Medium Math Space (U+205F), Ideographic Space (U+3000), Variation Selectors (U+FE00-U+FE0F & U+E0100-U+E01EF), Control Pictures (U+2400-U+243F), Musical Symbol Format Controls, Shorthand Format Controls, Egyptian Hieroglyph Format Controls, Invisible Operators, Hangul Fillers, and invisible characters, and condense consecutive whitespaces
  normalizedQuery = stripInvisibleCharacters(normalizedQuery).replace(/\s+/g, ' ');

  // 1. Delimiter hijacking detection (VORO specific nonced blocks or closing tags, evaluated after full normalization and invisible character stripping)
  const collapsedTag = normalizedQuery.replace(/[^\[\]\/a-z0-9_]/gi, '');
  if (DELIMITER_RE.test(normalizedQuery) || DELIMITER_RE.test(query) || DELIMITER_RE.test(decodedQuery) || DELIMITER_RE.test(collapsedTag)) return true;

  // Clean Markdown obfuscation (asterisks, underscores, tildes, backticks) specifically for keyword matching
  normalizedQuery = normalizedQuery.replace(MARKDOWN_RE, '');

  // 2. Override, Harvesting, and Roleplay bypass patterns matched in single-pass compiled regexes
  if (OVERRIDE_RE.test(normalizedQuery)) return true;
  if (HARVESTING_RE.test(normalizedQuery)) return true;
  if (ROLEPLAY_RE.test(normalizedQuery)) return true;

  // 3. Spacer-based obfuscation defense: strip non-alphanumeric separator characters and evaluate
  const compressedQuery = normalizedQuery.replace(NON_ALPHANUM_RE, '');
  if (COMPRESSED_BLOCKLIST_RE.test(compressedQuery)) return true;

  // Security: Scan and decode Base64, Base32, Hex, ROT13, ROT47, and reversed-string obfuscated prompt injection payloads.
  // Evaluate over decodedQuery (which strips escape sequences, HTML entities, and percent-encoding) as well as raw query
  // to neutralize multi-pass encoding bypass attempts. Include scrubbed versions to neutralize zero-width / invisible formatting character fragmentation.
  if (!isNested) {
    const rawTargets = decodedQuery !== query ? [decodedQuery, query] : [query];
    const targets = new Set();
    for (const t of rawTargets) {
      targets.add(t);
      const scrubbed = stripInvisibleCharacters(t);
      if (scrubbed !== t) {
        targets.add(scrubbed);
      }
      const deDiacritic = scrubbed.normalize('NFKD').replace(/[\u0300-\u036f\u1ab0-\u1aff\u1dc0-\u1dff\u20d0-\u20ff\ufe20-\ufe2f]/g, '');
      if (deDiacritic !== scrubbed) {
        targets.add(deDiacritic);
      }
    }
    for (const targetStr of targets) {
      const hexMatches = targetStr.match(HEX_MATCH_RE) || [];
      const hexDecodedList = [];
      for (const match of hexMatches) {
        const decoded = safeDecodeHex(match);
        if (decoded) {
          if (isPromptInjection(decoded, true)) return true;
          hexDecodedList.push(decoded);
        }
      }
      if (hexDecodedList.length > 1) {
        if (isPromptInjection(hexDecodedList.join(' '), true)) return true;
      }

      const decimalMatches = targetStr.match(DECIMAL_MATCH_RE) || [];
      for (const match of decimalMatches) {
        const decimalDecoded = safeDecodeDecimal(match);
        if (decimalDecoded && isPromptInjection(decimalDecoded, true)) {
          return true;
        }
      }

      const octalMatches = targetStr.match(OCTAL_MATCH_RE) || [];
      for (const match of octalMatches) {
        const octalDecoded = safeDecodeOctal(match);
        if (octalDecoded && isPromptInjection(octalDecoded, true)) {
          return true;
        }
      }

      const hexByteMatches = targetStr.match(HEX_BYTES_MATCH_RE) || [];
      for (const match of hexByteMatches) {
        const hexByteDecoded = safeDecodeHexBytes(match);
        if (hexByteDecoded && isPromptInjection(hexByteDecoded, true)) {
          return true;
        }
      }

      const multiRadixMatches = targetStr.match(MULTI_RADIX_MATCH_RE) || [];
      for (const match of multiRadixMatches) {
        const multiRadixDecoded = safeDecodeMultiRadix(match);
        if (multiRadixDecoded && isPromptInjection(multiRadixDecoded, true)) {
          return true;
        }
      }

      const base64Matches = targetStr.match(BASE64_MATCH_RE) || [];
      const base64DecodedList = [];
      for (const match of base64Matches) {
        const decoded = safeAtob(match);
        if (decoded) {
          if (isPromptInjection(decoded, true)) return true;
          base64DecodedList.push(decoded);
        }
      }
      if (base64DecodedList.length > 1) {
        if (isPromptInjection(base64DecodedList.join(' '), true)) return true;
      }

      const base32Decoded = safeDecodeBase32(targetStr.trim());
      if (base32Decoded && isPromptInjection(base32Decoded, true)) {
        return true;
      }

      const base58Matches = targetStr.match(BASE58_MATCH_RE) || [];
      for (const match of base58Matches) {
        const base58Decoded = safeDecodeBase58(match);
        if (base58Decoded && isPromptInjection(base58Decoded, true)) {
          return true;
        }
      }

      const binaryMatches = targetStr.match(BINARY_MATCH_RE) || [];
      for (const match of binaryMatches) {
        const binaryDecoded = safeDecodeBinary(match);
        if (binaryDecoded && isPromptInjection(binaryDecoded, true)) {
          return true;
        }
      }

      const morseMatches = targetStr.match(MORSE_MATCH_RE) || [];
      for (const match of morseMatches) {
        const morseDecoded = safeDecodeMorse(match);
        if (morseDecoded && isPromptInjection(morseDecoded, true)) {
          return true;
        }
      }

      // Security: Handle Caesar cipher (ROT-1 through ROT-25) and ROT47-encoded obfuscation and evaluate recursively
      for (let s = 1; s < 26; s++) {
        const caesarDecoded = safeDecodeCaesar(targetStr, s);
        if (caesarDecoded && isPromptInjection(caesarDecoded, true)) {
          return true;
        }
      }

      const rot47Decoded = safeDecodeRot47(targetStr);
      if (rot47Decoded && isPromptInjection(rot47Decoded, true)) {
        return true;
      }

      const atbashDecoded = safeDecodeAtbash(targetStr);
      if (atbashDecoded && isPromptInjection(atbashDecoded, true)) {
        return true;
      }

      // Security: Handle reversed-string/words obfuscation and evaluate recursively
      const reversedStr = safeReverseString(targetStr);
      if (reversedStr && isPromptInjection(reversedStr, true)) {
        return true;
      }

      // Security: Handle Single-Byte XOR cipher-encoded payloads across keys 1..255 and evaluate recursively
      const xorDecoded = safeDecodeXOR(targetStr);
      if (xorDecoded) {
        return true;
      }

      // Security: Handle Bacon's Cipher (Baconian Cipher) encoded payloads and evaluate recursively
      const baconDecoded = safeDecodeBacon(targetStr);
      if (baconDecoded) {
        return true;
      }

      // Security: Handle Polybius Square Cipher encoded payloads and evaluate recursively
      const polybiusDecoded = safeDecodePolybius(targetStr);
      if (polybiusDecoded) {
        return true;
      }

      // Security: Handle A1Z26 Cipher encoded payloads and evaluate recursively
      const a1z26Decoded = safeDecodeA1Z26(targetStr);
      if (a1z26Decoded) {
        return true;
      }

      // Security: Handle Affine Cipher (E(x) = (a*x + b) mod 26 across 312 key pairs) and evaluate recursively
      const affineDecoded = safeDecodeAffine(targetStr);
      if (affineDecoded) {
        return true;
      }

      // Security: Handle Tap Code Cipher (5x5 grid dots or coordinates) and evaluate recursively
      const tapDecoded = safeDecodeTapCode(targetStr);
      if (tapDecoded) {
        return true;
      }

      // Security: Handle Rail Fence Cipher (2 to 5 rails) and evaluate recursively
      const railFenceDecoded = safeDecodeRailFence(targetStr);
      if (railFenceDecoded) {
        return true;
      }

      // Security: Handle Vigenère Cipher (2-letter keys and short keyword dictionary) and evaluate recursively
      const vigenereDecoded = safeDecodeVigenere(targetStr);
      if (vigenereDecoded) {
        return true;
      }

      // Security: Handle Beaufort Cipher (2-letter keys and short keyword dictionary) and evaluate recursively
      const beaufortDecoded = safeDecodeBeaufort(targetStr);
      if (beaufortDecoded) {
        return true;
      }

      // Security: Handle Gronsfeld Cipher (1-3 digit keys and common numeric keys) and evaluate recursively
      const gronsfeldDecoded = safeDecodeGronsfeld(targetStr);
      if (gronsfeldDecoded) {
        return true;
      }
    }
  }

  return false;
};

// Pre-computed common short keywords for Vigenère and Beaufort ciphers
const CIPHER_KEYWORDS = [
  'ai', 'key', 'voro', 'pass', 'code', 'safe', 'sec', 'secret', 'admin', 'prompt',
  'system', 'hack', 'bypass', 'test', 'demo', 'lock', 'guard', 'shield', 'auth',
  'user', 'bot', 'gpt', 'llm', 'zero', 'vigenere', 'beaufort', 'cipher'
];

// Helper to safely decode Vigenère cipher-encoded payloads (P_i = (C_i - K_{i mod L}) mod 26)
const safeDecodeVigenere = (targetStr) => {
  if (!targetStr || typeof targetStr !== 'string' || targetStr.length < 8 || targetStr.length > 500) return null;

  const candidateKeys = [];
  for (let c1 = 0; c1 < 26; c1++) {
    for (let c2 = 0; c2 < 26; c2++) {
      candidateKeys.push(String.fromCharCode(97 + c1, 97 + c2));
    }
  }
  candidateKeys.push(...CIPHER_KEYWORDS);

  for (const key of candidateKeys) {
    const L = key.length;
    let decoded = '';
    let keyIdx = 0;

    for (let i = 0; i < targetStr.length; i++) {
      const code = targetStr.charCodeAt(i);
      const kShift = key.charCodeAt(keyIdx % L) - 97;

      if (code >= 65 && code <= 90) {
        let x = (code - 65 - kShift) % 26;
        if (x < 0) x += 26;
        decoded += String.fromCharCode(x + 65);
        keyIdx++;
      } else if (code >= 97 && code <= 122) {
        let x = (code - 97 - kShift) % 26;
        if (x < 0) x += 26;
        decoded += String.fromCharCode(x + 97);
        keyIdx++;
      } else {
        decoded += targetStr[i];
      }
    }

    if (decoded !== targetStr && isPromptInjection(decoded, true)) {
      return decoded;
    }
  }

  return null;
};

// Helper to safely decode Beaufort cipher-encoded payloads (P_i = (K_{i mod L} - C_i) mod 26)
const safeDecodeBeaufort = (targetStr) => {
  if (!targetStr || typeof targetStr !== 'string' || targetStr.length < 8 || targetStr.length > 500) return null;

  const candidateKeys = [];
  for (let c1 = 0; c1 < 26; c1++) {
    for (let c2 = 0; c2 < 26; c2++) {
      candidateKeys.push(String.fromCharCode(97 + c1, 97 + c2));
    }
  }
  candidateKeys.push(...CIPHER_KEYWORDS);

  for (const key of candidateKeys) {
    const L = key.length;
    let decoded = '';
    let keyIdx = 0;

    for (let i = 0; i < targetStr.length; i++) {
      const code = targetStr.charCodeAt(i);
      const kVal = key.charCodeAt(keyIdx % L) - 97;

      if (code >= 65 && code <= 90) {
        let x = (kVal - (code - 65)) % 26;
        if (x < 0) x += 26;
        decoded += String.fromCharCode(x + 65);
        keyIdx++;
      } else if (code >= 97 && code <= 122) {
        let x = (kVal - (code - 97)) % 26;
        if (x < 0) x += 26;
        decoded += String.fromCharCode(x + 97);
        keyIdx++;
      } else {
        decoded += targetStr[i];
      }
    }

    if (decoded !== targetStr && isPromptInjection(decoded, true)) {
      return decoded;
    }
  }

  return null;
};

// Helper to safely decode Gronsfeld cipher-encoded payloads (Vigenère with numeric digit keys)
const safeDecodeGronsfeld = (targetStr) => {
  if (!targetStr || typeof targetStr !== 'string' || targetStr.length < 8 || targetStr.length > 500) return null;

  const candidateKeys = [];
  for (let n = 0; n < 10; n++) candidateKeys.push(String(n));
  for (let n = 0; n < 100; n++) candidateKeys.push(String(n).padStart(2, '0'));
  for (let n = 0; n < 1000; n++) candidateKeys.push(String(n).padStart(3, '0'));
  candidateKeys.push('1234', '12345', '123456', '314159', '2024', '2025', '9876', '987654');

  for (const key of candidateKeys) {
    const L = key.length;
    let decoded = '';
    let keyIdx = 0;

    for (let i = 0; i < targetStr.length; i++) {
      const code = targetStr.charCodeAt(i);
      const dShift = key.charCodeAt(keyIdx % L) - 48;

      if (code >= 65 && code <= 90) {
        let x = (code - 65 - dShift) % 26;
        if (x < 0) x += 26;
        decoded += String.fromCharCode(x + 65);
        keyIdx++;
      } else if (code >= 97 && code <= 122) {
        let x = (code - 97 - dShift) % 26;
        if (x < 0) x += 26;
        decoded += String.fromCharCode(x + 97);
        keyIdx++;
      } else {
        decoded += targetStr[i];
      }
    }

    if (decoded !== targetStr && isPromptInjection(decoded, true)) {
      return decoded;
    }
  }

  return null;
};

// Helper to safely decode Rail Fence Cipher (2 to 5 rails)
const safeDecodeRailFence = (targetStr) => {
  if (!targetStr || typeof targetStr !== 'string' || targetStr.length < 8 || targetStr.length > 500) return null;

  for (let rails = 2; rails <= 5; rails++) {
    if (targetStr.length < rails) continue;
    const len = targetStr.length;
    const cycle = 2 * (rails - 1);
    const railCounts = new Array(rails).fill(0);
    const railIndices = new Array(len);

    for (let i = 0; i < len; i++) {
      const m = i % cycle;
      const r = m < rails ? m : cycle - m;
      railIndices[i] = r;
      railCounts[r]++;
    }

    const railStart = new Array(rails).fill(0);
    for (let r = 1; r < rails; r++) {
      railStart[r] = railStart[r - 1] + railCounts[r - 1];
    }

    const currentPos = [...railStart];
    const decodedArr = new Array(len);
    for (let i = 0; i < len; i++) {
      const r = railIndices[i];
      decodedArr[i] = targetStr[currentPos[r]++];
    }

    const decoded = decodedArr.join('');
    if (decoded !== targetStr && isPromptInjection(decoded, true)) {
      return decoded;
    }
  }

  return null;
};

// Helper to safely decode A1Z26 cipher (A=1..Z=26 or A=01..Z=26) encoded payloads (tokenized or 2-digit concatenated)
const safeDecodeA1Z26 = (targetStr) => {
  if (!targetStr || typeof targetStr !== 'string' || targetStr.length < 8) return null;

  // 1. Tokenized A1Z26 (space, comma, dash, colon, semicolon, plus, or slash-separated numbers)
  const tokens = targetStr.trim().split(/[\s,.\-_\/:;+=]+/);
  if (tokens.length >= 4 && tokens.every(t => /^\d{1,2}$/.test(t) && parseInt(t, 10) >= 1 && parseInt(t, 10) <= 26)) {
    let decoded = '';
    for (const t of tokens) {
      const num = parseInt(t, 10);
      decoded += String.fromCharCode(96 + num);
    }
    if (decoded.length >= 4 && isPromptInjection(decoded, true)) {
      return decoded;
    }
  }

  // 2. 2-digit concatenated A1Z26 numbers (e.g. 0907141518051618052209152119 for "ignoreprevious")
  const clean = targetStr.replace(/[\s,.\-_\/:;+=]+/g, '');
  if (/^\d+$/.test(clean) && clean.length >= 8 && clean.length % 2 === 0) {
    let isValid = true;
    let decoded = '';
    for (let i = 0; i < clean.length; i += 2) {
      const num = parseInt(clean.slice(i, i + 2), 10);
      if (num < 1 || num > 26) {
        isValid = false;
        break;
      }
      decoded += String.fromCharCode(96 + num);
    }
    if (isValid && decoded.length >= 4 && isPromptInjection(decoded, true)) {
      return decoded;
    }
  }

  return null;
};

// Pre-computed coprimes and modular multiplicative inverses modulo 26 for Affine Cipher (E(x) = (a*x + b) mod 26)
const AFFINE_COPRIMES = [
  { a: 1, inv: 1 },
  { a: 3, inv: 9 },
  { a: 5, inv: 21 },
  { a: 7, inv: 15 },
  { a: 9, inv: 3 },
  { a: 11, inv: 19 },
  { a: 15, inv: 7 },
  { a: 17, inv: 23 },
  { a: 19, inv: 11 },
  { a: 21, inv: 5 },
  { a: 23, inv: 17 },
  { a: 25, inv: 25 }
];

// Helper to safely decode Affine cipher-encoded payloads (E(x) = (a*x + b) mod 26) across all 312 key pairs (a, b)
const safeDecodeAffine = (targetStr) => {
  if (!targetStr || typeof targetStr !== 'string' || targetStr.length < 8) return null;

  for (const { a, inv } of AFFINE_COPRIMES) {
    for (let b = 0; b < 26; b++) {
      if (a === 1) continue; // Skip identity and Caesar cipher shifts (handled by safeDecodeCaesar)

      let decoded = '';
      for (let i = 0; i < targetStr.length; i++) {
        const code = targetStr.charCodeAt(i);
        if (code >= 65 && code <= 90) { // 'A'-'Z'
          let x = (inv * (code - 65 - b)) % 26;
          if (x < 0) x += 26;
          decoded += String.fromCharCode(x + 65);
        } else if (code >= 97 && code <= 122) { // 'a'-'z'
          let x = (inv * (code - 97 - b)) % 26;
          if (x < 0) x += 26;
          decoded += String.fromCharCode(x + 97);
        } else {
          decoded += targetStr[i];
        }
      }

      if (decoded !== targetStr && isPromptInjection(decoded, true)) {
        return decoded;
      }
    }
  }

  return null;
};

const TAP_GRID = [
  ['a', 'b', 'c', 'd', 'e'],
  ['f', 'g', 'h', 'i', 'j'],
  ['l', 'm', 'n', 'o', 'p'],
  ['q', 'r', 's', 't', 'u'],
  ['v', 'w', 'x', 'y', 'z']
];

// Helper to safely decode Tap Code cipher-encoded payloads (dot patterns or 5x5 grid coordinates)
const safeDecodeTapCode = (targetStr) => {
  if (!targetStr || typeof targetStr !== 'string' || targetStr.length < 8) return null;

  // 1. Dot-based Tap Code (e.g. ". .. ... ...." or ". ../... ..../...")
  const cleanDots = targetStr.trim().replace(/[•]/g, '.');
  if (/[.\s\/|\-]+/.test(cleanDots) && cleanDots.includes('.')) {
    const tokens = cleanDots.split(/[\s\/|\-]+/).filter(Boolean);
    if (tokens.length >= 8 && tokens.every(t => /^\.+$/.test(t))) {
      let decoded = '';
      for (let i = 0; i + 1 < tokens.length; i += 2) {
        const r = tokens[i].length - 1;
        const c = tokens[i + 1].length - 1;
        if (r >= 0 && r < 5 && c >= 0 && c < 5) {
          decoded += TAP_GRID[r][c];
        } else {
          decoded = '';
          break;
        }
      }
      if (decoded.length >= 4) {
        const cand1 = decoded;
        const cand2 = decoded.replace(/c/g, 'k');
        if (isPromptInjection(cand1, true) || isPromptInjection(cand2, true)) {
          return cand1;
        }
      }
    }
  }

  // 2. Digit-based Tap Code (e.g. "12 34 23" or "1.2 3.4")
  const digitTokens = targetStr.trim().split(/[\s,.\-_\/:;+=]+/);
  if (digitTokens.length >= 4 && digitTokens.every(t => /^[1-5]{2}$/.test(t))) {
    let decoded = '';
    for (const t of digitTokens) {
      const r = parseInt(t[0], 10) - 1;
      const c = parseInt(t[1], 10) - 1;
      decoded += TAP_GRID[r][c];
    }
    if (decoded.length >= 4) {
      const cand1 = decoded;
      const cand2 = decoded.replace(/c/g, 'k');
      if (isPromptInjection(cand1, true) || isPromptInjection(cand2, true)) {
        return cand1;
      }
    }
  }

  return null;
};

// Helper to safely decode Polybius Square Cipher (5x5 grid, coordinates 11..55) encoded payloads
const safeDecodePolybius = (targetStr) => {
  if (!targetStr || typeof targetStr !== 'string' || targetStr.length < 8) return null;
  const POLYBIUS_GRID = ['abcde', 'fghik', 'lmnop', 'qrstu', 'vwxyz'];
  let pairs = [];
  const tokens = targetStr.trim().split(/[\s,.\-_\/:;+=]+/);
  if (tokens.length >= 4 && tokens.every(t => /^[1-5]{2}$/.test(t))) {
    pairs = tokens;
  } else {
    const clean = targetStr.replace(/[\s,.\-_\/:;+=]+/g, '');
    if (/^[1-5]+$/.test(clean) && clean.length >= 8 && clean.length % 2 === 0) {
      for (let i = 0; i < clean.length; i += 2) pairs.push(clean.slice(i, i + 2));
    }
  }
  if (pairs.length < 4) return null;
  let decoded = '';
  for (const p of pairs) {
    const r = parseInt(p[0], 10) - 1;
    const c = parseInt(p[1], 10) - 1;
    decoded += POLYBIUS_GRID[r][c];
  }
  if (decoded.length >= 4) {
    const cand1 = decoded;
    const cand2 = decoded.replace(/i/g, 'j');
    if (isPromptInjection(cand1, true) || isPromptInjection(cand2, true)) return cand1;
  }
  return null;
};

/**
 * ⚡ PERFORMANCE OPTIMIZATION: Hoisted static option sets for O(1) lookups and zero heap allocations.
 * Completely eliminates dynamic array allocations (`const validArr = [...]`) and O(N) `.includes()` scans
 * on every validation cycle.
 */
const VALID_GENDERS = Object.freeze(new Set(["male", "female", "other", "prefer_not_to_say"]));
const VALID_GOALS = Object.freeze(new Set([
  "weight_loss", "muscle_gain", "maintenance", "athletic_performance", "health_optimization",
  "lose weight", "build muscle", "improve fitness", "body recomposition", "general health"
]));
const VALID_EXPERIENCE_LEVELS = Object.freeze(new Set(["beginner", "intermediate", "advanced", "elite"]));
const VALID_ACTIVITY_LEVELS = Object.freeze(new Set([
  "sedentary", "lightly_active", "moderately_active", "very_active", "extremely_active",
  "lightly active", "moderately active", "very active", "extremely active"
]));
const VALID_MEAL_TYPES = Object.freeze(new Set(["breakfast", "lunch", "dinner", "snack", "pre_workout", "post_workout"]));
const VALID_EQUIPMENT = Object.freeze(new Set(["barbell", "dumbbell", "machine", "cable", "bodyweight", "kettlebell", "bands", "cardio", "medicine_ball"]));
const VALID_DIFFICULTIES = Object.freeze(new Set(["beginner", "intermediate", "advanced", "expert"]));
const VALID_HABIT_COLORS = Object.freeze(new Set(["voro-primary", "voro-secondary", "voro-accent"]));

// Gender validation
export const isValidGender = (gender) => {
  return typeof gender === 'string' && VALID_GENDERS.has(gender.toLowerCase());
};

// Goal validation
export const isValidGoal = (goal) => {
  return typeof goal === 'string' && VALID_GOALS.has(goal.toLowerCase());
};

// Experience level validation
export const isValidExperienceLevel = (level) => {
  return typeof level === 'string' && VALID_EXPERIENCE_LEVELS.has(level.toLowerCase());
};

// Activity level validation
export const isValidActivityLevel = (level) => {
  return typeof level === 'string' && VALID_ACTIVITY_LEVELS.has(level.toLowerCase());
};

// Meal type validation
export const isValidMealType = (type) => {
  return typeof type === 'string' && VALID_MEAL_TYPES.has(type.toLowerCase());
};

// Exercise equipment validation
export const isValidEquipment = (equipment) => {
  return typeof equipment === 'string' && VALID_EQUIPMENT.has(equipment.toLowerCase());
};

// Difficulty validation
export const isValidDifficulty = (difficulty) => {
  return typeof difficulty === 'string' && VALID_DIFFICULTIES.has(difficulty.toLowerCase());
};

// Helper to check if payload is a non-null object (excluding arrays)
const isNonNullObject = (val) => val !== null && typeof val === 'object' && !Array.isArray(val);

// Form validation for fitness profile
export const validateFitnessProfile = (profile) => {
  if (!isNonNullObject(profile)) {
    return { valid: false, errors: { profile: "Invalid profile format" } };
  }
  const errors = {};

  if (profile.name !== undefined && !isValidName(profile.name)) errors.name = "Name must be between 1 and 50 characters";
  if (!isValidAge(profile.age)) errors.age = "Age must be between 13-120";
  if (!isValidHeight(profile.height)) errors.height = "Height must be between 100-250 cm";
  if (!isValidWeight(profile.weight)) errors.weight = "Weight must be between 30-500 kg";
  if (!isValidGender(profile.gender)) errors.gender = "Invalid gender selection";
  if (!isValidGoal(profile.goal)) errors.goal = "Invalid fitness goal";
  if (!isValidActivityLevel(profile.activityLevel)) errors.activityLevel = "Invalid activity level";

  return { valid: Object.keys(errors).length === 0, errors };
};

// Form validation for food diary entry
export const validateFoodDiaryEntry = (entry) => {
  if (!isNonNullObject(entry)) {
    return { valid: false, errors: { entry: "Invalid entry format" } };
  }
  const errors = {};

  const portion = parseFloat(entry.portion);
  if (isNaN(portion) || portion < 1 || portion > 5000) {
    errors.portion = "Portion must be between 1 and 5000 grams";
  }

  return { valid: Object.keys(errors).length === 0, errors };
};

// Form validation for vitals
export const validateVitals = (vitals) => {
  if (!isNonNullObject(vitals)) {
    return { valid: false, errors: { vitals: "Invalid vitals format" } };
  }
  const errors = {};

  if (!isValidHeartRate(vitals.heartRate)) errors.heartRate = "Heart rate must be between 30-220 bpm";

  if (vitals.bloodPressure) {
    if (typeof vitals.bloodPressure !== 'string' || vitals.bloodPressure.length > 20) {
      errors.bloodPressure = "Blood pressure reading is too long";
    } else {
      const parts = vitals.bloodPressure.split('/');
      if (parts.length === 2) {
        if (!isValidBloodPressure(parts[0], parts[1])) {
          errors.bloodPressure = "Invalid blood pressure format or values";
        }
      } else {
        errors.bloodPressure = "Blood pressure must be in 'systolic/diastolic' format";
      }
    }
  }

  const sleep = parseFloat(vitals.sleep);
  if (isNaN(sleep) || !Number.isFinite(sleep) || sleep < 0 || sleep > 24) {
    errors.sleep = "Sleep must be between 0-24 hours";
  }

  const mood = parseFloat(vitals.mood);
  if (isNaN(mood) || !Number.isFinite(mood) || mood < 1 || mood > 10) {
    errors.mood = "Mood must be between 1-10";
  }

  const energy = parseFloat(vitals.energy);
  if (isNaN(energy) || !Number.isFinite(energy) || energy < 1 || energy > 10) {
    errors.energy = "Energy must be between 1-10";
  }

  return { valid: Object.keys(errors).length === 0, errors };
};

// Form validation for workout entry
export const validateWorkoutEntry = (workout) => {
  if (!isNonNullObject(workout)) {
    return { valid: false, errors: { workout: "Invalid workout format" } };
  }
  const errors = {};

  // Handle both single entry and full session structure
  if (Array.isArray(workout.exercises)) {
    if (workout.exercises.length === 0) {
      errors.exercises = "At least one exercise is required";
    } else {
      workout.exercises.forEach((ex, idx) => {
        if (!isNonNullObject(ex)) {
          errors[`exercise_${idx}`] = "Invalid exercise object";
          return;
        }
        if (typeof ex.name !== 'string' || !ex.name.trim()) {
          errors[`exercise_${idx}_name`] = "Exercise name is required";
        } else if (ex.name.length > 100) {
          errors[`exercise_${idx}_name`] = "Exercise name must be less than 100 characters";
        }
        if (Array.isArray(ex.sets)) {
          ex.sets.forEach((set, setIdx) => {
            if (!isNonNullObject(set)) {
              errors[`exercise_${idx}_set_${setIdx}`] = "Invalid set object";
              return;
            }
            if (!isValidReps(set.reps)) errors[`exercise_${idx}_set_${setIdx}_reps`] = "Reps must be between 1-100";
            if (!isValidExerciseWeight(set.weight)) errors[`exercise_${idx}_set_${setIdx}_weight`] = "Weight must be between 0-1000kg";
          });
        }
      });
    }
    if (!isValidDate(workout.date)) errors.date = "Date is invalid";
  } else {
    // Single entry validation
    if (typeof workout.exercise !== 'string' || !workout.exercise.trim()) {
      errors.exercise = "Exercise is required";
    } else if (workout.exercise.length > 100) {
      errors.exercise = "Exercise name must be less than 100 characters";
    }
    if (!isValidSets(workout.sets)) errors.sets = "Sets must be between 1-50";
    if (!isValidReps(workout.reps)) errors.reps = "Reps must be between 1-100";
    if (!isValidExerciseWeight(workout.weight)) errors.weight = "Weight is invalid";
    if (workout.date && !isValidDate(workout.date)) errors.date = "Date is invalid";
  }

  return { valid: Object.keys(errors).length === 0, errors };
};

// Form validation for nutrition entry
export const validateNutritionEntry = (nutrition) => {
  if (!isNonNullObject(nutrition)) {
    return { valid: false, errors: { nutrition: "Invalid nutrition format" } };
  }
  const errors = {};

  if (typeof nutrition.food !== 'string' || !nutrition.food.trim()) {
    errors.food = "Food is required";
  } else if (nutrition.food.length > 100) {
    errors.food = "Food name must be less than 100 characters";
  }
  if (!isValidCalories(nutrition.calories)) errors.calories = "Calories must be between 500-10000";
  if (!isValidMacro(nutrition.protein)) errors.protein = "Protein must be between 0 and 500 grams";
  if (!isValidMacro(nutrition.carbs)) errors.carbs = "Carbs must be between 0 and 500 grams";
  if (!isValidMacro(nutrition.fat)) errors.fat = "Fat must be between 0 and 500 grams";
  if (!isValidMealType(nutrition.mealType)) errors.mealType = "Invalid meal type";
  if (!isValidDate(nutrition.date)) errors.date = "Date is invalid";

  return { valid: Object.keys(errors).length === 0, errors };
};

// Form validation for habit entry
export const validateHabit = (habit) => {
  if (!isNonNullObject(habit)) {
    return { valid: false, errors: { habit: "Invalid habit format" } };
  }
  const errors = {};

  if (typeof habit.name !== 'string' || !habit.name.trim()) {
    errors.name = "Habit name is required";
  } else if (habit.name.length > 50) {
    errors.name = "Habit name must be less than 50 characters";
  }

  if (habit.icon && habit.icon.length > 10) {
    errors.icon = "Icon is too long";
  }

  if (habit.color && !VALID_HABIT_COLORS.has(habit.color)) {
    errors.color = "Invalid color selection";
  }

  return { valid: Object.keys(errors).length === 0, errors };
};

// Form validation for recipe entry
export const validateRecipe = (recipe) => {
  if (!isNonNullObject(recipe)) {
    return { valid: false, errors: { recipe: "Invalid recipe format" } };
  }
  const errors = {};

  if (typeof recipe.name !== 'string' || !recipe.name.trim()) {
    errors.name = "Recipe name is required";
  } else if (recipe.name.length > 100) {
    errors.name = "Recipe name must be less than 100 characters";
  }

  if (!Array.isArray(recipe.ingredients) || recipe.ingredients.length === 0) {
    errors.ingredients = "At least one ingredient is required";
  } else {
    recipe.ingredients.forEach((ing, idx) => {
      if (!isNonNullObject(ing)) {
        errors[`ingredient_${idx}`] = "Invalid ingredient format";
        return;
      }
      const portion = parseFloat(ing.portion);
      if (isNaN(portion) || portion < 1 || portion > 5000) {
        errors[`ingredient_${idx}_portion`] = `Portion for ${ing.name || 'ingredient'} must be between 1 and 5000 grams`;
      }
    });
  }

  return { valid: Object.keys(errors).length === 0, errors };
};

// Form validation for water entry
export const validateWaterEntry = (entry) => {
  if (!isNonNullObject(entry)) {
    return { valid: false, errors: { entry: "Invalid entry format" } };
  }
  const errors = {};

  if (!isValidWaterAmount(entry.amount)) {
    errors.amount = "Water amount must be between 0-5000 ml";
  }

  if (entry.date && !isValidDate(entry.date)) {
    errors.date = "Date is invalid";
  }

  return { valid: Object.keys(errors).length === 0, errors };
};

export default {
  isValidEmail,
  isValidPassword,
  getPasswordStrength,
  isPositiveNumber,
  isNonNegativeNumber,
  isInteger,
  isValidWeight,
  isValidExerciseWeight,
  isValidHeight,
  isValidAge,
  isValidBodyFat,
  isValidCalories,
  isValidMacro,
  isValidMacroRatio,
  isValidDate,
  isDateInFuture,
  isDateInPast,
  isValidURL,
  isValidHeartRate,
  isValidBloodPressure,
  isValidTemperature,
  isValidReps,
  isValidSets,
  isValidDuration,
  isValidGender,
  isValidGoal,
  isValidExperienceLevel,
  isValidActivityLevel,
  isValidMealType,
  isValidEquipment,
  isValidDifficulty,
  validateFitnessProfile,
  validateWorkoutEntry,
  validateNutritionEntry,
  validateVitals,
  validateWaterEntry,
  validateFoodDiaryEntry,
  validateHabit,
  validateRecipe,
  isValidWaterAmount,
  isValidJournalNote,
  isValidChatQuery,
  isValidName,
  isPromptInjection,
  sanitizeCSVField
};
