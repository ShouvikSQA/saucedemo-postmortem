/**
 * @author Mallik Galib Shahriar
 * @link https://www.linkedin.com/in/mallikgalibshahriar/
 */

import { Page, Locator, expect } from '@playwright/test';

/**
 * PAGE OBJECT MODEL (POM) - CartPage
 * Why? To isolate cart actions. Even if the checkout button ID changes, our tests stay clean.
 */
export class CartPage {
    private readonly page: Page;;
    private readonly cartItems: Locator;
    private readonly checkoutButton: Locator;
    private readonly continueShoppingButton: Locator;

    constructor(page: Page) {
        this.page = page;
        // Note: Items in cart use the same inventory-item data-test as the shop page.
        this.cartItems = page.locator('[data-test="inventory-item"]');
        this.checkoutButton = page.locator('[data-test="checkout"]');
        this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
    }

    async removeItem(itemName: string) {
        const item = this.cartItems.filter({ hasText: itemName });
        await item.locator('button[data-test^="remove"]').click();
    }

    async checkout() {
        await this.checkoutButton.click();
    }

    async continueShopping() {
        await this.continueShoppingButton.click();
    }

    /**
     * Action: Individual item check.
     * Why? We verify price in cart matches the shop page. 
     * Risk: Sometimes apps have price rounding bugs in the cart.
     */
    async assertItemInCart(itemName: string, expectedPrice?: string) {
        const item = this.cartItems.filter({ hasText: itemName });
        await expect(item).toBeVisible();
        if (expectedPrice) {
            await expect(item.locator('[data-test="inventory-item-price"]')).toHaveText(expectedPrice);
        }
    }

    async assertCartEmpty() {
        await expect(this.cartItems).toHaveCount(0);
    }

    async getItemCount() {
        return await this.cartItems.count();
    }

    /**
     * Logical Check: Button should be enabled for valid users.
     */
    async assertCheckoutButtonState(enabled: boolean) {
        if (enabled) {
            await expect(this.checkoutButton).toBeEnabled();
        }
    }
}
