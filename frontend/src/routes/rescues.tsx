import { useMemo, useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { PawPrint } from 'lucide-react';
import { Container } from '@/components/site/container';
import { SiteLayout } from '@/components/site/site-layout';
import { RescueCard } from '@/components/site/rescue-card';
import { pageHead } from '@/components/site/page-header';
import { rescues, shelters } from '@/data/rescues';

// /rescues — grid of every animal available for adoption, with filters and page numbers.
export const Route = createFileRoute('/rescues')({
  head: () =>
    pageHead(
      'Meet our rescues — StrayAssist',
      'Browse dogs and cats currently in StrayAssist shelters and find the companion who is waiting for you.',
    ),
  component: RescuePage,
});

// How many animals to show per page.
const PAGE_SIZE = 6;

// Filter button groups shown under the title. "All" means that filter is off.
const filters = [
  {
    key: 'type',
    label: 'Type',
    values: [
      { value: 'All', label: 'All' },
      { value: 'Dog', label: 'Dog' },
      { value: 'Cat', label: 'Cat' },
    ],
  },
  {
    key: 'shelter',
    label: 'Shelter',
    values: [
      { value: 'All', label: 'All' },
      ...shelters.map((s) => ({ value: s.slug, label: s.location.split(',')[0]! })),
    ],
  },
  {
    key: 'gender',
    label: 'Gender',
    values: [
      { value: 'All', label: 'All' },
      { value: 'Male', label: 'Male' },
      { value: 'Female', label: 'Female' },
    ],
  },
] as const;

type FilterKey = (typeof filters)[number]['key'];

/** The rescues list page. */
function RescuePage() {
  // The chosen value for each filter.
  const [selected, setSelected] = useState<Record<FilterKey, string>>({
    type: 'All',
    shelter: 'All',
    gender: 'All',
  });
  // The page number the visitor is on.
  const [page, setPage] = useState(1);

  // Animals that match every chosen filter.
  const visibleRescues = useMemo(
    () =>
      rescues.filter(
        (r) =>
          (selected.type === 'All' || r.type === selected.type) &&
          (selected.shelter === 'All' || r.shelter === selected.shelter) &&
          (selected.gender === 'All' || r.gender === selected.gender),
      ),
    [selected],
  );

  // Split the matching animals into pages. If filters shrink the list, stay on a page that exists.
  const pageCount = Math.max(1, Math.ceil(visibleRescues.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const pageItems = visibleRescues.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  // Switch page and scroll back up to the top of the list.
  const goToPage = (n: number) => {
    setPage(n);
    document.getElementById('rescue-list')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <SiteLayout>
      <section className='border-b border-border'>
        <Container className='flex flex-col items-center py-14 text-center md:py-[72px]'>
          <p className='text-[13px] font-semibold uppercase tracking-[0.12em] text-muted-foreground'>
            Find your match
          </p>
          <h1 className='mt-2.5 text-5xl font-bold leading-[1.08] tracking-[-0.045em] text-foreground md:text-[64px]'>
            Meet our rescues.
          </h1>
          <p className='mt-5 max-w-[850px] text-[17px] leading-[25px] text-muted-foreground'>
            Every animal here is waiting for someone to choose them. Filter by what fits your home,
            and come say hello.
          </p>
          {/* Filter buttons. Changing a filter goes back to page 1. */}
          <div className='mt-8 flex flex-wrap justify-center gap-7'>
            {filters.map((filter) => (
              <fieldset
                key={filter.key}
                className='flex flex-wrap items-center justify-center gap-2'
              >
                <legend className='sr-only'>Filter by {filter.label}</legend>
                {filter.values.map((option) => (
                  <button
                    key={option.value}
                    type='button'
                    aria-pressed={selected[filter.key] === option.value}
                    onClick={() => {
                      setSelected((current) => ({ ...current, [filter.key]: option.value }));
                      setPage(1);
                    }}
                    className={`rounded-full px-4 py-2.5 text-sm font-semibold transition-colors ${
                      selected[filter.key] === option.value
                        ? 'bg-foreground text-primary-foreground'
                        : 'bg-chip text-muted-foreground hover:bg-secondary-hover'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </fieldset>
            ))}
          </div>
        </Container>
      </section>

      <section id='rescue-list' aria-label='Available rescues' className='scroll-mt-4'>
        <Container className='py-16 md:py-[72px]'>
          <div className='mb-6 flex items-center justify-between'>
            <p className='text-sm text-muted-foreground'>
              Showing {pageItems.length} of {visibleRescues.length} available rescues
            </p>
            <PawPrint aria-hidden='true' className='size-[19px] text-plum-soft' />
          </div>

          {/* The animal cards, or a friendly message when nothing matches. */}
          {pageItems.length > 0 ? (
            <div className='grid gap-8 md:grid-cols-2 lg:grid-cols-3'>
              {pageItems.map((rescue) => (
                <RescueCard key={rescue.slug} rescue={rescue} />
              ))}
            </div>
          ) : (
            <div className='rounded-xl border border-dashed border-line-strong py-20 text-center text-muted-foreground'>
              No rescues match those filters yet.
            </div>
          )}

          {/* Page number buttons, only when there is more than one page. */}
          {pageCount > 1 && (
            <nav className='mt-16 flex justify-center gap-2.5' aria-label='Rescue pages'>
              {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  type='button'
                  aria-label={`Page ${n}`}
                  aria-current={n === currentPage ? 'page' : undefined}
                  onClick={() => goToPage(n)}
                  className={`flex size-10 items-center justify-center rounded-xl text-sm font-semibold ${
                    n === currentPage
                      ? 'bg-foreground text-primary-foreground'
                      : 'bg-chip text-muted-foreground hover:bg-secondary-hover'
                  }`}
                >
                  {n}
                </button>
              ))}
            </nav>
          )}
        </Container>
      </section>
    </SiteLayout>
  );
}
