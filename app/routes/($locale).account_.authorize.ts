import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';

// eslint-disable-next-line no-unused-vars
export async function loader({context, params}: LoaderFunctionArgs) {
  return context.customerAccount.authorize();
}
