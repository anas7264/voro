import os
from playwright.sync_api import sync_playwright

def run_cuj(context, page):
    # Setup directories
    os.makedirs("/home/jules/verification/screenshots", exist_ok=True)
    os.makedirs("/home/jules/verification/videos", exist_ok=True)

    # Listen to console and page errors
    page.on("console", lambda msg: print(f"BROWSER CONSOLE: {msg.text}"))
    page.on("pageerror", lambda exc: print(f"BROWSER ERROR: {exc}"))

    # Add init script to bypass RASP lockdown and seed database state
    print("Registering early RASP test bypass and seeding localStorage...")
    context.add_init_script("""
        localStorage.setItem('voro_test_mode', 'true');
        window.__VORO_TEST_BYPASS__ = true;
        localStorage.setItem('voro_user', JSON.stringify({ name: 'Voro Champion' }));
        localStorage.setItem('voro_profile', JSON.stringify({ name: 'Voro Champion', age: 30, height: 180, weight: 80, gender: 'male', goal: 'build muscle', activityLevel: 'moderately active' }));
        localStorage.setItem('voro_settings', JSON.stringify({ theme: 'dark' }));
    """)

    # Navigate to settings page
    print("Navigating to Settings page...")
    page.goto("http://localhost:4173/settings")
    page.wait_for_timeout(2000)

    # Handle the dialogs automatically
    dialog_sequence = []

    def handle_dialog(dialog):
        print(f"Dialog encountered: {dialog.type} with message: '{dialog.message}'")
        dialog_sequence.append(dialog.type)
        if dialog.type == "confirm":
            dialog.accept()
        elif dialog.type == "prompt":
            dialog.accept("MyVoroEnclavePassword123!")

    page.on("dialog", handle_dialog)

    # Click the "Export Archive" button and capture the download
    print("Clicking 'Export Archive' button...")
    try:
        # Use a more specific selector to find the button
        button = page.locator("button:has-text('Export Archive')")
        button.click()
        print("Export Archive clicked.")
    except Exception as e:
        print(f"Click failed: {e}")

    page.wait_for_timeout(2000)

    # Take screenshot at key moment
    page.screenshot(path="/home/jules/verification/screenshots/settings_backup_dialogs.png")
    print("Screenshot saved.")
    page.wait_for_timeout(1000)

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            record_video_dir="/home/jules/verification/videos"
        )
        page = context.new_page()
        try:
            run_cuj(context, page)
        finally:
            context.close()
            browser.close()
            print("Browser closed.")
