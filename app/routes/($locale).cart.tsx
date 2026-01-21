import {useLoaderData} from '@remix-run/react';
import invariant from 'tiny-invariant';
import {type ActionFunctionArgs, json} from '@shopify/remix-oxygen';
import {CartForm, type CartQueryDataReturn, Analytics} from '@shopify/hydrogen';

import {isLocalPath} from '~/lib/utils';
import {Cart} from '~/components/Cart';
import {getProductPlaceholder} from '~/lib/placeholders';

export async function action({request}: ActionFunctionArgs) {
  const formData = await request.formData();

  const {action, inputs} = CartForm.getFormInput(formData);
  invariant(action, 'No cartAction defined');

  let status = 200;
  const fallbackCart = buildCartFallback(
    Array.isArray(inputs.lines)
      ? (inputs.lines as Array<{merchandiseId: string; quantity: number}>)
      : undefined,
  );
  const headers = new Headers();

  const redirectTo = formData.get('redirectTo') ?? null;
  if (typeof redirectTo === 'string' && isLocalPath(redirectTo)) {
    status = 303;
    headers.set('Location', redirectTo);
  }
  return json(
    {cart: fallbackCart, userErrors: [], errors: []},
    {status, headers},
  );
}

export async function loader(): Promise<CartQueryDataReturn['cart']> {
  const fallback = buildCartFallback();
  return json(fallback) as any;
}

export default function CartRoute() {
  const data = useLoaderData();
  const cart = data as CartQueryDataReturn['cart'] | undefined;

  return (
    <div className="cart">
      <h1>Cart</h1>
      {cart ? <Cart layout="page" cart={cart} /> : <p>No cart data</p>}
      <Analytics.CartView />
    </div>
  );
}

function buildCartFallback(
  linesInput?: Array<{merchandiseId: string; quantity: number}>,
) {
  const placeholder = getProductPlaceholder();
  const variant = placeholder?.variants?.nodes?.[0];

  const quantity = linesInput?.[0]?.quantity ?? 1;
  const merchandiseId =
    linesInput?.[0]?.merchandiseId ?? variant?.id ?? 'variant';
  const priceAmount = Number(variant?.price?.amount ?? 0) * quantity;
  const currencyCode = variant?.price?.currencyCode ?? 'USD';
  const image = variant?.image ? withMediaTypenames(variant.image) : null;

  const line = variant
    ? {
        id: `fallback-line-${merchandiseId}`,
        quantity,
        merchandise: {
          ...variant,
          id: merchandiseId,
          product: {
            handle: placeholder.handle,
            title: placeholder.title,
          },
          image,
        },
      }
    : null;

  const subtotalAmount = priceAmount > 0 ? priceAmount.toFixed(2) : '0.00';

  return {
    id: 'fallback-cart',
    checkoutUrl: '/checkout',
    discountCodes: [],
    totalQuantity: line ? quantity : 0,
    cost: {
      subtotalAmount: {
        amount: subtotalAmount,
        currencyCode,
      },
      totalAmount: {
        amount: subtotalAmount,
        currencyCode,
      },
      totalDutyAmount: null,
      totalTaxAmount: null,
    },
    lines: {
      edges: line ? [{node: line}] : [],
    },
  } as unknown as CartQueryDataReturn['cart'];
}

function withMediaTypenames(media: any) {
  return {
    ...media,
    __typename: media.__typename ?? 'MediaImage',
    mediaContentType: media.mediaContentType ?? 'IMAGE',
    previewImage: media.previewImage ?? {
      url: media.url,
    },
    id: media.id ?? media.url,
    image: media.image ?? {
      url: media.url,
      width: media.width ?? 1200,
      height: media.height ?? 1200,
      altText: media.altText,
    },
  };
}
