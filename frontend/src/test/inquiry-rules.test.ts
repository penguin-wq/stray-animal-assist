// Checks the adopter screening rules (age, ID photo, home photos, landlord question).

import { describe, expect, it } from 'vitest';
import {
  adoptionAboutSchema,
  adoptionHomeSchema,
  adoptionVerifySchema,
  checkPhotos,
  isAtLeastAge,
  photoRules,
} from '@/lib/inquiry-schemas';

const today = new Date(2026, 10, 11); // 11 Nov 2026

describe('adopter screening rules', () => {
  it('rejects adopters younger than 18', () => {
    expect(isAtLeastAge('2008-11-12', 18, today)).toBe(false);
  });

  it('accepts adopters who turn 18 today', () => {
    expect(isAtLeastAge('2008-11-11', 18, today)).toBe(true);
  });

  it('requires a photo of a valid ID', () => {
    expect(checkPhotos([], photoRules.idPhoto)).not.toBeNull();
    expect(
      checkPhotos([{ name: 'id.jpg', size: 1000, type: 'image/jpeg' }], photoRules.idPhoto),
    ).toBeNull();
  });

  it('requires at least one home photo', () => {
    expect(checkPhotos([], photoRules.homePhotos)).not.toBeNull();
  });

  it('rejects photos over 8 MB and non-image files', () => {
    expect(
      checkPhotos(
        [{ name: 'big.jpg', size: 9 * 1024 * 1024, type: 'image/jpeg' }],
        photoRules.homePhotos,
      ),
    ).not.toBeNull();
    expect(
      checkPhotos(
        [{ name: 'doc.pdf', size: 1000, type: 'application/pdf' }],
        photoRules.homePhotos,
      ),
    ).not.toBeNull();
  });

  it('requires renters to say whether their landlord allows pets', () => {
    const base = {
      companion: 'Dog',
      homeType: 'House',
      livingArea: 'Indoors',
      adults: '2',
      children: '0',
      hoursAlone: '4',
      experience: 'Grew up with two dogs.',
      reason: 'We have a big yard and time.',
    };
    expect(adoptionHomeSchema.safeParse({ ...base, ownership: 'I rent' }).success).toBe(false);
    expect(
      adoptionHomeSchema.safeParse({ ...base, ownership: 'I rent', landlordAllowsPets: 'Yes' })
        .success,
    ).toBe(true);
  });

  it('requires home-visit and return-policy agreement', () => {
    const verify = {
      referenceName: 'Ana Cruz',
      referencePhone: '09171234567',
      contactConsent: 'on',
    };
    expect(adoptionVerifySchema.safeParse(verify).success).toBe(false);
    expect(
      adoptionVerifySchema.safeParse({
        ...verify,
        homeVisitConsent: 'on',
        returnPolicyConsent: 'on',
      }).success,
    ).toBe(true);
  });

  it('requires an address for the home visit', () => {
    const about = {
      firstName: 'Ana',
      lastName: 'Cruz',
      email: 'ana@example.com',
      phone: '09171234567',
      birthDate: '1990-01-01',
      city: 'Talisay',
    };
    expect(adoptionAboutSchema.safeParse(about).success).toBe(false);
  });
});
