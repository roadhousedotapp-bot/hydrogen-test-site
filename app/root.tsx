import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useRouteError,
} from '@remix-run/react';
import type {LinksFunction} from '@shopify/remix-oxygen';

import styles from '~/styles/app.css?url';
import {GoogleTagManager} from '~/components/GoogleTagManager';

export const links: LinksFunction = () => [{rel: 'stylesheet', href: styles}];

export default function App() {
  const {data} = useLoaderData<typeof loader>(); //
  const {ENV} = data; //

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <GoogleTagManager gtmId={ENV.PUBLIC_GTM_ID} />
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
