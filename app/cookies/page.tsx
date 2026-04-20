import Container from '@/components/layout/Container';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import Prose from '@/components/layout/Prose';
import ComparisonTable from '@/components/blocks/ComparisonTable';

export const metadata = {
  title: 'Cookie policy',
  description: 'What cookies WiserLiving sets, why, and how to control them.',
  alternates: { canonical: '/cookies/' },
};

const rows = [
  ['wl-consent', 'WiserLiving', 'Essential', 'Remembers your cookie choice', '12 months'],
  ['_ga / _ga_*', 'Google Analytics', 'Analytics', 'Measures site usage anonymously', '14 months'],
  ['_gid', 'Google Analytics', 'Analytics', 'Distinguishes users for a single session', '24 hours'],
  ['NID / __Secure-*', 'Google', 'Advertising', 'Personalises and measures ads', 'Up to 13 months'],
  ['awc', 'Awin', 'Advertising', 'Tracks affiliate clicks and commissions', '30 days'],
  ['ubid-acbuk / session-id', 'Amazon', 'Advertising', 'Attributes affiliate sales', 'Up to 20 years'],
];

export default function CookiesPage() {
  return (
    <Container width="content" className="pt-8 pb-16">
      <Breadcrumbs crumbs={[{ label: 'Home', href: '/' }, { label: 'Cookie policy' }]} />
      <h1 className="mt-4 font-serif text-4xl font-semibold text-brand-ink">Cookie policy</h1>
      <p className="mt-2 text-base text-brand-muted">Last reviewed: April 2026</p>
      <Prose className="mt-6">
        <p>
          We use a small number of cookies to run the site and, with your permission, to measure usage and fund the
          site through advertising. Essential cookies are set whenever you visit. Everything else is only set once you
          accept on the banner.
        </p>
        <h2>Cookies we may set</h2>
      </Prose>
      <ComparisonTable
        factualNote={false}
        headers={['Cookie', 'Set by', 'Category', 'Purpose', 'Duration']}
        rows={rows}
      />
      <Prose>
        <h2>Managing your choice</h2>
        <p>
          You can withdraw or change your cookie choice at any time by clearing your browser cookies for this site, or
          by using your browser&apos;s privacy controls. Most browsers also allow you to block third-party cookies
          entirely.
        </p>
        <h2>Do Not Track</h2>
        <p>
          We treat a Do Not Track browser signal as a request to reject non-essential cookies, even though UK law does
          not strictly require this.
        </p>
      </Prose>
    </Container>
  );
}
