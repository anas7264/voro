import json
from playwright.sync_api import sync_playwright

def verify_vitals():
    print("Starting Playwright verification...")
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)

        # Prepare storage state to avoid attestation issues
        storage_state = {
            "cookies": [],
            "origins": [
                {
                    "origin": "http://localhost:4173",
                    "localStorage": [
                        {"name": "voro_test_mode", "value": "true"},
                        {"name": "voro_user", "value": json.dumps({
                            "name": "Somatic Architect",
                            "age": 28,
                            "gender": "Male",
                            "currentWeight": 78.5,
                            "heightCm": 182.0,
                            "onboarded": True,
                            "createdAt": "2025-01-01T00:00:00.000Z"
                        })},
                        {"name": "voro_profile", "value": json.dumps({
                            "name": "Somatic Architect",
                            "age": 28,
                            "gender": "Male",
                            "currentWeight": 78.5,
                            "heightCm": 182.0
                        })},
                        {"name": "voro_backup_v2", "value": "true"}
                    ]
                }
            ]
        }

        context = browser.new_context(
            viewport={"width": 1440, "height": 900},
            storage_state=storage_state
        )

        # Inject bypass before any script executes
        context.add_init_script("window.__VORO_TEST_BYPASS__ = true;")

        page = context.new_page()

        # Navigate to Vitals page
        print("Navigating to http://localhost:4173/body/vitals...")
        page.goto("http://localhost:4173/body/vitals")

        # Wait for network idle and specific elements
        page.wait_for_load_state("networkidle")
        page.wait_for_timeout(2000)

        print("Vitals tracker loaded. Taking screenshot...")
        page.screenshot(path="/home/jules/verification/vitals_page_initial.png", full_page=True)

        # Focus on one of the sliders to demonstrate the keyboard focus outline and status
        print("Focusing on Neural Balance slider...")
        slider = page.locator('input[type="range"]').first
        slider.focus()
        page.wait_for_timeout(1000)
        page.screenshot(path="/home/jules/verification/vitals_page_focus.png")

        print("Screenshots captured successfully.")
        browser.close()

if __name__ == "__main__":
    verify_vitals()
