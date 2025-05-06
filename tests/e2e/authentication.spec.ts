import { test, expect } from './setup';

test.describe('Authentication', () => {
  test('should show login page', async ({ page }) => {
    await page.goto('/auth');
    await expect(page).toHaveTitle(/ComplexCare CRM/);
    await expect(page.getByRole('heading', { name: /Sign in to your account/i })).toBeVisible();
  });

  test('should redirect to login page when trying to access protected routes', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/auth/);
  });

  test('should show error on invalid login', async ({ page }) => {
    await page.goto('/auth');
    await page.fill('input[name="username"]', 'invaliduser');
    await page.fill('input[name="password"]', 'invalidpassword');
    await page.click('button[type="submit"]');
    
    // Should show error message
    await expect(page.getByText(/invalid username or password/i)).toBeVisible();
    
    // Should still be on auth page
    await expect(page).toHaveURL(/auth/);
  });

  test('should login successfully with valid credentials and logout', async ({ page, loginAsAdmin }) => {
    await loginAsAdmin();
    
    // Should be redirected to dashboard
    await expect(page).toHaveURL(/dashboard/);
    
    // User should be able to see their name
    await expect(page.getByText(/Admin User/i)).toBeVisible();
    
    // Should be able to logout
    await page.click('button[aria-label="Open user menu"]');
    await page.click('button:has-text("Log out")');
    
    // Should be redirected to login page
    await expect(page).toHaveURL(/auth/);
  });
});
