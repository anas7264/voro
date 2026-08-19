import asyncio
import time
from playwright.async_api import async_playwright

async def run():
    print("Launching browser via Python Playwright for Kinetic Blueprint verification...")
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            record_video_dir="/home/jules/verification/videos",
            record_video_size={"width": 1280, "height": 720}
        )
        page = await context.new_page()

        # Set test mode marker so security system bypasses environment/integrity locks
        await page.add_init_script("""
            window.__VORO_TEST_BYPASS__ = true;
            localStorage.setItem('voro_test_mode', 'true');
        """)

        print("Navigating to entry page to set storage state...")
        await page.goto("http://localhost:4173/")
        await page.wait_for_timeout(1000)

        # Set user state so onboarding guard passes
        await page.evaluate("""async () => {
            await window.storage.ensureInitialized();
            await window.storage.set('user', {
                name: 'Ulysses Elite',
                primaryGoal: 'Evolution',
                calorieGoal: 2000
            });
            await window.storage.set('profile', {
                name: 'Ulysses Elite',
                completedOnboarding: true
            });
        }""")

        print("Navigating to Training Plan page (/workout/plan)...")
        await page.goto("http://localhost:4173/workout/plan")
        await page.wait_for_timeout(1500)

        # 1. Initial Void state screenshot
        print("Taking screenshot of initial empty blueprint state...")
        await page.screenshot(path="/home/jules/verification/screenshots/training_plan_void.png")

        # 2. Select parameters and click Initiate Synthesis
        print("Selecting Advanced level and Hypertrophy focus...")
        advanced_btn = page.locator('button:has-text("Advanced")').first
        if await advanced_btn.is_visible():
            await advanced_btn.click()

        hypertrophy_btn = page.locator('button:has-text("Hypertrophy")').first
        if await hypertrophy_btn.is_visible():
            await hypertrophy_btn.click()

        print("Clicking Initiate Synthesis...")
        synthesize_btn = page.locator('button:has-text("Initiate Synthesis")').first
        await synthesize_btn.click()
        await page.wait_for_timeout(2000)

        print("Taking screenshot of synthesized blueprint matrix...")
        await page.screenshot(path="/home/jules/verification/screenshots/training_plan_synthesized.png")

        # 3. Hovering over a training day card to verify 60fps 3D volumetric tilt
        print("Hovering mouse over the first training day card...")
        first_card = page.locator('div[role="region"][aria-label^="Training Day"]').first
        if await first_card.is_visible():
            await first_card.hover(position={"x": 80, "y": 80})
            await page.wait_for_timeout(1000)
            await page.screenshot(path="/home/jules/verification/screenshots/training_plan_card_hover.png")

        # 4. Focus the second training day card to verify static 4-degree accessibility focus tilt
        print("Focusing the second training day card via keyboard...")
        second_card = page.locator('div[role="region"][aria-label^="Training Day"]').nth(1)
        if await second_card.is_visible():
            await second_card.focus()
            await page.wait_for_timeout(1000)
            await page.screenshot(path="/home/jules/verification/screenshots/training_plan_card_focus.png")

        # 5. Click archive button (Trigger confirmation 'PURGE?')
        print("Clicking Archive button (Confirmation step 1)...")
        archive_btn = page.locator('button:has-text("Archive")').first
        if await archive_btn.is_visible():
            await archive_btn.click()
            await page.wait_for_timeout(1000)
            await page.screenshot(path="/home/jules/verification/screenshots/training_plan_confirm_purge.png")

        # 6. Confirm purge
        print("Confirming purge...")
        confirm_btn = page.locator('button:has-text("PURGE?")').first
        if await confirm_btn.is_visible():
            await confirm_btn.click()
            await page.wait_for_timeout(1500)
            await page.screenshot(path="/home/jules/verification/screenshots/training_plan_after_purge.png")

        await context.close()
        await browser.close()
        print("Training Plan E2E visual verification complete.")

if __name__ == "__main__":
    asyncio.run(run())
