"""
test_01_home.py  –  Home page test cases
Website : Great Gaining Institution (https://gg-web-sigma.vercel.app)
"""

import pytest
from pages import HomePage


class TestHomePage:

    # TC-HOME-001
    def test_page_title(self, driver):
        """Page title contains institution name"""
        page = HomePage(driver)
        page.load()
        assert "Great Gaining" in page.get_title(), \
            f"Expected 'Great Gaining' in title, got: {page.get_title()}"

    # TC-HOME-002
    def test_hero_heading_visible(self, driver):
        """H1 hero heading is displayed"""
        page = HomePage(driver)
        page.load()
        heading = page.hero_heading_text()
        assert heading.strip() != "", "Hero heading should not be empty"

    # TC-HOME-003
    def test_nav_links_present(self, driver):
        """All navbar links are visible"""
        page = HomePage(driver)
        page.load()
        for locator in [page.NAV_HOME, page.NAV_COURSES, page.NAV_ABOUT,
                        page.NAV_CONTACT, page.NAV_LOGIN]:
            assert page.is_visible(*locator), f"Nav link not found: {locator}"

    # TC-HOME-004
    def test_explore_courses_navigates(self, driver):
        """'Explore Courses' button leads to courses page"""
        page = HomePage(driver)
        page.load()
        page.click_explore_courses()
        assert "course" in page.current_url().lower(), \
            f"Expected courses URL, got: {page.current_url()}"

    # TC-HOME-005
    def test_login_link_in_navbar(self, driver):
        """Login link in navbar navigates to login page"""
        page = HomePage(driver)
        page.load()
        page.click_nav_login()
        assert "login" in page.current_url().lower(), \
            f"Expected login URL, got: {page.current_url()}"

    # TC-HOME-006
    def test_enrol_now_button(self, driver):
        """'Enrol Now' CTA navigates to courses page"""
        page = HomePage(driver)
        page.load()
        page.click_enrol_now()
        assert "course" in page.current_url().lower(), \
            f"Expected courses URL, got: {page.current_url()}"

    # TC-HOME-007
    def test_about_nav_link(self, driver):
        """About nav link goes to about page"""
        page = HomePage(driver)
        page.load()
        page.click_nav_about()
        assert "about" in page.current_url().lower(), \
            f"Expected about URL, got: {page.current_url()}"

    # TC-HOME-008
    def test_contact_nav_link(self, driver):
        """Contact nav link goes to contact page"""
        page = HomePage(driver)
        page.load()
        page.click_nav_contact()
        assert "contact" in page.current_url().lower(), \
            f"Expected contact URL, got: {page.current_url()}"

    # TC-HOME-009
    def test_page_loads_without_errors(self, driver):
        """Page loads with HTTP 200 (no crash/blank page)"""
        page = HomePage(driver)
        page.load()
        assert "Great Gaining" in driver.page_source, \
            "Page source missing institution name — possible load failure"
