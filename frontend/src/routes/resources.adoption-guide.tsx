import { createFileRoute } from '@tanstack/react-router';
import { ResourcePage } from '@/components/site/resource-page';
import { pageHead } from '@/components/site/page-header';

// /resources/adoption-guide — step-by-step guide to adopting, built with the shared resource layout.
export const Route = createFileRoute('/resources/adoption-guide')({
  head: () =>
    pageHead(
      'Adoption guide — StrayAssist',
      'How adopting from StrayAssist works, from application to home visit to your first week together.',
    ),
  component: () => (
    <ResourcePage
      current='/resources/adoption-guide'
      eyebrow='Adoption guide'
      title='How adoption works.'
      intro="We take our time so every animal lands in the right home. Here's what to expect, step by step."
      sections={[
        {
          title: 'Choose a companion',
          points: [
            "Browse our rescues and read about each animal's personality.",
            "Not sure? Pick “Not sure yet” on the application and we'll suggest a match.",
          ],
        },
        {
          title: 'Send your application',
          points: [
            'Share your details, a photo of a valid ID and photos of your home.',
            "Give us one personal reference who isn't family.",
            'Applicants must be at least 18 years old.',
          ],
        },
        {
          title: 'Screening and home visit',
          points: [
            'Our team calls you and your reference.',
            "A volunteer visits your home to make sure it's safe — secure gates, shade, a place to sleep.",
            "We'll only approve the adoption once the visit is done.",
          ],
        },
        {
          title: 'Meet and go home',
          points: [
            'Spend time with the animal at the shelter before deciding.',
            'Sign the adoption agreement, including our promise to return the animal to us rather than rehome it.',
            'We check in during the first weeks and are always a message away.',
          ],
        },
      ]}
    />
  ),
});
