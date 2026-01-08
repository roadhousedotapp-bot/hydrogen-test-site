# Hydrogen template: Demo Store

Hydrogen is Shopify’s stack for headless commerce. Hydrogen is designed to dovetail with [Remix](https://remix.run/), Shopify’s full stack web framework. This template contains a **full-featured setup** of components, queries and tooling to get started with Hydrogen. It is deployed at [hydrogen.shop](https://hydrogen.shop)

[Check out Hydrogen docs](https://shopify.dev/custom-storefronts/hydrogen)
[Get familiar with Remix](https://remix.run/docs/en/v1)

## What's included

- Remix
- Hydrogen
- Oxygen
- Shopify CLI
- ESLint
- Prettier
- GraphQL generator
- TypeScript and JavaScript flavors
- Tailwind CSS (via PostCSS)
- Full-featured setup of components and routes

## Getting started

**Requirements:**

- Node.js version 18.0.0 or higher

```bash
npm create @shopify/hydrogen@latest -- --template demo-store
```

Remember to update `.env` with your shop's domain and Storefront API token!

## Building for production

```bash
npm run build
```

## Local development

```bash
npm run dev
```

## Setup for using Customer Account API (`/account` section)

### Setup public domain using ngrok

1. Setup a [ngrok](https://ngrok.com/) account and add a permanent domain (ie. `https://<your-ngrok-domain>.app`).
1. Install the [ngrok CLI](https://ngrok.com/download) to use in terminal
1. Start ngrok using `ngrok http --domain=<your-ngrok-domain>.app 3000`

### Include public domain in Customer Account API settings

1. Go to your Shopify admin => `Hydrogen` or `Headless` app/channel => Customer Account API => Application setup
1. Edit `Callback URI(s)` to include `https://<your-ngrok-domain>.app/account/authorize`
1. Edit `Javascript origin(s)` to include your public domain `https://<your-ngrok-domain>.app` or keep it blank
1. Edit `Logout URI` to include your public domain `https://<your-ngrok-domain>.app` or keep it blank

### Google Tag Manager information

@@ -1,6 +1,6 @@
-# Hydrogen template: Skeleton
+# Hydrogen template: Google Tag Manager (GTM)

-Hydrogen is Shopify’s stack for headless commerce. Hydrogen is designed to dovetail with [Remix](https://remix.run/), Shopify’s full stack web framework. This template contains a **minimal setup** of components, queries and tooling to get started with Hydrogen.
+This Hydrogen template demonstrates how to implement Google Tag Manager with analytics integration. Hydrogen supports both Shopify analytics and third-party services with built-in support for the [Customer Privacy API](https://shopify.dev/docs/api/customer-privacy).

[Check out Hydrogen docs](https://shopify.dev/custom-storefronts/hydrogen)
[Get familiar with Remix](https://remix.run/docs/en/v1)
@@ -16,18 +16,67 @@ Hydrogen is Shopify’s stack for headless commerce. Hydrogen is designed to dov

- Prettier
- GraphQL generator
- TypeScript and JavaScript flavors
  -- Minimal setup of components and routes
  +- **Google Tag Manager integration**
  +- **Analytics.Provider setup**
  +- **Customer Privacy API support**

## Getting started

**Requirements:**

- Node.js version 18.0.0 or higher
  +- Google Tag Manager account with container ID

```bash
npm create @shopify/hydrogen@latest
```

+## Google Tag Manager Setup

- +### 1. Enable Customer Privacy / Cookie Consent Banner
- +In the Shopify admin, navigate to Settings → Customer Privacy → Cookie Banner:
- +- Configure region visibility for the banner
  +- Customize banner appearance and position (optional)
  +- Set up cookie preferences
- +### 2. Configuration Requirements
- +- [Configure customer privacy settings](https://help.shopify.com/en/manual/privacy-and-security/privacy/customer-privacy-settings/privacy-settings) - Manage privacy settings to comply with data protection laws
  +- [Add a cookie banner](https://help.shopify.com/en/manual/privacy-and-security/privacy/customer-privacy-settings/privacy-settings#add-a-cookie-banner) - Display consent notifications for data collection
- +### 3. Update GTM Container ID
- +Replace `GTM-<YOUR_GTM_ID>` with your actual Google Tag Manager container ID in:
  +- `app/root.tsx` - Script tags in head and body sections
- +### 4. Content Security Policy
- +The template includes pre-configured CSP headers for GTM domains:
  +- `*.googletagmanager.com`
  +- `*.google-analytics.com`
  +- `*.analytics.google.com`
- +## Key Files
- +| File | Description |
  +|------|-------------|
  +| `app/components/GoogleTagManager.tsx` | Subscribes to analytics events and pushes to GTM dataLayer |
  +| `app/root.tsx` | Contains GTM script tags and Analytics.Provider setup |
  +| `app/entry.server.tsx` | Configured CSP headers for GTM domains |
- +## Analytics Events
- +The GTM component listens to Hydrogen analytics events and pushes them to the dataLayer:
- +```tsx
  +// Example: Product viewed event
  +subscribe('product_viewed', () => {
- window.dataLayer.push({event: 'viewed-product'});
  +});
  +```
- ## Building for production

  ```bash
  @@ -42,4 +91,4 @@ npm run dev

  ## Setup for using Customer Account API (`/account` section)

  -Follow step 1 and 2 of <https://shopify.dev/docs/custom-storefronts/building-with-the-customer-account-api/hydrogen#step-1-set-up-a-public-domain-for-local-development>
  +Follow step 1 and 2 of <https://shopify.dev/docs/custom-storefronts/building-with-the-customer-account-api/hydrogen#step-1-set-up-a-public-domain-for-local-development>
  \ No newline at end of file
  ```
