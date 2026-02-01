/**
 * @author Mallik Galib Shahriar
 * @link https://www.linkedin.com/in/mallikgalibshahriar/
 */

import { test, expect } from '../fixtures/fixtures';
import { testData } from '../data/testData';

/**
 * TEST SUITE: Checkout & Pricing Integrity
 * This is the "Money Flow" (Critical Path). If this breaks, the business loses money.
 */
test.describe('💳 Checkout Flow – High Value Automation', () => {

    test.beforeEach(async ({ page, sidebarPage }) => {
        await page.goto('/inventory.html');
        await sidebarPage.resetAppState();
        await page.reload();
    });

    /**
     * Happy Path: 
     * A user adds products, fills info, checks overview, and successfully completes the order.
     * Stability Check: We verify the cart is empty AFTER the successful purchase.
     */
    test('Checkout with valid user info → Full flow success', async ({ inventoryPage, cartPage, checkoutPage, finishPage, page }) => {
        await inventoryPage.addItemToCart(testData.products.backpack);
        await inventoryPage.addItemToCart(testData.products.onesie);
        await inventoryPage.goToCart();
        await cartPage.checkout();

        await expect(page).toHaveURL(/.*checkout-step-one.html/);
        await checkoutPage.fillInformation(
            testData.checkoutInfo.firstName,
            testData.checkoutInfo.lastName,
            testData.checkoutInfo.postalCode
        );

        // Overview screen validation
        await expect(page).toHaveURL(/.*checkout-step-two.html/);
        await checkoutPage.assertCalculations(); // Validating math (Price + Tax = Total)
        await checkoutPage.finish();

        // Success confirmation
        await expect(page).toHaveURL(/.*checkout-complete.html/);
        await finishPage.assertSuccessMessage('Thank you for your order!');

        // Final check: Badge should disappear
        await expect(page.locator('[data-test="shopping-cart-badge"]')).not.toBeVisible();
    });

    /**
     * Risk: Mandatory Fields.
     * Does the checkout form prevent submission if required fields are missing?
     */
    test('Checkout validation for missing fields', async ({ inventoryPage, cartPage, checkoutPage }) => {
        await inventoryPage.addItemToCart(testData.products.backpack);
        await inventoryPage.goToCart();
        await cartPage.checkout();

        // No fields filled
        await checkoutPage.fillInformation('', '', '');
        await checkoutPage.assertErrorMessage(testData.errorMessages.firstNameRequired);

        // Missing Last Name
        await checkoutPage.fillInformation('John', '', '12345');
        await checkoutPage.assertErrorMessage(testData.errorMessages.lastNameRequired);
    });

    /**
     * Math Integrity Check: 
     * Risk: Total calculation bugs are very common in e-commerce. 
     * Logic: 29.99 + 9.99 = 39.98. The app MUST show exactly this.
     */
    test('Pricing integrity: Item total = sum of individual item prices', async ({ inventoryPage, cartPage, checkoutPage }) => {
        await inventoryPage.addItemToCart(testData.products.backpack);
        await inventoryPage.addItemToCart(testData.products.bikeLight);
        await inventoryPage.goToCart();
        await cartPage.checkout();
        await checkoutPage.fillInformation('J', 'D', '1');

        await checkoutPage.assertSubtotal(39.98);
        await checkoutPage.assertCalculations();
    });

    /**
     * Navigation Check:
     * Users should be able to "Cancel" at any step and return to safety without losing their selected products.
     */
    test('Cancel checkout from step one or two works', async ({ inventoryPage, cartPage, checkoutPage, page }) => {
        await inventoryPage.addItemToCart(testData.products.backpack);
        await inventoryPage.goToCart();
        await cartPage.checkout();

        // Cancel from Info page -> Return to Cart
        await checkoutPage.cancel();
        await expect(page).toHaveURL(/.*cart.html/);

        // Cancel from Overview page -> Return to Shop
        await cartPage.checkout();
        await checkoutPage.fillInformation('J', 'D', '1');
        await page.locator('[data-test="cancel"]').click();
        await expect(page).toHaveURL(/.*inventory.html/);
    });
});
