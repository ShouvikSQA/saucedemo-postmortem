/**
 * @author Mallik Galib Shahriar
 * @link https://www.linkedin.com/in/mallikgalibshahriar/
 */

import { Page, Locator, expect } from '@playwright/test';

/**
 * PAGE OBJECT MODEL (POM) - SidebarPage
 * Handles global elements like the Burger Menu.
 */
export class SidebarPage {
    private readonly page: Page;
    private readonly burgerMenuButton: Locator;
    private readonly logoutLink: Locator;
    private readonly allItemsLink: Locator;
    private readonly aboutLink: Locator;
    private readonly resetLink: Locator;
    private readonly closeMenuButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.burgerMenuButton = page.locator('#react-burger-menu-btn');
        this.logoutLink = page.locator('[data-test="logout-sidebar-link"]');
        this.allItemsLink = page.locator('[data-test="inventory-sidebar-link"]');
        this.aboutLink = page.locator('[data-test="about-sidebar-link"]');
        this.resetLink = page.locator('[data-test="reset-sidebar-link"]');
        this.closeMenuButton = page.locator('#react-burger-cross-btn');
    }

    /**
     * Action: Open Menu.
     * Stability: We wait for a specific link inside to be visible to ensure the animation finished.
     */
    async open() {
        await this.burgerMenuButton.click();
        await expect(this.logoutLink).toBeVisible();
    }

    async close() {
        await this.closeMenuButton.click();
        await expect(this.logoutLink).not.toBeVisible();
    }

    async logout() {
        await this.open();
        await this.logoutLink.click();
    }

    /**
     * Action: System Cleanup.
     * Why? Risk: Saucedemo keeps state in session. If we don't reset, one test might affect another.
     * Reusability: Use this in beforeEach to ensure a fresh start for every test.
     */
    async resetAppState() {
        await this.open();
        await this.resetLink.click();
        await this.close();
    }

    async navigateToAllItems() {
        await this.open();
        await this.allItemsLink.click();
    }
}
