import type { ReactNode } from 'react';
import { Container } from './container';

/** Centered title block shown at the top of most inner pages (small label, big title, intro text). */
export function PageHeader({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <section className='border-b border-border'>
      <Container className='flex flex-col items-center py-14 text-center md:py-[76px]'>
        <p className='text-[13px] font-semibold uppercase tracking-[0.12em] text-muted-foreground'>
          {eyebrow}
        </p>
        <h1 className='mt-2.5 max-w-[880px] text-5xl font-bold leading-[1.06] tracking-[-0.045em] text-foreground md:text-[64px]'>
          {title}
        </h1>
        {children && (
          <div className='mt-5 max-w-[760px] text-[17px] leading-[26px] text-muted-foreground'>
            {children}
          </div>
        )}
      </Container>
    </section>
  );
}

/**
 * Builds the browser tab title and social-sharing tags for a page.
 * Used in each route's `head()` so every page has its own title and description.
 */
export function pageHead(title: string, description: string) {
  return {
    meta: [
      { title },
      { name: 'description', content: description },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
  };
}
