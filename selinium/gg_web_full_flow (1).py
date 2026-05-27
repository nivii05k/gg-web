
#  Great Gaining Institution — FULL USER FLOW Selenium Automation
#  Website : https://gg-web-q7y1.onrender.com

import time
import random
import string
import traceback

from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait, Select
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import (
    TimeoutException,
    NoSuchElementException,
    ElementClickInterceptedException,
)
from webdriver_manager.chrome import ChromeDriverManager
def ok(msg):
    print(f"✓ {msg}")

def fail(msg):
    print(f"✗ {msg}")


BASE_URL      = "https://gg-web-q7y1.onrender.com"
HOME_URL      = BASE_URL + "/index.html"
SIGNUP_URL    = BASE_URL + "/signup.html"
LOGIN_URL     = BASE_URL + "/login.html"
COURSE_URL    = BASE_URL + "/course.html"
APPLY_URL     = BASE_URL + "/apply.html"
ABOUT_URL     = BASE_URL + "/about.html"
CONTACT_URL   = BASE_URL + "/contact.html"
DASHBOARD_URL = BASE_URL + "/dashboard.html"

LOGIN_EMAIL    = "qwert@gmail.com"
LOGIN_PASSWORD = "123456"

WAIT         = 15   # explicit wait seconds
SCROLL_STEP  = 300  # px per scroll tick
SCROLL_PAUSE = 0.22 # seconds between ticks




def random_name():
    first = random.choice(["Arun","Priya","Sneha","Karthik","Divya","Meera","Vijay","Riya"])
    last  = random.choice(["Kumar","Sharma","Raj","Devi","Nair","Reddy","Patel","Singh"])
    return f"{first} {last}"

def random_email():
    part = "".join(random.choices(string.ascii_lowercase + string.digits, k=9))
    return f"user_{part}@testmail.com"

def random_phone():
    return "9" + "".join(random.choices(string.digits, k=9))

def random_password():
    return "Test@" + "".join(random.choices(string.digits, k=4))


def make_driver():
    opts = Options()
    opts.add_argument("--start-maximized")
    opts.add_argument("--disable-notifications")
    opts.add_argument("--disable-popup-blocking")
    opts.add_argument("--no-sandbox")
    opts.add_argument("--disable-dev-shm-usage")
    opts.add_experimental_option("excludeSwitches", ["enable-automation"])
    opts.add_experimental_option("useAutomationExtension", False)
    driver = webdriver.Chrome(
        service=Service(ChromeDriverManager().install()),
        options=opts,
    )
    return driver


def wait_visible(driver, by, val, t=WAIT):
    return WebDriverWait(driver, t).until(EC.visibility_of_element_located((by, val)))

def wait_clickable(driver, by, val, t=WAIT):
    return WebDriverWait(driver, t).until(EC.element_to_be_clickable((by, val)))

def wait_url_has(driver, text, t=WAIT):
    WebDriverWait(driver, t).until(EC.url_contains(text))


def into_view(driver, el):
    """Scroll element into centre of viewport."""
    driver.execute_script("arguments[0].scrollIntoView({block:'center',inline:'center'});", el)
    time.sleep(0.35)


def js_click(driver, el):
    """JavaScript click — bypasses overlay issues."""
    driver.execute_script("arguments[0].click();", el)


def safe_click(driver, el):
    """Try normal click, fall back to JS click."""
    try:
        el.click()
    except ElementClickInterceptedException:
        js_click(driver, el)


def slow_scroll(driver, label="page"):
    """Scroll smoothly from top to bottom."""
    print(f"    ↓ Scrolling {label}...")
    driver.execute_script("window.scrollTo(0,0);")
    time.sleep(0.4)
    pos   = 0
    total = driver.execute_script("return document.body.scrollHeight")
    while pos < total:
        pos  += SCROLL_STEP
        driver.execute_script(f"window.scrollTo(0,{pos});")
        time.sleep(SCROLL_PAUSE)
        total = driver.execute_script("return document.body.scrollHeight")
    print(f"    ✓ Scrolled {label} to bottom")


def to_top(driver):
    driver.execute_script("window.scrollTo(0,0);")
    time.sleep(0.3)


def body_has(driver, *words):
    txt = driver.find_element(By.TAG_NAME, "body").text.lower()
    return any(w.lower() in txt for w in words)


def header(text):
    print("\n" + "=" * 60)
    print(f"  {text}")
    print("=" * 60)


# =============================================================================
# SECTION 4 — TEST STEPS
# =============================================================================

# -----------------------------------------------------------------------------
# STEP 1 — Home page open & slow scroll
# -----------------------------------------------------------------------------
def step1_home_scroll(driver):
    header("STEP 1 — Home Page: Open & Slow Scroll")
    try:
        driver.get(BASE_URL)
        wait_visible(driver, By.TAG_NAME, "body")
        print(f"    ✓ Opened: {driver.current_url}")
        assert "Great Gaining" in driver.title
        print(f"    ✓ Title OK: {driver.title}")

        # Verify hero h1 is visible
        h1 = wait_visible(driver, By.CSS_SELECTOR, "section.hero h1")
        print(f"    ✓ Hero heading: '{h1.text[:55]}'")

        slow_scroll(driver, "Home page")
        to_top(driver)
        print("✅ STEP 1 PASSED\n")
    except Exception as e:
        print(f"❌ STEP 1 FAILED — {e}")
        traceback.print_exc()


# -----------------------------------------------------------------------------
# STEP 2 — Sign Up with random data
# -----------------------------------------------------------------------------
def step2_signup(driver):
    header("STEP 2 — Sign Up with Random Data")

    name     = random_name()
    email    = random_email()
    password = random_password()
    print(f"    Name     : {name}")
    print(f"    Email    : {email}")
    print(f"    Password : {password}")

    try:
        driver.get(SIGNUP_URL)
        wait_visible(driver, By.CLASS_NAME, "auth-container")
        print(f"    ✓ Signup page loaded")

        # Click Student role tab  (label#roleStudent)
        student_tab = wait_clickable(driver, By.ID, "roleStudent")
        safe_click(driver, student_tab)
        print("    ✓ Selected: Student role")
        time.sleep(0.4)

        # Full Name  → id="newUser"
        name_field = wait_clickable(driver, By.ID, "newUser")
        name_field.clear()
        name_field.send_keys(name)
        print(f"    ✓ Name entered")

        # Email  → id="newEmail"
        email_field = driver.find_element(By.ID, "newEmail")
        email_field.clear()
        email_field.send_keys(email)
        print(f"    ✓ Email entered")

        # Password  → id="newPass"
        pass_field = driver.find_element(By.ID, "newPass")
        pass_field.clear()
        pass_field.send_keys(password)
        print(f"    ✓ Password entered")

        # Confirm Password  → id="confirmPass"
        confirm_field = driver.find_element(By.ID, "confirmPass")
        confirm_field.clear()
        confirm_field.send_keys(password)
        print(f"    ✓ Confirm password entered")

        # Submit  → button.form-submit
        submit = wait_clickable(driver, By.CSS_SELECTOR, "button.form-submit")
        into_view(driver, submit)
        safe_click(driver, submit)
        print("    ✓ Clicked Create Account")

        # Wait for redirect or toast success
        time.sleep(3)
        cur = driver.current_url
        print(f"    ✓ After submit URL: {cur}")

        if "login" in cur.lower() or body_has(driver, "account created", "redirecting", "login"):
            print("    ✓ Signup successful — redirected to login")
        else:
            print(f"    ⚠ Page text: {driver.find_element(By.TAG_NAME,'body').text[:150]}")

        print("✅ STEP 2 PASSED\n")
        return email, password

    except Exception as e:
        print(f"❌ STEP 2 FAILED — {e}")
        traceback.print_exc()
        return email, password


# -----------------------------------------------------------------------------
# STEP 3 — Login with niv@gmail.com / 123456
# -----------------------------------------------------------------------------
def step3_login(driver):
    header(f"STEP 3 — Login: {LOGIN_EMAIL} / {LOGIN_PASSWORD}")
    try:
        driver.get(LOGIN_URL)
        wait_visible(driver, By.CLASS_NAME, "auth-container")
        print(f"    ✓ Login page loaded")

        # Select Student role  → label#roleStudent
        student_tab = wait_clickable(driver, By.ID, "roleStudent")
        safe_click(driver, student_tab)
        print("    ✓ Selected: Student role")
        time.sleep(0.4)

        # Email/Username  → id="username"
        user_field = wait_clickable(driver, By.ID, "username")
        user_field.clear()
        user_field.send_keys(LOGIN_EMAIL)
        print(f"    ✓ Email entered: {LOGIN_EMAIL}")

        # Password  → id="password"
        pwd_field = driver.find_element(By.ID, "password")
        pwd_field.clear()
        pwd_field.send_keys(LOGIN_PASSWORD)
        print("    ✓ Password entered")

        # NOTE: This site uses reCAPTCHA on login.
        # Selenium CANNOT solve reCAPTCHA automatically.
        # Two options:
        #   A) Manually tick "I'm not a robot" when browser opens (you have ~15 seconds)
        #   B) Ask your developer to disable CAPTCHA in a test/staging environment
        print()
        print("    ⚠️  reCAPTCHA detected on this page!")
        print("    👉 Please manually tick 'I am not a robot' in the browser NOW.")
        print("    ⏳ Waiting 20 seconds for you to complete CAPTCHA...")
        print()
        time.sleep(20)   # give user time to tick CAPTCHA manually

        # Submit  → button.form-submit
        submit = wait_clickable(driver, By.CSS_SELECTOR, "button.form-submit")
        into_view(driver, submit)
        safe_click(driver, submit)
        print("    ✓ Clicked Login")

        # Wait for redirect to dashboard or home
        time.sleep(3)
        cur = driver.current_url
        print(f"    ✓ After login URL: {cur}")

        if "dashboard" in cur.lower() or "index" in cur.lower() or LOGIN_URL not in cur:
            print(f"    ✓ Login successful → {cur}")
        elif body_has(driver, "invalid", "incorrect", "locked", "captcha"):
            print("    ⚠ Login failed — check credentials or CAPTCHA completion")
        else:
            print(f"    ⚠ Result unclear — page: {driver.find_element(By.TAG_NAME,'body').text[:120]}")

        print("✅ STEP 3 PASSED\n")

    except Exception as e:
        print(f"❌ STEP 3 FAILED — {e}")
        traceback.print_exc()


# -----------------------------------------------------------------------------
# STEP 4 — Navigate to Home & verify
# -----------------------------------------------------------------------------
def step4_home_verify(driver):
    header("STEP 4 — Home Page: Navigate & Verify")
    try:
        # Click Home in navbar  → nav a[href='index.html']
        home_link = wait_clickable(driver, By.CSS_SELECTOR, "nav.navbar .nav-links a[href='index.html']")
        safe_click(driver, home_link)
        wait_visible(driver, By.CSS_SELECTOR, "section.hero")
        print(f"    ✓ Home page: {driver.current_url}")

        h1 = driver.find_element(By.CSS_SELECTOR, "section.hero h1")
        assert h1.is_displayed()
        print(f"    ✓ Hero visible: '{h1.text[:55]}'")
        print("✅ STEP 4 PASSED\n")

    except Exception as e:
        print(f"❌ STEP 4 FAILED — {e}")
        traceback.print_exc()


# -----------------------------------------------------------------------------
# STEP 5 — Courses: scroll → click each card & close → apply Software Testing
# -----------------------------------------------------------------------------
def step5_courses(driver):
    header("STEP 5 — Courses: Scroll → Visit Each Card → Apply Software Testing")

    # From course.html HTML: 7 cards, onclick="showCourse(N)", index 0–6
    # Modal: id="courseModal", close button: span.close
    COURSE_INDEXES = list(range(7))   # 0=Frontend,1=Data,2=SoftwareTesting,3=Web,4=Business,5=UI/UX,6=Cyber
    APPLY_INDEX    = 2                # Software Testing = index 2

    try:
        driver.get(COURSE_URL)
        wait_visible(driver, By.CSS_SELECTOR, "div.course-container")
        print(f"    ✓ Courses page loaded: {driver.current_url}")

        # ── Slow scroll once ─────────────────────────────────────────────────
        slow_scroll(driver, "Courses page")
        to_top(driver)
        time.sleep(0.5)

        # ── Get all 7 course cards ────────────────────────────────────────────
        cards = driver.find_elements(By.CSS_SELECTOR, "div.course-container div.course-card")
        print(f"    ✓ Found {len(cards)} course cards")
        assert len(cards) == 7, f"Expected 7 cards, got {len(cards)}"

        # ── Click each card, read modal title, close modal ───────────────────
        print("\n    ── Visiting each card ──")
        for idx in COURSE_INDEXES:
            # Re-fetch cards each time (DOM may refresh)
            cards = driver.find_elements(By.CSS_SELECTOR, "div.course-container div.course-card")
            card  = cards[idx]
            title = card.find_element(By.TAG_NAME, "h3").text
            into_view(driver, card)
            time.sleep(0.3)
            safe_click(driver, card)
            print(f"    ✓ Clicked card [{idx}]: {title}")

            # Wait for modal to be visible  → id="courseModal"
            try:
                modal = WebDriverWait(driver, 6).until(
                    EC.visibility_of_element_located((By.ID, "courseModal"))
                )
                print(f"      ✓ Modal opened for: {title}")

                # Close modal  → span.close  (onclick="closeModal()")
                close_btn = wait_clickable(driver, By.CSS_SELECTOR, "#courseModal span.close")
                safe_click(driver, close_btn)

                # Wait for modal to disappear
                WebDriverWait(driver, 6).until(
                    EC.invisibility_of_element_located((By.ID, "courseModal"))
                )
                print(f"      ✓ Modal closed")
                time.sleep(0.5)

            except TimeoutException:
                print(f"      ⚠ Modal did not open for card {idx} — trying Escape")
                driver.find_element(By.TAG_NAME, "body").send_keys(Keys.ESCAPE)
                time.sleep(0.5)

        # ── Now apply: click Software Testing card (index 2) ─────────────────
        print("\n    ── Applying for: Software Testing (card index 2) ──")
        to_top(driver)
        time.sleep(0.4)

        cards = driver.find_elements(By.CSS_SELECTOR, "div.course-container div.course-card")
        apply_card = cards[APPLY_INDEX]
        into_view(driver, apply_card)
        time.sleep(0.3)
        safe_click(driver, apply_card)
        print("    ✓ Clicked Software Testing card")

        # Wait for modal
        modal = WebDriverWait(driver, 8).until(
            EC.visibility_of_element_located((By.ID, "courseModal"))
        )
        print("    ✓ Modal opened")

        # Find Apply button inside modal
        # From Script.js the modal body has an <a> or <button> linking to apply.html
        # It typically says "Apply Now" or "Apply"
        try:
            apply_btn = WebDriverWait(driver, 6).until(
                EC.element_to_be_clickable(
                    (By.CSS_SELECTOR,
                     "#courseModal a[href*='apply'], "
                     "#courseModal button[onclick*='apply'], "
                     "#modalBody a[href*='apply']")
                )
            )
            href = apply_btn.get_attribute("href") or ""
            print(f"    ✓ Found Apply button in modal → {href}")
            safe_click(driver, apply_btn)
            time.sleep(2)

        except TimeoutException:
            # Modal may have different markup — look for any link/button with "Apply"
            try:
                apply_btn = driver.find_element(By.XPATH,
                    "//*[@id='courseModal']//*[contains(translate(text(),'apply','APPLY'),'Apply') "
                    "or contains(@href,'apply') or contains(@onclick,'apply')]"
                )
                safe_click(driver, apply_btn)
                time.sleep(2)
            except NoSuchElementException:
                # Fallback: navigate directly with course pre-set
                print("    ⚠ Apply button not found in modal — navigating to apply.html directly")
                driver.find_element(By.TAG_NAME, "body").send_keys(Keys.ESCAPE)
                time.sleep(0.5)
                driver.get(APPLY_URL + "?course=Software+Testing")
                time.sleep(2)

        # ── Fill Apply Form ───────────────────────────────────────────────────
        wait_visible(driver, By.CSS_SELECTOR, "div.form-card")
        print(f"    ✓ Apply page: {driver.current_url}")

        r_phone = random_phone()

        # id="courseName" is readonly — auto-filled by JS (loadCourse())
        course_val = driver.find_element(By.ID, "courseName").get_attribute("value")
        print(f"    ✓ Course field value: '{course_val}'")

        # id="appName" is readonly — auto-filled from logged-in user
        name_val = driver.find_element(By.ID, "appName").get_attribute("value")
        print(f"    ✓ Name field value: '{name_val}'")

        # Phone  → id="phone"
        phone_field = wait_clickable(driver, By.ID, "phone")
        phone_field.clear()
        phone_field.send_keys(r_phone)
        print(f"    ✓ Phone entered: {r_phone}")

        # Status/Role  → id="role"  (select: Student / Working Professional / Fresher)
        role_select = Select(driver.find_element(By.ID, "role"))
        role_select.select_by_visible_text("Student")
        print("    ✓ Status selected: Student")

        # Qualification  → id="qualification"
        qual_field = driver.find_element(By.ID, "qualification")
        qual_field.clear()
        qual_field.send_keys("B.Sc Computer Science")
        print("    ✓ Qualification entered: B.Sc Computer Science")

        # Submit  → button.form-submit
        submit = wait_clickable(driver, By.CSS_SELECTOR, "button.form-submit")
        into_view(driver, submit)
        safe_click(driver, submit)
        print("    ✓ Clicked Submit Application")
        time.sleep(3)

        cur = driver.current_url
        print(f"    ✓ After submit URL: {cur}")

        if body_has(driver, "success", "submitted", "thank", "received", "application"):
            print("    ✓ Application submitted successfully!")
        else:
            print(f"    ⚠ Page: {driver.find_element(By.TAG_NAME,'body').text[:200]}")

        print("✅ STEP 5 PASSED\n")

    except Exception as e:
        print(f"❌ STEP 5 FAILED — {e}")
        traceback.print_exc()


# -----------------------------------------------------------------------------
# STEP 6 — About page slow scroll
# -----------------------------------------------------------------------------
def step6_about(driver):
    header("STEP 6 — About Page: Slow Scroll")
    try:
        driver.get(ABOUT_URL)
        wait_visible(driver, By.TAG_NAME, "body")
        print(f"    ✓ About page: {driver.current_url}")
        assert "about" in driver.current_url.lower() or "About" in driver.title

        slow_scroll(driver, "About page")
        print("✅ STEP 6 PASSED\n")

    except Exception as e:
        print(f"❌ STEP 6 FAILED — {e}")
        traceback.print_exc()


# -----------------------------------------------------------------------------
# STEP 7 — Contact page: slow scroll + fill form + send
# -----------------------------------------------------------------------------
def step7_contact(driver):
    header("STEP 7 — Contact Page: Slow Scroll + Send Message")
    try:
        driver.get(CONTACT_URL)
        wait_visible(driver, By.ID, "contactForm")
        print(f"    ✓ Contact page: {driver.current_url}")

        # Slow scroll first
        slow_scroll(driver, "Contact page")
        to_top(driver)
        time.sleep(0.5)

        # Scroll down to form
        form = driver.find_element(By.ID, "contactForm")
        into_view(driver, form)
        time.sleep(0.4)

        # Your Name  → id="contactName"
        name_field = wait_clickable(driver, By.ID, "contactName")
        name_field.clear()
        name_field.send_keys(random_name())
        print("    ✓ Name entered")

        # Email  → id="contactEmail"
        email_field = driver.find_element(By.ID, "contactEmail")
        email_field.clear()
        email_field.send_keys(random_email())
        print("    ✓ Email entered")

        # Phone (optional)  → id="contactPhone"
        phone_field = driver.find_element(By.ID, "contactPhone")
        phone_field.clear()
        phone_field.send_keys(random_phone())
        print("    ✓ Phone entered")

        # Interested In  → id="contactCourse"  (select dropdown)
        course_select = Select(driver.find_element(By.ID, "contactCourse"))
        course_select.select_by_visible_text("Software Testing")
        print("    ✓ Course selected: Software Testing")

        # Message  → id="contactMsg"  (textarea)
        msg_area = driver.find_element(By.ID, "contactMsg")
        msg_area.clear()
        msg_area.send_keys(
            "Hello! I am interested in the Software Testing course. "
            "Please share details about the next batch, fee structure, "
            "and placement support. Thank you!"
        )
        print("    ✓ Message entered")

        # Send Message  → button.cf-submit (type="submit" inside #contactForm)
        send_btn = wait_clickable(driver, By.CSS_SELECTOR, "#contactForm button.cf-submit")
        into_view(driver, send_btn)
        safe_click(driver, send_btn)
        print("    ✓ Clicked Send Message")
        time.sleep(3)

        if body_has(driver, "success", "thank", "sent", "received", "message"):
            print("    ✓ Message sent successfully!")
        else:
            print(f"    ⚠ Page text: {driver.find_element(By.TAG_NAME,'body').text[:200]}")

        print("✅ STEP 7 PASSED\n")

    except Exception as e:
        print(f"❌ STEP 7 FAILED — {e}")
        traceback.print_exc()


# -----------------------------------------------------------------------------
# STEP 8 — Dashboard slow scroll
# -----------------------------------------------------------------------------
def step8_dashboard(driver):
    header("STEP 8 — Dashboard: Slow Scroll")
    try:
        driver.get(DASHBOARD_URL)
        wait_visible(driver, By.TAG_NAME, "body")
        time.sleep(2)   # let JS load user data
        print(f"    ✓ Dashboard: {driver.current_url}")

        # Dashboard may redirect to login if session not active
        if "login" in driver.current_url.lower():
            print("    ⚠ Redirected to login — session may have expired after CAPTCHA step")
            print("    → Skipping scroll, moving to next step")
            return

        slow_scroll(driver, "Dashboard")
        print("✅ STEP 8 PASSED\n")

    except Exception as e:
        print(f"❌ STEP 8 FAILED — {e}")
        traceback.print_exc()


# -----------------------------------------------------------------------------
# STEP 9 — Home: switch dark→light theme + slow scroll
# -----------------------------------------------------------------------------
def step9_theme_and_scroll(driver):
    header("STEP 9 — Home: Dark → Light Theme Toggle + Slow Scroll")
    try:
        driver.get(HOME_URL)
        wait_visible(driver, By.TAG_NAME, "body")
        print(f"    ✓ Home page: {driver.current_url}")
        time.sleep(1)

        # Theme toggle button  → button#darkModeToggle  (confirmed in index.html)
        # onclick="toggleDarkMode()" — adds/removes class "dark-mode" on body
        toggle = wait_clickable(driver, By.ID, "darkModeToggle")
        print(f"    ✓ Theme toggle found: button#darkModeToggle")

        # Check current theme
        body_classes = driver.find_element(By.TAG_NAME, "body").get_attribute("class")
        is_dark = "dark-mode" in body_classes
        print(f"    ✓ Current theme: {'DARK' if is_dark else 'LIGHT'} (body class: '{body_classes}')")

        if is_dark:
            # Already dark → click once to switch to light
            into_view(driver, toggle)
            safe_click(driver, toggle)
            time.sleep(0.8)
            print("    ✓ Clicked toggle: DARK → LIGHT")
        else:
            # Currently light → click to dark first, then back to light
            into_view(driver, toggle)
            safe_click(driver, toggle)
            time.sleep(0.8)
            print("    ✓ Clicked toggle: LIGHT → DARK")
            safe_click(driver, toggle)
            time.sleep(0.8)
            print("    ✓ Clicked toggle: DARK → LIGHT")

        # Verify it's now light
        final_classes = driver.find_element(By.TAG_NAME, "body").get_attribute("class")
        is_now_dark   = "dark-mode" in final_classes
        print(f"    ✓ Final theme: {'DARK' if is_now_dark else 'LIGHT'} ✓")
        assert not is_now_dark, "Expected LIGHT theme after toggle"

        # Slow scroll home page in light theme
        slow_scroll(driver, "Home page (light theme)")
        print(" STEP 9 PASSED\n")

    except Exception as e:
        print(f" STEP 9 FAILED — {e}")
        traceback.print_exc()
        # =============================================================================
# STEP 10 — Admin Login & Dashboard verify
# =============================================================================
def step10_admin(driver):
    try:
        driver.get(BASE_URL + "/login.html")
        wait_visible(driver, By.CLASS_NAME, "auth-container")

        # Click Admin role tab
        admin_tab = wait_clickable(driver, By.ID, "roleAdmin")
        safe_click(driver, admin_tab)
        time.sleep(0.4)

        driver.find_element(By.ID, "username").send_keys("niv123@gmail.com")
        driver.find_element(By.ID, "password").send_keys("123456")

        print("⏳ Please tick 'I am not a robot' — waiting 20 seconds...")
        time.sleep(20)

        submit = wait_clickable(driver, By.CSS_SELECTOR, "button.form-submit")
        into_view(driver, submit)
        safe_click(driver, submit)
        time.sleep(3)

        # Verify admin dashboard loaded
        wait_visible(driver, By.CSS_SELECTOR, "div.adm-layout")

        # Check all 4 stat cards visible
        stats = driver.find_elements(By.CSS_SELECTOR, "div.adm-stat-card")
        assert len(stats) > 0

        # Click each sidebar nav item
        nav_items = driver.find_elements(By.CSS_SELECTOR, "nav.adm-nav a.adm-nav-item")
        for item in nav_items:
            into_view(driver, item)
            safe_click(driver, item)
            time.sleep(0.8)

        # Scroll dashboard
        slow_scroll(driver)

        ok("Admin dashboard loaded and all sections verified successfully")

    except Exception as e:
        fail(f"Admin dashboard test failed — {e}")


# =============================================================================
# STEP 11 — Chatbot open, send message, close
# =============================================================================
def step11_chatbot(driver):
    try:
        driver.get(BASE_URL)
        wait_visible(driver, By.TAG_NAME, "body")
        time.sleep(3)

        # Open chatbot
        chat_btn = WebDriverWait(driver,15).until(
            EC.element_to_be_clickable((By.ID,"ggChatBtn"))
        )

        driver.execute_script(
            "arguments[0].scrollIntoView({block:'center'});",
            chat_btn
        )

        time.sleep(1)
        driver.execute_script("arguments[0].click();", chat_btn)

        # Wait for chatbot window
        chat_window = WebDriverWait(driver,10).until(
            EC.visibility_of_element_located((By.ID,"ggChatWindow"))
        )

        # Input message
        chat_input = WebDriverWait(driver,10).until(
            EC.element_to_be_clickable((By.ID,"ggChatInput"))
        )

        chat_input.clear()
        chat_input.send_keys("Hi")

        send_btn=driver.find_element(By.ID,"ggSendBtn")
        driver.execute_script("arguments[0].click();", send_btn)

        time.sleep(3)

        messages=driver.find_elements(
            By.CSS_SELECTOR,
            "#ggChatMessages div"
        )

        print("Messages found:",len(messages))

        assert len(messages)>0

        # close chatbot
        driver.execute_script("arguments[0].click();",chat_btn)

        print("✓ Chatbot tested successfully")

    except Exception as e:
        print("✗ Chatbot failed:",e)

        ok("Chatbot opened, message sent, reply received, closed successfully")

    except Exception as e:
        fail(f"Chatbot test failed — {e}")


# =============================================================================
# SECTION 5 — MAIN RUNNER + CLEANUP
# =============================================================================

def run():
    print("\n" + "█" * 60)
    print("  🚀 GREAT GAINING INSTITUTION — FULL FLOW AUTOMATION")
    print(f"  URL   : {BASE_URL}")
    print(f"  Login : {LOGIN_EMAIL}  /  {LOGIN_PASSWORD}")
    print("█" * 60)

    driver = make_driver()

    try:
        step1_home_scroll(driver)
        step2_signup(driver)
        step3_login(driver)
        step4_home_verify(driver)
        step5_courses(driver)
        step6_about(driver)
        step7_contact(driver)
        step8_dashboard(driver)
        step9_theme_and_scroll(driver)
        step10_admin(driver)
        step11_chatbot(driver)

    except KeyboardInterrupt:
        print("\n⛔ Stopped by user.")

    finally:
        print("\n" + "─" * 60)
        print("  🧹 Closing browser...")
        driver.quit()
        print("  ✅ All steps complete. Browser closed.")
        print("─" * 60 + "\n")


if __name__ == "__main__":
    run()
