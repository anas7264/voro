import asyncio
import os
from playwright.async_api import async_playwright

async def main():
    print("🚀 Starting Python Playwright E2E verification for BodyComposition page...")
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True, args=['--no-sandbox', '--disable-setuid-sandbox'])
        context = await browser.new_context(viewport={'width': 1440, 'height': 900})
        page = await context.new_page()

        try:
            # Enable test bypass and mock localStorage before page load
            await page.add_init_script("""
                window.__VORO_TEST_BYPASS__ = true;
                window.localStorage.setItem('voro_test_mode', 'true');
                window.localStorage.setItem('voro_bypass_loader', 'true');

                // Bypass onboarding guard
                window.localStorage.setItem('voro_user', JSON.stringify({ name: 'Voro User', onboardingComplete: true }));

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
            """)

            print("🌐 Navigating to preview server at http://localhost:4173/body/composition...")
            await page.goto("http://localhost:4173/body/composition", wait_until="networkidle")

            # Wait briefly for React suspense or router navigation
            await asyncio.sleep(2.0)

            print(f"Current URL: {page.url}")

            await page.wait_for_selector("h1", timeout=10000)
            print("✅ Page header rendered successfully.")

            # Hover over Lean Mass specimen cell
            specimen = page.locator('div[role="article"]').first
            await specimen.scroll_into_view_if_needed()
            box = await specimen.bounding_box()
            if box:
                await page.mouse.move(box['x'] + box['width'] * 0.7, box['y'] + box['height'] * 0.3)
                await asyncio.sleep(0.5)
                print("✨ 3D volumetric hover tilt triggered on specimen cell.")

            # Hover over SomaticSegmentalLens
            lens = page.locator('div[role="region"]').first
            await lens.scroll_into_view_if_needed()
            lens_box = await lens.bounding_box()
            if lens_box:
                await page.mouse.move(lens_box['x'] + lens_box['width'] * 0.4, lens_box['y'] + lens_box['height'] * 0.4)
                await asyncio.sleep(0.5)
                print("✨ 3D volumetric hover triggered on SomaticSegmentalLens.")

            screenshot_path = os.path.abspath("webs/body_composition_forge_v1.png")
            await page.screenshot(path=screenshot_path, full_page=True)
            print(f"📸 Full page screenshot captured at {screenshot_path}")

        except Exception as e:
            print(f"❌ Error during verification: {e}")
            raise e
        finally:
            await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
