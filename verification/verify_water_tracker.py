from playwright.sync_api import sync_playwright
import json
import os

def run_verification():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Create directories if they don't exist
        os.makedirs("/home/jules/verification/videos", exist_ok=True)
        os.makedirs("/home/jules/verification/screenshots", exist_ok=True)

        context = browser.new_context(
            record_video_dir="/home/jules/verification/videos",
            viewport={'width': 1280, 'height': 800}
        )
        page = context.new_page()

        try:
            # 1. Bypass onboarding
            page.goto("http://localhost:5173/onboarding")
            page.wait_for_timeout(1000)

            user_data = {"name": "Architect", "email": "architect@voro.io", "waterGoal": 2000, "calorieGoal": 2500}
            profile_data = {"completedOnboarding": True}

            page.evaluate(f"window.localStorage.setItem('voro_user', '{json.dumps(user_data)}')")
            page.evaluate(f"window.localStorage.setItem('voro_profile', '{json.dumps(profile_data)}')")
            page.wait_for_timeout(500)

            # 2. Navigate to Water Tracker
            page.goto("http://localhost:5173/water")
            page.wait_for_timeout(2000)

            # 3. Interact with the tracker
            # Add 250ml
            page.get_by_role("button", name="250 ml").click()
            page.wait_for_timeout(1000)

            # Add 500ml
            page.get_by_role("button", name="500 ml").click()
            page.wait_for_timeout(1000)

            # Add 1.0L
            page.get_by_role("button", name="1.0 Liters").click()
            page.wait_for_timeout(1000)

            # 4. Final state screenshot
            page.screenshot(path="/home/jules/verification/screenshots/water_tracker_refined.png", full_page=True)
            page.wait_for_timeout(1000)

        finally:
            context.close()
            browser.close()

if __name__ == "__main__":
    run_verification()
