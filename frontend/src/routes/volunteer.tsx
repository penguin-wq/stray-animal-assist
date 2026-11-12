import { useRef, useState, type SubmitEvent } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { ArrowRight, Camera, Car, HandHeart, Home, PawPrint } from 'lucide-react';
import { Container } from '@/components/site/container';
import { SiteLayout } from '@/components/site/site-layout';
import { SiteButton } from '@/components/site/site-button';
import { PageHeader, pageHead } from '@/components/site/page-header';
import {
  ChoiceGroup,
  clearErrorOnChange,
  ConsentCheckbox,
  SelectField,
  SuccessCard,
  TextAreaField,
  TextField,
} from '@/components/site/form-fields';
import {
  availabilityOptions,
  formDataToObject,
  interestOptions,
  volunteerSchema,
  zodFieldErrors,
  type FieldErrors,
} from '@/lib/inquiry-schemas';

// /volunteer — volunteer roles and the sign-up form.
export const Route = createFileRoute('/volunteer')({
  head: () =>
    pageHead(
      'Volunteer with StrayAssist',
      'Foster, care for shelter animals, drive rescues or help at events. Sign up to volunteer with StrayAssist.',
    ),
  component: VolunteerPage,
});

// The ways people can help, shown as cards above the form.
const roles = [
  {
    icon: Home,
    title: 'Fostering',
    text: 'Open your home for a few weeks while an animal heals or waits for adoption.',
  },
  {
    icon: PawPrint,
    title: 'Shelter care',
    text: 'Feed, clean, walk and keep our residents company at the shelter.',
  },
  {
    icon: Car,
    title: 'Rescue transport',
    text: 'Drive animals to the vet, the shelter or their new families.',
  },
  {
    icon: HandHeart,
    title: 'Events',
    text: 'Help at adoption days, drives and fundraisers in the community.',
  },
  {
    icon: Camera,
    title: 'Photos & social media',
    text: 'Great photos and stories help our animals get noticed.',
  },
];

function VolunteerPage() {
  const formRef = useRef<HTMLFormElement>(null);
  // Error message per field, and whether the thank-you message should show.
  const [errors, setErrors] = useState<FieldErrors>({});
  const [done, setDone] = useState(false);

  // Check the form in the browser; show errors next to fields, or the thank-you message.
  const onSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(formRef.current!);
    const parsed = volunteerSchema.safeParse(formDataToObject(fd, ['interests']));
    if (!parsed.success) {
      setErrors(zodFieldErrors(parsed.error));
      return;
    }
    setErrors({});
    setDone(true);
  };

  return (
    <SiteLayout>
      <PageHeader eyebrow='Volunteer' title="There's a place for you here.">
        Foster for a weekend, lend a hand at an event, or help spread the word. Your time can change
        a life.
      </PageHeader>

      {/* Role cards. */}
      <section className='bg-surface-soft'>
        <Container className='grid gap-4 py-16 sm:grid-cols-2 lg:grid-cols-5'>
          {roles.map(({ icon: Icon, title, text }) => (
            <article key={title} className='rounded-xl border border-line-strong bg-card p-6'>
              <div className='flex size-10 items-center justify-center rounded-full bg-accent text-plum'>
                <Icon className='size-5' />
              </div>
              <h2 className='mt-4 text-lg font-bold text-ink-soft'>{title}</h2>
              <p className='mt-1.5 text-sm leading-[21px] text-muted-foreground'>{text}</p>
            </article>
          ))}
        </Container>
      </section>

      {/* Sign-up form */}
      <section id='signup'>
        <Container className='max-w-[720px] py-16 md:py-20'>
          <h2 className='text-[38px] font-bold tracking-[-0.04em] text-foreground'>
            Sign up to volunteer
          </h2>
          <p className='mt-2 text-muted-foreground'>
            Tell us a little about yourself and we'll reach out with next steps.
          </p>
          {done ? (
            <div className='mt-8'>
              <SuccessCard title='Thank you for signing up!'>
                <p>
                  Our volunteer team will contact you soon about orientation and your first shift.
                </p>
              </SuccessCard>
            </div>
          ) : (
            <form
              ref={formRef}
              onSubmit={onSubmit}
              noValidate
              onChange={clearErrorOnChange(setErrors)}
              className='relative mt-8 space-y-[18px]'
            >
              <TextField
                name='fullName'
                label='Full name'
                errors={errors}
                autoComplete='name'
                maxLength={120}
              />
              <div className='grid gap-[18px] sm:grid-cols-2'>
                <TextField
                  name='email'
                  type='email'
                  label='Email address'
                  errors={errors}
                  autoComplete='email'
                  maxLength={255}
                />
                <TextField
                  name='phone'
                  type='tel'
                  label='Mobile number'
                  errors={errors}
                  autoComplete='tel'
                  maxLength={20}
                />
              </div>
              <div className='grid gap-[18px] sm:grid-cols-2'>
                <TextField name='city' label='City or town' errors={errors} maxLength={100} />
                <SelectField
                  name='availability'
                  label='When are you available?'
                  options={availabilityOptions}
                  errors={errors}
                  defaultValue=''
                />
              </div>
              <ChoiceGroup
                name='interests'
                label='How would you like to help? (pick all that apply)'
                options={interestOptions}
                multiple
                errors={errors}
              />
              <TextAreaField
                name='experience'
                label='Any experience with animals? (optional)'
                rows={3}
                errors={errors}
                maxLength={1000}
              />
              <ConsentCheckbox name='isAdult' errors={errors}>
                I am at least 18 years old and agree that StrayAssist may contact me.
              </ConsentCheckbox>
              <SiteButton type='submit' size='lg'>
                Sign me up <ArrowRight className='size-[17px]' />
              </SiteButton>
            </form>
          )}
        </Container>
      </section>
    </SiteLayout>
  );
}
