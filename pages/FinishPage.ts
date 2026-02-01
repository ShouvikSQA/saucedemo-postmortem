/**
 * @author Mallik Galib Shahriar
 * @link https://www.linkedin.com/in/mallikgalibshahriar/
 */

import { Page, Locator, expect } from '@playwright/test';

/**
 * PAGE OBJECT MODEL (POM) - FinishPage
 * The final success screen.
 */
export class FinishPage {
    private readonly page: Page;
    private readonly completeHeader: Locator;
    private readonly backHomeButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.completeHeader = page.locator('.complete-header');
        this.backHomeButton = page.locator('[data-test="back-to-products"]');
    }

    async assertSuccessMessage(expectedHeader: string) {
        await expect(this.completeHeader).toHaveText(expectedHeader);
    }

    async backHome() {
        await this.backHomeButton.click();
    }
}
