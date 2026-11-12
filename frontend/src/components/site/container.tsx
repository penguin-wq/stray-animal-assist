import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

/** Centers page content and applies the site's standard side padding and max width. */
export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('mx-auto w-full max-w-[1440px] px-6 md:px-10 lg:px-20', className)}>
      {children}
    </div>
  );
}
