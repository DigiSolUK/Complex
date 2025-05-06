# ComplexCare CRM End-to-End Tests

This directory contains end-to-end tests for the ComplexCare CRM application using Playwright.

## Test Structure

- `e2e/setup.ts`: Configures test fixtures including login helpers for different user roles
- `e2e/authentication.spec.ts`: Tests for user authentication functionality
- `e2e/documents.spec.ts`: Tests for document management functionality
- `e2e/patient-support.spec.ts`: Tests for the AI-powered patient support chat

## Running Tests

To run the tests, you can use the provided script:

```bash
./tests/run-tests.sh
```

Or run the commands manually:

```bash
# Install Playwright browsers (only needed once)
npx playwright install

# Run the tests
npx playwright test

# View the report (if tests fail)
npx playwright show-report
```

## Running Tests with UI

You can also run tests with the Playwright UI:

```bash
npx playwright test --ui
```

## Test Coverage

The current test suite covers:

- Authentication flows (login, logout, protected routes)
- Document management (filtering, viewing, downloading)

More tests will be added for other functionalities in future updates.
