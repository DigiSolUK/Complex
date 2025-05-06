#!/bin/bash

# Install Playwright browsers if needed
npx playwright install

# Run the tests
npx playwright test

# Show report if tests failed
if [ $? -ne 0 ]; then
  npx playwright show-report
fi
