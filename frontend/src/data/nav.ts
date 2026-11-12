export type NavLinkItem = {
  label: string;
  to: string;
};

export type NavItem = NavLinkItem & {
  children?: NavLinkItem[];
};

export const mainNav: NavItem[] = [
  { label: 'Home', to: '/' },
  { label: 'Rescues', to: '/rescues' },
  { label: 'Adopt', to: '/adopt' },
  {
    label: 'Resources',
    to: '#',
    children: [
      { label: 'Adoption Guide', to: '/resources/adoption-guide' },
      { label: 'Pet Care Tips', to: '/resources/pet-care' },
      { label: 'Volunteer', to: '/volunteer' },
      { label: 'Rescue Stories', to: '/stories' },
      { label: 'FAQ', to: '/resources/faq' },
    ],
  },
];

export const footerNav: NavLinkItem[] = [
  { label: 'Blog', to: '#' },
  { label: 'About', to: '#' },
  { label: 'Contact', to: '#' },
];

export const legalNav: NavLinkItem[] = [
  { label: 'Privacy', to: '#' },
  { label: 'Terms', to: '#' },
  { label: 'Cookies', to: '#' },
];
