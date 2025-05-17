import {defer} from '@shopify/remix-oxygen';
import {Await, useLoaderData} from '@remix-run/react';
import {Suspense} from 'react';

export async function loader() {
  const promise = new Promise((resolve) => {
    setTimeout(() => {
      resolve('Loaded');
    }, 5000);
  });

  return defer({
    test: promise,
  });
}

export default function Test() {
  const {test} = useLoaderData<typeof loader>();

  return (
    <div className="mt-12 flex flex-col items-center justify-center">
      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={test} errorElement={<div>Error</div>}>
          {(data) => <div>{data as string}</div>}
        </Await>
      </Suspense>
    </div>
  );
}
