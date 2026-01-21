import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';

export async function loader({
  params: _params,
  request: _request,
  context,
}: LoaderFunctionArgs) {
  return context.customerAccount.login();
}
