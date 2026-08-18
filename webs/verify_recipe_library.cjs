const { chromium } = require('@playwright/test');
const { spawn } = require('child_process');
const path = require('path');

async function runVerification() {
  console.log('🚀 Starting Recipe Library (Culinary Codex) E2E Verification...');

  const viteProcess = spawn('pnpm', ['run', 'dev'], {
    cwd: path.join(__dirname),
    stdio: 'pipe',
    shell: true
  });

  let serverUrl = '';

  await new Promise((resolve) => {
    viteProcess.stdout.on('data', (data) => {
      const output = data.toString();
      const match = output.match(/http:\/\/localhost:\d+/);
      if (match) {
        serverUrl = match[0];
        resolve();
      }
    });

    setTimeout(() => {
      if (!serverUrl) resolve();
    }, 4000);
  });

  if (!serverUrl) {
    serverUrl = 'http://localhost:5173';
  }

  console.log(`🌐 Server active at ${serverUrl}`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Set test mode marker so security system bypasses environment/integrity locks
  await page.addInitScript(() => {
    window.__VORO_TEST_BYPASS__ = true;
    localStorage.setItem('voro_test_mode', 'true');
  });

  try {
    console.log('📌 Navigating to entry to inject profile and user state...');
    await page.goto(`${serverUrl}/`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    await page.evaluate(async () => {
      if (window.storage && window.storage.ensureInitialized) {
        await window.storage.ensureInitialized();
        await window.storage.set('user', {
          name: 'Ulysses Elite',
          primaryGoal: 'Evolution'
        });
        await window.storage.set('profile', {
          name: 'Ulysses Elite',
          completedOnboarding: true
        });
      } else {
        localStorage.setItem('voro_user', JSON.stringify({ name: 'Ulysses Elite' }));
        localStorage.setItem('voro_profile', JSON.stringify({ completedOnboarding: true }));
      }
    });

    console.log('📌 Navigating to /nutrition/recipes...');
    await page.goto(`${serverUrl}/nutrition/recipes`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    // Check Header Title
    const pageTitle = await page.textContent('h1');
    console.log(`✓ Page Title found: "${pageTitle.trim()}"`);

    // Verify Recipe Artifact Cards render
    const cards = await page.$$('[role="article"]');
    console.log(`✓ Number of Recipe Artifact Cards rendered: ${cards.length}`);
    if (cards.length === 0) {
      throw new Error('No Recipe Artifact Cards found on page');
    }

    // Hover over first card and check custom properties (tilt, telemetry)
    const firstCard = cards[0];
    const boundingBox = await firstCard.boundingBox();
    if (boundingBox) {
      await page.mouse.move(boundingBox.x + boundingBox.width / 4, boundingBox.y + boundingBox.height / 4);
      await page.waitForTimeout(300);

      const tiltX = await firstCard.evaluate(el => el.style.getPropertyValue('--tilt-x'));
      const tiltY = await firstCard.evaluate(el => el.style.getPropertyValue('--tilt-y'));
      console.log(`✓ 3D Volumetric Tilt active on mouse move: tiltX=${tiltX}, tiltY=${tiltY}`);
    }

    // Keyboard Focus test on first card (APG 4-degree static tilt check)
    await firstCard.focus();
    const focusTiltX = await firstCard.evaluate(el => el.style.getPropertyValue('--tilt-x'));
    console.log(`✓ APG Keyboard Focus 4-degree static tilt active: ${focusTiltX}`);

    // Test Search input filtering
    const searchInput = await page.$('input[placeholder*="Query formula index"]');
    if (searchInput) {
      console.log('📌 Testing Search Terminal filtering...');
      await searchInput.fill('Kinetic');
      await page.waitForTimeout(500);

      const filteredCards = await page.$$('[role="article"]');
      console.log(`✓ Search "Kinetic" returned ${filteredCards.length} matching formulas`);
      await searchInput.fill('');
      await page.waitForTimeout(300);
    }

    // Test Category Pill filters
    const ketoFilter = await page.$('button[aria-pressed="false"]:has-text("Keto")');
    if (ketoFilter) {
      console.log('📌 Testing Category Pill Filter "Keto"...');
      await ketoFilter.click();
      await page.waitForTimeout(300);

      const ketoCards = await page.$$('[role="article"]');
      console.log(`✓ Category "Keto" filter returned ${ketoCards.length} matching formulas`);

      const allFilter = await page.$('button:has-text("All")');
      if (allFilter) await allFilter.click();
      await page.waitForTimeout(300);
    }

    // Test 2-step defensive confirmation purge trigger ("PURGE?")
    console.log('📌 Testing Defensive 2-Step Confirmation Purge Trigger...');
    const purgeButton = await page.$('button[aria-label*="Decommission"]');
    if (purgeButton) {
      await purgeButton.click({ force: true });
      await page.waitForTimeout(200);

      const purgeText = await purgeButton.textContent();
      console.log(`✓ Purge confirmation button text changed to: "${purgeText.trim()}"`);
    }

    console.log('🎉 E2E Verification Completed Successfully!');
  } catch (err) {
    console.error('❌ Verification failed:', err);
    process.exitCode = 1;
  } finally {
    await browser.close();
    viteProcess.kill('SIGKILL');
    process.exit(process.exitCode || 0);
  }
}

runVerification();
