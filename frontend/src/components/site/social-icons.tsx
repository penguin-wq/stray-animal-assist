import type { ReactNode } from 'react';

/** A social network link and the outline icon drawn for it. */
type Social = { label: string; href: string; icon: ReactNode };

// Social links in the footer. These point to each site's home page until the real accounts are added.
const socials: Social[] = [
  {
    label: 'YouTube',
    href: 'https://youtube.com',
    icon: (
      <>
        <rect x='2.5' y='5' width='19' height='14' rx='3' />
        <path d='m10 9.5 4.5 2.5-4.5 2.5z' />
      </>
    ),
  },
  {
    label: 'Facebook',
    href: 'https://facebook.com',
    icon: (
      <>
        <circle cx='12' cy='12' r='9.5' />
        <path d='M15 8h-1.5A2.5 2.5 0 0 0 11 10.5V21.5M8.5 13h6' />
      </>
    ),
  },
  {
    label: 'X',
    href: 'https://x.com',
    icon: (
      <>
        <path d='M4 4l11.733 16H20L8.267 4z' />
        <path d='M4 20l6.768-6.768M13.232 10.768 20 4' />
      </>
    ),
  },
  {
    label: 'Instagram',
    href: 'https://instagram.com',
    icon: (
      <>
        <rect x='3' y='3' width='18' height='18' rx='4.5' />
        <circle cx='12' cy='12' r='4' />
        <path d='M17.2 6.8h.01' />
      </>
    ),
  },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com',
    icon: (
      <>
        <rect x='3' y='3' width='18' height='18' rx='1.5' />
        <path d='M8 11v5M8 8v.01M12 16v-5M16 16v-3a2 2 0 1 0-4 0' />
      </>
    ),
  },
];

/** Row of social media icon links (they open in a new tab). */
export function SocialIcons() {
  return (
    <ul className='flex items-center gap-4'>
      {socials.map((s) => (
        <li key={s.label}>
          <a
            href={s.href}
            target='_blank'
            rel='noreferrer'
            aria-label={s.label}
            className='flex size-5 items-center justify-center text-muted-foreground transition-colors hover:text-foreground'
          >
            <svg
              aria-hidden='true'
              width='20'
              height='20'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='1.75'
              strokeLinecap='round'
              strokeLinejoin='round'
            >
              {s.icon}
            </svg>
          </a>
        </li>
      ))}
    </ul>
  );
}
