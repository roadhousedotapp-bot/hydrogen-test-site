import {
  Link as RemixLink,
  NavLink as RemixNavLink,
  type NavLinkProps as RemixNavLinkProps,
  type LinkProps as RemixLinkProps,
  useRouteLoaderData,
} from '@remix-run/react';

import type {loader} from '~/root';
type RootLoader = typeof loader;

type LinkProps = Omit<RemixLinkProps, 'className'> & {
  className?: RemixNavLinkProps['className'] | RemixLinkProps['className'];
};

export function Link(props: LinkProps) {
  const {to, className, ...resOfProps} = props;
  const rootData = useRouteLoaderData<RootLoader>('root');
  const selectedLocale = rootData?.selectedLocale;

  let toWithLocale = to;

  if (typeof toWithLocale === 'string' && selectedLocale?.pathPrefix) {
    if (!toWithLocale.toLowerCase().startsWith(selectedLocale.pathPrefix)) {
      toWithLocale = `${selectedLocale.pathPrefix}${to}`;
    }
  }

  if (typeof className === 'function') {
    return (
      <RemixNavLink to={toWithLocale} className={className} {...resOfProps} />
    );
  }

  return <RemixLink to={toWithLocale} className={className} {...resOfProps} />;
}
