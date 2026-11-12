import { useRef, useState, type FormEvent } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { ArrowRight, Check, Heart, Package } from 'lucide-react';
import { Container } from '@/components/site/container';
import { SiteLayout } from '@/components/site/site-layout';
import { SiteButton } from '@/components/site/site-button';
import { SmartLink } from '@/components/site/smart-link';
import { PageHeader, pageHead } from '@/components/site/page-header';
import {
  ChoiceGroup,
  clearErrorOnChange,
  SuccessCard,
  TextAreaField,
  TextField,
} from '@/components/site/form-fields';
import {
  donationSchema,
  formDataToObject,
  frequencyOptions,
  pledgeTypeOptions,
  zodFieldErrors,
  type FieldErrors,
} from '@/lib/inquiry-schemas';

// /donate — pledge money or supplies. No payment is taken; the team follows up with the donor.
export const Route = createFileRoute('/donate')({
  head: () =>
    pageHead(
      'Donate to StrayAssist',
      'Pledge money or supplies to help StrayAssist rescue, treat and rehome stray animals.',
    ),
  component: DonatePage,
});

// Quick-pick amounts in pesos.
const presetAmounts = ['250', '500', '1000', '2500'];

// Supplies listed in the "Our wishlist" box.
const wishlist = [
  'Dry and wet dog and cat food',
  'Clean old towels and blankets',
  'Leashes, collars and harnesses',
  'Cat litter and litter boxes',
  'Food and water bowls',
  'Pet carriers and crates',
];

/** The donate page: pledge form on the left, wishlist on the right. */
function DonatePage() {
  const formRef = useRef<HTMLFormElement>(null);
  // Form choices that change which fields are shown.
  const [pledgeType, setPledgeType] = useState<string>('Money');
  const [frequency, setFrequency] = useState<string>('One-time');
  const [amount, setAmount] = useState('500');
  // Error message per field, and whether the thank-you message should show.
  const [errors, setErrors] = useState<FieldErrors>({});
  const [done, setDone] = useState(false);

  // Check the form in the browser; show errors next to fields, or the thank-you message.
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(formRef.current!);
    const parsed = donationSchema.safeParse(formDataToObject(fd));
    if (!parsed.success) {
      setErrors(zodFieldErrors(parsed.error));
      return;
    }
    // No backend yet: a valid pledge just shows the thank-you message. Nothing is saved.
    setErrors({});
    setDone(true);
  };

  return (
    <SiteLayout>
      <PageHeader eyebrow='Donate' title='Your gift turns a rescue into a second chance.'>
        Food, vet care and a safe place to sleep all start with people like you. Pledge a gift and
        our team will reach out with how to send it.
      </PageHeader>

      <Container className='grid gap-12 py-16 md:py-20 lg:grid-cols-[1.1fr_0.9fr]'>
        <section>
          <h2 className='text-[34px] font-bold tracking-[-0.04em] text-foreground'>
            Make a pledge
          </h2>
          {/* After a valid pledge the form is replaced by a thank-you card. */}
          {done ? (
            <div className='mt-6'>
              <SuccessCard title='Thank you for your generosity!'>
                <p>
                  We've received your pledge. Our team will contact you by email with how to send
                  your gift.
                </p>
              </SuccessCard>
            </div>
          ) : (
            <form
              ref={formRef}
              onSubmit={onSubmit}
              noValidate
              onChange={clearErrorOnChange(setErrors)}
              className='relative mt-6 space-y-[18px]'
            >
              <ChoiceGroup
                name='pledgeType'
                label='How would you like to give?'
                options={pledgeTypeOptions}
                errors={errors}
                value={pledgeType}
                onChange={setPledgeType}
              />

              {/* Money: how often + amount. Supplies: what they want to give. */}
              {pledgeType === 'Money' ? (
                <>
                  <ChoiceGroup
                    name='frequency'
                    label='How often?'
                    options={frequencyOptions}
                    errors={errors}
                    value={frequency}
                    onChange={setFrequency}
                  />
                  <div>
                    <p className='text-sm font-semibold text-ink-soft'>Amount (₱)</p>
                    <div className='mt-2 flex flex-wrap gap-2'>
                      {presetAmounts.map((a) => (
                        <button
                          key={a}
                          type='button'
                          onClick={() => setAmount(a)}
                          aria-pressed={amount === a}
                          className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                            amount === a
                              ? 'border-foreground bg-foreground text-primary-foreground'
                              : 'border-line-input bg-card text-muted-foreground hover:border-foreground/40'
                          }`}
                        >
                          ₱{Number(a).toLocaleString()}
                        </button>
                      ))}
                    </div>
                    <TextField
                      name='amount'
                      type='number'
                      min={1}
                      label='Or enter your own amount'
                      errors={errors}
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className='mt-3'
                    />
                  </div>
                </>
              ) : (
                <TextAreaField
                  name='items'
                  label='What would you like to give?'
                  rows={3}
                  errors={errors}
                  placeholder='e.g. 2 sacks of dog food, old towels'
                  maxLength={1000}
                />
              )}

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
                  label='Mobile number (optional)'
                  errors={errors}
                  autoComplete='tel'
                  maxLength={20}
                />
              </div>
              <TextAreaField
                name='message'
                label='Message (optional)'
                rows={2}
                errors={errors}
                maxLength={1000}
              />
              <SiteButton type='submit' size='lg'>
                <Heart className='size-[17px]' />
                Send my pledge
              </SiteButton>
              <p className='text-[13px] text-muted-foreground'>
                No payment is taken on this page — we'll contact you to complete your gift.
              </p>
            </form>
          )}
        </section>

        {/* Wishlist and a "share a rescue" prompt. */}
        <aside className='space-y-5'>
          <div className='rounded-2xl bg-foreground p-8 text-primary-foreground'>
            <Package className='size-7 text-plum-light' />
            <h2 className='mt-5 text-2xl font-bold'>Our wishlist</h2>
            <p className='mt-2 text-sm text-dark-muted'>
              Supplies we always need at both shelters:
            </p>
            <ul className='mt-5 space-y-2.5'>
              {wishlist.map((w) => (
                <li key={w} className='flex items-start gap-2.5 text-[15px]'>
                  <Check className='mt-0.5 size-4 shrink-0 text-plum-light' /> {w}
                </li>
              ))}
            </ul>
          </div>
          <div className='rounded-2xl border border-border bg-secondary p-7'>
            <p className='text-sm font-semibold text-ink-soft'>Can't give right now?</p>
            <p className='mt-1.5 text-sm text-muted-foreground'>
              Sharing our animals with friends helps just as much.
            </p>
            <SmartLink
              to='/rescues'
              className='mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-foreground hover:underline'
            >
              Share a rescue <ArrowRight className='size-4' />
            </SmartLink>
          </div>
        </aside>
      </Container>
    </SiteLayout>
  );
}
