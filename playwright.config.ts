import * as fs from 'fs';
import * as path from 'path';

// Load .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
const envVars: Record<string, string> = {};

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      if (key) {
        envVars[key.trim()] = valueParts.join('=').trim();
      }
    }
  });
}

import {
  defineConfig,
  devices,
  type PlaywrightTestConfig,
} from '@playwright/test';

// Build cross-env command with all variables
const _envVarString = Object.entries(envVars)
  .map(([key, value]) => `${key}=${value}`)
  .join(' ');

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
    command: 'npm run dev',
    port: 3000,
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
    env: {
      ...process.env,
      SESSION_SECRET:
        process.env.SESSION_SECRET ||
        '9d83402cb6db8bdf6a0219ecc8d39ebb1fba4830',
      PUBLIC_STOREFRONT_API_TOKEN:
        process.env.PUBLIC_STOREFRONT_API_TOKEN ||
        'f7b8ff7fcf3c4488b8298a96537e5cce',
      PUBLIC_STORE_DOMAIN:
        process.env.PUBLIC_STORE_DOMAIN ||
        'hydrogen-test-site-c3af9b28180909d81e30.o2.myshopify.dev',
      PUBLIC_STOREFRONT_ID: '1000070592',
      SHOP_ID: '69867438158',
      PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID:
        '15df4a30-725c-4c78-beb9-5935470227bb',
      PUBLIC_CUSTOMER_ACCOUNT_API_URL: 'https://shopify.com/69867438158',
    },
  },
});

/* Preserved: Environment variable logic for Oxygen/CI environments */
if (process.env.URL) {
  config.use = {
    ...config.use,
    baseURL: process.env.URL,
  };
  if (process.env.AUTH_BYPASS_TOKEN) {
    config.use.extraHTTPHeaders = {
      'oxygen-auth-bypass-token': process.env.AUTH_BYPASS_TOKEN,
    };
  }
} else {
  config.use = {
    ...config.use,
    baseURL: 'http://localhost:3000',
  };
}

export default config;
