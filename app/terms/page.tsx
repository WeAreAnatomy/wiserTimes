import { siteConfig } from '@/lib/config';
import Container from '@/components/layout/Container';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import Prose from '@/components/layout/Prose';

export const metadata = {
  title: 'Terms and conditions',
  description: `Terms of use for ${siteConfig.name}.`,
  alternates: { canonical: '/terms/' },
};

export default function TermsPage() {
  return (
    <Container width="prose" className="pt-8 pb-16">
      <Breadcrumbs crumbs={[{ label: 'Home', href: '/' }, { label: 'Terms' }]} />
      <h1 className="mt-4 font-serif text-4xl font-semibold text-brand-ink">Terms and conditions</h1>
      <p className="mt-2 text-base text-brand-muted">Last reviewed: April 2026</p>
      <Prose className="mt-6">
        <h2>Ownership</h2>
        <p>
          {siteConfig.name} is owned and operated by {siteConfig.owner.legalName}, registered at{' '}
          {siteConfig.owner.address}.
        </p>

        <h2>Information, not advice</h2>
        <p>
          Content on {siteConfig.name} is general information. It is not financial advice, medical advice, or legal
          advice. You should seek advice from a qualified professional before acting on anything you read here.
          {siteConfig.name} is not liable for decisions made based on its content.
        </p>

        <h2>Intellectual property</h2>
        <p>
          All content on {siteConfig.name} is © {new Date().getFullYear()} {siteConfig.owner.legalName}. You may link
          to our pages and quote short passages with attribution. You may not reproduce whole articles without
          permission.
        </p>

        <h2>Affiliate disclosure</h2>
        <p>
          Some links on the site are affiliate links. If you click through and make a purchase or take out a product,
          we may receive a commission. This does not affect the information we publish or the recommendations we do
          not make.
        </p>

        <h2>Accuracy</h2>
        <p>
          While every effort is made to keep information accurate and up to date, prices, product features, and benefit
          entitlements change. Always verify critical information with the relevant provider or authority before
          acting on it.
        </p>

        <h2>Governing law</h2>
        <p>
          These terms are governed by the laws of England and Wales, and any dispute falls under the exclusive
          jurisdiction of the courts of England and Wales.
        </p>
      </Prose>
    </Container>
  );
}
