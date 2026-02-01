# 🎭 Saucedemo Professional Automation Suite

High-standard End-to-End automation framework for [Saucedemo](https://www.saucedemo.com/) using **Playwright** and **TypeScript**. Built with a focus on clean architecture, stability, and comprehensive business flow coverage.

---

## �‍💻 Author Info
- **Author:** [Mallik Galib Shahriar](https://www.linkedin.com/in/mallikgalibshahriar/)
- **Project Type:** Automation Framework for QA Bootcamp

---

## �🚀 Key Features

- **Modern POM Architecture:** Clean and scalable Page Object Model structure.
- **Global Authentication:** Uses Playwright Session Storage to login once and reuse the session, significantly reducing execution time.
- **Custom Fixtures:** Simplified test dependencies for high readability.
- **Stability-First Locators:** Prioritizes `data-test` attributes to ensure robust execution across UI updates.
- **Dynamic Assertions:** Includes mathematical validation for checkout pricing and tax calculations.
- **Resilient State Management:** Verified session persistence across refreshes and history navigation.
- **Cross-Browser Support:** Pre-configured for Chromium, Firefox, and Webkit.
- **Premium Reporting:** Detailed HTML reports with failure screenshots and videos.

## 📁 Project Overview

- **`pages/`**: Encapsulated page logic and locators (Login, Inventory, Cart, Checkout, Sidebar, Finish).
- **`tests/`**: Business-driven test specifications:
  - `auth.spec.ts`: Login flows, security, and edge cases.
  - `inventory.spec.ts`: Sorting, product details, and inventory integrity.
  - `cart.spec.ts`: Cart operations, badge updates, and persistence.
  - `checkout.spec.ts`: End-to-end purchasing fow with pricing validation.
  - `navigation.spec.ts`: Session handling, unauthorized access protection, and menu flows.
  - `stability.spec.ts`: Keyboard interactions, rapid-action resilience, and regression paths.
- **`fixtures/`**: Custom Playwright setup for cleaner test writing.
- **`data/`**: Centralized test data for easy maintenance.

## 🛠️ Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+)

### Setup
```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install
```

### Run Tests
```bash
# Run all tests (headless)
npx playwright test

# Run tests in UI Mode
npx playwright test --ui

# View HTML Report
npx playwright show-report
```

---
*Developed with ❤️ by Mallik Galib Shahriar*
