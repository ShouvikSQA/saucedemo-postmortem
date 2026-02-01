/**
 * @author Mallik Galib Shahriar
 * @link https://www.linkedin.com/in/mallikgalibshahriar/
 */

import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { FinishPage } from '../pages/FinishPage';
import { SidebarPage } from '../pages/SidebarPage';

/**
 * CUSTOM FIXTURES
 * Why? Bad Practice: In every test, doing `const loginPage = new LoginPage(page);`. 
 * Good Practice: Bundle them into fixtures. Playwright automatically handles setup/teardown.
 * Benefit: Your test code becomes extremely clean, focusing only on the business flow.
 */
type MyFixtures = {
    loginPage: LoginPage;
    inventoryPage: InventoryPage;
    cartPage: CartPage;
    checkoutPage: CheckoutPage;
    finishPage: FinishPage;
    sidebarPage: SidebarPage;
};

// Extending the base test with our POM objects
export const test = base.extend<MyFixtures>({
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },
    inventoryPage: async ({ page }, use) => {
        await use(new InventoryPage(page));
    },
    cartPage: async ({ page }, use) => {
        await use(new CartPage(page));
    },
    checkoutPage: async ({ page }, use) => {
        await use(new CheckoutPage(page));
    },
    finishPage: async ({ page }, use) => {
        await use(new FinishPage(page));
    },
    sidebarPage: async ({ page }, use) => {
        await use(new SidebarPage(page));
    },
});

export { expect } from '@playwright/test';
