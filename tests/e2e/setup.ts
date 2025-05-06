import { test as base } from '@playwright/test';

// Extend the basic test fixture with custom auth methods
type CustomTestFixtures = {
  loginAsAdmin: () => Promise<void>;
  loginAsCareStaff: () => Promise<void>;
  loginAsPatient: () => Promise<void>;
};

export const test = base.extend<CustomTestFixtures>({
  // Define the loginAsAdmin fixture
  loginAsAdmin: async ({ page }, use) => {
    const login = async () => {
      await page.goto('/auth');
      await page.fill('input[name="username"]', 'admin');
      await page.fill('input[name="password"]', 'admin123');
      await page.click('button[type="submit"]');
      // Wait for dashboard to load
      await page.waitForURL('/dashboard');
    };

    await use(login);
  },
  
  // Define the loginAsCareStaff fixture
  loginAsCareStaff: async ({ page }, use) => {
    const login = async () => {
      await page.goto('/auth');
      await page.fill('input[name="username"]', 'carestaff');
      await page.fill('input[name="password"]', 'care123');
      await page.click('button[type="submit"]');
      // Wait for dashboard to load
      await page.waitForURL('/dashboard');
    };

    await use(login);
  },
  
  // Define the loginAsPatient fixture
  loginAsPatient: async ({ page }, use) => {
    const login = async () => {
      await page.goto('/auth');
      await page.fill('input[name="username"]', 'patient');
      await page.fill('input[name="password"]', 'patient123');
      await page.click('button[type="submit"]');
      // Wait for dashboard to load
      await page.waitForURL('/dashboard');
    };

    await use(login);
  },
});

export { expect } from '@playwright/test';
