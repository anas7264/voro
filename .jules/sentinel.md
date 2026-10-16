## 2026-10-16 - Base32 Substring Extraction in Prompt Injection Shields

**Vulnerability:**
Prompt injection filters that evaluate whole-string decoders for Base32 variants (Base32, Base32hex, Z-base-32, Crockford Base32) fail when encoded payloads are embedded within natural language sentences (e.g., `"My goal is NFTW433SMUQHA4TFOZUW65LT and build muscle"`). Because whole-string format regexes requiring exact match (`^[A-Z2-7=]+$`) reject strings with spaces or surrounding words, candidate extraction is bypassed, allowing the obfuscated prompt override instructions to reach downstream LLMs.

**Learning:**
Extracting candidate substrings with bounded word-boundary regexes (`/\b[A-Z2-7=]{12,}\b/g`, `/\b[0-9A-V=]{12,}\b/g`, `/\b[ybndrfg8ejkmcpqxot1uwisza345h769=]{12,}\b/g`, `/\b[0-9A-Z\-]{12,}\b/g`) enables deep decoding of embedded Base32-variant payloads without re-evaluating short English words (preventing CPU overhead).

**Prevention:**
Always use minimum-length bounded word extraction regexes (e.g. `{12,}`) for base-encodings in input validators to catch embedded substring payloads while avoiding false positives and performance penalties on standard text inputs.
