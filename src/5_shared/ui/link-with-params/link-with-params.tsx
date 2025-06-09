'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

type LinkProps = Parameters<typeof Link>[0];

export interface LinkWithParamsProps extends LinkProps {
  params?: Record<string, string>;
} 

export function LinkWithParams({ href, params, ...props }: LinkWithParamsProps) {
  const searchParams = useSearchParams();

  return <Link href={{
    pathname: typeof href === 'string' ? href : href.pathname,
    query: {...Object.fromEntries(searchParams), ...params}
  }} {...props} />;
}