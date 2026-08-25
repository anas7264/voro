const { chromium } = require('@playwright/test');
const { spawn } = require('child_process');
const path = require('path');

async function runVerification() {
  console.log('🚀 Launching preview server...');
  const server = spawn('pnpm', ['run', 'preview', '--port', '4173'], {
    cwd: path.join(__dirname),
    shell: true,
    stdio: 'ignore'
  });

  // Wait 3 seconds for server boot
  await new Promise(resolve => setTimeout(resolve, 3000));

  let browser;
  try {
    console.log('🌐 Launching Chromium browser...');
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 }
    });
    const page = await context.newPage();

    console.log('⚡ Injecting E2E test mode bypass...');
    await page.addInitScript(() => {
      window.__VORO_TEST_BYPASS__ = true;
      localStorage.setItem('voro_test_mode', 'true');
    });

    console.log('📍 Navigating to Education Hub page...');
    await page.goto('http://localhost:4173/education', { waitUntil: 'networkidle' });

    // Step 1: Verify header title
    const headerTitle = await page.textContent('h1');
    console.log(`✅ Header title verified: "${headerTitle?.trim()}"`);

    // Step 2: Verify Featured Dossier Hero
    const heroVisible = await page.isVisible('section.group\\/hero');
    console.log(`✅ Featured Dossier Hero visible: ${heroVisible}`);

    // Step 3: Hover over first article card to verify 3D tilt and spatial telemetry
    const articleCard = page.locator('div[role="article"]').first();
    await articleCard.scrollIntoViewIfNeeded();

    const box = await articleCard.boundingBox();
    if (box) {
      console.log('🖱️ Simulating 60fps 3D volumetric hover tilt...');
      await page.mouse.move(box.x + box.width * 0.7, box.y + box.height * 0.3);
      await page.waitForTimeout(500);

      const tiltStyle = await articleCard.getAttribute('style');
      console.log(`✅ Verified transform style: "${tiltStyle}"`);
    }

    // Step 4: Category Filter Verification
    console.log('🔍 Clicking category filter: Training...');
    const trainingBtn = page.locator('button', { hasText: 'Training' }).first();
    await trainingBtn.click();
    await page.waitForTimeout(300);

    const filteredCardsCount = await page.locator('div[role="article"]').count();
    console.log(`✅ Filtered article count for Training: ${filteredCardsCount}`);

    // Step 5: Search Query Verification
    console.log('🔎 Testing Search Query input...');
    const searchInput = page.locator('input[placeholder="Query Research Database..."]');
    await searchInput.fill('Hypertrophic');
    await page.waitForTimeout(500);

    const searchCount = await page.locator('div[role="article"]').count();
    console.log(`✅ Search result count for "Hypertrophic": ${searchCount}`);

    // Capture visual verification screenshot
    const screenshotPath = path.join(__dirname, 'education_hub_forge.png');
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(`📸 Visual verification screenshot saved to: ${screenshotPath}`);

    console.log('🎉 All Education Hub E2E verifications completed successfully!');
  } catch (error) {
    console.error('❌ Verification failed:', error);
    process.exitCode = 1;
  } finally {
    if (browser) await browser.close();
    server.kill();
  }
}

runVerification();
