import { z } from 'zod';

// Validation rules for every form on the site. They run in the browser only (there is no backend yet).

// Photo limits and the minimum adopter age.
export const MAX_PHOTO_BYTES = 8 * 1024 * 1024;
export const PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];
export const MIN_ADOPTER_AGE = 18;

// Building blocks for the rules below.
// A required short text field with a maximum length.
const text = (label: string, max = 200) =>
  z
    .string({ required_error: `${label} is required` })
    .trim()
    .min(1, `${label} is required`)
    .max(max, `${label} is too long`);

// A required longer answer that needs at least a few words.
const longText = (label: string, min = 10) =>
  z
    .string({ required_error: `${label} is required` })
    .trim()
    .min(min, `Please tell us a bit more (at least ${min} characters)`)
    .max(2000, `${label} is too long`);

// An optional text field; empty answers become "not given".
const optionalText = (max = 500) =>
  z
    .string()
    .trim()
    .max(max, 'Too long')
    .optional()
    .transform((v) => (v ? v : undefined));

// A valid email address.
const email = z
  .string({ required_error: 'Email is required' })
  .trim()
  .email('Enter a valid email address')
  .max(255);
// A phone number: digits, spaces, +, - and brackets, 7 to 20 characters.
const phone = z
  .string({ required_error: 'Phone number is required' })
  .trim()
  .regex(/^[+0-9\s()-]{7,20}$/, 'Enter a valid phone number');

// One answer that must be from the given list.
const choice = <T extends string>(label: string, values: readonly [T, ...T[]]) =>
  z.enum(values, { errorMap: () => ({ message: `Choose ${label}` }) });

// A checkbox that must be ticked.
const agree = (message: string) => z.literal('on', { errorMap: () => ({ message }) });

// A whole number between min and max.
const intIn = (label: string, min: number, max: number) =>
  z.coerce
    .number({ invalid_type_error: `${label} must be a number` })
    .int(`${label} must be a whole number`)
    .min(min, `${label} must be at least ${min}`)
    .max(max, `${label} must be at most ${max}`);

/** True when someone born on `birthDate` (YYYY-MM-DD) is at least `minAge` on `today`. */
export function isAtLeastAge(birthDate: string, minAge: number, today = new Date()) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(birthDate);
  if (!match) return false;
  const [y, m, d] = [Number(match[1]), Number(match[2]), Number(match[3])];
  let age = today.getFullYear() - y;
  const beforeBirthday =
    today.getMonth() + 1 < m || (today.getMonth() + 1 === m && today.getDate() < d);
  if (beforeBirthday) age -= 1;
  return age >= minAge && age < 120;
}

/* ---------------- Adoption ---------------- */

export const companionOptions = ['Dog', 'Cat', 'Not sure yet'] as const;
export const homeTypeOptions = ['House', 'Apartment or condo', 'Townhouse', 'Other'] as const;
export const ownershipOptions = ['I own it', 'I rent', 'I live with family'] as const;
export const livingAreaOptions = [
  'Indoors',
  'Indoors with yard access',
  'Mostly outdoors',
] as const;

// Adoption step 1: about the applicant (must be at least 18).
export const adoptionAboutSchema = z.object({
  firstName: text('First name', 80),
  lastName: text('Last name', 80),
  email,
  phone,
  birthDate: z
    .string({ required_error: 'Date of birth is required' })
    .refine(
      (v) => isAtLeastAge(v, MIN_ADOPTER_AGE),
      `You must be at least ${MIN_ADOPTER_AGE} to adopt`,
    ),
  address: text('Home address', 300),
  city: text('City or town', 100),
});

// Adoption step 2: the home. Renters must say whether their landlord allows pets.
export const adoptionHomeSchema = z
  .object({
    companion: choice('a companion type', companionOptions),
    homeType: choice('a home type', homeTypeOptions),
    ownership: choice('an option', ownershipOptions),
    landlordAllowsPets: z.enum(['Yes', 'No']).optional(),
    adults: intIn('Adults', 1, 20),
    children: intIn('Children', 0, 20),
    otherPets: optionalText(500),
    livingArea: choice('where the animal will live', livingAreaOptions),
    hoursAlone: intIn('Hours alone', 0, 24),
    experience: longText('Experience'),
    reason: longText('Your reason'),
  })
  .superRefine((v, ctx) => {
    if (v.ownership === 'I rent' && !v.landlordAllowsPets) {
      ctx.addIssue({
        code: 'custom',
        path: ['landlordAllowsPets'],
        message: 'Let us know if your landlord allows pets',
      });
    }
  });

// Adoption step 3: reference and the three required agreements (photos are checked separately).
export const adoptionVerifySchema = z.object({
  referenceName: text('Reference name', 120),
  referencePhone: phone,
  vetReference: optionalText(300),
  homeVisitConsent: agree('We need to be able to visit your home before adoption'),
  returnPolicyConsent: agree('Please agree to return the animal to us rather than rehome it'),
  contactConsent: agree('Please agree so we can contact you'),
});

/* ---------------- Rescue ---------------- */

export const animalTypeOptions = ['Dog', 'Cat', 'Other'] as const;
export const conditionOptions = [
  'Injured',
  'Sick or weak',
  'Pregnant or nursing',
  'Puppies or kittens',
  'Scared or aggressive',
  'Healthy but stray',
] as const;
export const urgencyOptions = [
  'Emergency — needs help now',
  'Soon — within a day or two',
  'Not urgent',
] as const;
export const stillThereOptions = ['Yes, still there', 'No, it moved', 'Not sure'] as const;

// Rescue step 1: the animal.
export const rescueAnimalSchema = z.object({
  animalType: choice('the kind of animal', animalTypeOptions),
  animalCount: intIn('Number of animals', 1, 50),
  conditions: z.array(z.enum(conditionOptions)).min(1, 'Pick at least one'),
  urgency: choice('how urgent it is', urgencyOptions),
  details: longText('Details'),
});

// Optional map coordinate within a valid range (filled by "Use my current location").
const coord = (min: number, max: number) =>
  z
    .union([z.literal(''), z.coerce.number().min(min).max(max)])
    .optional()
    .transform((v) => (v === '' || v === undefined ? undefined : v));

// Rescue step 2: where the animal is.
export const rescueLocationSchema = z.object({
  locationText: text('Location', 300),
  latitude: coord(-90, 90),
  longitude: coord(-180, 180),
  stillThere: choice('an option', stillThereOptions),
});

// Rescue step 3: the reporter's contact details.
export const rescueContactSchema = z.object({
  firstName: text('First name', 80),
  lastName: text('Last name', 80),
  email,
  phone,
  contactConsent: agree('Please agree so we can contact you'),
});

/* ---------------- Volunteer & donate ---------------- */

export const interestOptions = [
  'Fostering',
  'Shelter care',
  'Rescue transport',
  'Events and fundraising',
  'Photos and social media',
] as const;
export const availabilityOptions = ['Weekdays', 'Weekends', 'Evenings', 'Flexible'] as const;

// Volunteer sign-up form.
export const volunteerSchema = z.object({
  fullName: text('Full name', 120),
  email,
  phone,
  city: text('City or town', 100),
  interests: z.array(z.enum(interestOptions)).min(1, 'Pick at least one'),
  availability: choice('your availability', availabilityOptions),
  experience: optionalText(1000),
  isAdult: agree('Volunteers must be at least 18'),
});

export const pledgeTypeOptions = ['Money', 'Supplies'] as const;
export const frequencyOptions = ['One-time', 'Monthly'] as const;

// Donation pledge form: money needs an amount, supplies need a description.
export const donationSchema = z
  .object({
    fullName: text('Full name', 120),
    email,
    phone: z
      .string()
      .trim()
      .optional()
      .transform((v) => (v ? v : undefined))
      .refine(
        (v) => v === undefined || /^[+0-9\s()-]{7,20}$/.test(v),
        'Enter a valid phone number',
      ),
    pledgeType: choice('a way to give', pledgeTypeOptions),
    amount: z
      .union([
        z.literal(''),
        z.coerce.number().positive('Amount must be more than 0').max(10_000_000),
      ])
      .optional()
      .transform((v) => (v === '' || v === undefined ? undefined : v)),
    frequency: z.enum(frequencyOptions).optional(),
    items: optionalText(1000),
    message: optionalText(1000),
  })
  .superRefine((v, ctx) => {
    if (v.pledgeType === 'Money' && v.amount === undefined) {
      ctx.addIssue({ code: 'custom', path: ['amount'], message: 'Enter an amount' });
    }
    if (v.pledgeType === 'Supplies' && !v.items) {
      ctx.addIssue({
        code: 'custom',
        path: ['items'],
        message: 'Tell us what you would like to give',
      });
    }
  });

/* ---------------- Helpers ---------------- */

/** One error message per field name. */
export type FieldErrors = Record<string, string>;

/** Turns form data into a plain object; keys listed in `arrayKeys` keep every value. */
export function formDataToObject(fd: FormData, arrayKeys: string[] = []) {
  const out: Record<string, string | string[]> = {};
  for (const key of new Set(fd.keys())) {
    const values = fd.getAll(key).filter((v): v is string => typeof v === 'string');
    if (arrayKeys.includes(key)) out[key] = values;
    else if (values.length) out[key] = values[0]!;
  }
  for (const key of arrayKeys) out[key] ??= [];
  return out;
}

/** Turns validation problems into one message per field (the first problem wins). */
export function zodFieldErrors(error: z.ZodError): FieldErrors {
  const errors: FieldErrors = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? 'form');
    errors[key] ??= issue.message;
  }
  return errors;
}

type FileLike = { name: string; size: number; type: string };

/** Returns an error message, or null when the photos are acceptable. */
export function checkPhotos(files: FileLike[], opts: { min: number; max: number; label: string }) {
  if (files.length < opts.min)
    return opts.min === 1 ? `${opts.label} is required` : `Add at least ${opts.min} photos`;
  if (files.length > opts.max) return `You can add up to ${opts.max} photos`;
  for (const f of files) {
    if (!PHOTO_TYPES.includes(f.type)) return `${f.name} is not a JPG, PNG, WEBP or HEIC photo`;
    if (f.size > MAX_PHOTO_BYTES) return `${f.name} is larger than 8 MB`;
  }
  return null;
}

// How many photos each upload field needs (min) and allows (max).
export const photoRules = {
  idPhoto: { min: 1, max: 1, label: 'A photo of your valid ID' },
  homePhotos: { min: 1, max: 4, label: 'Home photos' },
  animalPhotos: { min: 0, max: 5, label: 'Photos' },
} as const;
