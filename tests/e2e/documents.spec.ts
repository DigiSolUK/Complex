import { test, expect } from './setup';

test.describe('Documents Page', () => {
  test.beforeEach(async ({ loginAsAdmin, page }) => {
    // Login before each test
    await loginAsAdmin();
    // Navigate to documents page
    await page.goto('/documents');
  });

  test('should display documents page with filters', async ({ page }) => {
    // Check page title
    await expect(page.getByRole('heading', { name: 'Documents' })).toBeVisible();
    
    // Check filter components
    await expect(page.getByLabel('Document Type')).toBeVisible();
    await expect(page.getByLabel('Status')).toBeVisible();
    await expect(page.getByLabel('Department')).toBeVisible();
    await expect(page.getByLabel('Date Range')).toBeVisible();
    
    // Check document list is visible
    await expect(page.getByRole('table')).toBeVisible();
  });

  test('should filter documents by type', async ({ page }) => {
    // Open document type dropdown
    await page.getByLabel('Document Type').click();
    
    // Select Medical Records
    await page.getByRole('option', { name: 'Medical Records' }).click();
    
    // Click Apply Filters button
    await page.getByRole('button', { name: 'Apply Filters' }).click();
    
    // Wait for network request to complete
    await page.waitForResponse(response => 
      response.url().includes('/api/documents') && response.status() === 200
    );
    
    // Verify filtered results
    const cells = await page.getByRole('cell', { name: 'Medical Records' }).count();
    expect(cells).toBeGreaterThan(0);
  });

  test('should be able to view document details', async ({ page }) => {
    // Click on the first document view button
    await page.getByRole('button', { name: 'View' }).first().click();
    
    // Check that document modal appears
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByRole('heading', { name: /Document Details/i })).toBeVisible();
    
    // Close the modal
    await page.getByRole('button', { name: 'Close' }).click();
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });

  test('should be able to download a document', async ({ page }) => {
    // Setup download listener
    const downloadPromise = page.waitForEvent('download');
    
    // Click on the first document download button
    await page.getByRole('button', { name: 'Download' }).first().click();
    
    // Wait for download to start
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBeTruthy();
  });
});
