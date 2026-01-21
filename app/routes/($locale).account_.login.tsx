import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';

// eslint-disable-next-line no-unused-vars
export async function loader({params, request, context}: LoaderFunctionArgs) {
  return context.customerAccount.login();
}
