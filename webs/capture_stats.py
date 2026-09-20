import asyncio
from playwright.async_api import async_playwright
import json

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={"width": 1280, "height": 800})

        user_data = {
            "name": "Alex Mercer",
            "email": "alex.mercer@voro.cyber",
            "role": "Lead Architect"
        }
        profile_data = {
            "completedOnboarding": True,
            "theme": "dark",
            "createdAt": "2025-01-01T00:00:00.000Z"
        }

        # Seed localStorage before navigating
        await page.goto("http://localhost:5173/analytics/dashboard")
        await page.evaluate(f"""() => {{
            localStorage.setItem('voro_test_mode', 'true');
            localStorage.setItem('voro_user', JSON.stringify({json.dumps(user_data)}));
            localStorage.setItem('voro_profile', JSON.stringify({json.dumps(profile_data)}));
        }}""")

        # Reload so AppContext initializes with seeded storage
        await page.goto("http://localhost:5173/analytics/dashboard", wait_until="networkidle")
        await asyncio.sleep(2)

        await page.screenshot(path="/home/jules/verification/statistics_page.png")
        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
