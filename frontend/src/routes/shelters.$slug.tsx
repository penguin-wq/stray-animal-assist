import { createFileRoute, Link, notFound } from '@tanstack/react-router';
import { ArrowLeft, Heart, MapPin, Navigation } from 'lucide-react';
import { Container } from '@/components/site/container';
import { SiteLayout } from '@/components/site/site-layout';
import { siteButtonClasses } from '@/components/site/site-button';
import { RescueCard } from '@/components/site/rescue-card';
import { pageHead } from '@/components/site/page-header';
import { getShelter, rescues } from '@/data/rescues';

// /shelters/<slug> — page for one shelter with a map, directions and the animals living there.
export const Route = createFileRoute('/shelters/$slug')({
  // Look up the shelter before the page shows; unknown names show "not found".
  loader: ({ params }) => {
    const shelter = getShelter(params.slug);
    if (!shelter) throw notFound();
    return { shelter };
  },
  head: ({ loaderData }) =>
    loaderData
      ? pageHead(
          `${loaderData.shelter.name} — StrayAssist`,
          `${loaderData.shelter.description} Meet the animals at our ${loaderData.shelter.location} shelter.`,
        )
      : pageHead('Shelter not found — StrayAssist', 'This shelter could not be found.'),
  // Shown when the address doesn't match any shelter.
  notFoundComponent: () => (
    <SiteLayout>
      <Container className='py-24 text-center'>
        <h1 className='text-4xl font-bold text-foreground'>We couldn't find that shelter.</h1>
        <Link to='/' className={siteButtonClasses('primary', 'md', 'mt-6')}>
          Back to home
        </Link>
      </Container>
    </SiteLayout>
  ),
  component: ShelterPage,
});

/** The shelter page. */
function ShelterPage() {
  const { shelter } = Route.useLoaderData();
  // Animals currently at this shelter.
  const residents = rescues.filter((r) => r.shelter === shelter.slug);

  return (
    <SiteLayout>
      <Container className='py-10 md:py-14'>
        <Link
          to='/'
          hash='about'
          className='inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground'
        >
          <ArrowLeft className='size-4' /> Our shelters
        </Link>

        <div className='mt-6 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start'>
          <div>
            <p className='flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.1em] text-muted-foreground'>
              <MapPin className='size-4' /> {shelter.location}
            </p>
            <h1 className='mt-3 text-5xl font-bold leading-[1.05] tracking-[-0.045em] text-foreground md:text-[60px]'>
              {shelter.name}
            </h1>
            <p className='mt-5 text-lg leading-7 text-muted-foreground'>{shelter.about}</p>
            <div className='mt-8 flex flex-wrap gap-2.5'>
              <Link to='/adopt/inquiry' className={siteButtonClasses('primary', 'lg')}>
                Ask about visiting <Heart className='size-[17px]' />
              </Link>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(shelter.mapQuery)}`}
                target='_blank'
                rel='noreferrer'
                className={siteButtonClasses('secondary', 'lg')}
              >
                <Navigation className='size-[17px]' /> Get directions
              </a>
            </div>
            <p className='mt-5 text-[13px] text-muted-foreground'>
              Visits are by appointment so the animals stay calm. Send an adoption inquiry and we'll
              arrange a time.
            </p>
          </div>
          {/* Embedded OpenStreetMap centred on the shelter, with a marker. */}
          <div className='overflow-hidden rounded-2xl border border-line-strong'>
            <iframe
              title={`Map of ${shelter.location}`}
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${shelter.lng - 0.03},${shelter.lat - 0.02},${shelter.lng + 0.03},${shelter.lat + 0.02}&layer=mapnik&marker=${shelter.lat},${shelter.lng}`}
              className='h-80 w-full'
              loading='lazy'
            />
          </div>
        </div>

        <section className='mt-20'>
          <h2 className='text-3xl font-bold tracking-[-0.03em] text-foreground'>
            Waiting at {shelter.location.split(',')[0]}
          </h2>
          <div className='mt-6 grid gap-8 md:grid-cols-2 lg:grid-cols-3'>
            {residents.map((r) => (
              <RescueCard key={r.slug} rescue={r} />
            ))}
          </div>
        </section>
      </Container>
    </SiteLayout>
  );
}
