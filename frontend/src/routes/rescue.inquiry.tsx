import { createFileRoute } from '@tanstack/react-router';
import { InquiryPage } from '@/components/site/inquiry-page';
import { pageHead } from '@/components/site/page-header';

// /rescue/inquiry — the "report an animal in need" form (full screen, no navbar or footer).
export const Route = createFileRoute('/rescue/inquiry')({
  head: () =>
    pageHead(
      'Report an animal in need — StrayAssist',
      'Seen a stray or injured animal? Send photos and the exact location so the StrayAssist rescue team can respond quickly.',
    ),
  component: () => <InquiryPage kind='rescue' />,
});
