"""
test_02_login.py  –  Login page test cases
Website : Great Gaining Institution (https://gg-web-sigma.vercel.app)
"""

import pytest
from pages import LoginPage, SignupPage


class TestLoginPage:

    # TC-LG-001
    def test_login_page_loads(self, driver):
        """Login page title and heading are correct"""
        page = LoginPage(driver)
        page.load()
        assert "Login" in page.get_title(), \
            f"Expected 'Login' in title, got: {page.get_title()}"

    # TC-LG-002
    def test_email_field_present(self, driver):
        """Email input field is visible"""
        page = LoginPage(driver)
        page.load()
        assert page.is_visible(*page.EMAIL_INPUT), "Email field not found on login page"

    # TC-LG-003
    def test_password_field_present(self, driver):
        """Password input field is visible"""
        page = LoginPage(driver)
        page.load()
        assert page.is_visible(*page.PASSWORD_INPUT), "Password field not found on login page"

    # TC-LG-004
    def test_student_tab_visible(self, driver):
        """Student role tab is visible"""
        page = LoginPage(driver)
        page.load()
        assert page.is_visible(*page.STUDENT_TAB), "Student tab not visible"

    # TC-LG-005
    def test_admin_tab_visible(self, driver):
        """Admin role tab is visible"""
        page = LoginPage(driver)
        page.load()
        assert page.is_visible(*page.ADMIN_TAB), "Admin tab not visible"

    # TC-LG-006
    def test_forgot_password_link(self, driver):
        """Forgot Password link is clickable and navigates"""
        page = LoginPage(driver)
        page.load()
        page.click_forgot_password()
        assert "forgot" in page.current_url().lower() or \
               "password" in page.current_url().lower() or \
               "reset" in page.current_url().lower(), \
            f"Expected forgot-password URL, got: {page.current_url()}"

    # TC-LG-007
    def test_signup_link_on_login_page(self, driver):
        """'Sign Up' link on login page navigates to signup"""
        page = LoginPage(driver)
        page.load()
        page.click_signup_link()
        assert "signup" in page.current_url().lower() or \
               "register" in page.current_url().lower(), \
            f"Expected signup URL, got: {page.current_url()}"

    # TC-LG-008
    def test_login_with_empty_fields(self, driver):
        """Submit with empty fields — should not navigate away"""
        page = LoginPage(driver)
        page.load()
        page.click(*page.LOGIN_BTN)
        # Should still be on login page
        assert "login" in page.current_url().lower(), \
            "Empty submit should keep user on login page"

    # TC-LG-009
    def test_login_with_invalid_email_format(self, driver):
        """Invalid email format shows validation"""
        page = LoginPage(driver)
        page.load()
        page.type(*page.EMAIL_INPUT, "notanemail")
        page.type(*page.PASSWORD_INPUT, "Test@123")
        page.click(*page.LOGIN_BTN)
        assert "login" in page.current_url().lower(), \
            "Invalid email format should keep user on login page"

    # TC-LG-010
    def test_password_field_masked(self, driver):
        """Password field type is 'password' (masked)"""
        page = LoginPage(driver)
        page.load()
        pwd_field = page.find(*page.PASSWORD_INPUT)
        assert pwd_field.get_attribute("type") == "password", \
            "Password field should be masked (type='password')"

    # TC-LG-011
    def test_valid_login_student(self, driver):
        """
        Valid student login navigates to dashboard.
        NOTE: Requires a registered student account.
        Update the email/password below to a real test account.
        """
        # ── UPDATE THESE with a real registered account ──
        TEST_EMAIL    = "2413711058029@mopvaishnav.ac.in"
        TEST_PASSWORD = "123456"
        # ─────────────────────────────────────────────────
        page = LoginPage(driver)
        page.load()
        page.click_student_tab()
        page.login(TEST_EMAIL, TEST_PASSWORD)
        # After login, should redirect away from login page
        assert "login" not in page.current_url().lower() or \
               "dashboard" in page.current_url().lower(), \
            f"Login did not redirect. Current URL: {page.current_url()}"
