"""
test_03_signup.py  –  Signup page test cases
Website : Great Gaining Institution (https://gg-web-sigma.vercel.app)
"""

import pytest
import time
from pages import SignupPage


class TestSignupPage:

    # TC-SU-001
    def test_signup_page_loads(self, driver):
        """Signup page title is correct"""
        page = SignupPage(driver)
        page.load()
        assert "Sign Up" in page.get_title() or "Register" in page.get_title() or \
               "Create" in page.get_title(), \
            f"Unexpected title: {page.get_title()}"

    # TC-SU-002
    def test_fullname_field_present(self, driver):
        """Full Name input is visible"""
        page = SignupPage(driver)
        page.load()
        assert page.is_visible(*page.FULLNAME_INPUT), "Full Name field not found"

    # TC-SU-003
    def test_email_field_present(self, driver):
        """Email input is visible"""
        page = SignupPage(driver)
        page.load()
        assert page.is_visible(*page.EMAIL_INPUT), "Email field not found"

    # TC-SU-004
    def test_two_password_fields_present(self, driver):
        """Both Password and Confirm Password fields are visible"""
        from selenium.webdriver.common.by import By
        page = SignupPage(driver)
        page.load()
        pwd_fields = driver.find_elements(By.CSS_SELECTOR, "input[type='password']")
        assert len(pwd_fields) >= 2, \
            f"Expected 2 password fields, found {len(pwd_fields)}"

    # TC-SU-005
    def test_submit_empty_form(self, driver):
        """Submit empty signup form stays on page"""
        page = SignupPage(driver)
        page.load()
        page.click(*page.SUBMIT_BTN)
        assert "signup" in page.current_url().lower() or \
               "register" in page.current_url().lower(), \
            "Empty form submit should keep user on signup page"

    # TC-SU-006
    def test_invalid_email_format(self, driver):
        """Invalid email format blocked on signup"""
        page = SignupPage(driver)
        page.load()
        page.type(*page.FULLNAME_INPUT, "Test User")
        page.type(*page.EMAIL_INPUT, "bademail@@test")
        from selenium.webdriver.common.by import By
        pwd_fields = driver.find_elements(By.CSS_SELECTOR, "input[type='password']")
        if pwd_fields:
            pwd_fields[0].send_keys("Test@123")
        if len(pwd_fields) > 1:
            pwd_fields[1].send_keys("Test@123")
        page.click(*page.SUBMIT_BTN)
        assert "signup" in page.current_url().lower() or \
               "register" in page.current_url().lower(), \
            "Invalid email should keep user on signup page"

    # TC-SU-007
    def test_password_fields_are_masked(self, driver):
        """All password fields are masked"""
        from selenium.webdriver.common.by import By
        page = SignupPage(driver)
        page.load()
        pwd_fields = driver.find_elements(By.CSS_SELECTOR, "input[type='password']")
        for field in pwd_fields:
            assert field.get_attribute("type") == "password", \
                "A password field is not masked"

    # TC-SU-008
    def test_login_link_on_signup_page(self, driver):
        """'Login' link on signup page navigates to login"""
        page = SignupPage(driver)
        page.load()
        page.click(*page.LOGIN_LINK)
        assert "login" in page.current_url().lower(), \
            f"Expected login URL, got: {page.current_url()}"

    # TC-SU-009
    def test_valid_signup(self, driver):
        """
        Valid signup with unique email.
        Uses timestamp to generate a unique email each run.
        """
        page = SignupPage(driver)
        page.load()
        unique_email = f"testuser{int(time.time())}@gg.com"
        page.signup(
            name     = "Nivetha Test",
            email    = unique_email,
            password = "Test@1234",
            confirm  = "Test@1234"
        )
        # After successful signup, should redirect (away from signup page)
        # or show a success message — either is a pass
        success = (
            "signup" not in page.current_url().lower() or
            "success" in driver.page_source.lower() or
            "account" in driver.page_source.lower() or
            "created" in driver.page_source.lower()
        )
        assert success, "Signup did not show success state"

    # TC-SU-010
    def test_password_mismatch(self, driver):
        """Mismatched passwords should show error / stay on page"""
        page = SignupPage(driver)
        page.load()
        page.signup(
            name     = "Mismatch User",
            email    = "mismatch@test.com",
            password = "Test@123",
            confirm  = "Wrong@999"
        )
        # Should stay on signup or show error
        error_present = (
            "signup" in page.current_url().lower() or
            "register" in page.current_url().lower() or
            "password" in driver.page_source.lower()
        )
        assert error_present, "Password mismatch should keep user on signup page"
