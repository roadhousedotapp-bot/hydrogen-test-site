import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useRouteError,
} from '@remix-run/react';
import type {LinksFunction, LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {json} from '@shopify/remix-oxygen';

import styles from '~/styles/app.css?url';
import {GoogleTagManager} from '~/components/GoogleTagManager';

export const links: LinksFunction = () => [{rel: 'stylesheet', href: styles}];

export async function loader({context}: LoaderFunctionArgs) {
  const {cart, customerAccount, storefront} = context;

  const isLoggedIn = await customerAccount.isLoggedIn();
  const cartPromise = cart.get();
  const selectedLocale = storefront.i18n;

  return json({
    isLoggedIn,
    cart: cartPromise,
    selectedLocale,
  });
}

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
        <GoogleTagManager />
      </head>
      <body>
        <header style={{backgroundColor: '#f8f8f8', padding: '15px 20px', borderBottom: '1px solid #eee'}}>
          <nav>
            {/* Add your navigation links here */}
            <a href="/" style={{marginRight: '15px', textDecoration: 'none', color: '#333'}}>Home</a>
            <a href="/products" style={{marginRight: '15px', textDecoration: 'none', color: '#333'}}>Products</a>
            <a href="/about" style={{textDecoration: 'none', color: '#333'}}>About</a>
          </nav>
        </header>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-5P9R6MP8"
            height="0"
            width="0"
            style={{display: 'none', visibility: 'hidden'}}
          />
        </noscript>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <html lang="en">
        <head>
          <Meta />
          <Links />
        </head>
        <body>
          <h1>{error.status}</h1>
          <p>{error.statusText}</p>
          <Scripts />
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <h1>Unexpected error</h1>
        <Scripts />
      </body>
    </html>
  );
}
