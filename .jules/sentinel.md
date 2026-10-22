## 2026-10-16 - Base32 Substring Extraction in Prompt Injection Shields

**Vulnerability:**
Prompt injection filters that evaluate whole-string decoders for Base32 variants (Base32, Base32hex, Z-base-32, Crockford Base32) fail when encoded payloads are embedded within natural language sentences (e.g., `"My goal is NFTW433SMUQHA4TFOZUW65LT and build muscle"`). Because whole-string format regexes requiring exact match (`^[A-Z2-7=]+$`) reject strings with spaces or surrounding words, candidate extraction is bypassed, allowing the obfuscated prompt override instructions to reach downstream LLMs.

**Learning:**
Extracting candidate substrings with bounded word-boundary regexes (`/\b[A-Z2-7=]{12,}\b/g`, `/\b[0-9A-V=]{12,}\b/g`, `/\b[ybndrfg8ejkmcpqxot1uwisza345h769=]{12,}\b/g`, `/\b[0-9A-Z\-]{12,}\b/g`) enables deep decoding of embedded Base32-variant payloads without re-evaluating short English words (preventing CPU overhead).

**Prevention:**
Always use minimum-length bounded word extraction regexes (e.g. `{12,}`) for base-encodings in input validators to catch embedded substring payloads while avoiding false positives and performance penalties on standard text inputs.

## 2026-10-18 - Wildcard DNS and Internal TLD Bypasses in Client-Side SSRF Validators

**Vulnerability:**
URL validators relying exclusively on raw IP regex matching (`INTERNAL_IP_RE`, `INTERNAL_IPV6_RE`) fail to detect Server-Side Request Forgery (SSRF) and private network probe vectors targeting public wildcard DNS resolution services (`nip.io`, `sslip.io`, `xip.io`) or unroutable/internal TLDs (`.local`, `.internal`, `.lan`, `.home.arpa`). For instance, `http://127.0.0.1.nip.io` or `http://169.254.169.254.sslip.io` resolves directly to loopback or cloud metadata IPs, bypassing standard IPv4/IPv6 address regexes.

**Learning:**
Matching domain endings against known wildcard DNS rebinders and reserved internal TLDs via a dedicated regex (`INTERNAL_TLD_RE = /(?:^|\.)(?:localhost|local|internal|lan|home\.arpa|nip\.io|sslip\.io|xip\.io)$/i`) blocks domain-name based SSRF bypass vectors before URL resolution or fetching occurs.

**Prevention:**
Always pair explicit IP range checks with domain TLD/wildcard DNS blacklisting in URL validation functions (`isValidURL`).

## 2026-10-20 - Fast-Path Marker Regex Omissions in Multi-Decoder Validators

**Vulnerability:**
Fast-path optimization guards (`ENCODING_MARKERS_RE = /[&%\\]|[^\x00-\x7F]/`) designed to bypass multi-pass decoding pipelines for plain ASCII text fail when an encoding scheme uses standard printable ASCII symbols not present in the marker set. Quoted-Printable encodings reliance on `=XX` hex escapes allows ASCII payloads like `ig=0A=6E=6F=72=65 =70=72=65=76=69=6F=75=73...` to fail the fast-path check, completely bypassing `decodeQuotedPrintable` inspection.

**Learning:**
Fast-path pre-filters must include all delimiter and marker symbols (`=`, `%`, `&`, `\`, `+`, `-`, `/`, `<~`, `0x`, `0b`, `0o`) utilized by downstream decoders in the validation pipeline.

**Prevention:**
Ensure fast-path regex guards cover all encoding indicators, or test fast-path guards against test vectors for every active decoder in the validation suite.
