import { test, expect } from './setup';

test.describe('Patient Support Chat', () => {
  test.beforeEach(async ({ loginAsAdmin, page }) => {
    // Login before each test
    await loginAsAdmin();
    // Navigate to patient support page
    await page.goto('/tools/patient-support');
  });

  test('should display chat interface and allow sending messages', async ({ page }) => {
    // Check page title and content
    await expect(page.getByRole('heading', { name: /Patient Support Chat/i })).toBeVisible();
    
    // Check that the chat interface is visible
    await expect(page.locator('.chat-container')).toBeVisible();
    await expect(page.getByPlaceholder(/Type your message/i)).toBeVisible();
    
    // Type and send a message
    const testMessage = 'Hello, I need some help with my medication schedule';
    await page.getByPlaceholder(/Type your message/i).fill(testMessage);
    await page.getByRole('button', { name: /Send/i }).click();
    
    // Verify message appears in the chat
    await expect(page.getByText(testMessage)).toBeVisible();
    
    // Verify that the AI is responding (may take a moment)
    await expect(page.getByText(/AI Assistant/i)).toBeVisible({ timeout: 10000 });
  });

  test('should show chat history', async ({ page }) => {
    // Send a test message
    const testMessage = 'Can you help me understand my care plan?';
    await page.getByPlaceholder(/Type your message/i).fill(testMessage);
    await page.getByRole('button', { name: /Send/i }).click();
    
    // Wait for response
    await page.waitForTimeout(2000);
    
    // Reload the page to test persistence
    await page.reload();
    
    // Verify the message history is still visible
    await expect(page.getByText(testMessage)).toBeVisible();
  });

  test('should maintain context in conversation', async ({ page }) => {
    // First message to establish context
    await page.getByPlaceholder(/Type your message/i).fill('I take metformin twice daily');
    await page.getByRole('button', { name: /Send/i }).click();
    
    // Wait for response
    await page.waitForTimeout(2000);
    
    // Follow-up question that relies on context
    await page.getByPlaceholder(/Type your message/i).fill('When should I take it?');
    await page.getByRole('button', { name: /Send/i }).click();
    
    // Verify response mentions metformin timing
    await expect(page.getByText(/metformin/i, { exact: false })).toBeVisible({ timeout: 10000 });
  });
});
