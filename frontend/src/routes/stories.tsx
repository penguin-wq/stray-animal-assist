import { createFileRoute } from '@tanstack/react-router';
import { ArrowRight, Check } from 'lucide-react';
import { Container } from '@/components/site/container';
import { SiteLayout } from '@/components/site/site-layout';
import { SiteButtonLink } from '@/components/site/site-button';
import { PageHeader, pageHead } from '@/components/site/page-header';

// /stories — rescue stories page.
export const Route = createFileRoute('/stories')({
  head: () =>
    pageHead(
      'Rescue stories — StrayAssist',
      'Real second chances: the animals StrayAssist volunteers rescued, healed and matched with loving families.',
    ),
  component: StoriesPage,
});

// The stories shown on the page (sample content until real stories are added).
const stories = [
  {
    name: 'Biscuit',
    tag: 'Rescued from the streets',
    title: 'A little patience. A lot of love.',
    body: 'Biscuit arrived scared and unsure. With a warm bed, a patient foster family and a whole lot of snacks, he found his confidence again. Today, he greets every visitor like an old friend.',
    steps: ['Rescued from the streets', 'Fostered for six weeks', 'Matched with a loving family'],
    image: '/rescue-story.jpg',
  },
  {
    name: 'Ming',
    tag: 'Reported by a neighbour',
    title: 'One message made the difference.',
    body: 'A neighbour spotted Ming hiding under a parked jeepney during a storm and sent us a photo and a pin. Our team found her within the hour. After a few weeks of care she moved in with a family who adores her.',
    steps: [
      'Reported with photo and location',
      'Treated for a leg injury',
      'Adopted by a family of four',
    ],
  },
  {
    name: 'Tisoy',
    tag: 'Senior rescue',
    title: "It's never too late for a home.",
    body: 'Tisoy spent years on the streets near the market. Volunteers fed him every morning until he trusted them enough to come to the shelter. At nine years old, he now naps on a sofa with a retired couple.',
    steps: ['Earned trust slowly', 'Health check and vaccines', 'Adopted at nine years old'],
  },
];

/** Lists each rescue story with its journey steps, then a call-to-action at the end. */
function StoriesPage() {
  return (
    <SiteLayout>
      <PageHeader eyebrow='Rescue stories' title='Every rescue is a story worth telling.'>
        These are a few of the animals our volunteers have helped — and the people who chose them.
      </PageHeader>
      <Container className='space-y-20 py-16 md:py-24'>
        {stories.map((s, i) => (
          <article key={s.name} className='grid items-center gap-10 lg:grid-cols-2'>
            <div className={`overflow-hidden rounded-2xl bg-accent ${i % 2 ? 'lg:order-2' : ''}`}>
              {s.image ? (
                <img
                  src={s.image}
                  alt={`${s.name} with a volunteer`}
                  className='aspect-[4/3] w-full object-cover'
                  loading='lazy'
                  width={1200}
                  height={900}
                />
              ) : (
                <div className='flex aspect-[4/3] items-center justify-center text-6xl font-bold tracking-[-0.04em] text-plum-soft'>
                  {s.name}
                </div>
              )}
            </div>
            <div>
              <p className='text-[13px] font-semibold uppercase tracking-[0.12em] text-muted-foreground'>
                {s.tag} · {s.name}
              </p>
              <h2 className='mt-3 text-[38px] font-bold leading-[1.1] tracking-[-0.04em] text-foreground md:text-5xl'>
                {s.title}
              </h2>
              <p className='mt-5 text-lg leading-[29px] text-muted-foreground'>{s.body}</p>
              <ul className='mt-6 space-y-2.5 text-[15px] font-medium text-ink-soft'>
                {s.steps.map((st) => (
                  <li key={st} className='flex items-center gap-2.5'>
                    <Check className='size-[17px] text-plum' /> {st}
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}
        <div className='rounded-2xl bg-foreground p-10 text-center text-primary-foreground'>
          <h2 className='text-3xl font-bold tracking-[-0.03em]'>
            The next story could start with you.
          </h2>
          <div className='mt-6 flex flex-wrap justify-center gap-2.5'>
            <SiteButtonLink to='/rescues' variant='soft'>
              Meet our rescues <ArrowRight className='size-4' />
            </SiteButtonLink>
            <SiteButtonLink to='/rescue/inquiry' variant='secondary'>
              Report an animal
            </SiteButtonLink>
          </div>
        </div>
      </Container>
    </SiteLayout>
  );
}
