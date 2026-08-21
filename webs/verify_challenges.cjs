const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

(async () => {
  console.log("Launching browser for Strategic Objective Synthesis Enclave verification...");
  const screenshotsDir = '/home/jules/verification/screenshots';
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    recordVideo: {
      dir: '/home/jules/verification/videos',
      size: { width: 1280, height: 720 }
    }
  });

  const page = await context.newPage();

  // Set test mode marker so security system bypasses environment/integrity locks
  await page.addInitScript(() => {
    window.__VORO_TEST_BYPASS__ = true;
    localStorage.setItem('voro_test_mode', 'true');
  });

  console.log("Navigating to home/entry to inject state securely...");
  await page.goto('http://localhost:4173/');
  await page.waitForTimeout(1000); // Let initial bundle load

  // Inject mock gamification & user profile into storage
  console.log("Securely injecting mock gamification & user profile into storage...");
  await page.evaluate(async () => {
    await window.storage.ensureInitialized();
    await window.storage.set('user', {
      name: 'Ulysses Elite',
      completedOnboarding: true,
      primaryGoal: 'Evolution'
    });
    await window.storage.set('profile', {
      name: 'Ulysses Elite',
      completedOnboarding: true
    });
    await window.storage.set('gamification', {
      level: 5,
      xp: 4200,
      completedChallenges: {
        "c001": true
      }
    });
  });

  // Navigate to Challenges page
  console.log("Navigating to Strategic Objectives (Challenges) page...");
  await page.goto('http://localhost:4173/gamification/challenges');
  await page.waitForTimeout(2000); // Wait for transition animations and state load

  // 1. Initial page state
  console.log("Taking screenshot of initial Strategic Matrix list...");
  await page.screenshot({ path: path.join(screenshotsDir, 'challenges_initial.png') });

  // 2. Hover over a top Telemetry Card
  console.log("Hovering over Manifestation Rate Telemetry Card...");
  const telemetryCard = page.locator('div[role="group"][aria-label^="Manifestation Rate"]');
  if (await telemetryCard.isVisible()) {
    await telemetryCard.hover({ position: { x: 100, y: 30 } });
    await page.waitForTimeout(800);
    await page.screenshot({ path: path.join(screenshotsDir, 'challenges_telemetry_hover.png') });
  }

  // 3. Focus a Challenge Card for 4-degree static keyboard accessibility tilt
  console.log("Focusing a Challenge Card...");
  const challengeCard = page.locator('div[role="article"][aria-label^="Strategic Objective"]').first();
  if (await challengeCard.isVisible()) {
    await challengeCard.focus();
    await page.waitForTimeout(800);
    await page.screenshot({ path: path.join(screenshotsDir, 'challenges_card_focus.png') });
  }

  // 4. Switch tabs to Weekly Rhythms
  console.log("Switching tab to Weekly Rhythms...");
  const weeklyTab = page.locator('button', { hasText: 'Weekly Rhythms' });
  if (await weeklyTab.isVisible()) {
    await weeklyTab.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(screenshotsDir, 'challenges_weekly_tab.png') });
  }

  await context.close();
  await browser.close();
  console.log("Strategic Objective Synthesis Enclave E2E verification complete.");
})();
