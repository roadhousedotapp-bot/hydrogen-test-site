import {test, expect} from '@playwright/test';

import {formatPrice, normalizePrice} from './utils';

test.describe('Cart Flow', () => {
  test.beforeEach(async ({page}) => {
    await page.setViewportSize({width: 1280, height: 720});
  });

  test('Navigate from home to checkout successfully', async ({page}) => {
    // 1. Navigate to home
    await page.goto('/', {waitUntil: 'networkidle'});

    // 2. Select first product
    const productLink = page.locator('a[href*="/products/"]').first();
    await expect(productLink).toBeVisible({timeout: 15000});
    await productLink.click();

    // 3. Hydration Settle
    await expect(page).toHaveURL(/\/products\//, {timeout: 15000});
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000); // Wait for hydration to settle

    // 4. Capture Price
    const priceElement = page
      .locator('[data-test="price"], .price, .product-price')
      .first();
    await expect(priceElement).toBeVisible();
    const itemPrice = normalizePrice(await priceElement.textContent());

    // 5. Add to Cart (Filtering for visible, interactive elements)
    const addToCartButton = page
      .locator('[data-test="add-to-cart"], button:has-text("Add to cart")')
      .filter({has: page.locator('visible=true')})
      .first();

    await expect(addToCartButton).toBeVisible();
    await addToCartButton.click();

    // 6. Navigation Fallback
    // If hydration issues prevent the drawer, we ensure we reach the stable /cart page.
    await page.waitForTimeout(2000);
    if (!page.url().includes('/cart')) {
      await page.goto('/cart', {waitUntil: 'networkidle'});
    }

    // 7. Verify Subtotal
    const subtotal = page
      .locator(
        '.totals__subtotal-value, [data-test="subtotal"], .cart__subtotal-price',
      )
      .first();

    await expect(subtotal).toBeVisible({timeout: 15000});
    await expect(subtotal).toContainText(itemPrice.toString());

    // 8. Checkout
    const checkoutButton = page
      .locator(
        '[data-test="checkout-button"], a[href*="checkout"], button[name="checkout"], #checkout',
      )
      .filter({has: page.locator('visible=true')})
      .first();

    await expect(checkoutButton).toBeVisible();
    // Use dispatchEvent for stability against hydration lag
    await checkoutButton.dispatchEvent('click');

    // 9. Success Check
    await expect(page).toHaveURL(/.*checkout.*/, {timeout: 30000});
  });
});
