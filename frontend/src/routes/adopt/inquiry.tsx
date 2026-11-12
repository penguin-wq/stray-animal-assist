import { createFileRoute } from '@tanstack/react-router';
import { InquiryPage } from '@/components/site/inquiry-page';
import { pageHead } from '@/components/site/page-header';
import { getRescue } from '@/data/rescues';

// Optional ?animal=<slug> in the address, set when someone clicks "Apply to adopt" on an animal.
type InquirySearch = { animal?: string };

// /adopt/inquiry — the adoption application form (full screen, no navbar or footer).
export const Route = createFileRoute('/adopt/inquiry')({
  // Keep only a text `animal` value from the address; ignore anything else.
  validateSearch: (search: Record<string, unknown>): InquirySearch =>
    typeof search['animal'] === 'string' ? { animal: search['animal'] } : {},
  head: () =>
    pageHead(
      'Adoption application — StrayAssist',
      'Apply to adopt a rescued dog or cat from StrayAssist. Every adopter is screened with ID, references and a home visit.',
    ),
  component: AdoptionInquiry,
});

/** Shows the adoption form, mentioning the chosen animal when one was picked. */
function AdoptionInquiry() {
  const { animal } = Route.useSearch();
  return <InquiryPage kind='adoption' animal={animal ? getRescue(animal) : undefined} />;
}
