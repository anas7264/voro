# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: security_hardening.spec.js >> Security Sentinel Hardening >> Mutation Shield detects unauthorized script injection
- Location: security_hardening.spec.js:21:3

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: true
Received: false
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  |
  3  | test.describe('Security Sentinel Hardening', () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     page.on('console', msg => console.log(`BROWSER [${msg.type()}]: ${msg.text()}`));
  6  |     // Bypass onboarding
  7  |     await page.addInitScript(() => {
  8  |       window.localStorage.setItem('voro_onboarded', 'true');
  9  |     });
  10 |     await page.goto('http://localhost:5173/');
  11 |   });
  12 |
  13 |   test('Application loads correctly with Security Sentinel active', async ({ page }) => {
  14 |     // Wait for the app to be ready
  15 |     await page.waitForTimeout(2000);
  16 |     await page.screenshot({ path: 'load_check.png' });
  17 |     const title = await page.title();
  18 |     expect(title).toContain('VORO');
  19 |   });
  20 |
  21 |   test('Mutation Shield detects unauthorized script injection', async ({ page }) => {
  22 |     // Attempt to inject a script tag into the DOM
  23 |     const lockdownDetected = await page.evaluate(async () => {
  24 |       if (window.VORO_COMPROMISED) return true;
  25 |
  26 |       return new Promise((resolve) => {
  27 |         // Listen for the lockdown event
  28 |         window.addEventListener('voro-security-lockdown', () => {
  29 |           resolve(true);
  30 |         });
  31 |
  32 |         // Trigger mutation
  33 |         try {
  34 |           const script = document.createElement('script');
  35 |           script.setAttribute('src', '/unauthorized.js');
  36 |           document.body.appendChild(script);
  37 |         } catch (e) {
  38 |           console.error('Injection failed:', e);
  39 |         }
  40 |
  41 |         // Timeout if no lockdown
  42 |         setTimeout(() => resolve(false), 3000);
  43 |       });
  44 |     });
  45 |
> 46 |     expect(lockdownDetected).toBe(true);
     |                              ^ Error: expect(received).toBe(expected) // Object.is equality
  47 |   });
  48 |
  49 |   test('Mutation Shield detects unauthorized attribute tampering', async ({ page }) => {
  50 |     const lockdownDetected = await page.evaluate(async () => {
  51 |       if (window.VORO_COMPROMISED) return true;
  52 |
  53 |       console.log('Starting attribute tampering test...');
  54 |       return new Promise((resolve) => {
  55 |         window.addEventListener('voro-security-lockdown', () => {
  56 |           console.log('Lockdown event received!');
  57 |           resolve(true);
  58 |         });
  59 |
  60 |         // Trigger mutation by adding an iframe
  61 |         const iframe = document.createElement('iframe');
  62 |         iframe.src = 'about:blank';
  63 |         document.body.appendChild(iframe);
  64 |
  65 |         setTimeout(() => {
  66 |           console.log('Test timed out without lockdown event.');
  67 |           resolve(false);
  68 |         }, 3000);
  69 |       });
  70 |     });
  71 |
  72 |     await page.screenshot({ path: 'tamper_check.png' });
  73 |     expect(lockdownDetected).toBe(true);
  74 |   });
  75 |
  76 |   test('Environment Attestation detects automation (Playwright itself)', async ({ page }) => {
  77 |      // Since we ARE running in Playwright, the app should theoretically detect it and lockdown
  78 |      // However, Playwright often hides navigator.webdriver unless configured otherwise.
  79 |      // Let's check if the app locked down.
  80 |      const isCompromised = await page.evaluate(() => window.VORO_COMPROMISED === true);
  81 |
  82 |      // NOTE: This test might fail if Playwright is perfectly stealthy,
  83 |      // but our sentinel checks many markers.
  84 |      console.log('Is compromised in Playwright:', isCompromised);
  85 |   });
  86 | });
  87 |
```