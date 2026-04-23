import { siteConfig } from '@/lib/config';
import Container from '@/components/layout/Container';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import Prose from '@/components/layout/Prose';

export const metadata = {
  title: 'Privacy policy',
  description: `How ${siteConfig.name} handles your personal data under UK GDPR.`,
  alternates: { canonical: '/privacy/' },
};

export default function PrivacyPage() {
  return (
    <Container width="prose" className="pt-8 pb-16">
      <Breadcrumbs crumbs={[{ label: 'Home', href: '/' }, { label: 'Privacy policy' }]} />
      <h1 className="mt-4 font-serif text-4xl font-semibold text-brand-ink">Privacy policy</h1>
      <p className="mt-2 text-base text-brand-muted">Last reviewed: April 2026</p>
      <Prose className="mt-6">
        <h2>Who we are</h2>
        <p>
          Wiser Times is published by {siteConfig.owner.legalName}. We are the
          data controller for personal data collected through this site. You can contact us at{' '}
          <a href={`mailto:${siteConfig.owner.contactEmail}`}>{siteConfig.owner.contactEmail}</a>.
        </p>

        <h2>What data we collect</h2>
        <ul>
          <li>
            <strong>Analytics data:</strong> IP address, device information, and browsing behaviour, collected via
            Google Analytics if you accept analytics cookies.
          </li>
          <li>
            <strong>Aggregate traffic and performance measurement:</strong> we use Vercel Analytics and Vercel Speed
            Insights to count page views and measure page-load performance. These are cookieless and do not track you
            across sites or build a profile of you; data is aggregated and anonymised by Vercel as our processor.
          </li>
          <li>
            <strong>Advertising cookies:</strong> set by Google AdSense (and, where applicable, partner ad networks)
            if you accept advertising cookies.
          </li>
          <li>
            <strong>Affiliate tracking cookies:</strong> set by networks such as Awin and Amazon Associates if you
            accept advertising cookies.
          </li>
          <li>
            <strong>Form submissions:</strong> any information you choose to submit via a contact form or a lead
            generation form (for example, when enquiring about equity release or a stairlift quote).
          </li>
        </ul>

        <h2>Legal basis</h2>
        <p>
          We rely on your <strong>consent</strong> for advertising, analytics, and affiliate cookies. We rely on
          <strong> legitimate interests</strong> for site security and fraud prevention. Where you submit a form, we
          rely on <strong>consent</strong> or <strong>performance of a contract</strong> (for example, to pass your
          enquiry to a third-party provider you have explicitly asked to hear from).
        </p>

        <h2>Who we share data with</h2>
        <ul>
          <li>Google (Analytics, AdSense) - in their role as processors and, for advertising, independent controllers.</li>
          <li>Vercel - our hosting and analytics processor (aggregate, cookieless traffic and performance metrics).</li>
          <li>Affiliate networks such as Awin and Amazon Associates - for attribution of clicks and sales.</li>
          <li>Lead generation partners - only with your explicit consent on the relevant form.</li>
        </ul>

        <h2>Retention</h2>
        <p>
          Analytics data is retained for 14 months. Form submissions are retained for as long as needed to respond to
          your enquiry, or up to 12 months if handed to a lead generation partner, after which we delete our copy.
        </p>

        <h2>Your rights</h2>
        <p>
          Under UK GDPR you have the right to access, rectify, erase, restrict, port, and object to processing of your
          personal data. To exercise these rights, email{' '}
          <a href={`mailto:${siteConfig.owner.contactEmail}`}>{siteConfig.owner.contactEmail}</a>. If you are unhappy
          with how we handle your data, you can complain to the Information Commissioner&apos;s Office (ICO) at{' '}
          <a href="https://ico.org.uk" rel="noopener noreferrer">ico.org.uk</a>.
        </p>

        <h2>International transfers</h2>
        <p>
          Some of our processors (notably Google) are based in the United States. Where data is transferred outside
          the UK, we rely on adequacy decisions or Standard Contractual Clauses to protect your data.
        </p>

        <h2>Changes to this policy</h2>
        <p>
          We review this policy at least once a year. Material changes will be communicated via a notice on the site.
        </p>
      </Prose>
    </Container>
  );
}
