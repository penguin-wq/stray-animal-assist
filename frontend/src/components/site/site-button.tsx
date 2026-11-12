import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { SmartLink } from './smart-link';

//** Visual styles and sizes available for site buttons. */
export type SiteButtonVariant = 'primary' | 'secondary' | 'ghost' | 'soft';
export type SiteButtonSize = 'sm' | 'md' | 'lg' | 'icon';

//** Colors for each button style (all come from the theme tokens in styles.css). */
const variants: Record<SiteButtonVariant, string> = {
  primary: 'bg-primary text-primary-foreground hover:bg-primary-hover',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary-hover',
  ghost: 'bg-transparent text-foreground hover:bg-secondary',
  soft: 'bg-accent text-accent-foreground hover:bg-accent-hover',
};

/** Height, padding and corner radius for each button size. */
const sizes: Record<SiteButtonSize, string> = {
  sm: 'h-9 px-3 text-sm rounded-[10px]',
  md: 'h-10 px-3 text-sm rounded-xl',
  lg: 'h-12 px-5 text-base rounded-xl',
  icon: 'h-10 w-8 rounded-full',
};

/** Returns the button class names, so links and other elements can look like buttons too. */
export function siteButtonClasses(
  variant: SiteButtonVariant = 'primary',
  size: SiteButtonSize = 'md',
  className?: string,
) {
  return cn(
    'inline-flex items-center justify-center gap-2 font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:opacity-50',
    variants[variant],
    sizes[size],
    className,
  );
}

type CommonProps = {
  variant?: SiteButtonVariant;
  size?: SiteButtonSize;
  className?: string;
  children: ReactNode;
};

/** A regular <button> with the site styling. Defaults to type="button" so it never submits a form by accident. */
export function SiteButton({
  variant,
  size,
  className,
  children,
  type = 'button',
  ...props
}: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type={type} className={siteButtonClasses(variant, size, className)} {...props}>
      {children}
    </button>
  );
}

/** A link styled like a button (e.g. "Donate" in the navbar). */
export function SiteButtonLink({
  to,
  variant,
  size,
  className,
  children,
  ...rest
}: CommonProps & { to: string; 'aria-label'?: string }) {
  return (
    <SmartLink to={to} className={siteButtonClasses(variant, size, className)} {...rest}>
      {children}
    </SmartLink>
  );
}
