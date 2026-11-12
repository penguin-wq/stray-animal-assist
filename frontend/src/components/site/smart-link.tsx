import { Link } from '@tanstack/react-router';
import type { ReactNode } from 'react';

type SmartLinkProps = {
  to: string;
  className?: string;
  children: ReactNode;
  onClick?: () => void;
  'aria-label'?: string;
};

/** App paths ("/...") use the router; placeholders like "#" stay plain anchors. */
export function SmartLink({ to, children, ...rest }: SmartLinkProps) {
  // Real pages go through the router so navigation is instant (no full reload).
  if (to.startsWith('/')) {
    return (
      <Link to={to} activeOptions={{ exact: true }} {...rest}>
        {children}
      </Link>
    );
  }
  // Placeholder links ("#") are plain anchors because the router only accepts real paths.
  return (
    <a href={to} {...rest}>
      {children}
    </a>
  );
}
