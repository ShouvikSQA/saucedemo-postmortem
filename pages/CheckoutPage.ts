/**
 * @author Mallik Galib Shahriar
 * @link https://www.linkedin.com/in/mallikgalibshahriar/
 */

import { Page, Locator, expect } from '@playwright/test';

/**
 * PAGE OBJECT MODEL (POM) - CheckoutPage
 * This covers both step one (info) and step two (overview/pricing).
 */
export class CheckoutPage {
    private readonly page: Page;
    private readonly firstNameInput: Locator;
    private readonly lastNameInput: Locator;
    private readonly postalCodeInput: Locator;
    private readonly continueButton: Locator;
    private readonly finishButton: Locator;
    private readonly cancelButton: Locator;
    private readonly errorMessage: Locator;
    private readonly subtotalLabel: Locator;
    private readonly taxLabel: Locator;
    private readonly totalLabel: Locator;

    constructor(page: Page) {
        this.page = page;
        this.firstNameInput = page.locator('[data-test="firstName"]');
        this.lastNameInput = page.locator('[data-test="lastName"]');
        this.postalCodeInput = page.locator('[data-test="postalCode"]');
        this.continueButton = page.locator('[data-test="continue"]');
        this.finishButton = page.locator('[data-test="finish"]');
        this.cancelButton = page.locator('[data-test="cancel"]');
        this.errorMessage = page.locator('[data-test="error"]');
        this.subtotalLabel = page.locator('[data-test="subtotal-label"]');
        this.taxLabel = page.locator('[data-test="tax-label"]');
        this.totalLabel = page.locator('[data-test="total-label"]');
    }

    /**
     * Action: Multi-field form filling.
     * Logic: We fill whatever data is passed, then continue. Excellent for testing missing field errors.
     */
    async fillInformation(firstName: string, lastName: string, postalCode: string) {
        if (firstName !== null) await this.firstNameInput.fill(firstName);
        if (lastName !== null) await this.lastNameInput.fill(lastName);
        if (postalCode !== null) await this.postalCodeInput.fill(postalCode);
        await this.continueButton.click();
    }

    async finish() {
        await this.finishButton.click();
    }

    async cancel() {
        await this.cancelButton.click();
    }

    /**
     * Complex Logic: Financial Integrity Validation.
     * Why? Bad Practice: Hardcoding the final total like "Total: $32.39". 
     * Good Practice: Extracting individual values and verifying the sum. 
     * Risk: If tax calculation logic changes from 8%, this math test helps us detect it.
     */
    async assertCalculations() {
        const subtotalText = await this.subtotalLabel.textContent();
        const taxText = await this.taxLabel.textContent();
        const totalText = await this.totalLabel.textContent();

        // Cleaning string data: "Item total: $29.99" -> 29.99
        const subtotal = parseFloat(subtotalText?.split('$')[1] || '0');
        const tax = parseFloat(taxText?.split('$')[1] || '0');
        const total = parseFloat(totalText?.split('$')[1] || '0');

        // Using toBeCloseTo for float math precision (handles 0.1 + 0.2 issue)
        expect(subtotal + tax).toBeCloseTo(total, 2);
    }

    async assertSubtotal(expectedSubtotal: number) {
        const subtotalText = await this.subtotalLabel.textContent();
        const subtotal = parseFloat(subtotalText?.split('$')[1] || '0');
        expect(subtotal).toBe(expectedSubtotal);
    }

    async assertErrorMessage(expectedMessage: string) {
        await expect(this.errorMessage).toBeVisible();
        await expect(this.errorMessage).toContainText(expectedMessage);
    }
}
