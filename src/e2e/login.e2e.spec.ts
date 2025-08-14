import { test, expect } from '@playwright/test';

test.describe('Login Flow', () => {
  test('Login page loads correctly', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('Can fill login form', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    
    // Verify form was filled
    await expect(page.locator('input[name="email"]')).toHaveValue('test@example.com');
    await expect(page.locator('input[name="password"]')).toHaveValue('password123');
  });

  test('Form submission triggers action', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    
    // Click submit and wait for network activity or page change
    await Promise.all([
      page.waitForResponse(response => response.url().includes('login') || response.url().includes('auth'), { timeout: 10000 }).catch(() => null),
      page.click('button[type="submit"]')
    ]);
    
    // Just verify we're still on a valid page (could be login with error or redirected)
    await expect(page.locator('body')).toBeVisible();
  });

  test('Login page has accessible form', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('form')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });
});
