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
  retries: process.env.CI ? 2 : 1, // Added 1 retry for local runs to handle hydration blips
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    actionTimeout: 15000,
    /* Cleaned up: Record artifacts only when things go wrong */
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

  webServer: {
    command: 'npm run preview',
    port: 3000,
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
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
  };
} else {
  config = {
    ...config,
    use: {
      ...config.use,
      baseURL: 'http://localhost:3000',
    },
    webServer: {
      command: 'npm run preview',
      port: 3000,
      reuseExistingServer: !process.env.CI,
      timeout: 120 * 1000,
    },
  };
}

export default config;
