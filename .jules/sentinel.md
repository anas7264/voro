## 2025-05-14 - [Input Validation for Profile Persistence]
**Vulnerability:** Lack of server-side (or pre-storage) validation for physical and health metrics allowed potentially malicious or malformed data to be persisted to localStorage and used in downstream health calculations (BMI, TDEE).
**Learning:** React components often lack defensive validation when interacting with custom storage abstractions, assuming the UI controls already constrain the input.
**Prevention:** Centralize validation logic in a shared utility and enforce it immediately before any storage 'set' operation in the UI layer.
