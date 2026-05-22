"""
test_05_about_contact.py  –  About & Contact page test cases
Website : Great Gaining Institution (https://gg-web-sigma.vercel.app)
"""

import pytest
from selenium.webdriver.common.by import By
from pages import AboutPage, ContactPage


class TestAboutPage:

    # TC-AB-001
    def test_about_page_loads(self, driver):
        """About page title is correct"""
        page = AboutPage(driver)
        page.load()
        assert "About" in page.get_title(), \
            f"Unexpected title: {page.get_title()}"

    # TC-AB-002
    def test_main_heading_visible(self, driver):
        """H1 heading on about page is visible"""
        page = AboutPage(driver)
        page.load()
        heading = page.get_heading()
        assert heading.strip() != "", "H1 heading should not be empty"

    # TC-AB-003
    def test_stats_visible(self, driver):
        """Key stats (students, placement rate) are visible"""
        page = AboutPage(driver)
        page.load()
        src = driver.page_source
        assert "2,000" in src or "2000" in src or "2K" in src, \
            "Student count stat not visible"
        assert "95%" in src, "Placement rate stat not visible"

    # TC-AB-004
    def test_mission_section_present(self, driver):
        """Mission section is present"""
        page = AboutPage(driver)
        page.load()
        assert "Mission" in driver.page_source, "Mission section not found"

    # TC-AB-005
    def test_vision_section_present(self, driver):
        """Vision section is present"""
        page = AboutPage(driver)
        page.load()
        assert "Vision" in driver.page_source, "Vision section not found"

    # TC-AB-006
    def test_founding_year_mentioned(self, driver):
        """Founding year 2022 is mentioned"""
        page = AboutPage(driver)
        page.load()
        assert "2022" in driver.page_source, "Founding year not found"

    # TC-AB-007
    def test_faq_section_exists(self, driver):
        """FAQ section exists on about page"""
        page = AboutPage(driver)
        page.load()
        assert "FAQ" in driver.page_source or \
               "Frequently" in driver.page_source or \
               "Questions" in driver.page_source, \
            "FAQ section not found on about page"

    # TC-AB-008
    def test_course_list_on_about(self, driver):
        """About page lists at least some courses"""
        page = AboutPage(driver)
        page.load()
        assert "Frontend Development" in driver.page_source or \
               "Software Testing" in driver.page_source, \
            "Course list not visible on about page"


class TestContactPage:

    # TC-CT-001
    def test_contact_page_loads(self, driver):
        """Contact page title is correct"""
        page = ContactPage(driver)
        page.load()
        assert "Contact" in page.get_title(), \
            f"Unexpected title: {page.get_title()}"

    # TC-CT-002
    def test_phone_number_visible(self, driver):
        """Phone number is visible on contact page"""
        page = ContactPage(driver)
        page.load()
        assert "88388" in driver.page_source or "+91" in driver.page_source, \
            "Phone number not visible"

    # TC-CT-003
    def test_email_address_visible(self, driver):
        """Email address is visible on contact page"""
        page = ContactPage(driver)
        page.load()
        assert "greatgaining" in driver.page_source or \
               "info@" in driver.page_source, \
            "Email address not visible"

    # TC-CT-004
    def test_address_visible(self, driver):
        """Chennai address is visible"""
        page = ContactPage(driver)
        page.load()
        assert "Chennai" in driver.page_source, "Address not visible"

    # TC-CT-005
    def test_contact_form_name_field(self, driver):
        """Name field present in contact form"""
        page = ContactPage(driver)
        page.load()
        assert page.is_visible(*page.NAME_INPUT), "Name field not found"

    # TC-CT-006
    def test_contact_form_email_field(self, driver):
        """Email field present in contact form"""
        page = ContactPage(driver)
        page.load()
        assert page.is_visible(*page.EMAIL_INPUT), "Email field not found"

    # TC-CT-007
    def test_contact_form_message_field(self, driver):
        """Message textarea present"""
        page = ContactPage(driver)
        page.load()
        assert page.is_visible(*page.MESSAGE_INPUT), "Message textarea not found"

    # TC-CT-008
    def test_course_dropdown_options(self, driver):
        """Course dropdown has multiple options"""
        from selenium.webdriver.support.ui import Select
        page = ContactPage(driver)
        page.load()
        try:
            sel = Select(page.find(*page.COURSE_SELECT))
            options = sel.options
            assert len(options) > 1, "Course dropdown should have multiple options"
        except Exception:
            pytest.skip("Course dropdown not found — skipping")

    # TC-CT-009
    def test_submit_empty_contact_form(self, driver):
        """Submitting empty contact form stays on page"""
        page = ContactPage(driver)
        page.load()
        page.click(*page.SUBMIT_BTN)
        assert "contact" in page.current_url().lower(), \
            "Empty contact form should keep user on contact page"

    # TC-CT-010
    def test_valid_contact_form_submission(self, driver):
        """Valid contact form submission shows success state"""
        page = ContactPage(driver)
        page.load()
        page.fill_and_submit(
            name    = "Nivetha S",
            email   = "nivetha@test.com",
            phone   = "9876543210",
            message = "I am interested in the Software Testing course.",
            course  = "Software Testing"
        )
        # Success = page shows a confirmation OR redirects
        success = (
            "success" in driver.page_source.lower() or
            "thank" in driver.page_source.lower() or
            "sent" in driver.page_source.lower() or
            "received" in driver.page_source.lower()
        )
        assert success, "Contact form did not show success state after submission"

    # TC-CT-011
    def test_working_hours_visible(self, driver):
        """Working hours are displayed"""
        page = ContactPage(driver)
        page.load()
        assert "Mon" in driver.page_source or "9 AM" in driver.page_source, \
            "Working hours not visible"

    # TC-CT-012
    def test_faq_section_on_contact(self, driver):
        """FAQ / Common Questions section exists"""
        page = ContactPage(driver)
        page.load()
        assert "Question" in driver.page_source or \
               "FAQ" in driver.page_source, \
            "FAQ section not found on contact page"
