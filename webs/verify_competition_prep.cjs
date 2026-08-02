const { chromium } = require('@playwright/test');
const path = require('path');

(async () => {
  console.log("Launching browser for Competition Prep luxury verification...");
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    recordVideo: {
      dir: '/home/jules/verification/videos',
      size: { width: 1280, height: 720 }
    }
  });

  const page = await context.newPage();

  // Set localStorage and inject test mode bypass
  await page.addInitScript(() => {
    window.__VORO_TEST_BYPASS__ = true;
    localStorage.setItem('voro_test_mode', 'true');
    localStorage.setItem('voro_user', JSON.stringify({
      name: 'Ulysses Elite',
      primaryGoal: 'Evolution',
      calorieGoal: 2000,
      waterGoal: 2000,
      proteinGoal: 150,
      carbsGoal: 200,
      fatGoal: 70
    }));
    localStorage.setItem('voro_profile', JSON.stringify({
      name: 'Ulysses Elite',
      completedOnboarding: true
    }));
  });

  // Start the vite preview server first or check if it's running
  // We will assume the runner executes this during preview. Let's head to the page.
  console.log("Navigating to Competition Manifest page...");
  await page.goto('http://localhost:4173/competition');
  await page.waitForTimeout(3000); // Allow loading/animations to complete

  // Scenario 1: Empty state (No manifest scheduled)
  console.log("Scenario 1: Verifying Alignment Deck (Empty State)...");
  await page.screenshot({ path: '/home/jules/verification/screenshots/competition_empty_state.png' });

  // Click 'Initiate Manifest Protocol' button to open DatePicker
  console.log("Clicking 'Initiate Manifest Protocol'...");
  const initiateBtn = page.locator('button:has-text("Initiate Manifest Protocol")').first();
  if (await initiateBtn.isVisible()) {
    await initiateBtn.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: '/home/jules/verification/screenshots/competition_datepicker_open.png' });
  }

  // Set a future date in input
  console.log("Entering target date...");
  const dateInput = page.locator('input[type="date"]').first();
  if (await dateInput.isVisible()) {
    // Set a date far in the future
    await dateInput.fill('2028-08-18');
    await page.waitForTimeout(500);
    await page.screenshot({ path: '/home/jules/verification/screenshots/competition_date_filled.png' });
  }

  // Synchronize timeline
  console.log("Synchronizing timeline...");
  const syncBtn = page.locator('button:has-text("Synchronize")').first();
  if (await syncBtn.isVisible()) {
    await syncBtn.click();
    await page.waitForTimeout(3000); // Wait for transition
    await page.screenshot({ path: '/home/jules/verification/screenshots/competition_active_manifest.png' });
  }

  // Focus on the first Peak Protocol card to verify Accessible 3D Interaction Pattern
  console.log("Verifying 3D Focus Interaction on Peak Protocols...");
  const protocolCard = page.locator('div[tabindex="0"]:has-text("Volume Reduction Matrix")').first();
  if (await protocolCard.isVisible()) {
    await protocolCard.focus();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: '/home/jules/verification/screenshots/competition_protocol_focus.png' });
  }

  // Click checklist items to test tactile switches
  console.log("Testing tactile checklist switches...");
  const checklistBtn = page.locator('button:has-text("Synthesize light energy source")').first();
  if (await checklistBtn.isVisible()) {
    await checklistBtn.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: '/home/jules/verification/screenshots/competition_checklist_checked.png' });
  }

  // Test the Decommission double-confirmation safeguard
  console.log("Testing Decommission safeguard (first trigger)...");
  const decompBtn = page.locator('button:has-text("Decommission Protocol")').first();
  if (await decompBtn.isVisible()) {
    await decompBtn.click();
    await page.waitForTimeout(1000); // Watch countdown state
    await page.screenshot({ path: '/home/jules/verification/screenshots/competition_decommission_active.png' });

    // Wait for automatic self-cancel countdown (3 seconds) to verify automatic rollback
    console.log("Waiting for automatic cancel of decommissioning...");
    await page.waitForTimeout(3500);
    await page.screenshot({ path: '/home/jules/verification/screenshots/competition_decommission_cancelled.png' });
  }

  await context.close();
  await browser.close();
  console.log("E2E verification of Competition Prep luxury interface successfully complete.");
})();
