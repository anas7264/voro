const { chromium } = require('playwright');
const path = require('path');
const http = require('http');
const fs = require('fs');
const serveStatic = require('serve-static');

async function runVerification() {
  console.log('Starting Playwright E2E verification for SupplementTracker...');

  // Serve the built static files in dist
  const distPath = path.join(__dirname, 'dist');
  if (!fs.existsSync(distPath)) {
    console.error('dist directory does not exist! Run build first.');
    process.exit(1);
  }

  const serve = serveStatic(distPath);
  const server = http.createServer((req, res) => {
    serve(req, res, () => {
      res.statusCode = 404;
      res.end('Not found');
    });
  });

  await new Promise((resolve) => server.listen(4173, resolve));
  console.log('Static server listening at http://localhost:4173');

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    // Navigate to local server
    await page.goto('http://localhost:4173', { waitUntil: 'networkidle' });

    // Inject bypass hook in window
    await page.evaluate(() => {
      window.__VORO_TEST_BYPASS__ = true;
      localStorage.setItem('voro_test_mode', 'true');
    });

    // Navigate to Supplement Tracker via URL hash or sidebar
    await page.goto('http://localhost:4173/#/supplements', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    // Take screenshot of initial state
    await page.screenshot({ path: path.join(__dirname, 'supplement_tracker_initial.png'), fullPage: true });
    console.log('Saved initial screenshot supplement_tracker_initial.png');

    // Click 'Integrate Compound' / 'Open Apothecary Catalog' button
    const integrateBtn = page.locator('button:has-text("Integrate Compound"), button:has-text("Open Apothecary Catalog")').first();
    if (await integrateBtn.isVisible()) {
      await integrateBtn.click();
      await page.waitForTimeout(500);
    }

    // Verify catalog form and items are visible
    const catalogItem = page.locator('button:has-text("DOSE //")').first();
    await catalogItem.waitFor({ state: 'visible', timeout: 5000 });
    console.log('Catalog items loaded successfully.');

    // Test 3D volumetric tilt mousemove on catalog item
    const box = await catalogItem.boundingBox();
    if (box) {
      await page.mouse.move(box.x + box.width * 0.75, box.y + box.height * 0.25);
      await page.waitForTimeout(300);

      const tiltX = await catalogItem.evaluate(el => el.style.getPropertyValue('--tilt-x'));
      console.log(`Evaluated 3D tilt-x custom property: ${tiltX}`);
      if (!tiltX) {
        throw new Error('3D tilt-x custom property was not set on mouse move!');
      }
    }

    // Add supplement to active protocol (trigger bypass integration)
    await catalogItem.click();
    await page.waitForTimeout(1000);

    // Verify supplement card appears in active protocols list
    const activeCard = page.locator('div[role="article"]').first();
    await activeCard.waitFor({ state: 'visible', timeout: 5000 });
    console.log('Supplement integrated into active protocol matrix successfully.');

    // Test Purge Guard
    const purgeBtn = activeCard.locator('button[aria-label*="decommission"]').first();
    await purgeBtn.click();
    await page.waitForTimeout(300);

    const purgeText = await activeCard.locator('span:has-text("PURGE?")').textContent();
    console.log(`Purge confirmation text detected: ${purgeText}`);
    if (!purgeText.includes('PURGE?')) {
      throw new Error('Double-confirmation purge guard did not activate!');
    }

    // Take screenshot of active protocol state
    await page.screenshot({ path: path.join(__dirname, 'supplement_tracker_active.png'), fullPage: true });
    console.log('Saved active protocol screenshot supplement_tracker_active.png');

    console.log('ALL E2E VERIFICATION CHECKS PASSED SUCCESSFULLY!');
  } catch (err) {
    console.error('Verification failed:', err);
    process.exitCode = 1;
  } finally {
    await browser.close();
    server.close();
  }
}

runVerification();
