import os
import time
from playwright.sync_api import sync_playwright, expect

def main():
    print("Starting Playwright frontend verification...")
    with sync_playwright() as p:
        # Launch browser
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()

        # Inject the Voro test bypass flag and localStorage setup into context initialization
        context.add_init_script("""
            window.__VORO_TEST_BYPASS__ = true;
            localStorage.setItem('voro_test_mode', 'true');
            localStorage.setItem('voro_profile', JSON.stringify({
                name: 'Julian de Forge',
                completedOnboarding: true,
                createdAt: new Date().toISOString()
            }));
            localStorage.setItem('voro_user', JSON.stringify({
                name: 'Julian de Forge',
                heightCm: 185,
                gender: 'Male',
                age: 28,
                primaryGoal: 'Strength',
                waterGoal: 2500,
                calorieGoal: 2800,
                proteinGoal: 180,
                carbsGoal: 320,
                fatGoal: 80
            }));
        """)

        page = context.new_page()

        # Listen for console events
        page.on("console", lambda msg: print(f"PAGE LOG: {msg.text}"))

        # Navigate directly to the Recipe Builder page
        print("Navigating directly to Recipe Builder page...")
        page.goto("http://localhost:4173/nutrition/recipe-builder")
        time.sleep(3) # Let page assets and transitions load

        print("Current URL:", page.url)
        print("Page Title:", page.title())

        # Take a debugging screenshot
        page.screenshot(path="/home/jules/verification/debug_state.png")
        print("Debug screenshot saved to /home/jules/verification/debug_state.png")

        # Let's try to find any input fields on the page
        inputs = page.locator("input").all()
        print(f"Found {len(inputs)} input fields on the page:")
        for idx, inp in enumerate(inputs):
            print(f"Input {idx}: placeholder='{inp.get_attribute('placeholder')}'")

        # Let's type a custom recipe name into our luxury input if it exists
        try:
            page.fill("input[placeholder*='recipe name']", "Bespoke Trophic Elixir", timeout=5000)
            print("Successfully filled recipe name.")
        except Exception as e:
            print("Could not fill recipe name using selector:", e)

        # Let's search for "Chicken" or similar in our compound infusion search
        try:
            page.fill("input[placeholder*='Search bioactive foods']", "Chicken", timeout=5000)
            print("Successfully filled food search.")
        except Exception as e:
            print("Could not fill food search:", e)

        time.sleep(2) # Wait for search results

        # Click on search result to infuse
        try:
            page.locator("button.group\\/row").first.click(timeout=5000)
            print("Successfully clicked the first search result button.")
            time.sleep(1)
        except Exception as e:
            print("Could not click search result button:", e)

        # Let's take a final screenshot showing the formulated page
        screenshot_path = "/home/jules/verification/recipe_builder_masterpiece.png"
        page.screenshot(path=screenshot_path, full_page=True)
        print(f"Final screenshot taken and saved to {screenshot_path}")

        browser.close()

if __name__ == "__main__":
    main()
