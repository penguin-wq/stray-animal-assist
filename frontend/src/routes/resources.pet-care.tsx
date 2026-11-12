import { createFileRoute } from '@tanstack/react-router';
import { ResourcePage } from '@/components/site/resource-page';
import { pageHead } from '@/components/site/page-header';

// /resources/pet-care — care tips for a newly adopted pet.
export const Route = createFileRoute('/resources/pet-care')({
  head: () =>
    pageHead(
      'Pet care tips — StrayAssist',
      'Simple, practical tips for keeping a rescued dog or cat healthy and happy at home.',
    ),
  component: () => (
    <ResourcePage
      current='/resources/pet-care'
      eyebrow='Pet care tips'
      title='Caring for your rescue.'
      intro='Rescued animals often need a little extra patience. These basics help them settle in and stay healthy.'
      sections={[
        {
          title: 'The first week',
          points: [
            'Give them a quiet corner with a bed, water and food.',
            'Keep routines simple and predictable.',
            "Let them come to you — don't force cuddles.",
          ],
        },
        {
          title: 'Vet care',
          points: [
            'Book a check-up soon after adoption.',
            'Keep vaccines, deworming and flea and tick prevention up to date.',
            "Ask your vet about spaying or neutering if it hasn't been done.",
          ],
        },
        {
          title: 'Food and water',
          points: [
            'Feed a complete pet food suited to their age.',
            'Avoid chocolate, grapes, onions, garlic and cooked bones.',
            'Always keep fresh water out, especially on hot days.',
          ],
        },
        {
          title: 'Safety at home',
          points: [
            'Use a collar with an ID tag and keep gates closed.',
            'Never leave them chained all day or in direct sun.',
            'Keep cats indoors or in a secure area to protect them from traffic.',
          ],
        },
      ]}
    />
  ),
});
