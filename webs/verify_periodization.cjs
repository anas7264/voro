const { chromium } = require('@playwright/test');

(async () => {
  console.log("Launching browser for Periodization Page verification...");
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    recordVideo: {
      dir: '/home/jules/verification/videos',
      size: { width: 1440, height: 900 }
    },
    viewport: { width: 1440, height: 900 }
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

  // Now set the keys securely through window.storage.set
  console.log("Securely injecting mock profile & periodization data into storage...");
  await page.evaluate(async () => {
    await window.storage.ensureInitialized();
    await window.storage.set('profile', {
      name: 'Ulysses Elite',
      completedOnboarding: true
    });
    await window.storage.set('user', {
      name: 'Ulysses Elite',
      primaryGoal: 'Evolution',
      calorieGoal: 2000
    });
    await window.storage.set('periodization', [
      {
        id: 1710000000000,
        name: 'Hypertrophy Block',
        duration: '4 weeks',
        focus: 'Muscle growth',
        color: 'text-voro-primary',
        bg: 'bg-voro-primary/10',
        startDate: new Date().toISOString()
      },
      {
        id: 1710000005000,
        name: 'Strength Block',
        duration: '4 weeks',
        focus: 'Maximum strength',
        color: 'text-voro-secondary',
        bg: 'bg-voro-secondary/10',
        startDate: new Date().toISOString()
      }
    ]);
  });

  // Now navigate to the Periodization page
  console.log("Navigating to Periodization page...");
  await page.goto('http://localhost:4173/workout/periodization');
  await page.waitForTimeout(2000); // Wait for transition animations and state load

  // 1. Initial page state screenshot
  console.log("Taking screenshot of initial periodization page...");
  await page.screenshot({ path: '/home/jules/verification/screenshots/periodization_forge.png', fullPage: true });

  // 2. Hover over the first available stimulus block card
  console.log("Hovering mouse over the Hypertrophy stimulus block card...");
  const firstBlockCard = page.locator('article[aria-label^="Periodization Block: Hypertrophy"]').first();
  if (await firstBlockCard.isVisible()) {
    await firstBlockCard.hover({ position: { x: 150, y: 100 } });
    await page.waitForTimeout(500);
    await page.screenshot({ path: '/home/jules/verification/screenshots/periodization_card_hover.png' });
  }

  // 3. Click integrate on the Power Block card
  console.log("Integrating Power Block into timeline...");
  const powerIntegrateBtn = page.locator('article[aria-label^="Periodization Block: Power"]').locator('button', { hasText: 'Integrate' });
  if (await powerIntegrateBtn.isVisible()) {
    await powerIntegrateBtn.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: '/home/jules/verification/screenshots/periodization_block_added.png' });
  }

  // 4. Focus on a timeline node to test APG focus tilt
  console.log("Focusing on the first timeline node...");
  const firstTimelineNode = page.locator('article[aria-label^="Timeline Node 1"]').first();
  if (await firstTimelineNode.isVisible()) {
    await firstTimelineNode.focus();
    await page.waitForTimeout(500);
    await page.screenshot({ path: '/home/jules/verification/screenshots/periodization_node_focus.png' });
  }

  await context.close();
  await browser.close();
  console.log("Periodization Page E2E visual verification complete.");
})();
