import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page(viewport={'width': 1280, 'height': 900})

        await page.goto('http://localhost:5173/')

        # Set test bypass flag in localStorage & window
        await page.evaluate("""
            () => {
                localStorage.setItem('voro_test_mode', 'true');
                localStorage.setItem('voro_user', JSON.stringify({ id: 'u1', name: 'Test User' }));
                localStorage.setItem('voro_profile', JSON.stringify({ completedOnboarding: true }));
            }
        """)

        await page.goto('http://localhost:5173/body/vitals')
        await page.wait_for_timeout(3000)

        print("Current URL:", page.url)
        content = await page.content()
        print("Body text preview:", (await page.text_content('body'))[:300])

        await page.screenshot(path='webs/vitals_debug.png')
        await browser.close()

if __name__ == '__main__':
    asyncio.run(main())
