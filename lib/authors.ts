import type { Author } from './types';

// Editorial voices. These are illustrative editorial personae used by the
// content pipeline, framed on the site as "Our view" / "Editorial" rather
// than as real individuals, to stay compliant with the ASA/CAP code on
// testimonials. See Section 10.3 of the platform brief.
export const authors: Record<string, Author> = {
  margaret: {
    slug: 'margaret',
    name: 'Margaret (Editorial)',
    credentials: 'Former social worker, 30 years supporting older adults',
    bio: 'Margaret writes the site\'s benefits and care-related guides. Her editorial voice draws on three decades of casework with older adults and their families.',
    experience: 'Attendance Allowance, Pension Credit, social care assessments, Blue Badge applications.',
  },
  david: {
    slug: 'david',
    name: 'David (Editorial)',
    credentials: 'Former independent financial adviser',
    bio: 'David writes the site\'s finance guides. His editorial voice reflects a career advising retirees on income drawdown, equity release, and later-life planning.',
    experience: 'Equity release, pension drawdown, annuities, inheritance planning.',
  },
  priya: {
    slug: 'priya',
    name: 'Priya (Editorial)',
    credentials: 'Occupational therapist, NHS and private practice',
    bio: 'Priya writes the site\'s mobility and home adaptation guides. Her editorial voice is rooted in years of home assessments and adaptation planning.',
    experience: 'Stairlifts, wet rooms, grab rails, falls prevention, local authority OT referrals.',
  },
  editorial: {
    slug: 'editorial',
    name: 'Wiser Times Editorial',
    credentials: 'Wiser Times editorial team',
    bio: 'The Wiser Times editorial team produces and maintains this guide. Content is reviewed quarterly for accuracy.',
    experience: 'General guides across our six content areas.',
  },
};
