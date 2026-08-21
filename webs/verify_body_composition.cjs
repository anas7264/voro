const { chromium } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

(async () => {
  console.log('🚀 Starting E2E Playwright verification for BodyComposition page...');

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });

  const page = await context.newPage();

  try {
    // Enable bypass for instant loader rendering
    await page.addInitScript(() => {
      window.__VORO_TEST_BYPASS__ = true;
      window.localStorage.setItem('voro_test_mode', 'true');
      window.localStorage.setItem('voro_bypass_loader', 'true');

      // Populate mock body metrics data for rich visual composition display
      const mockMetrics = {
        weights: [
          { date: '2025-01-01', value: 82.5 },
          { date: '2025-01-15', value: 81.8 },
          { date: '2025-02-01', value: 81.0 },
          { date: '2025-02-15', value: 80.2 }
        ],
        bodyFat: [
          { date: '2025-01-01', value: 16.5 },
          { date: '2025-01-15', value: 15.8 },
          { date: '2025-02-01', value: 15.1 },
          { date: '2025-02-15', value: 14.5 }
        ]
      };
      window.localStorage.setItem('voro_body_metrics', JSON.stringify(mockMetrics));
    });

    console.log('🌐 Navigating to preview server at http://localhost:4173/analytics/body-composition...');
    await page.goto('http://localhost:4173/analytics/body-composition', { waitUntil: 'networkidle' });

    // Wait for the main page header
    await page.waitForSelector('h1', { timeout: 10000 });
    console.log('✅ Page loaded successfully.');

    // Hover over the first SomaticSpecimenCell card to trigger 3D volumetric tilt and telemetry
    const specimenCard = page.locator('div[role="article"]').first();
    await specimenCard.scrollIntoViewIfNeeded();

    const box = await specimenCard.boundingBox();
    if (box) {
      await page.mouse.move(box.x + box.width * 0.7, box.y + box.height * 0.3);
      await page.waitForTimeout(500);
      console.log('✨ Triggered 3D volumetric hover tilt on Lean Mass cell.');
    }

    // Hover over the SomaticSegmentalLens element
    const segmentalLens = page.locator('div[role="region"]').first();
    await segmentalLens.scrollIntoViewIfNeeded();
    const lensBox = await segmentalLens.boundingBox();
    if (lensBox) {
      await page.mouse.move(lensBox.x + lensBox.width * 0.4, lensBox.y + lensBox.height * 0.4);
      await page.waitForTimeout(500);
      console.log('✨ Triggered 3D volumetric hover on Somatic Segmental Lens.');
    }

    // Take screenshot of the complete page
    const screenshotPath = path.join(__dirname, '..', 'body_composition_forge_v1.png');
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(`📸 Screenshot saved to ${screenshotPath}`);

  } catch (error) {
    console.error('❌ Verification failed:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
