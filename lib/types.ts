// Canonical types for content frontmatter and site config.
// Any new frontmatter field MUST be added here before being used in markdown.

export type Vertical =
  | 'equity-release'
  | 'mobility-aids'
  | 'funeral-planning'
  | 'tech-guides'
  | 'benefits'
  | 'wills-poa';

export type ContentType = 'pillar' | 'spoke' | 'how-to' | 'product-review' | 'comparison';

export type Intent = 'informational' | 'commercial' | 'transactional';

export type RegulatoryDomain = 'finance' | 'health' | 'legal' | 'general';

export interface FAQItem {
  q: string;
  a: string;
}

export interface Author {
  slug: string;
  name: string;
  credentials: string;
  bio: string;
  experience: string;
}

export interface AffiliateReference {
  network: 'awin' | 'amazon' | 'impact' | 'shareasale' | 'direct';
  merchant: string;
  product?: string;
  url: string;
  disclosure: 'affiliate' | 'sponsored' | 'lead-gen';
}

export interface ArticleFrontmatter {
  title: string;
  description: string;
  vertical: Vertical;
  contentType: ContentType;
  intent: Intent;
  regulatoryDomain: RegulatoryDomain;
  slug: string;
  author: string; // author slug, resolved via authors.ts
  published: string; // ISO date
  lastReviewed: string; // ISO date
  keywords: string[];
  faqs?: FAQItem[];
  affiliates?: AffiliateReference[];
  heroImage?: string;
  tags?: string[];
  // If true, emit HowTo schema. Populated by content pipeline for how-to template.
  howTo?: {
    totalTime?: string;
    steps: { name: string; text: string }[];
  };
  // If true, emit Product schema.
  product?: {
    name: string;
    brand?: string;
    priceFrom?: number;
    priceTo?: number;
    currency?: string;
    rating?: number;
    reviewCount?: number;
  };
}

export interface Article {
  frontmatter: ArticleFrontmatter;
  body: string;
  readingTimeMinutes: number;
}

export interface SiteConfig {
  name: string;
  tagline: string;
  url: string;
  description: string;
  owner: {
    legalName: string;
    address: string;
    contactEmail: string;
  };
  adsense: {
    publisherId: string;
  };
  verticals: Record<Vertical, VerticalConfig>;
}

export interface VerticalConfig {
  slug: Vertical;
  label: string;
  shortLabel: string;
  regulatoryDomain: RegulatoryDomain;
  description: string;
  pillarSlug: string;
}
