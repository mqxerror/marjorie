import { test, expect, type Page } from '@playwright/test';

const uniqueEmail = `test+${Date.now()}@example.com`;

async function adminLogin(page: Page) {
  await page.goto('/admin/login');
  await page.getByLabel(/username/i).fill('wassim');
  await page.getByLabel(/password/i).fill('5ty6%TY^5ty6');
  await page.getByRole('button', { name: /sign in/i }).click();
  await expect(page).toHaveURL('/admin', { timeout: 10000 });
  // Full reload so the server layout re-renders with the session cookie
  await page.goto('/admin');
  await page.waitForLoadState('networkidle');
}

test.describe.serial('Full Application Flow: Form → Admin Dashboard', () => {

  test('1. Fill and submit the screening form', async ({ page }) => {
    await page.goto('/events');
    await page.waitForLoadState('networkidle');

    // Dismiss draft banner if present
    const startOver = page.getByText('Start over');
    if (await startOver.isVisible({ timeout: 2000 }).catch(() => false)) {
      await startOver.click();
    }

    // ── Section 1: Basic Information ──
    await page.getByLabel(/full name/i).fill('Playwright Test User');
    await page.getByLabel(/mobile number/i).fill('+971501234567');
    await page.getByLabel(/email/i).fill(uniqueEmail);

    // City — click "Dubai" radio
    await page.getByRole('radio', { name: /^Dubai$/i }).click();

    // ── Section 2: Eligibility & Background ──
    await page.getByRole('radio', { name: /^Filipino$/i }).click();

    // UAE Resident — use radiogroup role with legend text
    await page.getByRole('radiogroup', { name: /currently residing/i }).getByLabel('Yes').click();

    // Caregiving experience
    await page.getByRole('checkbox', { name: /home health care/i }).click();

    // Willing to work
    await page.getByRole('radiogroup', { name: /willing and able to work/i }).getByLabel('Yes').click();

    // Willing to drive
    await page.getByRole('radiogroup', { name: /willing to drive/i }).getByLabel('Yes').click();

    // ── Section 3: Expectation Setting ──
    await page.getByRole('radiogroup', { name: /2–3 years/i }).getByLabel('Yes').click();
    await page.getByRole('radiogroup', { name: /permanent relocation/i }).getByLabel('Yes').click();
    await page.getByRole('radiogroup', { name: /informational only/i }).getByLabel('Yes').click();

    // Financial — click the "Yes" option
    await page.getByRole('radiogroup', { name: /Financial Expectations/i }).getByLabel(/yes/i).click();

    // ── Section 4: Session Selection ──
    await page.getByRole('radio', { name: /in-person/i }).click();
    // Wait for session list to appear, then pick the first Dubai session
    // Labels are like "Saturday, February 21, 2026 | 3:00 PM – 5:00 PM"
    await page.getByRole('radio', { name: /February 21.*3:00 PM/i }).first().click();

    // ── Section 5: Final Acknowledgment ──
    await page.getByRole('checkbox', { name: /I confirm/i }).click();

    // Submit
    await page.getByRole('button', { name: /apply to attend/i }).click();

    // Wait for success screen
    await expect(page.getByText(/thank you/i)).toBeVisible({ timeout: 15000 });
    console.log('Form submitted successfully');
  });

  test('2. Login to admin dashboard', async ({ page }) => {
    await page.goto('/admin');
    await expect(page).toHaveURL(/\/admin\/login/);

    await page.getByLabel(/username/i).fill('wassim');
    await page.getByLabel(/password/i).fill('5ty6%TY^5ty6');
    await page.getByRole('button', { name: /sign in/i }).click();

    await expect(page).toHaveURL('/admin', { timeout: 10000 });
    await expect(page.getByText(/dashboard/i)).toBeVisible();
    console.log('Admin login successful');
  });

  test('3. Verify dashboard shows stats', async ({ page }) => {
    await adminLogin(page);

    await expect(page.getByText(/Total Applications/i)).toBeVisible();
    await expect(page.getByText('Qualified', { exact: true })).toBeVisible();
    await expect(page.getByText(/Today/i)).toBeVisible();
    await expect(page.getByText(/This Week/i)).toBeVisible();
    await expect(page.getByText(/Status Breakdown/i)).toBeVisible();
    await expect(page.getByText(/By Session/i)).toBeVisible();
    console.log('Dashboard stats loaded');
  });

  test('4. Navigate to applications and find the test submission', async ({ page }) => {
    await adminLogin(page);

    // Use sidebar link
    await page.getByRole('link', { name: /applications/i }).click();
    await expect(page).toHaveURL(/\/admin\/applications/);

    // Wait for table to load
    await expect(page.getByText(/Playwright Test User/i).first()).toBeVisible({ timeout: 10000 });
    console.log('Found test submission in applications table');

    // Search
    await page.getByPlaceholder(/search/i).fill('Playwright Test User');
    await expect(page.getByText(/Playwright Test User/i).first()).toBeVisible({ timeout: 5000 });
    console.log('Search works correctly');
  });

  test('5. Open application detail and update status', async ({ page }) => {
    await adminLogin(page);

    // Navigate directly to applications page
    await page.goto('/admin/applications');
    await page.waitForLoadState('networkidle');

    // Click on the test user's name to open detail
    await page.getByRole('link', { name: /Playwright Test User/i }).first().click();
    await page.waitForURL(/\/admin\/applications\//, { timeout: 10000 });

    // Verify detail page loaded — use heading to avoid strict mode on table links
    await expect(page.locator('h1', { hasText: 'Playwright Test User' })).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('+971501234567').first()).toBeVisible();
    console.log('Application detail page loaded');

    // Change status to "Contacted"
    const statusSelect = page.locator('select').last();
    await statusSelect.selectOption('Contacted');
    await page.waitForTimeout(1500);

    // Verify status badge updated
    await expect(page.locator('.inline-flex', { hasText: 'Contacted' })).toBeVisible({ timeout: 5000 });
    console.log('Status updated to Contacted');

    // Add review notes
    await page.getByPlaceholder(/add notes/i).fill('Playwright E2E test - auto reviewed');
    await page.getByRole('button', { name: /save notes/i }).click();
    await expect(page.getByText('Saved')).toBeVisible({ timeout: 5000 });
    console.log('Review notes saved');
  });

  test('6. Test sign out', async ({ page }) => {
    await adminLogin(page);

    // Sidebar should be visible after full page load
    await page.getByRole('button', { name: /sign out/i }).click();

    // Should redirect to login
    await expect(page).toHaveURL(/\/admin\/login/, { timeout: 10000 });
    console.log('Sign out successful');
  });
});
