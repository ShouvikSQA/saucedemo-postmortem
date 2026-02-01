/**
 * @author Mallik Galib Shahriar
 * @link https://www.linkedin.com/in/mallikgalibshahriar/
 */

import { test, expect } from '../fixtures/fixtures';

/**
 * TEST SUITE: Navigation, Sessions & Security
 * Focus: High-level site behavior and unauthorized access protection.
 */
test.describe('🧭 Navigation & Session Handling', () => {

    /**
     * Action: Session termination.
     * Risk: If session handles aren't cleared, another user can click "Back" and see private data.
     */
    test('Logout works and clears session', async ({ sidebarPage, page }) => {
        await page.goto('/inventory.html');
        await sidebarPage.logout();
        await expect(page).toHaveURL('https://www.saucedemo.com/');

        // Safety check: Back button should redirect to login, NOT the shop
        await page.goBack();
        await expect(page).toHaveURL('https://www.saucedemo.com/');
    });

    /**
     * Security Check: Unauthorized Access.
     * Risk: Users copying the internal URL (/inventory.html) and pasting it into a new tab without logging in.
     * Expectation: Redirect them back to login with a strict error message.
     */
    test.describe('Unauthorized Access', () => {
        test.use({ storageState: { cookies: [], origins: [] } }); // Clean slate

        test('Direct URL access without login redirects to login page', async ({ page }) => {
            await page.goto('https://www.saucedemo.com/inventory.html');
            await expect(page).toHaveURL('https://www.saucedemo.com/');
            await expect(page.locator('[data-test="error"]')).toContainText('You can only access \'/inventory.html\' when you are logged in.');
        });
    });

    /**
     * UI Stability: 
     * Does the menu interaction block the user from clicking the shop items later?
     */
    test('Menu open/close works consistently and doesn\'t block actions', async ({ sidebarPage, inventoryPage, page }) => {
        await page.goto('/inventory.html');
        await sidebarPage.open();
        await sidebarPage.close();

        // Menu is closed, user should be able to shop normally
        await inventoryPage.addItemToCart('Sauce Labs Backpack');
        expect(await inventoryPage.getCartCount()).toBe('1');
    });

    /**
     * Browser History Check:
     * What happens if a user clicks finish, then clicks the browser "Back" button?
     * The app should handle the state gracefully (No crashes).
     */
    test('Browser back after order completion handles state gracefully', async ({ inventoryPage, cartPage, checkoutPage, page }) => {
        await page.goto('/inventory.html');
        await inventoryPage.addItemToCart('Sauce Labs Backpack');
        await inventoryPage.goToCart();
        await cartPage.checkout();
        await checkoutPage.fillInformation('J', 'D', '1');
        await checkoutPage.finish();

        await expect(page).toHaveURL(/.*checkout-complete.html/);
        await page.goBack();
        // Verify no system errors or crashes are visible
        await expect(page).not.toHaveURL(/.*error.*/);
    });
});
