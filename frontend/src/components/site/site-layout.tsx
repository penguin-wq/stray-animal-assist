import { useEffect, type ReactNode } from 'react';
import { useRouterState } from '@tanstack/react-router';
import { Footer } from './footer';
import { Navbar } from './navbar';

/** Wraps a normal page with the navbar on top and the footer at the bottom. */
export function SiteLayout({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  // Start each new page at the top instead of keeping the previous scroll position.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className='flex min-h-screen flex-col bg-background'>
      <Navbar />
      <main className='flex-1'>{children}</main>
      <Footer />
    </div>
  );
}
