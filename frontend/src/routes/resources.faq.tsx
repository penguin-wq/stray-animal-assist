import { createFileRoute } from '@tanstack/react-router';
import { ResourcePage } from '@/components/site/resource-page';
import { pageHead } from '@/components/site/page-header';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

// /resources/faq — frequently asked questions.
export const Route = createFileRoute('/resources/faq')({
  head: () =>
    pageHead(
      'FAQ — StrayAssist',
      'Answers to common questions about adopting, reporting a stray, volunteering and donating with StrayAssist.',
    ),
  component: FaqPage,
});

// Questions and answers (q = question, a = answer).
const faqs = [
  {
    q: 'Who can adopt?',
    a: 'Anyone 18 or older who can give an animal a safe home. Every applicant shares a valid ID, home photos and a personal reference, and agrees to a home visit.',
  },
  {
    q: 'Why do you ask for my ID and home photos?',
    a: 'So our animals only go to safe, responsible homes. Your ID and photos are kept private and are only seen by our team.',
  },
  {
    q: 'How long does adoption take?',
    a: "It depends on how quickly we can reach your reference and schedule the home visit. We'd rather take a little longer than rush a match.",
  },
  {
    q: 'Can I return an animal?',
    a: 'Yes. If you can no longer care for your adopted animal, bring them back to us. We ask adopters never to sell, abandon or give them away.',
  },
  {
    q: 'I found an injured stray. What do I do?',
    a: "Send a rescue report with photos and the exact location — use the “Use my current location” button if you're there. If the animal is in immediate danger, also contact your barangay or city veterinary office.",
  },
  {
    q: 'Do I need experience to volunteer?',
    a: "No. We'll show you everything you need to know. Volunteers must be at least 18.",
  },
  {
    q: 'How do I donate?',
    a: 'Fill in the pledge form on our Donate page and our team will contact you with how to send money or supplies.',
  },
];

/** Shows the questions as an accordion: click a question to open its answer. */
function FaqPage() {
  return (
    <ResourcePage
      current='/resources/faq'
      eyebrow='FAQ'
      title='Questions, answered.'
      intro='Everything you might want to know before adopting, reporting, volunteering or giving.'
    >
      <Accordion type='single' collapsible className='w-full'>
        {faqs.map((f) => (
          <AccordionItem key={f.q} value={f.q}>
            <AccordionTrigger className='text-left text-base font-semibold text-foreground'>
              {f.q}
            </AccordionTrigger>
            <AccordionContent className='text-base leading-[26px] text-muted-foreground'>
              {f.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </ResourcePage>
  );
}
