// The sections that make up the home page, in order: hero, how to help, impact numbers,
// a rescue story, and about us with the shelters.

import { useEffect, useState } from 'react';
import {
  ArrowRight,
  Check,
  ChevronDown,
  Heart,
  MapPin,
  PawPrint,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { SiteButton, SiteButtonLink } from './site-button';
import { SmartLink } from './smart-link';
import { Container } from './container';
import { shelters } from '@/data/rescues';

// The three "How can you help" cards and where each button goes.
const actionCards = [
  {
    title: 'Donate',
    description: 'Your gift turns an emergency rescue into a second chance.',
    action: 'Help save a life',
    to: '/donate',
    icon: Heart,
  },
  {
    title: 'Adopt',
    description: 'Meet the companion who has been waiting for a place to call home.',
    action: 'Bring love home',
    to: '/rescues',
    icon: PawPrint,
  },
  {
    title: 'Report',
    description: 'See an animal in need? Help us get them to safety quickly.',
    action: 'Rescue an animal',
    to: '/rescue/inquiry',
    icon: ShieldCheck,
  },
];

// Numbers shown in the dark "Together, it adds up" band (sample figures).
const impactStats = [
  { value: '1,240', label: 'animals rescued' },
  { value: '980', label: 'happy adoptions' },
  { value: '320', label: 'active volunteers' },
];

// Headlines that rotate in the hero every few seconds.
const heroSlides = [
  {
    title: "You can't buy love, but you",
    line: 'can rescue it.',
    subtitle:
      "Adopt, foster or support a rescue and give them the second chance they've been waiting for.",
    cta: 'Start making a difference',
    to: '/adopt',
  },
  {
    title: 'Every rescue deserves',
    line: 'a safe place to land.',
    subtitle: 'A warm bed, a full bowl and someone who chooses them can change everything.',
    cta: 'Meet the animals',
    to: '/rescues',
  },
  {
    title: "There's a place for",
    line: 'you here.',
    subtitle:
      'Foster for a weekend, lend a hand at an event, or help spread the word. Your time can change a life.',
    cta: 'Become a volunteer',
    to: '/volunteer',
  },
];

/** Round arrow button that smoothly scrolls down to the section with the given id. */
function ScrollButton({ target }: { target: string }) {
  return (
    <SiteButton
      variant='soft'
      size='icon'
      aria-label='Scroll to next section'
      onClick={() => document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' })}
    >
      <ChevronDown aria-hidden='true' className='size-4' strokeWidth={2.25} />
    </SiteButton>
  );
}

/** Full-height opening section with a rotating headline and dot buttons to pick a slide. */
export function HomepageHero() {
  const [activeSlide, setActiveSlide] = useState(0);
  // activeSlide is always kept within range by the interval and dot buttons.
  const slide = heroSlides[activeSlide]!;

  // Move to the next headline every 5 seconds; stop the timer when the page is left.
  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % heroSlides.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <section id='home' aria-labelledby='home-heading' className='min-h-[calc(100vh-96px)]'>
      <Container className='flex min-h-[calc(100vh-96px)] flex-col items-center justify-center pb-[72px] pt-14 text-center'>
        <div className='mb-7 inline-flex items-center gap-2 rounded-full bg-accent px-3.5 py-[7px] text-[13px] font-semibold text-muted-foreground'>
          <Sparkles aria-hidden='true' className='size-[15px]' />
          Every rescue deserves a beginning
        </div>
        <h1
          id='home-heading'
          className='max-w-[900px] text-[52px] font-bold leading-[1.05] tracking-[-0.045em] text-foreground md:text-[76px]'
        >
          {slide.title}
          <span className='block'>{slide.line}</span>
        </h1>
        <p className='mt-6 max-w-[700px] text-lg font-semibold uppercase leading-[22px] tracking-[0.04em] text-muted-foreground md:text-xl'>
          {slide.subtitle}
        </p>
        {/* Main call-to-action (changes with the slide) plus a button that scrolls to "How can you help". */}
        <div className='mt-12 flex flex-wrap justify-center gap-2.5'>
          <SiteButtonLink to={slide.to}>
            {slide.cta} <ArrowRight aria-hidden='true' className='size-[17px]' />
          </SiteButtonLink>
          <SiteButton
            variant='secondary'
            onClick={() => document.getElementById('help')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Explore StrayAssist
          </SiteButton>
        </div>
        {/* One dot per slide; clicking a dot jumps to that headline. */}
        <div className='mt-auto flex items-center gap-5 pt-[50px]' aria-label='Homepage slides'>
          {heroSlides.map((item, index) => (
            <button
              key={item.title}
              type='button'
              aria-label={`Show headline ${index + 1}`}
              aria-current={activeSlide === index ? 'true' : undefined}
              onClick={() => setActiveSlide(index)}
              className={`size-2.5 rounded-full transition-colors ${
                activeSlide === index ? 'bg-foreground' : 'bg-line-input'
              }`}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}

/** "How can you help" — the Donate, Adopt and Report cards. */
export function HelpSection() {
  return (
    <section
      id='help'
      aria-labelledby='help-heading'
      className='border-t border-border bg-surface-soft'
    >
      <Container className='flex flex-col items-center py-[92px] text-center md:py-[120px]'>
        <p className='text-[13px] font-semibold uppercase tracking-[0.12em] text-muted-foreground'>
          There are many ways to show up
        </p>
        <h2
          id='help-heading'
          className='mt-3 text-5xl font-bold leading-[1.08] tracking-[-0.04em] text-foreground md:text-[72px]'
        >
          How can you help
        </h2>
        <p className='mt-6 max-w-[930px] text-lg font-semibold uppercase leading-[21px] tracking-[0.035em] text-muted-foreground md:text-xl'>
          Whether you choose to donate, adopt or report, you&apos;re giving them the second{' '}
          <span className='block'>chance they&apos;ve been waiting for.</span>
        </p>
        <div className='mt-[60px] grid w-full gap-4 text-left md:grid-cols-3'>
          {actionCards.map((card) => {
            const Icon = card.icon;
            return (
              <article
                key={card.title}
                className='group flex min-h-[275px] flex-col rounded-xl border border-line-strong bg-card p-[26px] transition-transform hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(17,18,20,0.07)]'
              >
                <div className='flex size-[42px] items-center justify-center rounded-full bg-accent text-muted-foreground'>
                  <Icon aria-hidden='true' className='size-[19px]' />
                </div>
                <h3 className='mt-[22px] text-2xl font-bold leading-7 text-ink-soft'>
                  {card.title}
                </h3>
                <p className='mt-2 max-w-[320px] text-base leading-[23px] text-muted-foreground'>
                  {card.description}
                </p>
                <SiteButtonLink
                  to={card.to}
                  variant='secondary'
                  size='sm'
                  className='mt-auto self-start rounded-full px-4 text-sm font-medium'
                >
                  {card.action}
                  <ArrowRight aria-hidden='true' className='size-3.5' />
                </SiteButtonLink>
              </article>
            );
          })}
        </div>
        <div className='mt-[82px]'>
          <ScrollButton target='impact' />
        </div>
      </Container>
    </section>
  );
}

/** Dark band with the rescue, adoption and volunteer numbers. */
export function ImpactSection() {
  return (
    <section id='impact' className='border-t border-border bg-foreground text-primary-foreground'>
      <Container className='py-[72px] md:py-[90px]'>
        <div className='flex flex-col justify-between gap-9 md:flex-row md:items-end'>
          <div>
            <p className='text-[13px] font-semibold uppercase tracking-[0.12em] text-plum-light'>
              Together, it adds up
            </p>
            <h2 className='mt-3 max-w-[620px] text-[42px] font-bold leading-[1.08] tracking-[-0.04em] md:text-[58px]'>
              Small acts make a big difference.
            </h2>
          </div>
          <p className='max-w-[330px] text-base leading-6 text-dark-muted'>
            Every adoption, donation and shared story helps build a kinder city for animals without
            a home.
          </p>
        </div>
        <dl className='mt-[58px] grid gap-7 border-t border-dark-line pt-[30px] sm:grid-cols-3'>
          {impactStats.map((stat) => (
            <div key={stat.label}>
              <dt className='text-sm uppercase tracking-[0.08em] text-dark-muted'>{stat.label}</dt>
              <dd className='mt-[5px] text-[46px] font-bold tracking-[-0.04em] md:text-[58px]'>
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}

/** A featured rescue story (Biscuit) with a photo. */
export function StorySection() {
  return (
    <section id='story' className='border-t border-border'>
      <Container className='grid items-center gap-12 py-[90px] md:py-[120px] lg:grid-cols-[0.9fr_1.1fr]'>
        <div className='overflow-hidden rounded-2xl bg-accent'>
          <img
            src='/rescue-story.jpg'
            alt='A volunteer spending time with a rescued dog'
            className='aspect-[4/3] w-full object-cover'
            loading='lazy'
            width={1200}
            height={900}
          />
        </div>
        <div>
          <p className='text-[13px] font-semibold uppercase tracking-[0.12em] text-muted-foreground'>
            Rescue story · Biscuit
          </p>
          <h2 className='mt-3 text-[42px] font-bold leading-[1.08] tracking-[-0.04em] text-foreground md:text-[58px]'>
            A little patience. A lot of love.
          </h2>
          <p className='mt-[22px] text-lg leading-[29px] text-muted-foreground'>
            Biscuit arrived scared and unsure. With a warm bed, a patient foster family and a whole
            lot of snacks, he found his confidence again. Today, he greets every visitor like an old
            friend.
          </p>
          <ul className='mt-7 space-y-3 text-[15px] font-medium text-ink-soft'>
            <li className='flex items-center gap-2.5'>
              <Check className='size-[17px] text-plum' /> Rescued from the streets
            </li>
            <li className='flex items-center gap-2.5'>
              <Check className='size-[17px] text-plum' /> Matched with a loving family
            </li>
          </ul>
          <SiteButtonLink to='/stories' variant='secondary' className='mt-[30px]'>
            Read more stories <ArrowRight className='size-4' />
          </SiteButtonLink>
        </div>
      </Container>
    </section>
  );
}

/** About StrayAssist, the "Our promise" quote, and a card for each shelter. */
export function AboutSection() {
  return (
    <section id='about' aria-labelledby='about-heading' className='border-t border-border'>
      <Container className='py-[90px] md:py-[110px]'>
        <div className='grid items-start gap-14 lg:grid-cols-[1.15fr_0.85fr]'>
          <div>
            <p className='text-[13px] font-semibold uppercase tracking-[0.12em] text-muted-foreground'>
              About us
            </p>
            <h2
              id='about-heading'
              className='mt-3 text-[52px] font-bold leading-[1.05] tracking-[-0.045em] text-foreground md:text-[72px]'
            >
              StrayAssist Project
            </h2>
            <div className='mt-6 max-w-[735px] space-y-6 text-lg leading-7 text-muted-foreground'>
              <p>
                We connect caring people with animals who need a safe place to land. Our
                volunteer-led network rescues, rehabilitates and rehomes stray animals in our
                neighborhoods.
              </p>
              <p>
                Because every animal deserves more than survival. They deserve a warm bed, a full
                bowl and someone who chooses them.
              </p>
            </div>
            <SiteButtonLink to='/stories' className='mt-[30px]'>
              Learn about our work <ArrowRight className='size-4' />
            </SiteButtonLink>
          </div>
          <div className='rounded-2xl border border-border bg-secondary p-7'>
            <p className='text-[15px] font-semibold uppercase tracking-[0.08em] text-muted-foreground'>
              Our promise
            </p>
            <p className='mt-[18px] text-[26px] font-semibold leading-[34px] tracking-[-0.02em] text-foreground'>
              “No animal left behind.”
            </p>
            <div className='mt-7 flex items-center gap-2.5 text-sm text-muted-foreground'>
              <MapPin className='size-[17px]' /> Serving our local community, one rescue at a time.
            </div>
          </div>
        </div>
        <h2 className='mt-[90px] text-center text-5xl font-bold leading-[1.05] tracking-[-0.04em] text-foreground md:text-[50px]'>
          Our Shelters
        </h2>
        <div className='mx-auto mt-9 grid max-w-[1058px] gap-5 md:grid-cols-2'>
          {shelters.map((shelter) => (
            <article
              key={shelter.slug}
              className='min-h-[250px] rounded-xl border border-line-strong p-[30px] transition-colors hover:bg-surface-soft'
            >
              <div className='flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.08em] text-muted-foreground'>
                <MapPin className='size-[15px]' /> {shelter.location}
              </div>
              <h3 className='mt-[18px] text-2xl font-bold text-ink-soft'>{shelter.name}</h3>
              <p className='mt-2.5 max-w-[450px] text-base leading-[23px] text-muted-foreground'>
                {shelter.description}
              </p>
              <SmartLink
                to={`/shelters/${shelter.slug}`}
                className='mt-[22px] inline-flex items-center gap-[7px] text-sm font-semibold text-foreground hover:underline'
              >
                Visit shelter <ArrowRight className='size-3.5' />
              </SmartLink>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
