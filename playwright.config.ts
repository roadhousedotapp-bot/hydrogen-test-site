import {
  defineConfig,
  devices,
  type PlaywrightTestConfig,
} from '@playwright/test';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
let config: PlaywrightTestConfig = defineConfig({
  testDir: './tests',
  /* Preserved: Increased global timeout for hydration-heavy Hydrogen apps */
  timeout: 60 * 1000,
  expect: {
    timeout: 10000,
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    actionTimeout: 15000,
    video: 'on-first-retry',
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
    bypassCSP: true,
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
  ],

  // Consolidating the WebServer here
  webServer: {
    command: 'npm run preview',
    port: 3000,
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
    // CRITICAL: Pass CI environment variables to the local server process
    env: {
      SESSION_SECRET: process.env.SESSION_SECRET || '',
      PUBLIC_STOREFRONT_API_TOKEN:
        process.env.PUBLIC_STOREFRONT_API_TOKEN || '',
      PUBLIC_STORE_DOMAIN: process.env.PUBLIC_STORE_DOMAIN || '',
    },
  },
});

/* Preserved: Environment variable logic for Oxygen/CI environments */
if (process.env.URL) {
  const use = {
    ...config.use,
    baseURL: process.env.URL,
  };

  if (process.env.AUTH_BYPASS_TOKEN) {
    use.extraHTTPHeaders = {
      'oxygen-auth-bypass-token': process.env.AUTH_BYPASS_TOKEN,
    };
  }

  config = {
    ...config,
    use,
    // Remove webServer from here if it exists to avoid conflicts
  };
} else {
  config = {
    ...config,
    use: {
      ...config.use,
      baseURL: 'http://localhost:3000',
    },
    // We removed the second webServer block from here because it's now
    // globally defined above with the correct 'env' settings.
  };
}

export default config;
