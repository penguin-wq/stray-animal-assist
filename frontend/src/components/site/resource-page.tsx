// Shared layout for the Resources pages (Adoption Guide, Pet Care Tips, FAQ).

import type { ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';
import { Container } from './container';
import { SiteLayout } from './site-layout';
import { PageHeader } from './page-header';
import { SmartLink } from './smart-link';
import { mainNav } from '@/data/nav';

// The Resources dropdown links, reused as the side menu on these pages.
const resourceLinks = mainNav.find((n) => n.children)?.children ?? [];

/** One numbered block of tips: a heading and a bullet list. */
export type ResourceSection = { title: string; points: string[] };

/**
 * Page frame for a resource article: header, a side menu of all resources (the current one
 * highlighted), numbered tip sections, any extra content, and a closing call-to-action.
 */
export function ResourcePage({
  eyebrow,
  title,
  intro,
  sections,
  current,
  children,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  sections?: ResourceSection[];
  current: string;
  children?: ReactNode;
}) {
  return (
    <SiteLayout>
      <PageHeader eyebrow={eyebrow} title={title}>
        {intro}
      </PageHeader>
      <Container className='grid gap-12 py-16 md:py-20 lg:grid-cols-[220px_1fr]'>
        {/* Side menu linking to every resource page. */}
        <nav aria-label='Resources' className='lg:sticky lg:top-8 lg:self-start'>
          <p className='text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground'>
            Resources
          </p>
          <ul className='mt-3 flex flex-wrap gap-2 lg:flex-col lg:gap-1'>
            {resourceLinks.map((l) => (
              <li key={l.to}>
                <SmartLink
                  to={l.to}
                  className={`block rounded-lg px-3 py-2 text-sm font-medium ${
                    l.to === current
                      ? 'bg-foreground text-primary-foreground'
                      : 'text-ink-soft hover:bg-secondary'
                  }`}
                >
                  {l.label}
                </SmartLink>
              </li>
            ))}
          </ul>
        </nav>
        {/* Numbered tip sections, then any custom content passed in. */}
        <div className='max-w-[760px] space-y-10'>
          {sections?.map((s, i) => (
            <section key={s.title}>
              <p className='text-[13px] font-semibold tracking-[0.08em] text-plum-soft'>
                {String(i + 1).padStart(2, '0')}
              </p>
              <h2 className='mt-1.5 text-2xl font-bold tracking-[-0.02em] text-foreground'>
                {s.title}
              </h2>
              <ul className='mt-3 list-disc space-y-2 pl-5 text-base leading-[26px] text-muted-foreground marker:text-plum'>
                {s.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </section>
          ))}
          {children}
          {/* Closing prompt to browse animals or apply. */}
          <div className='rounded-2xl border border-border bg-secondary p-7'>
            <p className='text-lg font-semibold text-foreground'>Ready for the next step?</p>
            <div className='mt-4 flex flex-wrap gap-4 text-sm font-semibold'>
              <SmartLink
                to='/rescues'
                className='inline-flex items-center gap-1.5 text-foreground hover:underline'
              >
                Meet our rescues <ArrowRight className='size-4' />
              </SmartLink>
              <SmartLink
                to='/adopt/inquiry'
                className='inline-flex items-center gap-1.5 text-foreground hover:underline'
              >
                Start an application <ArrowRight className='size-4' />
              </SmartLink>
            </div>
          </div>
        </div>
      </Container>
    </SiteLayout>
  );
}
