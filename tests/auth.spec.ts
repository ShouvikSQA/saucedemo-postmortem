/**
 * @author Mallik Galib Shahriar
 * @link https://www.linkedin.com/in/mallikgalibshahriar/
 */

import { test, expect } from '../fixtures/fixtures';
import { testData } from '../data/testData';

/**
 * TEST SUITE: Authentication Integrity
 * Focus: Security and Edge cases during login.
 */
test.describe('🔐 Authentication (Login) - Core Foundation', () => {

    /**
     * Why storageState override?
     * Since we use global login, all tests start LOGGED IN.
     * But for authentication tests, we need a CLEAN browser (Logged out) to test the login form.
     */
    test.use({ storageState: { cookies: [], origins: [] } });

    test.beforeEach(async ({ loginPage }) => {
        await loginPage.navigate();
    });

    test('Valid username + valid password → login success', async ({ loginPage, page }) => {
        await loginPage.login(testData.validUser.username, testData.validUser.password);
        await expect(page).toHaveURL(/.*inventory.html/);
    });

    test('Invalid username + valid password → proper error', async ({ loginPage }) => {
        await loginPage.login('invalid_user', testData.validUser.password);
        await loginPage.assertErrorMessage(testData.errorMessages.wrongCredentials);
    });

    test('Valid username + invalid password → proper error', async ({ loginPage }) => {
        await loginPage.login(testData.validUser.username, 'wrong_password');
        await loginPage.assertErrorMessage(testData.errorMessages.wrongCredentials);
    });

    /**
     * Risk Check: Validation logic.
     * Tests if the app prevents empty submissions and shows correct user-friendly messages.
     */
    test('Empty username + password → validation message', async ({ loginPage }) => {
        await loginPage.login('', testData.validUser.password);
        await loginPage.assertErrorMessage(testData.errorMessages.usernameRequired);
    });

    test('Username filled, password empty → validation message', async ({ loginPage }) => {
        await loginPage.login(testData.validUser.username, '');
        await loginPage.assertErrorMessage(testData.errorMessages.passwordRequired);
    });

    test('Locked_out_user → correct lock message', async ({ loginPage }) => {
        await loginPage.login(testData.lockedUser.username, testData.lockedUser.password);
        await loginPage.assertErrorMessage(testData.errorMessages.lockedOut);
    });

    test('Error message disappears after retry/close', async ({ loginPage }) => {
        await loginPage.login('', '');
        await loginPage.assertErrorMessage(testData.errorMessages.usernameRequired);
        await loginPage.closeErrorMessage();
        await loginPage.assertErrorMessageNotVisible();
    });

    /**
     * Security Check: 
     * Ensures the password field is actually a password type (dots/stars instead of text).
     */
    test('Password field is masked', async ({ loginPage }) => {
        await loginPage.assertPasswordMasked();
    });
});
