import { footerNav, legalNav } from '@/data/nav';
import { Container } from './container';
import { Logo } from './logo';
import { SmartLink } from './smart-link';
import { SocialIcons } from './social-icons';

/** Site footer: logo, footer links, social icons, then copyright and legal links. */
export function Footer() {
  return (
    <footer id='footer' className='border-t border-border bg-secondary'>
      <Container className='pt-12'>
        <div className='flex flex-col items-start gap-6 md:h-[38px] md:flex-row md:items-center md:justify-between'>
          <Logo />
          {/* Blog / About / Contact — placeholder links for now. */}
          <nav aria-label='Footer'>
            <ul className='flex items-center gap-8'>
              {footerNav.map((item) => (
                <li key={item.label}>
                  <SmartLink
                    to={item.to}
                    className='text-sm text-ink-soft transition-colors hover:text-foreground hover:underline'
                  >
                    {item.label}
                  </SmartLink>
                </li>
              ))}
            </ul>
          </nav>
          <SocialIcons />
        </div>

        <div className='mt-[34px] flex flex-col gap-4 border-t border-border pt-[31px] pb-[46px] md:flex-row md:items-center md:justify-between'>
          <p className='text-xs leading-[22px] text-muted-foreground'>
            {'© 2026 Your Company. All rights reserved.'}
          </p>
          {/* Privacy / Terms / Cookies — placeholder links for now. */}
          <ul className='flex items-center gap-6'>
            {legalNav.map((item) => (
              <li key={item.label}>
                <SmartLink
                  to={item.to}
                  className='text-sm leading-[22px] text-ink-soft transition-colors hover:text-foreground hover:underline'
                >
                  {item.label}
                </SmartLink>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  );
}
