/**
 * @author Mallik Galib Shahriar
 * @link https://www.linkedin.com/in/mallikgalibshahriar/
 */

import { test, expect } from '../fixtures/fixtures';
import { testData } from '../data/testData';

/**
 * TEST SUITE: Regression & User Experience (UX)
 * Focus: Small but annoying bugs (keyboard bugs, rapid clicking, data leaks).
 */
test.describe('🔁 Regression, Stability & State Abuse', () => {

    /**
     * Smoke Test:
     * A quick run through the most important business flow. 
     * Useful to run every time before a deployment.
     */
    test('End-to-end happy path regression (Smoke Test)', async ({ inventoryPage, cartPage, checkoutPage, finishPage, page }) => {
        await page.goto('/inventory.html');
        await inventoryPage.addItemToCart(testData.products.backpack);
        await inventoryPage.goToCart();
        await cartPage.checkout();
        await checkoutPage.fillInformation('Global', 'User', '00000');
        await checkoutPage.finish();
        await finishPage.assertSuccessMessage('Thank you for your order!');
    });

    /**
     * Accessibility/UX Check:
     * Can a user login without clicking the button? (Using the Enter key).
     */
    test('Enter key submits login form', async ({ page }) => {
        await page.goto('https://www.saucedemo.com/');
        await page.locator('[data-test="username"]').fill(testData.validUser.username);
        await page.locator('[data-test="password"]').fill(testData.validUser.password);

        // Action: Simulate keyboard press
        await page.keyboard.press('Enter');
        await expect(page).toHaveURL(/.*inventory.html/);
    });

    /**
     * Stress Check: 
     * Risk: Very fast users might click "Add" then "Remove" immediately. 
     * We ensure the app handles rapid state changes without breaking the cart badge.
     */
    test('Rapid add/remove clicks don\'t break cart count', async ({ inventoryPage, page }) => {
        await page.goto('/inventory.html');
        const item = testData.products.backpack;

        // Action: Fast multi-clicks
        await inventoryPage.addItemToCart(item);
        await inventoryPage.removeItemFromCart(item);
        await inventoryPage.addItemToCart(item);

        expect(await inventoryPage.getCartCount()).toBe('1');
    });

    /**
     * Performance/Accessibility: 
     * Can a user move between fields using just the keyboard? (Tab key).
     */
    test('Keyboard navigation (Tab) through login fields', async ({ page }) => {
        await page.goto('https://www.saucedemo.com/');
        await page.focus('[data-test="username"]');

        await page.keyboard.press('Tab');
        await expect(page.locator('[data-test="password"]')).toBeFocused();

        await page.keyboard.press('Tab');
        await expect(page.locator('[data-test="login-button"]')).toBeFocused();
    });
});
