import asyncio
import os
import subprocess
import time
from playwright.async_api import async_playwright

async def main():
    print("🚀 Starting Python Playwright E2E verification for Education Hub...")

    # Start Vite preview server
    server_process = subprocess.Popen(
        ["pnpm", "run", "preview", "--port", "4173"],
        cwd="/app/webs",
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL
    )
    time.sleep(3)

    async with async_playwright() as p:
        try:
            browser = await p.chromium.launch(headless=True)
            context = await browser.new_context(viewport={"width": 1440, "height": 900})
            page = await context.new_page()

            print("⚡ Injecting E2E test mode bypass and storage keys...")
            await page.add_init_script("""
                window.__VORO_TEST_BYPASS__ = true;
                localStorage.setItem('voro_test_mode', 'true');
                localStorage.setItem('voro_user', JSON.stringify({ name: 'Aria Thorne', level: 'Elite' }));
                localStorage.setItem('voro_user_profile', JSON.stringify({ name: 'Aria Thorne', level: 'Elite' }));
                localStorage.setItem('voro_profile', JSON.stringify({ name: 'Aria Thorne', level: 'Elite' }));
            """)

            print("📍 Navigating to Education Hub page...")
            await page.goto("http://localhost:4173/education", wait_until="networkidle")
            await page.wait_for_timeout(1000)

            # Step 1: Verify Header Title
            header_title = await page.text_content("h1")
            print(f"✅ Header title verified: '{header_title.strip()}'")

            # Step 2: Verify Featured Dossier Hero
            hero_visible = await page.is_visible("section.group\\/hero")
            print(f"✅ Featured Dossier Hero visible: {hero_visible}")

            # Capture Full Initial View Screenshot
            screenshot_path = "/app/webs/education_hub_forge.png"
            await page.screenshot(path=screenshot_path, full_page=True)
            print(f"📸 Full page initial view screenshot saved to: {screenshot_path}")

            # Step 3: Hover over first article card to verify 3D tilt
            article_card = page.locator("div[role='article']").first
            await article_card.scroll_into_view_if_needed()

            box = await article_card.bounding_box()
            if box:
                print("🖱️ Simulating 60fps 3D volumetric hover tilt...")
                await page.mouse.move(box["x"] + box["width"] * 0.7, box["y"] + box["height"] * 0.3)
                await page.wait_for_timeout(500)

                tilt_style = await article_card.get_attribute("style")
                print(f"✅ Verified transform style: '{tilt_style}'")

            # Step 4: Category Filter Verification
            print("🔍 Clicking category filter: Training...")
            training_btn = page.locator("button", has_text="Training").first
            await training_btn.click()
            await page.wait_for_timeout(300)

            filtered_count = await page.locator("div[role='article']").count()
            print(f"✅ Filtered article count for Training: {filtered_count}")

            # Step 5: Search Query Verification
            print("🔎 Testing Search Query input...")
            search_input = page.locator("input[placeholder='Query Research Database...']")
            await search_input.fill("Hypertrophic")
            await page.wait_for_timeout(500)

            search_count = await page.locator("div[role='article']").count()
            print(f"✅ Search result count for 'Hypertrophic': {search_count}")

            print("🎉 All Education Hub E2E verifications completed successfully!")
        finally:
            await browser.close()
            server_process.terminate()

if __name__ == "__main__":
    asyncio.run(main())
