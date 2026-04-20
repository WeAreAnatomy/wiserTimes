import Link from 'next/link';
import { siteConfig } from '@/lib/config';
import Container from './Container';
import Navigation from './Navigation';

const policyLinks = [
  { href: '/privacy/', label: 'Privacy policy' },
  { href: '/cookies/', label: 'Cookie policy' },
  { href: '/terms/', label: 'Terms & conditions' },
  { href: '/accessibility/', label: 'Accessibility' },
  { href: '/editorial-standards/', label: 'Editorial standards' },
];

export default function Footer() {
  return (
    <footer className="mt-20 bg-brand-ink text-brand-cream">
      <Container width="wide" className="py-10">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="font-serif text-2xl">{siteConfig.name}</p>
            <p className="mt-2 max-w-prose text-brand-cream/80">{siteConfig.description}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold">Browse guides</h2>
            <div className="mt-3">
              <Navigation variant="footer" />
            </div>
          </div>
          <div>
            <h2 className="text-lg font-semibold">About this site</h2>
            <ul className="mt-3 flex flex-col gap-1">
              {policyLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="inline-flex items-center min-h-tap py-1 text-brand-cream/90 hover:text-white hover:underline"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-brand-cream/20 pt-6 text-sm text-brand-cream/70">
          <p>
            © {new Date().getFullYear()} {siteConfig.owner.legalName}.{siteConfig.owner.address && ` ${siteConfig.owner.address}.`}
          </p>
          <p className="mt-2 max-w-prose">
            {siteConfig.name} provides information only and does not provide financial, medical, or legal advice.
            Always consult a qualified professional before making decisions that affect your finances, health, or
            legal arrangements.
          </p>
        </div>
      </Container>
    </footer>
  );
}
