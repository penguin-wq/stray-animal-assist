export type Shelter = {
  slug: string;
  name: string;
  location: string;
  mapQuery: string;
  lat: number;
  lng: number;
  description: string;
  about: string;
};

export const shelters: Shelter[] = [
  {
    slug: 'talisay',
    name: 'Talisay Animal Shelter',
    location: 'Talisay, BTG',
    mapQuery: 'Talisay, Batangas, Philippines',
    lat: 14.0956,
    lng: 121.0103,
    description:
      'A calm, welcoming space for dogs and cats to rest, heal and meet their future families.',
    about:
      'Our Talisay shelter is where most rescues land first. Volunteers make sure every new arrival gets a quiet corner, regular meals and plenty of patience while they settle in.',
  },
  {
    slug: 'tanauan',
    name: 'Tanauan Animal Care Shelter',
    location: 'Tanauan, BTG',
    mapQuery: 'Tanauan, Batangas, Philippines',
    lat: 14.0863,
    lng: 121.1497,
    description: 'A community of foster homes giving shy animals the confidence to start over.',
    about:
      'The Tanauan team works closely with foster families, so shy animals can learn what a real home feels like before they meet their adopters.',
  },
];

export type Rescue = {
  slug: string;
  name: string;
  type: 'Dog' | 'Cat';
  age: string;
  gender: 'Male' | 'Female';
  shelter: Shelter['slug'];
  personality: string;
  goodWith: string[];
};

export const rescues: Rescue[] = [
  {
    slug: 'bada-bing',
    name: 'Bada-bing',
    type: 'Cat',
    age: '2 months',
    gender: 'Male',
    shelter: 'talisay',
    personality: 'A curious little explorer who loves chasing string and napping in sunny spots.',
    goodWith: ['Other cats', 'Gentle children'],
  },
  {
    slug: 'bada-boom',
    name: 'Bada-boom',
    type: 'Cat',
    age: '2 months',
    gender: 'Male',
    shelter: 'tanauan',
    personality: "Bada-bing's brother. Loud purrs, big appetite and always first to say hello.",
    goodWith: ['Other cats', 'Gentle children'],
  },
  {
    slug: 'bada-bap',
    name: 'Bada-bap',
    type: 'Cat',
    age: '2 years',
    gender: 'Female',
    shelter: 'talisay',
    personality:
      'Calm and independent. She likes a quiet home where she can choose when to cuddle.',
    goodWith: ['Adults'],
  },
  {
    slug: 'milo',
    name: 'Milo',
    type: 'Dog',
    age: '4 years',
    gender: 'Male',
    shelter: 'tanauan',
    personality: 'A steady, friendly dog who enjoys slow walks and leaning against your legs.',
    goodWith: ['Children', 'Other dogs'],
  },
  {
    slug: 'luna',
    name: 'Luna',
    type: 'Cat',
    age: '1 year',
    gender: 'Female',
    shelter: 'talisay',
    personality:
      'Playful and chatty. Luna will follow you from room to room to see what you are up to.',
    goodWith: ['Other cats', 'Children'],
  },
  {
    slug: 'penny',
    name: 'Penny',
    type: 'Dog',
    age: '3 years',
    gender: 'Female',
    shelter: 'tanauan',
    personality: 'Shy at first, then endlessly loyal. Penny does best with a patient, calm family.',
    goodWith: ['Adults', 'Calm dogs'],
  },
  {
    slug: 'choco',
    name: 'Choco',
    type: 'Dog',
    age: '8 months',
    gender: 'Male',
    shelter: 'talisay',
    personality:
      'A bouncy puppy still learning his manners. Loves toys, treats and meeting new people.',
    goodWith: ['Children', 'Other dogs'],
  },
  {
    slug: 'mochi',
    name: 'Mochi',
    type: 'Cat',
    age: '5 years',
    gender: 'Female',
    shelter: 'tanauan',
    personality: 'A gentle lap cat who wants nothing more than a soft blanket and a kind hand.',
    goodWith: ['Adults', 'Other cats'],
  },
  {
    slug: 'bantay',
    name: 'Bantay',
    type: 'Dog',
    age: '6 years',
    gender: 'Male',
    shelter: 'talisay',
    personality: 'A watchful, loving senior who has plenty of good years left to give.',
    goodWith: ['Adults', 'Older children'],
  },
];

export function getRescue(slug: string) {
  return rescues.find((r) => r.slug === slug);
}

export function getShelter(slug: string) {
  return shelters.find((s) => s.slug === slug);
}
