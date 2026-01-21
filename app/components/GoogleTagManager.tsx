import {useAnalytics} from '@shopify/hydrogen';
import {useEffect} from 'react';

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    dataLayer: any[];
  }
}

export function GoogleTagManager() {
  const {subscribe, register} = useAnalytics();
  const {ready} = register('Google Tag Manager');

  useEffect(() => {
    subscribe('product_viewed', () => {
      // Triggering a custom event in GTM for when a product is viewed
      window.dataLayer.push({event: 'viewed-product'});
    });

    ready();
  }, [ready, subscribe]);

  return null;
}
