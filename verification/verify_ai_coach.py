from playwright.sync_api import Page, expect, sync_playwright
import time

def verify_ai_coach(page: Page):
    # Set up localStorage to bypass OnboardingGuard
    page.goto("http://localhost:5173")
    page.evaluate("""
        localStorage.setItem('voro_user', JSON.stringify({ name: 'Elite User' }));
        localStorage.setItem('voro_profile', JSON.stringify({ completedOnboarding: true }));
    """)

    # Navigate to AI Coach
    page.goto("http://localhost:5173/ai-coach")

    # Wait for the page to load
    expect(page.get_by_role("heading", name="Neural Oracle")).to_be_visible()

    # Take a screenshot of the initial state (Welcome / Inquiry Prisms)
    page.screenshot(path="verification/ai_coach_initial.png")

    # Act: Click a quick prompt
    page.get_by_text("WHAT SHOULD I EAT TODAY?").click()

    # Wait for the loading state
    expect(page.get_by_text("Synthesizing Biological Data...")).to_be_visible()

    # Take a screenshot of the loading state
    page.screenshot(path="verification/ai_coach_loading.png")

    # Wait for the AI response
    time.sleep(2)

    # Take a screenshot of the chat history (Insight Artifacts)
    page.screenshot(path="verification/ai_coach_chat.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_ai_coach(page)
        finally:
            browser.close()
