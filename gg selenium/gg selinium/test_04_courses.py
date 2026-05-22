"""
test_04_courses.py  –  Courses page test cases
Website : Great Gaining Institution (https://gg-web-sigma.vercel.app)
"""

import pytest
from selenium.webdriver.common.by import By
from pages import CoursesPage

EXPECTED_COURSES = [
    "Frontend Development",
    "Data Analysis",
    "Software Testing",
    "Web Development",
    "Business Analysis",
    "UI/UX Design",
    "Cyber Security",
]


class TestCoursesPage:

    # TC-CR-001
    def test_courses_page_loads(self, driver):
        """Courses page title is correct"""
        page = CoursesPage(driver)
        page.load()
        assert "Course" in page.get_title(), \
            f"Unexpected title: {page.get_title()}"

    # TC-CR-002
    def test_all_seven_courses_shown(self, driver):
        """All 7 courses are listed on the page"""
        page = CoursesPage(driver)
        page.load()
        src = driver.page_source
        for course in EXPECTED_COURSES:
            assert course in src, f"Course not found on page: {course}"

    # TC-CR-003
    def test_course_headings_visible(self, driver):
        """H3 headings for courses are visible"""
        page = CoursesPage(driver)
        page.load()
        titles = page.get_all_course_titles()
        assert len(titles) > 0, "No course titles found on courses page"

    # TC-CR-004
    def test_frontend_dev_course_present(self, driver):
        """Frontend Development course is visible"""
        page = CoursesPage(driver)
        page.load()
        assert "Frontend Development" in driver.page_source

    # TC-CR-005
    def test_software_testing_course_present(self, driver):
        """Software Testing course is visible"""
        page = CoursesPage(driver)
        page.load()
        assert "Software Testing" in driver.page_source

    # TC-CR-006
    def test_cyber_security_course_present(self, driver):
        """Cyber Security course is visible"""
        page = CoursesPage(driver)
        page.load()
        assert "Cyber Security" in driver.page_source

    # TC-CR-007
    def test_course_duration_shown(self, driver):
        """Course duration (Months) is shown"""
        page = CoursesPage(driver)
        page.load()
        assert "Month" in driver.page_source, "Course duration not visible"

    # TC-CR-008
    def test_course_price_shown(self, driver):
        """Course price (₹) is shown"""
        page = CoursesPage(driver)
        page.load()
        assert "₹" in driver.page_source or "Rs" in driver.page_source, \
            "Course price not visible"

    # TC-CR-009
    def test_nav_login_from_courses(self, driver):
        """Login link in navbar works from courses page"""
        page = CoursesPage(driver)
        page.load()
        page.click(By.LINK_TEXT, "Login")
        assert "login" in page.current_url().lower(), \
            f"Expected login URL, got: {page.current_url()}"

    # TC-CR-010
    def test_course_images_present(self, driver):
        """Course card images are present"""
        page = CoursesPage(driver)
        page.load()
        images = driver.find_elements(By.TAG_NAME, "img")
        assert len(images) > 0, "No images found on courses page"
