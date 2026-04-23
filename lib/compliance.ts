// Single source of truth for regulatory disclaimers and compliance copy.
// Never inline this text at the call-site - always use the compliance
// components (FCADisclaimer, MedicalDisclaimer, AffiliateDisclosure).
// We update this file quarterly as part of the compliance review.

import type { RegulatoryDomain } from './types';

export const disclaimers = {
  fca: {
    title: 'Important: information, not financial advice',
    body: 'Wiser Times provides general information only and does not provide financial advice. You should seek independent financial advice before making any financial decisions. The value of investments can go down as well as up.',
  },
  equityRelease: {
    title: 'About equity release',
    body: 'Equity release may involve a home reversion plan or lifetime mortgage which is secured against your property. To understand the features and risks, ask for a personalised illustration. Equity release requires paying off any existing mortgage. Any money released, plus accrued interest, would need to be repaid upon death or moving into long-term care.',
  },
  medical: {
    title: 'Health information, not medical advice',
    body: 'This information is for general guidance only and does not replace professional medical advice. Always consult your GP or a qualified healthcare professional before making decisions about medical equipment or health-related products.',
  },
  legal: {
    title: 'Information, not legal advice',
    body: 'Wiser Times provides general information about legal topics. It does not provide legal advice. Consult a qualified solicitor for advice about your specific circumstances.',
  },
  affiliate: {
    title: 'Affiliate disclosure',
    body: 'This page contains affiliate links. If you click through and take out a product, we may receive a commission. This does not affect our editorial independence or the information we provide.',
  },
  pricing: (date: string) =>
    `Prices correct as of ${date}. Prices and availability change - always confirm with the provider before purchasing.`,
} as const;

// Banned phrases that must not appear in financial content under our FCA positioning.
// This list is also used by scripts/lib/banned-words.mjs as the authoritative list.
export const financialAdviceBanned = [
  'we recommend',
  'we advise',
  'you should invest',
  'the best option is',
  'guaranteed returns',
  'risk-free',
  'you must',
];

// AI-signal banned words/phrases per brief §2.1 & §2.3.
export const aiSignalBanned = [
  'delve',
  'landscape',
  "it's important to note",
  "in today's world",
  "whether you're a beginner or expert",
  "let's dive in",
  'navigating',
  'leverage',
  'comprehensive',
  'crucial',
  'streamline',
  'game-changer',
  'unlock',
  'empower',
  'robust',
  'seamless',
  "let's explore",
  "let's take a closer look",
  'without further ado',
  'so, what exactly is',
  "now that we've covered",
];

// Punctuation bans per brief §2.3.
export const punctuationBans = {
  emDash: /\u2014/, // U+2014, absolutely forbidden
  // en-dash allowed only in number/date ranges - harder to check automatically,
  // so the compliance-check script warns rather than fails for this.
  enDash: /\u2013/,
};

export function requiresFinancialDisclaimer(domain: RegulatoryDomain): boolean {
  return domain === 'finance';
}

export function requiresMedicalDisclaimer(domain: RegulatoryDomain): boolean {
  return domain === 'health';
}

export function requiresLegalDisclaimer(domain: RegulatoryDomain): boolean {
  return domain === 'legal';
}
