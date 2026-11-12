import { createFileRoute, Link, notFound } from '@tanstack/react-router';
import { ArrowLeft, ArrowRight, Heart, MapPin, PawPrint, ShieldCheck } from 'lucide-react';
import { Container } from '@/components/site/container';
import { SiteLayout } from '@/components/site/site-layout';
import { siteButtonClasses } from '@/components/site/site-button';
import { RescueCard } from '@/components/site/rescue-card';
import { pageHead } from '@/components/site/page-header';
import { getRescue, getShelter, rescues } from '@/data/rescues';

// /rescues/<slug> — detail page for one animal. The `_` in the file name keeps it a separate
// page instead of nesting it inside the /rescues list page.
export const Route = createFileRoute('/rescues_/$slug')({
  // Look up the animal (and its shelter) before the page shows; unknown names show "not found".
  loader: ({ params }) => {
    const rescue = getRescue(params.slug);
    if (!rescue) throw notFound();
    return { rescue, shelter: getShelter(rescue.shelter)! };
  },
  // Tab title and description use the animal's name and details.
  head: ({ loaderData }) =>
    loaderData
      ? pageHead(
          `Meet ${loaderData.rescue.name} — StrayAssist`,
          `${loaderData.rescue.name} is a ${loaderData.rescue.age} old ${loaderData.rescue.type.toLowerCase()} at ${loaderData.shelter.name}. ${loaderData.rescue.personality}`,
        )
      : pageHead('Rescue not found — StrayAssist', 'This animal could not be found.'),
  // Shown when the address doesn't match any animal.
  notFoundComponent: () => (
    <SiteLayout>
      <Container className='py-24 text-center'>
        <h1 className='text-4xl font-bold text-foreground'>We couldn't find that animal.</h1>
        <p className='mt-3 text-muted-foreground'>They may already have found a home.</p>
        <Link to='/rescues' className={siteButtonClasses('primary', 'md', 'mt-6')}>
          See all rescues
        </Link>
      </Container>
    </SiteLayout>
  ),
  component: RescueDetail,
});

/** The animal's page: photo, details, buttons to apply or see its shelter, and similar animals. */
function RescueDetail() {
  const { rescue, shelter } = Route.useLoaderData();
  // Up to three other animals of the same kind, shown at the bottom.
  const others = rescues
    .filter((r) => r.slug !== rescue.slug && r.type === rescue.type)
    .slice(0, 3);
  // The small fact boxes (type, age, gender, shelter).
  const facts = [
    { label: 'Type', value: rescue.type },
    { label: 'Age', value: rescue.age },
    { label: 'Gender', value: rescue.gender },
    { label: 'Shelter', value: shelter.location },
  ];

  return (
    <SiteLayout>
      <Container className='py-10 md:py-14'>
        <Link
          to='/rescues'
          className='inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground'
        >
          <ArrowLeft className='size-4' /> All rescues
        </Link>

        <div className='mt-6 grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start'>
          <div className='flex aspect-[4/3] items-center justify-center rounded-2xl border border-line-strong bg-surface-soft text-line-strong'>
            <PawPrint
              aria-label={`${rescue.name} photo placeholder`}
              className='size-24'
              strokeWidth={1}
            />
          </div>

          <div>
            <p className='text-[13px] font-semibold uppercase tracking-[0.12em] text-plum'>
              Available for adoption
            </p>
            <h1 className='mt-2 text-5xl font-bold tracking-[-0.045em] text-foreground md:text-[64px]'>
              {rescue.name}
            </h1>
            <p className='mt-5 text-lg leading-7 text-muted-foreground'>{rescue.personality}</p>

            <dl className='mt-7 grid grid-cols-2 gap-3'>
              {facts.map((f) => (
                <div
                  key={f.label}
                  className='rounded-xl border border-border bg-secondary px-4 py-3'
                >
                  <dt className='text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground'>
                    {f.label}
                  </dt>
                  <dd className='mt-1 text-base font-semibold text-foreground'>{f.value}</dd>
                </div>
              ))}
            </dl>

            <div className='mt-6'>
              <p className='text-sm font-semibold text-ink-soft'>Gets along with</p>
              <ul className='mt-2 flex flex-wrap gap-2'>
                {rescue.goodWith.map((g) => (
                  <li
                    key={g}
                    className='rounded-full bg-accent px-3 py-1.5 text-sm font-medium text-plum'
                  >
                    {g}
                  </li>
                ))}
              </ul>
            </div>

            {/* "Apply to adopt" opens the application with this animal pre-selected. */}
            <div className='mt-8 flex flex-wrap gap-2.5'>
              <Link
                to='/adopt/inquiry'
                search={{ animal: rescue.slug }}
                className={siteButtonClasses('primary', 'lg')}
              >
                Apply to adopt {rescue.name} <Heart className='size-[17px]' />
              </Link>
              <Link
                to='/shelters/$slug'
                params={{ slug: shelter.slug }}
                className={siteButtonClasses('secondary', 'lg')}
              >
                <MapPin className='size-[17px]' /> {shelter.name}
              </Link>
            </div>

            <p className='mt-6 flex items-start gap-2 text-[13px] leading-5 text-muted-foreground'>
              <ShieldCheck className='mt-0.5 size-4 shrink-0 text-plum' />
              Every adopter is screened with a valid ID, a personal reference and a home visit
              before an animal goes home.
            </p>
          </div>
        </div>

        {/* "More dogs/cats waiting" section. */}
        {others.length > 0 && (
          <section className='mt-20'>
            <div className='flex items-end justify-between gap-4'>
              <h2 className='text-3xl font-bold tracking-[-0.03em] text-foreground'>
                More {rescue.type.toLowerCase()}s waiting
              </h2>
              <Link
                to='/rescues'
                className='inline-flex items-center gap-1.5 text-sm font-semibold text-foreground hover:underline'
              >
                See all <ArrowRight className='size-4' />
              </Link>
            </div>
            <div className='mt-6 grid gap-8 md:grid-cols-2 lg:grid-cols-3'>
              {others.map((r) => (
                <RescueCard key={r.slug} rescue={r} />
              ))}
            </div>
          </section>
        )}
      </Container>
    </SiteLayout>
  );
}
