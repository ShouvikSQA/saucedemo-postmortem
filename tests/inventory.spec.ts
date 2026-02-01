/**
 * @author Mallik Galib Shahriar
 * @link https://www.linkedin.com/in/mallikgalibshahriar/
 */

import { test, expect } from '../fixtures/fixtures';
import { testData } from '../data/testData';

/**
 * TEST SUITE: Product Listing & Sorting
 * These tests run ALREADY LOGGED IN (using global auth setup).
 */
test.describe('🛒 Product Listing – Real Business Flow', () => {

    test.beforeEach(async ({ page }) => {
        // Navigate straight to inventory because we are already logged in
        await page.goto('/inventory.html');
    });

    /**
     * Integrity Check: 
     * Ensures the shop isn't empty and all items are fully loaded (No broken images).
     */
    test('Products load successfully with correct count and details', async ({ inventoryPage }) => {
        await inventoryPage.assertInventoryCount(6);
        await inventoryPage.assertAllItemsHaveDetails();
    });

    /**
     * Data-Driven Sorting Tests:
     * Why multiple tests? Risk: Price sorting often fails with large decimals or symbols like '$'.
     */
    test('Product sorting: Name (A → Z)', async ({ inventoryPage }) => {
        await inventoryPage.selectSortOption('az');
        const names = await inventoryPage.getItemNames();
        const sorted = [...names].sort();
        expect(names).toEqual(sorted);
    });

    test('Product sorting: Name (Z → A)', async ({ inventoryPage }) => {
        await inventoryPage.selectSortOption('za');
        const names = await inventoryPage.getItemNames();
        const sorted = [...names].sort().reverse();
        expect(names).toEqual(sorted);
    });

    test('Product sorting: Price (Low → High)', async ({ inventoryPage }) => {
        await inventoryPage.selectSortOption('lohi');
        const prices = await inventoryPage.getItemPrices();
        const sorted = [...prices].sort((a, b) => a - b);
        expect(prices).toEqual(sorted);
    });

    test('Product sorting: Price (High → Low)', async ({ inventoryPage }) => {
        await inventoryPage.selectSortOption('hilo');
        const prices = await inventoryPage.getItemPrices();
        const sorted = [...prices].sort((a, b) => b - a);
        expect(prices).toEqual(sorted);
    });

    /**
     * Navigation Check:
     * Verify we can drill down into a specific product and return safely.
     */
    test('Navigation to item details and back works', async ({ inventoryPage, page }) => {
        const product = testData.products.backpack;
        await inventoryPage.navigateToItemDetails(product);
        await expect(page).toHaveURL(/.*inventory-item.html/);
        await expect(page.locator('[data-test="inventory-item-name"]')).toHaveText(product);

        await page.locator('[data-test="back-to-products"]').click();
        await expect(page).toHaveURL(/.*inventory.html/);
    });
});
