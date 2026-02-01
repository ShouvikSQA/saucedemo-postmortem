/**
 * @author Mallik Galib Shahriar
 * @link https://www.linkedin.com/in/mallikgalibshahriar/
 */

import { test as setup, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { testData } from '../data/testData';

const authFile = 'playwright/.auth/user.json';

/**
 * GLOBAL AUTHENTICATION SETUP
 * Why? Modern Practice: We login once here and save the "browser state" (cookies/localStorage) into a file.
 * Benefit: Other tests just read this file and they are ALREADY logged in. This saves 5-10 seconds per test.
 * Bad Practice: Logging in at the start of EVERY single test. It's slow and puts unnecessary load on the server.
 * Risk: If the session token expires, we need to re-run the setup.
 */
setup('authenticate', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login(testData.validUser.username, testData.validUser.password);

    // Verify we are actually logged in before saving state
    await expect(page).toHaveURL(/.*inventory.html/);

    // Save the state for reuse in other tests
    await page.context().storageState({ path: authFile });
});
