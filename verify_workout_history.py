import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            viewport={'width': 1280, 'height': 960},
            record_video_dir="/home/jules/verification/videos"
        )
        page = await context.new_page()

        # Seed local storage
        await page.goto("http://localhost:4173")
        await page.evaluate("""() => {
            localStorage.setItem('voro_onboarding_completed', 'true');
            localStorage.setItem('voro_workouts', JSON.stringify([
                {
                    id: 'w1',
                    date: '2025-05-18T10:00:00.000Z',
                    title: 'HYPERTROPHY CHEST & TRICEPS ENCLAVE',
                    notes: 'Peak velocity and mechanical tension achieved across all working sets.',
                    volume: 12450,
                    duration: 3420,
                    exercises: [
                        { name: 'Incline Dumbbell Press', sets: [{ reps: 10, weight: 42 }, { reps: 8, weight: 46 }] },
                        { name: 'Cable Triceps Overhead Extension', sets: [{ reps: 12, weight: 35 }] }
                    ]
                },
                {
                    id: 'w2',
                    date: '2025-05-16T14:30:00.000Z',
                    title: 'POSTERIOR CHAIN POWER ARCHITECTURE',
                    notes: 'Sub-maximal RPE 8 loading pattern with optimal mechanical alignment.',
                    volume: 18200,
                    duration: 4100,
                    exercises: [
                        { name: 'Barbell Deadlift', sets: [{ reps: 5, weight: 180 }, { reps: 5, weight: 190 }] }
                    ]
                }
            ]));
        }""")

        await page.goto("http://localhost:4173/#/history")
        await page.wait_for_timeout(2000)

        # Hover over first workout card to demonstrate 3D volumetric tilt and light mask
        card = page.locator("[data-attestation]").first
        if await card.count() > 0:
            box = await card.bounding_box()
            if box:
                await page.mouse.move(box['x'] + box['width'] * 0.7, box['y'] + box['height'] * 0.3)
                await page.wait_for_timeout(500)

        await page.screenshot(path="/home/jules/verification/screenshots/workout_history_forge.png")
        await context.close()
        await browser.close()

asyncio.run(run())
