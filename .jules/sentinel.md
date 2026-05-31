## 2025-05-21 - [Recipe Builder Input Validation]
**Vulnerability:** Lack of input validation for recipe names and ingredient portions in the Recipe Builder allowed malformed or out-of-range data to be persisted to localStorage, potentially corrupting recipe calculations and UI displays.
**Learning:** Even internal utility pages like a "Recipe Builder" require strict validation at the persistence boundary to maintain data integrity, as they often handle complex data structures (arrays of ingredients) that are sensitive to malformed values.
**Prevention:** Implement comprehensive structural and range validation (e.g., `validateRecipe`) and enforce it at the point of storage, providing user-visible feedback for any failures.
