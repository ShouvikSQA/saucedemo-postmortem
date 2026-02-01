/**
 * @author Mallik Galib Shahriar
 * @link https://www.linkedin.com/in/mallikgalibshahriar/
 */

import { Page, Locator, expect } from '@playwright/test';

/**
 * PAGE OBJECT MODEL (POM) - LoginPage
 * Why POM? We keep all selectors and actions for the login page here. 
 * If the developer changes a button name in the future, we only update it here once, not in every test.
 */
export class LoginPage {
    private readonly page: Page;
    private readonly usernameInput: Locator;
    private readonly passwordInput: Locator;
    private readonly loginButton: Locator;
    private readonly errorMessage: Locator;
    private readonly errorCloseButton: Locator;

    constructor(page: Page) {
        this.page = page;

        /**
         * Why data-test? 
         * Good Practice: Using data-test attributes. These are usually added for testing and don't change often.
         * Bad Practice: Using CSS classes like '.btn-primary'. These change every time the design changes, breaking your tests.
         * Risk: If Saucedemo removes data-test attributes, these locators will fail.
         */
        this.usernameInput = page.locator('[data-test="username"]');
        this.passwordInput = page.locator('[data-test="password"]');
        this.loginButton = page.locator('[data-test="login-button"]');
        this.errorMessage = page.locator('[data-test="error"]');
        this.errorCloseButton = page.locator('.error-button');
    }

    /**
     * Action: Navigate to the landing page.
     * Why assert URL? To make sure we actually arrived at the right page before doing anything.
     */
    async navigate() {
        await this.page.goto('/');
        await expect(this.page).toHaveURL('https://www.saucedemo.com/');
    }

    /**
     * Action: Generic login method.
     * Human-like logic: We check if username/password is provided before filling.
     * Reusability: Use this in setup and in edge-case tests.
     */
    async login(username: string, password: string) {
        if (username !== null) await this.usernameInput.fill(username);
        if (password !== null) await this.passwordInput.fill(password);
        await this.loginButton.click();
    }

    async clearInputs() {
        await this.usernameInput.clear();
        await this.passwordInput.clear();
    }

    async closeErrorMessage() {
        await this.errorCloseButton.click();
    }

    /**
     * Assertion: Verify error message content.
     * Why use containText? It's more flexible than exact match and less likely to fail on small whitespace changes.
     */
    async assertErrorMessage(expectedMessage: string) {
        await expect(this.errorMessage).toBeVisible();
        await expect(this.errorMessage).toContainText(expectedMessage);
    }

    async assertErrorMessageNotVisible() {
        await expect(this.errorMessage).not.toBeVisible();
    }

    /**
     * Risk: If the dev accidentally changes the input type to 'text', passwords will be visible.
     * This test ensures security standards are maintained.
     */
    async assertPasswordMasked() {
        const type = await this.passwordInput.getAttribute('type');
        expect(type).toBe('password');
    }
}
