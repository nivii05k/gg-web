"""
test_06_navigation_ui.py  –  Navigation & UI / Accessibility test cases
Website : Great Gaining Institution (https://gg-web-sigma.vercel.app)
"""

import pytest
from selenium.webdriver.common.by import By
from pages import HomePage, BasePage

ALL_PAGES = [
    ("/index.html",   "Great Gaining"),
    ("/course.html",  "Course"),
    ("/about.html",   "About"),
    ("/contact.html", "Contact"),
    ("/login.html",   "Login"),
    ("/signup.html",  "Sign"),
]


class TestNavigation:

    # TC-NAV-001  (parametrized)
    @pytest.mark.parametrize("path,expected_title_word", ALL_PAGES)
    def test_all_pages_load(self, driver, path, expected_title_word):
        """Every page should load and have the correct title keyword"""
        page = BasePage(driver)
        page.open(path)
        assert expected_title_word in page.get_title(), \
            f"Page {path}: expected '{expected_title_word}' in title, got '{page.get_title()}'"

    # TC-NAV-002
    def test_logo_visible_on_home(self, driver):
        """Institution logo / brand name visible on home page"""
        page = HomePage(driver)
        page.load()
        assert "Great Gaining" in driver.page_source, "Brand name not found on homepage"

    # TC-NAV-003
    def test_footer_copyright_on_home(self, driver):
        """Footer with copyright notice visible on home page"""
        page = HomePage(driver)
        page.load()
        assert "2025" in driver.page_source or "©" in driver.page_source, \
            "Footer copyright not found"

    # TC-NAV-004
    def test_footer_course_links(self, driver):
        """Footer contains course links"""
        page = HomePage(driver)
        page.load()
        footer_links = driver.find_elements(By.CSS_SELECTOR, "footer a")
        assert len(footer_links) > 0, "No links found in footer"

    # TC-NAV-005
    def test_no_broken_internal_links(self, driver):
        """Key internal links in navbar resolve (not 404)"""
        base = BasePage(driver)
        for path, _ in ALL_PAGES:
            base.open(path)
            assert "404" not in driver.page_source.lower() and \
                   "not found" not in driver.title.lower(), \
                f"Possible 404 on {path}"

    # TC-NAV-006
    def test_navbar_login_link_all_pages(self, driver):
        """Login link visible in navbar on every page"""
        base = BasePage(driver)
        for path, _ in ALL_PAGES:
            base.open(path)
            links = driver.find_elements(By.LINK_TEXT, "Login")
            assert len(links) > 0, f"Login link not found on {path}"

    # TC-NAV-007
    def test_back_navigation(self, driver):
        """Browser back button works between pages"""
        page = HomePage(driver)
        page.load()
        page.click_nav_courses()
        driver.back()
        assert "index" in page.current_url().lower() or \
               page.current_url().endswith("/"), \
            "Back navigation didn't return to home page"


class TestUIElements:

    # TC-UI-001
    def test_images_have_src(self, driver):
        """All img tags on courses page have a src attribute"""
        page = BasePage(driver)
        page.open("/course.html")
        images = driver.find_elements(By.TAG_NAME, "img")
        for img in images:
            src = img.get_attribute("src")
            assert src and src.strip() != "", "An image has empty src"

    # TC-UI-002
    def test_page_not_blank(self, driver):
        """Page body is not empty on home"""
        page = HomePage(driver)
        page.load()
        body = driver.find_element(By.TAG_NAME, "body").text
        assert len(body.strip()) > 100, "Page body content too short — possibly blank"

    # TC-UI-003
    def test_contact_info_in_footer(self, driver):
        """Contact details in footer (phone + email)"""
        page = HomePage(driver)
        page.load()
        assert "88388" in driver.page_source, "Phone not in footer"
        assert "greatgaining" in driver.page_source, "Email not in footer"

    # TC-UI-004
    def test_placement_rate_displayed(self, driver):
        """95% placement rate stat is shown on home"""
        page = HomePage(driver)
        page.load()
        assert "95%" in driver.page_source, "Placement rate not visible on homepage"

    # TC-UI-005
    def test_student_count_displayed(self, driver):
        """Student count (2K / 2000) is shown on home"""
        page = HomePage(driver)
        page.load()
        src = driver.page_source
        assert "2K" in src or "2,000" in src or "2000" in src, \
            "Student count not visible on homepage"
