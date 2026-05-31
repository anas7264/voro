## 2025-05-14 - [Input Validation for Profile Persistence]
**Vulnerability:** Lack of server-side (or pre-storage) validation for physical and health metrics allowed potentially malicious or malformed data to be persisted to localStorage and used in downstream health calculations (BMI, TDEE).
**Learning:** React components often lack defensive validation when interacting with custom storage abstractions, assuming the UI controls already constrain the input.
**Prevention:** Centralize validation logic in a shared utility and enforce it immediately before any storage 'set' operation in the UI layer.

## 2025-05-15 - [Input Validation for Body Metrics Tracking]
**Vulnerability:** Body metrics (weight, body fat, measurements) were persisted to localStorage without validation, allowing for malformed data to potentially corrupt health calculations (BMI, FFMI) and UI components.
**Learning:** Even internal-only tracking features often skip validation because they don't involve formal "forms", but security-in-depth requires validation at every persistence boundary.
**Prevention:** Always use centralized validation utilities before saving any user-inputted data to storage, even for simple numeric fields.

## 2025-05-16 - [Workout Session Input Validation]
**Vulnerability:** Workout logs containing multiple exercises and sets were persisted to storage without validation, allowing for malformed or out-of-range data (e.g., negative weights or unrealistic rep counts) to corrupt volume calculations and dashboard trends.
**Learning:** Complex data structures (like arrays of objects) need recursive or structural validation before persistence, not just simple field-level checks.
**Prevention:** Enhance validation utilities to handle the exact data structures used by the UI components and enforce validation at the point of save.

## 2025-05-17 - [Vitals Input Validation]
**Vulnerability:** Health vitals (heart rate, blood pressure, sleep, etc.) were persisted to localStorage without validation, which could lead to malformed data corruption in tracking history and UI.
**Learning:** Even simple numeric trackers or sliders need validation at the persistence layer to ensure data integrity across the application.
**Prevention:** Always implement structural and range validation for all user-contributed health data using centralized utilities before storage.

## 2025-05-18 - [Water Intake Input Validation]
**Vulnerability:** Water intake logs were persisted to localStorage without validation, allowing for malformed or out-of-range data (e.g., negative amounts or unrealistic intake) to potentially corrupt hydration trends and dashboard stats.
**Learning:** Even when UI components provide fixed-input options (like buttons for 250ml/500ml), the underlying persistence logic must still perform defensive validation to ensure data integrity.
**Prevention:** Implement range validation for all tracking metrics, including water intake, and enforce it at the persistence boundary.

## 2025-05-19 - [Food Diary and Water Intake Validation]
**Vulnerability:** Lack of input validation for food portions and water intake in the Food Diary page allowed malformed data to be persisted, potentially corrupting daily totals and summary rings.
**Learning:** Even when validation exists for a metric in one part of the app (e.g., WaterTracker), other pages that update the same data (e.g., FoodDiary) might bypass it if not explicitly integrated.
**Prevention:** Ensure all entry points for the same data type use centralized validation logic and the notification system to inform the user of failures.

## 2025-05-20 - [Strict CSP and AI Privacy Shield]
**Vulnerability:** Application lacked a Content Security Policy (CSP), leaving it vulnerable to XSS and unauthorized data exfiltration. Additionally, sensitive user PII was being transmitted to external AI APIs without sanitization.
**Learning:** Relying on UI-level data filtering is insufficient for privacy; security must be enforced at the data egress point. recursive sanitization is necessary to handle complex, nested objects and free-form text in chat history.
**Prevention:** Implement a strict CSP in index.html to restrict script/connect sources. Enforce a "Privacy Shield" layer in the AI client that recursively redacts PII and scrubs strings using regex before any external transmission.
