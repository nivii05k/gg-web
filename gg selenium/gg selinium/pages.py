"""
pages.py  –  Page Object Model for Great Gaining Institution website
All locators are kept here so tests stay clean and easy to maintain.
"""

from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait, Select
from selenium.webdriver.support import expected_conditions as EC

BASE_URL = "https://gg-web-sigma.vercel.app"
WAIT     = 8   # seconds


# ─────────────────────────────────────────────────────────────
#  BasePage
# ─────────────────────────────────────────────────────────────
class BasePage:
    def __init__(self, driver):
        self.driver = driver
        self.wait   = WebDriverWait(driver, WAIT)

    def open(self, path=""):
        self.driver.get(BASE_URL + path)

    def get_title(self):
        return self.driver.title

    def find(self, by, value):
        return self.wait.until(EC.presence_of_element_located((by, value)))

    def click(self, by, value):
        self.wait.until(EC.element_to_be_clickable((by, value))).click()

    def type(self, by, value, text):
        el = self.find(by, value)
        el.clear()
        el.send_keys(text)

    def get_text(self, by, value):
        return self.find(by, value).text

    def is_visible(self, by, value):
        try:
            self.wait.until(EC.visibility_of_element_located((by, value)))
            return True
        except Exception:
            return False

    def current_url(self):
        return self.driver.current_url


# ─────────────────────────────────────────────────────────────
#  HomePage
# ─────────────────────────────────────────────────────────────
class HomePage(BasePage):
    PATH = "/index.html"

    # Locators
    NAV_HOME      = (By.LINK_TEXT, "Home")
    NAV_COURSES   = (By.LINK_TEXT, "Courses")
    NAV_ABOUT     = (By.LINK_TEXT, "About")
    NAV_CONTACT   = (By.LINK_TEXT, "Contact")
    NAV_DASHBOARD = (By.LINK_TEXT, "Dashboard")
    NAV_LOGIN     = (By.LINK_TEXT, "Login")
    HERO_HEADING  = (By.TAG_NAME,  "h1")
    EXPLORE_BTN   = (By.LINK_TEXT, "Explore Courses")
    ENROL_BTN     = (By.LINK_TEXT, "Enrol Now")
    COUNSELLOR_BTN= (By.LINK_TEXT, "Talk to a Counsellor")
    FOOTER_COPY   = (By.XPATH, "//p[contains(text(),'Great Gaining Institution')]")

    def load(self):
        self.open(self.PATH)

    def click_explore_courses(self):
        self.click(*self.EXPLORE_BTN)

    def click_enrol_now(self):
        self.click(*self.ENROL_BTN)

    def click_nav_login(self):
        self.click(*self.NAV_LOGIN)

    def click_nav_courses(self):
        self.click(*self.NAV_COURSES)

    def click_nav_about(self):
        self.click(*self.NAV_ABOUT)

    def click_nav_contact(self):
        self.click(*self.NAV_CONTACT)

    def hero_heading_text(self):
        return self.get_text(*self.HERO_HEADING)


# ─────────────────────────────────────────────────────────────
#  LoginPage
# ─────────────────────────────────────────────────────────────
class LoginPage(BasePage):
    PATH = "/login.html"

    EMAIL_INPUT    = (By.CSS_SELECTOR, "input[type='email'], input[placeholder*='Email'], input[placeholder*='Username']")
    PASSWORD_INPUT = (By.CSS_SELECTOR, "input[type='password']")
    LOGIN_BTN      = (By.CSS_SELECTOR, "button[type='submit'], .login-btn, button")
    SIGNUP_LINK    = (By.LINK_TEXT, "Sign Up")
    FORGOT_LINK    = (By.LINK_TEXT, "Forgot Password?")
    STUDENT_TAB    = (By.XPATH, "//button[contains(text(),'Student')]")
    ADMIN_TAB      = (By.XPATH, "//button[contains(text(),'Admin')]")

    def load(self):
        self.open(self.PATH)

    def login(self, email, password):
        self.type(*self.EMAIL_INPUT, email)
        self.type(*self.PASSWORD_INPUT, password)
        self.click(*self.LOGIN_BTN)

    def click_student_tab(self):
        self.click(*self.STUDENT_TAB)

    def click_admin_tab(self):
        self.click(*self.ADMIN_TAB)

    def click_forgot_password(self):
        self.click(*self.FORGOT_LINK)

    def click_signup_link(self):
        self.click(*self.SIGNUP_LINK)


# ─────────────────────────────────────────────────────────────
#  SignupPage
# ─────────────────────────────────────────────────────────────
class SignupPage(BasePage):
    PATH = "/signup.html"

    FULLNAME_INPUT  = (By.CSS_SELECTOR, "input[placeholder*='Full Name'], input[name='fullname'], input[name='name']")
    EMAIL_INPUT     = (By.CSS_SELECTOR, "input[type='email']")
    PASSWORD_INPUT  = (By.CSS_SELECTOR, "input[type='password']:nth-of-type(1), input[placeholder*='Password']:not([placeholder*='Confirm'])")
    CONFIRM_INPUT   = (By.CSS_SELECTOR, "input[placeholder*='Confirm'], input[name='confirm']")
    SUBMIT_BTN      = (By.CSS_SELECTOR, "button[type='submit'], button")
    LOGIN_LINK      = (By.LINK_TEXT, "Login")
    STUDENT_TAB     = (By.XPATH, "//button[contains(text(),'Student')]")

    def load(self):
        self.open(self.PATH)

    def signup(self, name, email, password, confirm=None):
        self.type(*self.FULLNAME_INPUT, name)
        self.type(*self.EMAIL_INPUT, email)
        # Handle two password fields
        pwd_fields = self.driver.find_elements(By.CSS_SELECTOR, "input[type='password']")
        if len(pwd_fields) >= 1:
            pwd_fields[0].clear()
            pwd_fields[0].send_keys(password)
        if len(pwd_fields) >= 2:
            pwd_fields[1].clear()
            pwd_fields[1].send_keys(confirm if confirm else password)
        self.click(*self.SUBMIT_BTN)


# ─────────────────────────────────────────────────────────────
#  CoursesPage
# ─────────────────────────────────────────────────────────────
class CoursesPage(BasePage):
    PATH = "/course.html"

    COURSE_CARDS   = (By.CSS_SELECTOR, ".course-card, .card, article")
    COURSE_TITLES  = (By.CSS_SELECTOR, "h3")
    APPLY_BTNS     = (By.XPATH, "//button[contains(text(),'Apply')] | //a[contains(text(),'Apply')]")
    CLOSE_MODAL    = (By.CSS_SELECTOR, ".close, .modal-close, [aria-label='Close']")

    def load(self):
        self.open(self.PATH)

    def get_all_course_titles(self):
        cards = self.driver.find_elements(*self.COURSE_TITLES)
        return [c.text for c in cards if c.text.strip()]

    def click_first_apply(self):
        btns = self.driver.find_elements(*self.APPLY_BTNS)
        if btns:
            btns[0].click()

    def close_modal(self):
        try:
            self.click(*self.CLOSE_MODAL)
        except Exception:
            pass


# ─────────────────────────────────────────────────────────────
#  AboutPage
# ─────────────────────────────────────────────────────────────
class AboutPage(BasePage):
    PATH = "/about.html"

    HEADING       = (By.TAG_NAME, "h1")
    STAT_ITEMS    = (By.CSS_SELECTOR, ".stat, .counter, .number")
    FAQ_QUESTIONS = (By.CSS_SELECTOR, ".faq-question, .accordion-header, details summary")

    def load(self):
        self.open(self.PATH)

    def get_heading(self):
        return self.get_text(*self.HEADING)

    def click_first_faq(self):
        faqs = self.driver.find_elements(*self.FAQ_QUESTIONS)
        if faqs:
            faqs[0].click()


# ─────────────────────────────────────────────────────────────
#  ContactPage
# ─────────────────────────────────────────────────────────────
class ContactPage(BasePage):
    PATH = "/contact.html"

    NAME_INPUT    = (By.CSS_SELECTOR, "input[placeholder*='Name'], input[name='name']")
    EMAIL_INPUT   = (By.CSS_SELECTOR, "input[type='email']")
    PHONE_INPUT   = (By.CSS_SELECTOR, "input[type='tel'], input[placeholder*='Phone']")
    COURSE_SELECT = (By.CSS_SELECTOR, "select")
    MESSAGE_INPUT = (By.CSS_SELECTOR, "textarea")
    SUBMIT_BTN    = (By.CSS_SELECTOR, "button[type='submit'], button")
    SUCCESS_MSG   = (By.CSS_SELECTOR, ".success, .alert-success, .toast")

    def load(self):
        self.open(self.PATH)

    def fill_and_submit(self, name, email, phone, message, course=None):
        self.type(*self.NAME_INPUT, name)
        self.type(*self.EMAIL_INPUT, email)
        try:
            self.type(*self.PHONE_INPUT, phone)
        except Exception:
            pass
        if course:
            try:
                sel = Select(self.find(*self.COURSE_SELECT))
                sel.select_by_visible_text(course)
            except Exception:
                pass
        self.type(*self.MESSAGE_INPUT, message)
        self.click(*self.SUBMIT_BTN)
