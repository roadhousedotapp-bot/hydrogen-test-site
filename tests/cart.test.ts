import {test, expect} from '@playwright/test';
import {formatPrice, normalizePrice} from './utils';

test.describe('Cart', () => {
  test.beforeEach(async ({page}) => {
    await page.setViewportSize({width: 1280, height: 720});
  });

  test('From home to checkout flow', async ({page}) => {
    await page.goto(`/`);

    // 1. Check if we are stuck on the password page (Common in Dev Stores)
    if (await page.getByPlaceholder('Enter store password').isVisible()) {
        console.log('Detected Password Page. Tests might fail if not authenticated.');
        // Optional: You can add logic here to enter the password if you have one
    }

    // 2. Wait for the header to attach. 
    // We increase timeout to 30s because Hydrogen cold starts can be slow.
    const header = page.locator('header').first();
    await expect(header).toBeAttached({ timeout: 30000 });

    // 3. Find the menu item
    const navLink = page.locator('[data-test="nav-menu-item"]').first();
    await expect(navLink).toBeVisible({timeout: 10000});
    await navLink.click();

    // 4. Select the first product
    const firstItem = page.locator('a[href*="/products/"]').first();
    await expect(firstItem).toBeVisible();
    await firstItem.click();

    const firstItemPrice = normalizePrice(
      await page.locator(`[data-test=price]`).textContent(),
    );

    await page.locator(`[data-test=add-to-cart]`).click();

    await expect(
      page.locator('[data-test=subtotal]'),
      'should show the correct price',
    ).toContainText(formatPrice(firstItemPrice));

    // Increase quantity
    await page
      .locator(`button :text-is("+")`)
      .click({clickCount: 1, delay: 600});

    await expect(
      page.locator('[data-test=subtotal]'),
      'should double the price',
    ).toContainText(formatPrice(2 * firstItemPrice));

    await expect(
      page.locator('[data-test=item-quantity]'),
      'should increase quantity',
    ).toContainText('2');

    // Close cart drawer => Click Nav again => Click Product again
    await page.locator('[data-test=close-cart]').click();
    
    // Re-click the nav menu item we found earlier
    await page.locator('[data-test="nav-menu-item"]').first().click();
    await page.locator(`[data-test=product-grid] a >> nth=0`).click();

    const secondItemPrice = normalizePrice(
      await page.locator(`[data-test=price]`).textContent(),
    );

    await page.locator(`[data-test=add-to-cart]`).click();

    await expect(
      page.locator('[data-test=subtotal]'),
      'should add the price of the second item',
    ).toContainText(formatPrice(2 * firstItemPrice + secondItemPrice));

    const quantities = await page
      .locator('[data-test=item-quantity]')
      .allTextContents();
    await expect(
      quantities.reduce((a, b) => Number(a) + Number(b), 0),
      'should have the correct item quantities',
    ).toEqual(3);

    const priceInStore = await page
      .locator('[data-test=subtotal]')
      .textContent();

    await page.locator('a :text("Checkout")').click();

    // Validate Checkout URL
    await expect(page.url(), 'should navigate to checkout').toMatch(
      /checkout\.hydrogen\.shop\/checkouts\/[\d\w]+/,
    );

    const priceInCheckout = await page
      .locator('[role=cell] > span')
      .getByText(/^\$\d/)
      .textContent();

    await expect(
      normalizePrice(priceInCheckout),
      'should show the same price in checkout',
    ).toEqual(normalizePrice(priceInStore));
  });
});