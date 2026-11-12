import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Check, Heart, PawPrint, ShieldCheck, Sparkles } from 'lucide-react';
import { SiteButton } from '@/components/site/site-button';
import { Container } from '@/components/site/container';
import { SiteLayout } from '@/components/site/site-layout';

// /adopt — explains how adoption works and links to the application form.
export const Route = createFileRoute('/adopt/')({
  head: () => ({
    meta: [
      { title: 'Adopt — StrayAssist' },
      {
        name: 'description',
        content:
          'Start an adoption or rescue inquiry with StrayAssist and help an animal find a safe, loving home.',
      },
      { property: 'og:title', content: 'Adopt — StrayAssist' },
      {
        property: 'og:description',
        content:
          'Start an adoption or rescue inquiry with StrayAssist and help an animal find a safe, loving home.',
      },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
  }),
  component: AdoptPage,
});

// The option cards at the top of the page and where each one leads.
const inquiryOptions = [
  {
    title: 'Adopt',
    description:
      'Tell us what kind of companion you are looking for and we will help you find a thoughtful match.',
    action: 'Adoption Inquiry',
    icon: Heart,
  },
  {
    title: 'Rescue',
    description:
      'Seen an animal who needs help? Share what you know so our team can respond with care.',
    action: 'Rescue Inquiry',
    icon: ShieldCheck,
  },
];

// The numbered "Good matches take time" steps.
const processSteps = [
  {
    number: '01',
    title: 'Tell us your story',
    text: 'Share a little about your home, your routine and what brought you to StrayAssist.',
  },
  {
    number: '02',
    title: 'Find the right fit',
    text: 'Our team looks at personality, energy and lifestyle to make thoughtful introductions.',
  },
  {
    number: '03',
    title: 'Start a new chapter',
    text: 'We stay close through the transition, with guidance for a happy first week together.',
  },
];

// Tips shown in the "Before you begin" section.
const preparationTips = [
  'Think about your daily routine and available time.',
  'Make sure everyone in your home is ready to welcome a new companion.',
  'Keep an open mind — the right match might surprise you.',
];

/** The Adopt page. */
function AdoptPage() {
  const navigate = useNavigate();

  return (
    <SiteLayout>
      <section className='border-b border-border'>
        <Container className='flex flex-col items-center py-[76px] text-center md:py-[100px]'>
          <div className='inline-flex items-center gap-2 rounded-full bg-accent px-3.5 py-[7px] text-[13px] font-semibold text-plum'>
            <Sparkles aria-hidden='true' className='size-[15px]' />
            We are here to help
          </div>

          <h1 className='mt-5 max-w-[850px] text-5xl font-bold leading-[1.06] tracking-[-0.045em] text-foreground md:text-[68px]'>
            Every good beginning starts with a conversation.
          </h1>

          <p className='mt-6 max-w-[720px] text-lg leading-7 text-muted-foreground'>
            Whether you are ready to welcome an animal home or you have found one who needs help,
            you are in the right place.
          </p>

          <div className='mt-12 grid w-full max-w-[1010px] gap-4 text-left md:grid-cols-2'>
            {inquiryOptions.map((option) => {
              const Icon = option.icon;

              return (
                <article
                  key={option.title}
                  className='group flex min-h-[290px] flex-col rounded-xl border border-line-strong bg-card p-7 transition-transform hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(17,18,20,0.07)] md:p-[34px]'
                >
                  <div className='flex size-11 items-center justify-center rounded-full bg-accent text-plum'>
                    <Icon aria-hidden='true' className='size-5' />
                  </div>

                  <h2 className='mt-[22px] text-[26px] font-bold leading-[30px] text-ink-soft'>
                    {option.title}
                  </h2>

                  <p className='mt-[9px] max-w-[430px] text-base leading-6 text-muted-foreground'>
                    {option.description}
                  </p>

                  <SiteButton
                    variant='secondary'
                    size='sm'
                    onClick={() =>
                      navigate({
                        to: option.title === 'Adopt' ? '/adopt/inquiry' : '/rescue/inquiry',
                      })
                    }
                    className='mt-auto self-start rounded-full px-4 text-sm font-medium'
                  >
                    {option.action}
                  </SiteButton>
                </article>
              );
            })}
          </div>
        </Container>
      </section>

      <section className='bg-surface-soft'>
        <Container className='py-20 md:py-[100px]'>
          <div className='flex flex-col justify-between gap-5 md:flex-row md:items-end'>
            <div>
              <p className='text-[13px] font-semibold uppercase tracking-[0.12em] text-muted-foreground'>
                A thoughtful process
              </p>
              <h2 className='mt-2.5 text-[40px] font-bold tracking-[-0.04em] text-foreground md:text-[52px]'>
                Good matches take time.
              </h2>
            </div>
            <p className='max-w-[360px] text-base leading-[25px] text-muted-foreground'>
              We believe the best outcomes happen when people and animals are given space to get to
              know one another.
            </p>
          </div>

          <div className='mt-12 grid gap-3.5 md:grid-cols-3'>
            {processSteps.map((step) => (
              <article
                key={step.number}
                className='rounded-xl border border-border bg-card p-[26px]'
              >
                <span className='text-[13px] font-semibold tracking-[0.08em] text-plum-soft'>
                  {step.number}
                </span>
                <h3 className='mt-[34px] text-xl font-semibold text-foreground'>{step.title}</h3>
                <p className='mt-2 text-[15px] leading-[23px] text-muted-foreground'>{step.text}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section>
        <Container className='grid gap-12 py-[82px] md:py-[110px] lg:grid-cols-[0.9fr_1.1fr] lg:items-center'>
          <div className='rounded-2xl bg-foreground p-[30px] text-primary-foreground md:p-[42px]'>
            <PawPrint aria-hidden='true' className='size-7 text-plum-light' />
            <p className='mt-7 text-3xl font-semibold leading-9 tracking-[-0.025em]'>
              A safe home can change an entire life.
            </p>
            <p className='mt-[18px] text-base leading-[25px] text-dark-muted'>
              The first step does not need to be perfect. It just needs to be yours.
            </p>
          </div>

          <div>
            <p className='text-[13px] font-semibold uppercase tracking-[0.12em] text-muted-foreground'>
              Before you begin
            </p>
            <h2 className='mt-3 text-[38px] font-bold leading-[1.1] tracking-[-0.04em] text-foreground md:text-5xl'>
              A little preparation goes a long way.
            </h2>

            <ul className='mt-[26px] space-y-3.5'>
              {preparationTips.map((item) => (
                <li
                  key={item}
                  className='flex items-start gap-2.5 text-base leading-6 text-muted-foreground'
                >
                  <Check aria-hidden='true' className='mt-[3px] size-[17px] shrink-0 text-plum' />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>
    </SiteLayout>
  );
}
