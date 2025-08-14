import { test, expect } from '@playwright/test';

// This file is now superseded by login.e2e.spec.ts for Playwright E2E isolation.
// Please use login.e2e.spec.ts for all E2E tests.

// Helper for screenshot on failure
const screenshotOnFailure = async ({ page }, testInfo) => {
  if (testInfo.status !== testInfo.expectedStatus) {
    await page.screenshot({ path: `screenshots/${testInfo.title.replace(/\s+/g, '_')}.png`, fullPage: true });
  }
};

test.describe('Login Flow', () => {
  test('Client can login and see dashboard', async ({ page }, testInfo) => {
    await page.goto('http://localhost:5173/login');
    await expect(page).toHaveTitle(/login/i);
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await page.fill('input[name="email"]', 'client@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/dashboard/);
    await expect(page.locator('text=Welcome')).toBeVisible();
    await expect(page.locator('[role="status"]')).toBeVisible(); // Accessibility check
    await expect(page.locator('text=Total Invoices')).toBeVisible();
    await screenshotOnFailure({ page }, testInfo);
  });

  test('Admin can login and see admin dashboard', async ({ page }, testInfo) => {
    await page.goto('http://localhost:5173/login');
    await expect(page).toHaveTitle(/login/i);
    await page.fill('input[name="email"]', 'admin@techprocessing.com');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/admin/);
    await expect(page.locator('text=Admin Dashboard')).toBeVisible();
    await expect(page.locator('text=User Management')).toBeVisible(); // Example admin content
    await screenshotOnFailure({ page }, testInfo);
  });

  test('Shows error for invalid credentials', async ({ page }, testInfo) => {
    await page.goto('http://localhost:5173/login');
    await page.fill('input[name="email"]', 'wrong@user.com');
    await page.fill('input[name="password"]', 'wrongpass');
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Invalid credentials')).toBeVisible();
    await screenshotOnFailure({ page }, testInfo);
  });

  test('Login page has accessible form', async ({ page }) => {
    await page.goto('http://localhost:5173/login');
    await expect(page.locator('form[aria-label="login form"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toHaveAttribute('aria-required', 'true');
    await expect(page.locator('input[name="password"]')).toHaveAttribute('aria-required', 'true');
  });
});
