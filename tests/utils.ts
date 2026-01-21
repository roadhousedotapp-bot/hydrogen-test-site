/**
 * Formats a number as USD. Example: 1800 => $1,800.00
 */
export function formatPrice(
  price: string | number,
  currency = 'USD',
  locale = 'en-US',
) {
  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  });

  return formatter.format(Number(price));
}

/**
 * Removes symbols and decimals from a price and converts to number.
 * Supports both $ and NOK formats by stripping non-numeric prefixes.
 */
export function normalizePrice(price: string | null) {
  // 1. Initial check: Ensure we have a string to work with
  if (!price) {
    throw new Error('Price was not found');
  }

  // 2. Clean the string: Remove currency codes (NOK, USD) and symbols ($)
  // This replaces your !/^[$\d.,]+$/.test(price) check to allow "NOK"
  const cleanedPrice = price.replace(/[^\d.,]/g, '').trim();

  if (!cleanedPrice) {
    throw new Error(
      `Could not extract numeric value from price string: "${price}"`,
    );
  }

  // 3. Maintain your original conversion logic:
  // This handles the decimal shift (e.g., "50,00" -> "50.00")
  return Number(
    cleanedPrice
      .replace(/[.,](\d\d)$/, '-$1') // Mark the decimal point with a placeholder
      .replace(/[.,]/g, '') // Remove any thousands separators
      .replace('-', '.'), // Restore the decimal point as a dot
  );
}
