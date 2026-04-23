import { siteConfig } from '@/lib/config';
import { authors } from '@/lib/authors';
import Container from '@/components/layout/Container';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import Prose from '@/components/layout/Prose';
import AuthorCard from '@/components/content/AuthorCard';

export const metadata = {
  title: 'Editorial standards',
  description: `How ${siteConfig.name} researches, writes, and reviews its guides.`,
  alternates: { canonical: '/editorial-standards/' },
};

export default function EditorialPage() {
  return (
    <Container width="content" className="pt-8 pb-16">
      <Breadcrumbs crumbs={[{ label: 'Home', href: '/' }, { label: 'Editorial standards' }]} />
      <h1 className="mt-4 font-serif text-4xl font-semibold text-brand-ink">Editorial standards</h1>
      <p className="mt-2 text-base text-brand-muted">Last reviewed: April 2026</p>
      <Prose className="mt-6">
        <h2>What we publish</h2>
        <p>
          We publish practical, plain-English guides covering six areas of later-life planning: equity release and
          later-life finance, mobility aids and home adaptations, funeral planning, simple technology, UK benefits,
          and wills and lasting power of attorney.
        </p>

        <h2>How we produce content</h2>
        <p>
          Our guides are drafted using AI and then reviewed against a structured editorial framework that enforces
          factual accuracy, British English, plain-language phrasing, and the correct regulatory disclaimers for each
          topic. We cite UK government and charity sources (ONS, NHS, Age UK, Money Helper, CQC) where they are
          relevant.
        </p>
        <p>
          Editorial voices on the site (Margaret, David, Priya) are named personae used for tone and framing. We label
          their commentary as editorial opinion, not as testimonials from real named individuals, in line with the
          ASA/CAP code.
        </p>

        <h2>Review cycle</h2>
        <p>
          Every guide carries a &ldquo;Last reviewed&rdquo; date. We review each guide at least every quarter and
          refresh prices, benefit rates, and product details whenever a change is announced by a relevant authority.
        </p>

        <h2>What we do not do</h2>
        <ul>
          <li>We do not give financial advice. Our finance guides are information only.</li>
          <li>We do not give medical advice. Our mobility guides are for general guidance.</li>
          <li>We do not give legal advice. Our wills and LPA guides point to the official processes.</li>
          <li>We do not rank products by &ldquo;suitability&rdquo; - the right choice depends on your circumstances.</li>
        </ul>

        <h2>Editorial team</h2>
      </Prose>
      <div className="mt-6 space-y-4">
        {Object.values(authors).map((a) => (
          <AuthorCard key={a.slug} authorSlug={a.slug} />
        ))}
      </div>
    </Container>
  );
}
