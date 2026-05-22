# Great Gaining Institution — Selenium Test Suite

Automated test suite for https://gg-web-sigma.vercel.app

## Files

| File | What it tests |
|---|---|
| conftest.py | Chrome driver setup (shared fixture) |
| pages.py | Page Object Model — all locators |
| test_01_home.py | Home page (9 tests) |
| test_02_login.py | Login page (11 tests) |
| test_03_signup.py | Signup page (10 tests) |
| test_04_courses.py | Courses page (10 tests) |
| test_05_about_contact.py | About + Contact pages (20 tests) |
| test_06_navigation_ui.py | Navigation + UI elements (12 tests) |

**Total: ~72 test cases**

---

## Setup (run once)

```bash
pip install -r requirements.txt
```

Make sure Google Chrome is installed on your PC.

---

## Run all tests

```bash
pytest -v
```

## Run with HTML report (recommended for internship)

```bash
pytest -v --html=report.html --self-contained-html
```
Open `report.html` in your browser to see Pass/Fail with details.

## Run one file only

```bash
pytest test_02_login.py -v
```

## Run headless (no browser window)

In `conftest.py`, uncomment this line:
```python
# options.add_argument("--headless")
```

---

## Notes

- **TC-LG-011** (valid login test): update `TEST_EMAIL` and `TEST_PASSWORD`
  in `test_02_login.py` with a real registered account on the site.
- All other tests work without any login credentials.
- Tests are designed to be independent — each opens a fresh browser window.

---

## Folder structure

```
gg_selenium/
├── conftest.py
├── pages.py
├── requirements.txt
├── test_01_home.py
├── test_02_login.py
├── test_03_signup.py
├── test_04_courses.py
├── test_05_about_contact.py
├── test_06_navigation_ui.py
└── README.md
```
