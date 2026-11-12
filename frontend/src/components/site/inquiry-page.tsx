// Full-screen, step-by-step inquiry form used for both adoption applications and rescue reports.
// Everything is checked in the browser. There is no backend yet, so nothing is sent or saved.

import { useRef, useState, type FormEvent, type ReactNode } from 'react';
import { Link } from '@tanstack/react-router';
import { ArrowLeft, ArrowRight, Heart, PawPrint, ShieldCheck } from 'lucide-react';
import type { ZodTypeAny } from 'zod';
import { SiteButton } from './site-button';
import { Container } from './container';
import { SmartLink } from './smart-link';
import {
  ChoiceGroup,
  clearErrorOnChange,
  ConsentCheckbox,
  LocationPicker,
  PhotoDrop,
  SelectField,
  SuccessCard,
  TextAreaField,
  TextField,
} from './form-fields';
import {
  adoptionAboutSchema,
  adoptionHomeSchema,
  adoptionVerifySchema,
  animalTypeOptions,
  checkPhotos,
  companionOptions,
  conditionOptions,
  formDataToObject,
  homeTypeOptions,
  livingAreaOptions,
  ownershipOptions,
  photoRules,
  rescueAnimalSchema,
  rescueContactSchema,
  rescueLocationSchema,
  stillThereOptions,
  urgencyOptions,
  zodFieldErrors,
  type FieldErrors,
} from '@/lib/inquiry-schemas';
import type { Rescue } from '@/data/rescues';

/** Which form to show. */
export type InquiryKind = 'adoption' | 'rescue';

// The photo upload fields used across both forms.
type PhotoKey = keyof typeof photoRules;

/** One step of the form: its title, the rules for its fields, and which fields/photos it owns. */
type Step = {
  title: string;
  schema: ZodTypeAny;
  fields: string[];
  photos: PhotoKey[];
};

// Adoption: about you -> your home -> verification (ID, home photos, reference, agreements).
const adoptionSteps: Step[] = [
  {
    title: 'About you',
    schema: adoptionAboutSchema,
    fields: ['firstName', 'lastName', 'email', 'phone', 'birthDate', 'address', 'city'],
    photos: [],
  },
  {
    title: 'Your home',
    schema: adoptionHomeSchema,
    fields: [
      'companion',
      'homeType',
      'ownership',
      'landlordAllowsPets',
      'adults',
      'children',
      'otherPets',
      'livingArea',
      'hoursAlone',
      'experience',
      'reason',
    ],
    photos: [],
  },
  {
    title: 'Verification',
    schema: adoptionVerifySchema,
    fields: [
      'referenceName',
      'referencePhone',
      'vetReference',
      'homeVisitConsent',
      'returnPolicyConsent',
      'contactConsent',
    ],
    photos: ['idPhoto', 'homePhotos'],
  },
];

// Rescue report: the animal -> where it is -> how to contact you.
const rescueSteps: Step[] = [
  {
    title: 'The animal',
    schema: rescueAnimalSchema,
    fields: ['animalType', 'animalCount', 'conditions', 'urgency', 'details'],
    photos: ['animalPhotos'],
  },
  {
    title: 'Location',
    schema: rescueLocationSchema,
    fields: ['locationText', 'latitude', 'longitude', 'stillThere'],
    photos: [],
  },
  {
    title: 'Your contact',
    schema: rescueContactSchema,
    fields: ['firstName', 'lastName', 'email', 'phone', 'contactConsent'],
    photos: [],
  },
];

/** The inquiry page: a photo side panel (desktop only) and the multi-step form. */
export function InquiryPage({ kind, animal }: { kind: InquiryKind; animal?: Rescue | undefined }) {
  const adoption = kind === 'adoption';
  const steps = adoption ? adoptionSteps : rescueSteps;
  // The form element, read when checking each step.
  const formRef = useRef<HTMLFormElement>(null);
  // Which step is showing (0 = first).
  const [step, setStep] = useState(0);
  // Error message per field, shown under that field.
  const [errors, setErrors] = useState<FieldErrors>({});
  // True once the form is complete, to show the thank-you message.
  const [submitted, setSubmitted] = useState(false);
  // Own/rent answer, so the landlord question only shows for renters.
  const [ownership, setOwnership] = useState('');
  // Photos picked for each upload field (kept in the browser only).
  const [photos, setPhotos] = useState<Record<PhotoKey, File[]>>({
    idPhoto: [],
    homePhotos: [],
    animalPhotos: [],
  });

  // Saves the photos for one field and clears that field's error.
  const setPhotoList = (key: PhotoKey) => (files: File[]) => {
    setPhotos((p) => ({ ...p, [key]: files }));
    setErrors((e) => ({ ...e, [key]: '' }));
  };

  // Checks the fields and photos of one step. Returns true when everything is valid.
  const validateStep = (index: number) => {
    const current = steps[index]!;
    const fd = new FormData(formRef.current!);
    const parsed = current.schema.safeParse(formDataToObject(fd, ['conditions']));
    const stepErrors: FieldErrors = parsed.success ? {} : zodFieldErrors(parsed.error);
    for (const key of current.photos) {
      const msg = checkPhotos(photos[key], photoRules[key]);
      if (msg) stepErrors[key] = msg;
    }
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  // Smoothly scroll back to the top (used when changing steps).
  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  // Move to the next step only if the current one is valid.
  const goNext = () => {
    if (!validateStep(step)) return;
    setStep((s) => s + 1);
    scrollTop();
  };

  // Pressing Enter on an early step acts like "Continue"; on the last step it finishes the form.
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (step < steps.length - 1) return goNext();
    if (!validateStep(step)) return;

    // No backend yet: once every step is valid we just show the thank-you message.
    // Nothing is sent or saved anywhere.
    setSubmitted(true);
    scrollTop();
  };

  // Where the "Back" link goes: the animal's page, the Adopt page, or the Rescues page.
  const backTo = adoption ? (animal ? undefined : '/adopt') : '/rescues';

  return (
    <main className='min-h-screen bg-surface-warm'>
      <div className='grid min-h-screen lg:grid-cols-[0.85fr_1.15fr]'>
        {/* Left photo panel with a short message (large screens only). */}
        <aside className='relative hidden overflow-hidden lg:block'>
          <img
            src='/' // background image
            alt='Rescue animals resting together'
            className='absolute inset-0 size-full object-cover'
            width={1024}
            height={1536}
          />
          <div className='absolute inset-0 bg-foreground/55' />
          <div className='sticky top-0 flex min-h-screen flex-col justify-between p-12 text-primary-foreground xl:p-[68px]'>
            <BackLink
              to={backTo}
              animal={animal}
              className='text-[15px] text-primary-foreground/90 hover:text-primary-foreground'
            />
            <div className='max-w-[460px]'>
              <p className='text-[13px] font-semibold uppercase tracking-[0.14em] text-primary-foreground/70'>
                StrayAssist
              </p>
              <h1 className='mt-4 text-[52px] font-bold leading-[1.03] tracking-[-0.045em]'>
                {adoption ? 'Let’s find a place for love to land.' : 'You noticed. That matters.'}
              </h1>
              <p className='mt-[22px] text-[17px] leading-[27px] text-primary-foreground/80'>
                {adoption
                  ? 'Every adopter is screened — ID, references and a home visit — so our animals only go to safe, loving homes.'
                  : 'Photos and an exact location help our rescue team find the animal quickly and come prepared.'}
              </p>
            </div>
            <p className='text-[13px] text-primary-foreground/65'>
              Your information and photos are kept private and only seen by our team.
            </p>
          </div>
        </aside>

        {/* Right side: the form itself. */}
        <section className='flex items-start justify-center px-5 py-7 sm:px-9 sm:py-12 lg:py-16'>
          <Container className='max-w-[650px] px-0'>
            <div className='mb-7 flex items-center justify-between lg:hidden'>
              <BackLink to={backTo} animal={animal} className='text-sm text-muted-foreground' />
              <span className='text-sm font-bold text-ink-soft'>StrayAssist</span>
            </div>

            <div className='flex items-center gap-2.5 text-[13px] font-semibold uppercase tracking-[0.1em] text-plum'>
              {adoption ? (
                <Heart className='size-[17px]' />
              ) : (
                <ShieldCheck className='size-[17px]' />
              )}
              {adoption ? 'Adoption inquiry' : 'Rescue inquiry'}
            </div>
            <h2 className='mt-3 text-[38px] font-bold leading-[1.08] tracking-[-0.04em] text-foreground'>
              {submitted ? 'Thank you.' : adoption ? 'Tell us about you.' : 'Tell us what you saw.'}
            </h2>

            {/* Reminds the visitor which animal they are applying for. */}
            {animal && adoption && !submitted && (
              <div className='mt-4 inline-flex items-center gap-2 rounded-full bg-accent px-3.5 py-2 text-sm font-semibold text-plum'>
                <PawPrint className='size-4' /> Applying to adopt {animal.name}
              </div>
            )}

            {/* Thank-you message after finishing, otherwise the progress bar and form. */}
            {submitted ? (
              <div className='mt-8 space-y-5'>
                <SuccessCard title={adoption ? 'Your application is in.' : 'Your report is in.'}>
                  {adoption ? (
                    <p>
                      Our team will review your details, check your references and contact you to
                      arrange a home visit. Adoption is only confirmed after that visit.
                    </p>
                  ) : (
                    <p>
                      Our rescue team will review your report and contact you if they need more
                      details. If the animal is in immediate danger, please also call your local
                      barangay or city veterinary office.
                    </p>
                  )}
                </SuccessCard>
                <SmartLink
                  to={adoption ? '/rescues' : '/'}
                  className='inline-flex items-center gap-2 text-sm font-semibold text-foreground hover:underline'
                >
                  {adoption ? 'Back to the rescues' : 'Back to home'}{' '}
                  <ArrowRight className='size-4' />
                </SmartLink>
              </div>
            ) : (
              <>
                <p className='mt-3 text-base leading-[25px] text-muted-foreground'>
                  Step {step + 1} of {steps.length} · {steps[step]!.title}
                </p>
                {/* Progress bar: one segment per step. */}
                <ol className='mt-[18px] flex items-center gap-2' aria-label='Form progress'>
                  {steps.map((s, i) => (
                    <li key={s.title} className='flex-1'>
                      <span
                        className={`block h-1 rounded-full ${i <= step ? 'bg-plum' : 'bg-line-input'}`}
                      />
                      <span
                        className={`mt-2 hidden text-xs font-semibold sm:block ${i === step ? 'text-foreground' : 'text-muted-foreground'}`}
                      >
                        {s.title}
                      </span>
                    </li>
                  ))}
                </ol>

                {/* All steps stay in the page (hidden when inactive) so typed answers are kept when going back. */}
                <form
                  ref={formRef}
                  onSubmit={handleSubmit}
                  noValidate
                  onChange={clearErrorOnChange(setErrors)}
                  className='relative mt-[30px] space-y-[18px]'
                >
                  {animal && <input type='hidden' name='animalSlug' value={animal.slug} />}

                  {adoption ? (
                    <>
                      {/* Adoption step 1: about you (must be 18+). */}
                      <StepPanel active={step === 0}>
                        <div className='grid gap-[18px] sm:grid-cols-2'>
                          <TextField
                            name='firstName'
                            label='First name'
                            errors={errors}
                            autoComplete='given-name'
                            maxLength={80}
                          />
                          <TextField
                            name='lastName'
                            label='Last name'
                            errors={errors}
                            autoComplete='family-name'
                            maxLength={80}
                          />
                        </div>
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
                            placeholder='09XX XXX XXXX'
                            maxLength={20}
                          />
                        </div>
                        <TextField
                          name='birthDate'
                          type='date'
                          label='Date of birth'
                          hint='Adopters must be at least 18 years old.'
                          errors={errors}
                        />
                        <TextField
                          name='address'
                          label='Home address'
                          hint='Where the animal will live. We visit before every adoption.'
                          errors={errors}
                          autoComplete='street-address'
                          maxLength={300}
                        />
                        <TextField
                          name='city'
                          label='City or town'
                          errors={errors}
                          autoComplete='address-level2'
                          maxLength={100}
                        />
                      </StepPanel>

                      {/* Adoption step 2: your home and experience. */}
                      <StepPanel active={step === 1}>
                        <SelectField
                          name='companion'
                          label='What kind of companion are you looking for?'
                          options={companionOptions}
                          errors={errors}
                          defaultValue={animal?.type ?? ''}
                        />
                        <div className='grid gap-[18px] sm:grid-cols-2'>
                          <SelectField
                            name='homeType'
                            label='Type of home'
                            options={homeTypeOptions}
                            errors={errors}
                            defaultValue=''
                          />
                          <SelectField
                            name='livingArea'
                            label='Where will the animal stay?'
                            options={livingAreaOptions}
                            errors={errors}
                            defaultValue=''
                          />
                        </div>
                        <ChoiceGroup
                          name='ownership'
                          label='Do you own or rent your home?'
                          options={ownershipOptions}
                          errors={errors}
                          value={ownership}
                          onChange={setOwnership}
                        />
                        {ownership === 'I rent' && (
                          <ChoiceGroup
                            name='landlordAllowsPets'
                            label='Does your landlord allow pets?'
                            options={['Yes', 'No']}
                            errors={errors}
                          />
                        )}
                        <div className='grid gap-[18px] sm:grid-cols-3'>
                          <TextField
                            name='adults'
                            type='number'
                            min={1}
                            max={20}
                            label='Adults at home'
                            errors={errors}
                          />
                          <TextField
                            name='children'
                            type='number'
                            min={0}
                            max={20}
                            label='Children at home'
                            errors={errors}
                          />
                          <TextField
                            name='hoursAlone'
                            type='number'
                            min={0}
                            max={24}
                            label='Hours alone per day'
                            errors={errors}
                          />
                        </div>
                        <TextAreaField
                          name='otherPets'
                          label='Other pets at home (optional)'
                          rows={2}
                          errors={errors}
                          placeholder="Type, age, and whether they're vaccinated and spayed/neutered"
                          maxLength={500}
                        />
                        <TextAreaField
                          name='experience'
                          label='Your experience with animals'
                          errors={errors}
                          placeholder='Have you cared for a dog or cat before? What happened to them?'
                          maxLength={2000}
                        />
                        <TextAreaField
                          name='reason'
                          label='Why do you want to adopt?'
                          errors={errors}
                          placeholder='Tell us about your routine and what you hope for.'
                          maxLength={2000}
                        />
                      </StepPanel>

                      {/* Adoption step 3: verification — ID photo, home photos, reference and agreements. */}
                      <StepPanel active={step === 2}>
                        <PhotoDrop
                          name='idPhoto'
                          label='Photo of a valid government ID'
                          hint="Driver's license, passport, UMID, PhilSys or similar. Used only to confirm who you are."
                          files={photos.idPhoto}
                          onChange={setPhotoList('idPhoto')}
                          max={1}
                          errors={errors}
                        />
                        <PhotoDrop
                          name='homePhotos'
                          label='Photos of your home'
                          hint='Where the animal will sleep, eat and play — and your gate or fence if you have one.'
                          files={photos.homePhotos}
                          onChange={setPhotoList('homePhotos')}
                          max={4}
                          errors={errors}
                        />
                        <div className='grid gap-[18px] sm:grid-cols-2'>
                          <TextField
                            name='referenceName'
                            label='Personal reference (not family)'
                            errors={errors}
                            maxLength={120}
                          />
                          <TextField
                            name='referencePhone'
                            type='tel'
                            label="Reference's phone number"
                            errors={errors}
                            maxLength={20}
                          />
                        </div>
                        <TextField
                          name='vetReference'
                          label='Your veterinarian (optional)'
                          hint="Clinic name and phone, if you've had pets before."
                          errors={errors}
                          maxLength={300}
                        />
                        <div className='space-y-3 rounded-[12px] border border-line-strong bg-card/70 p-4'>
                          <ConsentCheckbox name='homeVisitConsent' errors={errors}>
                            I agree to a home visit by a StrayAssist volunteer before the adoption
                            is approved.
                          </ConsentCheckbox>
                          <ConsentCheckbox name='returnPolicyConsent' errors={errors}>
                            If I can no longer care for the animal, I will return them to
                            StrayAssist and never sell, abandon or give them away.
                          </ConsentCheckbox>
                          <ConsentCheckbox name='contactConsent' errors={errors}>
                            I agree that StrayAssist may contact me and my reference about this
                            application.
                          </ConsentCheckbox>
                        </div>
                      </StepPanel>
                    </>
                  ) : (
                    <>
                      {/* Rescue step 1: photos and details of the animal. */}
                      <StepPanel active={step === 0}>
                        <PhotoDrop
                          name='animalPhotos'
                          label='Photos of the animal (recommended)'
                          hint='Clear photos help us judge how urgent it is and recognise the animal.'
                          files={photos.animalPhotos}
                          onChange={setPhotoList('animalPhotos')}
                          max={5}
                          errors={errors}
                          capture
                        />
                        <div className='grid gap-[18px] sm:grid-cols-2'>
                          <SelectField
                            name='animalType'
                            label='What kind of animal?'
                            options={animalTypeOptions}
                            errors={errors}
                            defaultValue=''
                          />
                          <TextField
                            name='animalCount'
                            type='number'
                            min={1}
                            max={50}
                            defaultValue={1}
                            label='How many?'
                            errors={errors}
                          />
                        </div>
                        <ChoiceGroup
                          name='conditions'
                          label='What condition is it in? (pick all that apply)'
                          options={conditionOptions}
                          multiple
                          errors={errors}
                        />
                        <ChoiceGroup
                          name='urgency'
                          label='How urgent is it?'
                          options={urgencyOptions}
                          errors={errors}
                        />
                        <TextAreaField
                          name='details'
                          label='What happened?'
                          errors={errors}
                          placeholder='Describe the animal (color, size, collar) and anything else you noticed.'
                          maxLength={2000}
                        />
                      </StepPanel>

                      {/* Rescue step 2: location (typed or from the device) and whether it's still there. */}
                      <StepPanel active={step === 1}>
                        <LocationPicker errors={errors} />
                        <ChoiceGroup
                          name='stillThere'
                          label='Is the animal still there?'
                          options={stillThereOptions}
                          errors={errors}
                        />
                      </StepPanel>

                      {/* Rescue step 3: the reporter's contact details. */}
                      <StepPanel active={step === 2}>
                        <div className='grid gap-[18px] sm:grid-cols-2'>
                          <TextField
                            name='firstName'
                            label='First name'
                            errors={errors}
                            autoComplete='given-name'
                            maxLength={80}
                          />
                          <TextField
                            name='lastName'
                            label='Last name'
                            errors={errors}
                            autoComplete='family-name'
                            maxLength={80}
                          />
                        </div>
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
                            hint='So the rescue team can call you on the way.'
                            errors={errors}
                            autoComplete='tel'
                            placeholder='09XX XXX XXXX'
                            maxLength={20}
                          />
                        </div>
                        <ConsentCheckbox name='contactConsent' errors={errors}>
                          I agree that StrayAssist may contact me about this report.
                        </ConsentCheckbox>
                      </StepPanel>
                    </>
                  )}

                  {/* Back / Continue / Send buttons. */}
                  <div className='flex flex-wrap items-center gap-3 pt-2'>
                    {step > 0 && (
                      <SiteButton
                        type='button'
                        variant='secondary'
                        size='lg'
                        onClick={() => {
                          setErrors({});
                          setStep((s) => s - 1);
                          scrollTop();
                        }}
                      >
                        <ArrowLeft className='size-[17px]' /> Back
                      </SiteButton>
                    )}
                    {step < steps.length - 1 ? (
                      <SiteButton type='button' size='lg' onClick={goNext}>
                        Continue <ArrowRight className='size-[17px]' />
                      </SiteButton>
                    ) : (
                      <SiteButton type='submit' size='lg'>
                        {adoption ? 'Send application' : 'Send report'}{' '}
                        <ArrowRight className='size-[17px]' />
                      </SiteButton>
                    )}
                  </div>
                </form>
              </>
            )}
          </Container>
        </section>
      </div>
    </main>
  );
}

/** Shows its fields only when it is the current step. */
function StepPanel({ active, children }: { active: boolean; children: ReactNode }) {
  return (
    <div hidden={!active} className='space-y-[18px]'>
      {children}
    </div>
  );
}

/** "Back" link at the top of the form. */
function BackLink({
  to,
  animal,
  className,
}: {
  to?: string | undefined;
  animal?: Rescue | undefined;
  className?: string;
}) {
  const classes = `inline-flex items-center gap-2 font-semibold ${className ?? ''}`;
  if (animal) {
    return (
      <Link to='/rescues/$slug' params={{ slug: animal.slug }} className={classes}>
        <ArrowLeft className='size-4' /> Back to {animal.name}
      </Link>
    );
  }
  return (
    <SmartLink to={to ?? '/'} className={classes}>
      <ArrowLeft className='size-4' /> Back
    </SmartLink>
  );
}
