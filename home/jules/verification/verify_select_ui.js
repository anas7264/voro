import { sync_playwright } from 'playwright';

async function verify_select() {
  const browser = await sync_playwright().chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Set viewport for consistent results
    await page.setViewportSize({ width: 1280, height: 800 });

    // Navigate to settings page
    await page.goto('http://localhost:5173/settings');

    // Wait for the page to load
    await page.waitForLoadState('networkidle');

    // Bypass onboarding if needed (though based on AppLayout/OnboardingGuard it might be needed)
    // Looking at memory, voro_user and voro_profile in localStorage should bypass onboarding
    await page.evaluate(() => {
      localStorage.setItem('voro_user', JSON.stringify({ name: 'Palette Test', onboarded: true }));
      localStorage.setItem('voro_profile', JSON.stringify({ name: 'Palette Test' }));
      window.location.reload();
    });

    await page.waitForLoadState('networkidle');

    // Take screenshot of settings page
    await page.screenshot({ path: '/home/jules/verification/settings_select_idle.png', fullPage: true });

    // Focus on the first select (Font Size)
    const firstSelect = page.locator('select').first();
    await firstSelect.focus();
    await page.screenshot({ path: '/home/jules/verification/settings_select_focus.png' });

    console.log('Screenshots captured.');
  } catch (error) {
    console.error('Error during verification:', error);
  } finally {
    await browser.close();
  }
}

verify_select();
