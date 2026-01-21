import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';

export async function loader({context, params: _params}: LoaderFunctionArgs) {
  return context.customerAccount.authorize();
}
