import { useState } from 'react';
import { Heart, Menu, X } from 'lucide-react';
import { mainNav } from '@/data/nav';
import { SiteButtonLink } from './site-button';
import { Container } from './container';
import { Logo } from './logo';
import { NavDropdown } from './nav-dropdown';
import { SmartLink } from './smart-link';

// Shared look for the top-level menu links.
const linkClass =
  'text-base font-medium text-foreground transition-colors hover:text-muted-foreground';

/** Top bar with the logo, main menu and Donate button. On phones it collapses into a menu button. */
export function Navbar() {
  // Whether the phone menu is open.
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className='border-b border-border bg-background'>
      <Container className='flex h-20 items-center justify-between md:h-24'>
        <Logo />

        {/* Desktop menu (hidden on small screens). */}
        <nav aria-label='Main' className='hidden items-center md:flex'>
          <ul className='flex items-center gap-8'>
            {mainNav.map((item) => (
              <li key={item.label}>
                {item.children ? (
                  <NavDropdown label={item.label} items={item.children} />
                ) : (
                  <SmartLink to={item.to} className={linkClass}>
                    {item.label}
                  </SmartLink>
                )}
              </li>
            ))}
          </ul>
          <SiteButtonLink to='/donate' variant='secondary' className='ml-9'>
            Donate
            <Heart aria-hidden='true' className='size-[18px]' strokeWidth={2} />
          </SiteButtonLink>
        </nav>

        {/* Phone menu button (hidden on desktop). */}
        <button
          type='button'
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((v) => !v)}
          className='flex size-10 items-center justify-center rounded-xl bg-secondary md:hidden'
        >
          {mobileOpen ? <X className='size-5' /> : <Menu className='size-5' />}
        </button>
      </Container>

      {/* Phone menu: dropdown children are flattened into one simple list. */}
      {mobileOpen && (
        <nav aria-label='Mobile' className='border-t border-border md:hidden'>
          <Container className='flex flex-col gap-1 py-4'>
            {mainNav
              .flatMap((item) => (item.children ? item.children : [item]))
              .map((item) => (
                <SmartLink
                  key={item.label}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className='rounded-[10px] px-3 py-2.5 text-base font-medium text-foreground hover:bg-secondary'
                >
                  {item.label}
                </SmartLink>
              ))}
            <SiteButtonLink to='/donate' variant='secondary' className='mt-2 w-full'>
              Donate
              <Heart aria-hidden='true' className='size-[18px]' />
            </SiteButtonLink>
          </Container>
        </nav>
      )}
    </header>
  );
}
