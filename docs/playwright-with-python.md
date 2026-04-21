# Playwright with Python — Quick-Reference Guide

> **Playwright 1.58.0** · **Python ≥ 3.9** · Sync API only
> Sources: [playwright.dev/python](https://playwright.dev/python), [github.com/microsoft/playwright-python](https://github.com/microsoft/playwright-python), [pypi.org/project/playwright](https://pypi.org/project/playwright)

---

## How Playwright Works

Playwright controls Chromium, Firefox, and WebKit browsers through their native debugging protocols (Chrome DevTools Protocol for Chromium; equivalent internal protocols for Firefox and WebKit). Your test code talks to a single Playwright server process, which manages every browser instance.

The object hierarchy follows a strict chain: a **Playwright** instance launches a **Browser**, which creates one or more **BrowserContexts**, each of which opens one or more **Pages**. A Page is where you interact with DOM elements.

**Auto-waiting** means Playwright automatically waits for elements to be visible, enabled, and stable before performing actions like clicks or fills. You never need `time.sleep()` or manual wait logic.

**Browser context isolation** means each `BrowserContext` behaves like a fresh incognito profile — cookies, localStorage, service workers, and cache are completely isolated between contexts, so tests cannot leak state into each other.

### Object Hierarchy

```
Playwright
 └── Browser          (Chromium / Firefox / WebKit process)
      └── BrowserContext   (isolated session — cookies, storage, cache)
           └── Page        (single tab — DOM interaction happens here)
                └── Locator → DOM Element
```

### Minimal Working Example

```python
from playwright.sync_api import sync_playwright

def main() -> None:
    with sync_playwright() as pw:
        # Launch a Chromium browser in headless mode
        browser = pw.chromium.launch(headless=True)
        # Create an isolated browser context
        context = browser.new_context()
        # Open a new page (tab) inside the context
        page = context.new_page()
        page.goto("https://example.com")
        print(page.title())  # "Example Domain"
        # Tear down in reverse order
        context.close()
        browser.close()

main()
```

---

## E2E Testing Scenarios

All examples use `pytest-playwright`, which auto-injects a `page` fixture (one fresh `BrowserContext` + `Page` per test).

### Scenario A — Page Navigation and Title Assertion

Verify that navigating to a URL produces the expected page title.

```python
import re
from playwright.sync_api import Page, expect

def test_page_title(page: Page) -> None:
    # Navigate to the target URL
    page.goto("https://example.com")
    # Assert the page title matches
    expect(page).to_have_title(re.compile("Example Domain"))
```

### Scenario B — Form Fill and Submit

Fill a login form using semantic locators, submit it, and assert a success message appears.

```python
from playwright.sync_api import Page, expect

def test_login_form(page: Page) -> None:
    page.goto("https://example.com/login")

    # Fill form fields using accessible locators
    page.get_by_label("Username").fill("testuser")
    page.get_by_label("Password").fill("s3cureP@ss")

    # Submit the form
    page.get_by_role("button", name="Sign in").click()

    # Assert success indicator is visible
    expect(page.get_by_text("Welcome, testuser")).to_be_visible()
```

### Scenario C — Handling Multiple Pages (New Tab)

Click a link that opens a new tab, switch to that tab, and verify its content.

```python
from playwright.sync_api import Page, expect

def test_new_tab(page: Page) -> None:
    page.goto("https://example.com")

    # Listen for the new page event, then trigger it
    with page.context.expect_page() as new_page_info:
        page.get_by_role("link", name="Open docs").click()

    # Obtain the new tab's Page object
    new_page = new_page_info.value
    new_page.wait_for_load_state()

    # Assert content on the newly opened tab
    expect(new_page).to_have_title(re.compile("Documentation"))
```

> **Note:** `import re` is needed at the top of this file for the `re.compile` call.

### Scenario D — Network Request Interception

Intercept an API call, return mocked JSON, and assert the page renders the mocked data.

```python
from playwright.sync_api import Page, Route, expect

def test_mock_api(page: Page) -> None:
    # Define the mock handler
    def handle_route(route: Route) -> None:
        route.fulfill(
            status=200,
            content_type="application/json",
            body='[{"id": 1, "name": "Mocked Item"}]',
        )

    # Intercept GET requests to the /api/items endpoint
    page.route("**/api/items", handle_route)

    page.goto("https://example.com/items")

    # Assert the page renders the mocked data
    expect(page.get_by_text("Mocked Item")).to_be_visible()
```

---

## Python Setup and Usage

### Installation

```bash
pip install playwright==1.58.0
playwright install                   # downloads Chromium, Firefox, WebKit binaries
pip install pytest-playwright         # pytest integration
```

### Project Structure

```
my-project/
├── tests/
│   ├── conftest.py            # shared fixtures and config
│   ├── test_navigation.py     # Scenario A & C
│   └── test_forms.py          # Scenario B & D
├── requirements.txt
└── pytest.ini                 # (optional) pytest settings
```

### Running Tests

```bash
# Run all tests (headless by default)
pytest tests/

# Run with a visible browser window
pytest tests/ --headed

# Run on a specific browser engine
pytest tests/ --browser firefox

# Run a single test file
pytest tests/test_navigation.py

# Generate an HTML report
pytest tests/ --html=report.html --self-contained-html
```

> The `--html` flag requires `pytest-html`. Install it with `pip install pytest-html`. [UNVERIFIED — check official docs for bundled report options in pytest-playwright]

### conftest.py Example

```python
import pytest
from typing import Dict, Any

@pytest.fixture(scope="session")
def browser_type_launch_args() -> Dict[str, Any]:
    """Configure browser launch options for all tests."""
    return {
        "headless": True,
        "slow_mo": 0,       # milliseconds delay between actions (useful for debugging)
    }

@pytest.fixture(scope="session")
def browser_context_args() -> Dict[str, Any]:
    """Configure context options — applies to every test's BrowserContext."""
    return {
        "base_url": "https://example.com",
        "viewport": {"width": 1280, "height": 720},
    }
```

When `base_url` is set, `page.goto("/login")` resolves to `https://example.com/login`.

### Codegen

Playwright ships a built-in test recorder called **Codegen**. It opens a browser, records your manual interactions, and outputs ready-to-use Python test code. Launch it with:

```bash
playwright codegen https://example.com
```

---

## Further Reading

- [Playwright Python API Reference](https://playwright.dev/python/docs/api/class-playwright)
- [pytest-playwright Plugin Docs](https://playwright.dev/python/docs/test-runners)
- [Locators Guide](https://playwright.dev/python/docs/locators)
- [Network Interception](https://playwright.dev/python/docs/network)
