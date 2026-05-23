## 2025-05-14 - [Input Validation for Profile Persistence]
**Vulnerability:** Lack of server-side (or pre-storage) validation for physical and health metrics allowed potentially malicious or malformed data to be persisted to localStorage and used in downstream health calculations (BMI, TDEE).
**Learning:** React components often lack defensive validation when interacting with custom storage abstractions, assuming the UI controls already constrain the input.
**Prevention:** Centralize validation logic in a shared utility and enforce it immediately before any storage 'set' operation in the UI layer.

## 2025-05-15 - [Input Validation for Body Metrics Tracking]
**Vulnerability:** Body metrics (weight, body fat, measurements) were persisted to localStorage without validation, allowing for malformed data to potentially corrupt health calculations (BMI, FFMI) and UI components.
**Learning:** Even internal-only tracking features often skip validation because they don't involve formal "forms", but security-in-depth requires validation at every persistence boundary.
**Prevention:** Always use centralized validation utilities before saving any user-inputted data to storage, even for simple numeric fields.
