import type { SiteConfig } from './types';

export const siteConfig: SiteConfig = {
  name: 'WiserLiving',
  tagline: 'Clear, practical guidance for later life',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://wiserliving.co.uk',
  description:
    'Trusted UK guidance for people aged 55 and over and their families — equity release, mobility, funeral planning, benefits, wills, and tech.',
  owner: {
    legalName: 'WiserLiving',
    address: '',
    contactEmail: 'hello@wiserliving.co.uk',
  },
  verticals: {
    'equity-release': {
      slug: 'equity-release',
      label: 'Equity Release & Later-Life Finance',
      shortLabel: 'Equity Release',
      regulatoryDomain: 'finance',
      description:
        'How equity release works, the different plan types, costs, risks, and alternatives.',
      pillarSlug: 'complete-guide-equity-release-uk',
    },
    'mobility-aids': {
      slug: 'mobility-aids',
      label: 'Mobility Aids & Home Adaptations',
      shortLabel: 'Mobility',
      regulatoryDomain: 'health',
      description:
        'Stairlifts, walk-in showers, grab rails, and the adaptations that keep you at home longer.',
      pillarSlug: 'home-adaptations-for-older-adults',
    },
    'funeral-planning': {
      slug: 'funeral-planning',
      label: 'Funeral Planning',
      shortLabel: 'Funerals',
      regulatoryDomain: 'finance',
      description:
        'Prepaid funeral plans, direct cremation, costs, and what to arrange in advance.',
      pillarSlug: 'funeral-planning-uk-complete-guide',
    },
    'tech-guides': {
      slug: 'tech-guides',
      label: 'Simple Technology Guides',
      shortLabel: 'Tech',
      regulatoryDomain: 'general',
      description: 'Plain-English how-tos for video calling, smartphones, tablets, and staying safe online.',
      pillarSlug: 'simple-tech-guide-for-over-55s',
    },
    benefits: {
      slug: 'benefits',
      label: 'Benefits & Entitlements',
      shortLabel: 'Benefits',
      regulatoryDomain: 'general',
      description:
        'Attendance Allowance, Pension Credit, Council Tax reduction, and other benefits you may be entitled to.',
      pillarSlug: 'benefits-you-can-claim-in-retirement',
    },
    'wills-poa': {
      slug: 'wills-poa',
      label: 'Wills & Lasting Power of Attorney',
      shortLabel: 'Wills & LPA',
      regulatoryDomain: 'legal',
      description:
        'Writing a will, setting up a Lasting Power of Attorney, and making sure your wishes are recorded.',
      pillarSlug: 'wills-and-lasting-power-of-attorney-uk',
    },
  },
};

export const verticalsList = Object.values(siteConfig.verticals);
