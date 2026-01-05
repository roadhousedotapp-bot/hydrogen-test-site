import type {AppLoadContext, EntryContext} from '@shopify/remix-oxygen';
import {RemixServer} from '@remix-run/react';
import isbot from 'isbot';
import {renderToReadableStream} from 'react-dom/server';
import {createContentSecurityPolicy} from '@shopify/hydrogen';
import React from 'react';

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
  context: AppLoadContext,
) {
  const {nonce, header, NonceProvider} = createContentSecurityPolicy({
  shop: {
    checkoutDomain: context.env.PUBLIC_CHECKOUT_DOMAIN,
    storeDomain: context.env.PUBLIC_STORE_DOMAIN,
  },
  scriptSrc: [
    "'self'",
    "https://cdn.shopify.com",
    "https://www.googletagmanager.com",
    "https://www.google-analytics.com",
  ] as const,
  imgSrc: [
    "'self'",
    "https://cdn.shopify.com",
    "https://www.google-analytics.com",
  ] as const,
  connectSrc: [
    "'self'",
    "https://www.google-analytics.com",
  ] as const,
});

  const body = await renderToReadableStream(
  React.createElement(
    NonceProvider,
    null,
    React.createElement(RemixServer, {
      context: remixContext,
      url: request.url,
    }),
  ),
  {
    nonce,
    signal: request.signal,
    onError(error) {
      console.error(error);
      responseStatusCode = 500;
    },
  },
);

  if (isbot(request.headers.get('user-agent'))) {
    await body.allReady;
  }

  responseHeaders.set('Content-Type', 'text/html');
  responseHeaders.set('Content-Security-Policy', header);

  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}
