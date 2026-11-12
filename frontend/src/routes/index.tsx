import { createFileRoute } from '@tanstack/react-router';
import {
  AboutSection,
  HelpSection,
  HomepageHero,
  ImpactSection,
  StorySection,
} from '@/components/site/home-sections';
import { SiteLayout } from '@/components/site/site-layout';

// Home page (/): browser tab title, sharing tags, and the page itself.
export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      { title: 'StrayAssist — Rescue, care and homes for stray animals' },
      {
        name: 'description',
        content: 'StrayAssist helps stray animals find rescue, care, and loving homes.',
      },
      { property: 'og:title', content: 'StrayAssist — Rescue, care and homes for stray animals' },
      {
        property: 'og:description',
        content: 'StrayAssist helps stray animals find rescue, care, and loving homes.',
      },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
  }),
  component: Home,
});

/** Stacks the home page sections inside the normal navbar + footer layout. */
function Home() {
  return (
    <SiteLayout>
      <HomepageHero />
      <HelpSection />
      <ImpactSection />
      <StorySection />
      <AboutSection />
    </SiteLayout>
  );
}
