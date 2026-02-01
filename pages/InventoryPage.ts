/**
 * @author Mallik Galib Shahriar
 * @link https://www.linkedin.com/in/mallikgalibshahriar/
 */

import { Page, Locator, expect } from '@playwright/test';

/**
 * PAGE OBJECT MODEL (POM) - InventoryPage
 * This page handles the product list, sorting, and adding items to the cart.
 */
export class InventoryPage {
    private readonly page: Page;
    private readonly headerTitle: Locator;
    private readonly inventoryItems: Locator;
    private readonly sortDropdown: Locator;
    private readonly cartBadge: Locator;
    private readonly shoppingCartLink: Locator;

    constructor(page: Page) {
        this.page = page;
        this.headerTitle = page.locator('[data-test="title"]');
        this.inventoryItems = page.locator('[data-test="inventory-item"]');
        this.sortDropdown = page.locator('[data-test="product-sort-container"]');
        this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
        this.shoppingCartLink = page.locator('[data-test="shopping-cart-link"]');
    }

    /**
     * Action: Add item by its name.
     * Logic: We use .filter({ hasText: itemName }) to find the specific product card.
     * Why? Bad Practice: Hardcoding index like .nth(0). If the product order changes, the wrong item is clicked.
     * Risk: If Saucedemo changes the item name text, this filter will stop working.
     */
    async addItemToCart(itemName: string) {
        const item = this.inventoryItems.filter({ hasText: itemName });
        await item.locator('button[data-test^="add-to-cart"]').click();
    }

    /**
     * Action: Remove item by name.
     * Uses same logic as adding. Reusable patterns make code maintainable.
     */
    async removeItemFromCart(itemName: string) {
        const item = this.inventoryItems.filter({ hasText: itemName });
        await item.locator('button[data-test^="remove"]').click();
    }

    /**
     * Action: Get the cart count from badge.
     * Handling empty state: If the badge is not visible, count is '0'.
     */
    async getCartCount() {
        if (await this.cartBadge.isVisible()) {
            const count = await this.cartBadge.textContent();
            return count || '0';
        }
        return '0';
    }

    async selectSortOption(option: string) {
        await this.sortDropdown.selectOption(option);
    }

    async goToCart() {
        await this.shoppingCartLink.click();
    }

    async assertInventoryCount(expectedCount: number) {
        await expect(this.inventoryItems).toHaveCount(expectedCount);
    }

    /**
     * Verification: Deep Integrity Check.
     * Why? We check if every product has a name, price, and a VALID image.
     * Risk: Sometimes images fail to load (broken 404). This test catches that.
     */
    async assertAllItemsHaveDetails() {
        const items = await this.inventoryItems.all();
        for (const item of items) {
            await expect(item.locator('[data-test="inventory-item-name"]')).not.toBeEmpty();
            await expect(item.locator('[data-test="inventory-item-price"]')).not.toBeEmpty();

            const img = item.locator('img.inventory_item_img');
            await expect(img).toBeVisible();

            // Checking for the known broken image placeholder in Saucedemo
            const src = await img.getAttribute('src');
            expect(src).not.toContain('sl-404');
        }
    }

    /**
     * Helper: Extracts prices for sorting validation.
     * We convert "$29.99" string into a numeric 29.99 for math comparison.
     */
    async getItemPrices() {
        const priceElements = await this.page.locator('[data-test="inventory-item-price"]').allTextContents();
        return priceElements.map(p => parseFloat(p.replace('$', '')));
    }

    async getItemNames() {
        return await this.page.locator('[data-test="inventory-item-name"]').allTextContents();
    }

    async navigateToItemDetails(itemName: string) {
        await this.page.click(`[data-test="inventory-item-name"]:has-text("${itemName}")`);
    }
}
