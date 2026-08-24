import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(viewport={'width': 1280, 'height': 900})

        # Inject test mode and profile before any page script executes
        await context.add_init_script("""
            window.__VORO_TEST_BYPASS__ = true;
            localStorage.setItem('voro_test_mode', 'true');
            localStorage.setItem('voro_user', JSON.stringify({
                id: 'usr_test_architect',
                name: 'Aesthetic Architect',
                email: 'architect@voro.forge'
            }));
            localStorage.setItem('voro_profile', JSON.stringify({
                name: 'Aesthetic Architect',
                completedOnboarding: true
            }));
            localStorage.setItem('voro_vitals', JSON.stringify([
                {
                    id: "vit_1",
                    date: "2025-02-20T10:00:00.000Z",
                    restingHeartRate: 58,
                    bloodPressureSystolic: 118,
                    bloodPressureDiastolic: 76,
                    hrv: 82,
                    bloodOxygen: 99,
                    temperature: 98.4,
                    respiratoryRate: 14,
                    notes: "Optimal recovery state following morning kinetic session."
                },
                {
                    id: "vit_2",
                    date: "2025-02-19T09:30:00.000Z",
                    restingHeartRate: 61,
                    bloodPressureSystolic: 120,
                    bloodPressureDiastolic: 78,
                    hrv: 78,
                    bloodOxygen: 98,
                    temperature: 98.6,
                    respiratoryRate: 15,
                    notes: "Post-fasting biometric baseline."
                }
            ]));
        """)

        page = await context.new_page()
        await page.goto('http://localhost:5173/body/vitals')

        # Wait for the main title to render
        await page.wait_for_selector('text=AUTONOMIC BIO-FREQUENCY', timeout=10000)

        # Hover over the ECG Card to activate 3D tilt and spatial telemetry tracking
        ecg_card = await page.query_selector('.group\\/ecg')
        if ecg_card:
            box = await ecg_card.bounding_box()
            if box:
                await page.mouse.move(box['x'] + box['width'] * 0.7, box['y'] + box['height'] * 0.3)

        await page.wait_for_timeout(1000)
        await page.screenshot(path='webs/vitals_tracker_forge.png', full_page=True)
        print("Screenshot successfully saved to webs/vitals_tracker_forge.png")

        await browser.close()

if __name__ == '__main__':
    asyncio.run(main())
