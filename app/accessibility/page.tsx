import { siteConfig } from '@/lib/config';
import Container from '@/components/layout/Container';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import Prose from '@/components/layout/Prose';

export const metadata = {
  title: 'Accessibility statement',
  description: `${siteConfig.name} is designed to be usable by everyone, including older readers and people using assistive technology.`,
  alternates: { canonical: '/accessibility/' },
};

export default function AccessibilityPage() {
  return (
    <Container width="prose" className="pt-8 pb-16">
      <Breadcrumbs crumbs={[{ label: 'Home', href: '/' }, { label: 'Accessibility' }]} />
      <h1 className="mt-4 font-serif text-4xl font-semibold text-brand-ink">Accessibility statement</h1>
      <p className="mt-2 text-base text-brand-muted">Last reviewed: April 2026</p>
      <Prose className="mt-6">
        <h2>Our approach</h2>
        <p>
          We design {siteConfig.name} to be usable by as many people as possible, including people with visual, motor,
          cognitive, and auditory differences. We target <strong>WCAG 2.1 Level AA</strong> as a minimum standard.
        </p>

        <h2>What we do</h2>
        <ul>
          <li>Body text is at least 18 pixels, in a serif face chosen for reading comfort.</li>
          <li>All colours meet WCAG AA contrast ratios on the backgrounds we use them against.</li>
          <li>The site is fully keyboard navigable, with visible focus outlines.</li>
          <li>Every interactive element has a minimum tap target of 44×44 pixels.</li>
          <li>Images carry descriptive alternative text.</li>
          <li>We do not use hamburger menus, infinite scroll, or modal pop-ups that trap attention.</li>
          <li>The site is tested with screen readers (NVDA, VoiceOver).</li>
        </ul>

        <h2>Known limitations</h2>
        <p>
          Embedded third-party widgets (advertising, affiliate quote forms) are not always fully accessible, and we
          cannot always fix this at source. If a specific element blocks you, please let us know and we will either
          replace it, mark it optional, or provide an alternative.
        </p>

        <h2>Reporting issues</h2>
        <p>
          If something on the site does not work for you, please email{' '}
          <a href={`mailto:${siteConfig.owner.contactEmail}`}>{siteConfig.owner.contactEmail}</a>. We aim to respond
          within five working days.
        </p>
      </Prose>
    </Container>
  );
}
