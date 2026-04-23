import type { Vertical } from '@/lib/types';

export type IllustrationTopic = Vertical | 'home';

export interface TopicIllustrationProps {
  topic: IllustrationTopic;
  /** Visual size context. `card` = compact strip; `hero` = full-bleed banner. */
  variant?: 'card' | 'hero';
  /** Decorative illustrations get aria-hidden; pass a label to make them informative. */
  label?: string;
  className?: string;
}

/**
 * Editorial SVG illustrations used as topic imagery across the site.
 * One component, many topics - add a new SVG here rather than creating
 * a sibling component (see CLAUDE.md "compose, don't create").
 *
 * Visual language: warm, geometric, dignified. Each topic uses the
 * brand sand/cream surface plus a single accent colour matching the
 * topic's UI accent on the home page.
 */
export default function TopicIllustration({
  topic,
  variant = 'card',
  label,
  className = '',
}: TopicIllustrationProps) {
  const Svg = svgs[topic];
  const heightClass = variant === 'hero' ? 'h-48 sm:h-64' : 'h-32 sm:h-36';
  const a11y = label
    ? { role: 'img' as const, 'aria-label': label }
    : { 'aria-hidden': true };

  return (
    <div
      {...a11y}
      className={`relative w-full overflow-hidden ${heightClass} ${className}`}
    >
      <Svg />
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// SVG illustrations
// Each is rendered into a 400×200 viewBox so they crop gracefully into both
// card strips and hero banners. Colours pull from the Tailwind brand palette
// hexes declared in tailwind.config.ts.
// ──────────────────────────────────────────────────────────────────────────

type SvgComponent = () => JSX.Element;

const SAND = '#F5EFE3';
const CREAM = '#FAF7F0';
const INK = '#0B2838';
const DEEP = '#123A53';
const TEAL = '#0F766E';
const MUTED = '#4A5A66';

const accents: Record<IllustrationTopic, string> = {
  home: TEAL,
  'equity-release': '#047857', // emerald-700
  'mobility-aids': '#0369A1',  // sky-700
  'funeral-planning': '#6D28D9', // violet-700
  'tech-guides': '#B45309',     // amber-700
  benefits: '#BE123C',          // rose-700
  'wills-poa': '#4338CA',       // indigo-700
};

function Frame({ children, topic }: { children: React.ReactNode; topic: IllustrationTopic }) {
  return (
    <svg
      viewBox="0 0 400 200"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={`sky-${topic}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={CREAM} />
          <stop offset="100%" stopColor={SAND} />
        </linearGradient>
      </defs>
      <rect width="400" height="200" fill={`url(#sky-${topic})`} />
      {children}
    </svg>
  );
}

const HomeSvg: SvgComponent = () => {
  const accent = accents.home;
  return (
    <Frame topic="home">
      {/* Soft rolling hills + rising sun: "later chapter, brighter outlook" */}
      <circle cx="280" cy="110" r="42" fill={accent} opacity="0.18" />
      <circle cx="280" cy="110" r="28" fill={accent} opacity="0.45" />
      <path d="M0 160 Q 100 120 200 145 T 400 130 L 400 200 L 0 200 Z" fill={DEEP} opacity="0.85" />
      <path d="M0 175 Q 120 145 240 170 T 400 160 L 400 200 L 0 200 Z" fill={INK} />
      {/* small stylised birds */}
      <path d="M70 70 q 6 -6 12 0 q 6 -6 12 0" stroke={MUTED} strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M110 55 q 5 -5 10 0 q 5 -5 10 0" stroke={MUTED} strokeWidth="2" fill="none" strokeLinecap="round" />
    </Frame>
  );
};

const EquityReleaseSvg: SvgComponent = () => {
  const accent = accents['equity-release'];
  return (
    <Frame topic="equity-release">
      {/* Roof + house body */}
      <path d="M150 110 L 220 60 L 290 110 Z" fill={accent} opacity="0.9" />
      <rect x="160" y="110" width="120" height="65" fill={CREAM} stroke={DEEP} strokeWidth="2" />
      {/* Door */}
      <rect x="210" y="135" width="22" height="40" fill={accent} />
      <circle cx="227" cy="156" r="1.5" fill={CREAM} />
      {/* Windows */}
      <rect x="172" y="125" width="22" height="22" fill={SAND} stroke={DEEP} strokeWidth="1.5" />
      <rect x="246" y="125" width="22" height="22" fill={SAND} stroke={DEEP} strokeWidth="1.5" />
      {/* Subtle growth bars (equity rising) */}
      <rect x="60" y="150" width="14" height="25" rx="2" fill={accent} opacity="0.55" />
      <rect x="80" y="135" width="14" height="40" rx="2" fill={accent} opacity="0.7" />
      <rect x="100" y="115" width="14" height="60" rx="2" fill={accent} opacity="0.9" />
      {/* Ground line */}
      <line x1="0" y1="175" x2="400" y2="175" stroke={DEEP} strokeWidth="1.5" />
    </Frame>
  );
};

const MobilityAidsSvg: SvgComponent = () => {
  const accent = accents['mobility-aids'];
  return (
    <Frame topic="mobility-aids">
      {/* Stairs */}
      <path d="M40 175 L 40 145 L 100 145 L 100 115 L 160 115 L 160 85 L 220 85 L 220 175 Z" fill={CREAM} stroke={DEEP} strokeWidth="2" strokeLinejoin="round" />
      {/* Stairlift rail */}
      <path d="M50 160 L 110 130 L 170 100 L 220 75" stroke={accent} strokeWidth="4" fill="none" strokeLinecap="round" />
      {/* Stairlift seat */}
      <rect x="148" y="92" width="32" height="20" rx="3" fill={accent} />
      <rect x="152" y="78" width="24" height="16" rx="2" fill={accent} opacity="0.8" />
      {/* Grab rail (right side) */}
      <line x1="290" y1="80" x2="290" y2="170" stroke={accent} strokeWidth="5" strokeLinecap="round" />
      <circle cx="290" cy="80" r="5" fill={accent} />
      <circle cx="290" cy="170" r="5" fill={accent} />
      {/* Floor */}
      <line x1="0" y1="175" x2="400" y2="175" stroke={DEEP} strokeWidth="1.5" />
    </Frame>
  );
};

const FuneralPlanningSvg: SvgComponent = () => {
  const accent = accents['funeral-planning'];
  return (
    <Frame topic="funeral-planning">
      {/* Quiet candle, soft halo */}
      <circle cx="200" cy="95" r="60" fill={accent} opacity="0.10" />
      <circle cx="200" cy="95" r="36" fill={accent} opacity="0.18" />
      {/* Candle */}
      <rect x="190" y="100" width="20" height="55" rx="2" fill={CREAM} stroke={DEEP} strokeWidth="1.5" />
      {/* Wick */}
      <line x1="200" y1="100" x2="200" y2="92" stroke={INK} strokeWidth="1.5" />
      {/* Flame */}
      <path d="M200 90 q -6 -8 0 -18 q 6 10 0 18 Z" fill={accent} />
      <path d="M200 88 q -3 -5 0 -10 q 3 5 0 10 Z" fill={CREAM} opacity="0.8" />
      {/* Holder base */}
      <ellipse cx="200" cy="158" rx="22" ry="4" fill={DEEP} opacity="0.5" />
      {/* Quiet leaves either side */}
      <path d="M120 150 q 30 -10 50 0" stroke={accent} strokeWidth="2" fill="none" opacity="0.6" />
      <path d="M230 150 q 30 -10 50 0" stroke={accent} strokeWidth="2" fill="none" opacity="0.6" />
      <line x1="0" y1="175" x2="400" y2="175" stroke={DEEP} strokeWidth="1.5" />
    </Frame>
  );
};

const TechGuidesSvg: SvgComponent = () => {
  const accent = accents['tech-guides'];
  return (
    <Frame topic="tech-guides">
      {/* Tablet */}
      <rect x="120" y="55" width="160" height="110" rx="10" fill={DEEP} />
      <rect x="128" y="63" width="144" height="94" rx="4" fill={CREAM} />
      {/* Video call avatar */}
      <circle cx="200" cy="100" r="20" fill={accent} opacity="0.85" />
      <circle cx="200" cy="93" r="7" fill={CREAM} />
      <path d="M186 115 q 14 -12 28 0" stroke={CREAM} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* Call controls */}
      <circle cx="180" cy="142" r="6" fill={accent} />
      <circle cx="200" cy="142" r="6" fill={INK} opacity="0.4" />
      <circle cx="220" cy="142" r="6" fill="#BE123C" />
      {/* Tablet stand shadow */}
      <ellipse cx="200" cy="175" rx="80" ry="4" fill={DEEP} opacity="0.25" />
      {/* Wifi arcs */}
      <path d="M310 70 q 18 -18 36 0" stroke={accent} strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.7" />
      <path d="M316 80 q 12 -12 24 0" stroke={accent} strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.5" />
      <circle cx="328" cy="92" r="2.5" fill={accent} />
    </Frame>
  );
};

const BenefitsSvg: SvgComponent = () => {
  const accent = accents.benefits;
  return (
    <Frame topic="benefits">
      {/* Document */}
      <rect x="140" y="55" width="120" height="115" rx="4" fill={CREAM} stroke={DEEP} strokeWidth="2" />
      <line x1="155" y1="80" x2="245" y2="80" stroke={DEEP} strokeWidth="2" strokeLinecap="round" />
      <line x1="155" y1="95" x2="240" y2="95" stroke={MUTED} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="155" y1="108" x2="245" y2="108" stroke={MUTED} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="155" y1="121" x2="220" y2="121" stroke={MUTED} strokeWidth="1.5" strokeLinecap="round" />
      {/* Heart stamp */}
      <circle cx="215" cy="148" r="14" fill={accent} opacity="0.15" />
      <path
        d="M215 156 c -6 -4 -12 -8 -12 -14 a 5 5 0 0 1 10 -2 a 5 5 0 0 1 10 2 c 0 6 -6 10 -12 14 Z"
        fill={accent}
      />
      {/* Supporting hands beneath */}
      <path d="M90 170 q 30 -25 70 -10" stroke={accent} strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M310 170 q -30 -25 -70 -10" stroke={accent} strokeWidth="3" fill="none" strokeLinecap="round" />
      <line x1="0" y1="175" x2="400" y2="175" stroke={DEEP} strokeWidth="1.5" />
    </Frame>
  );
};

const WillsPoaSvg: SvgComponent = () => {
  const accent = accents['wills-poa'];
  return (
    <Frame topic="wills-poa">
      {/* Scroll */}
      <path
        d="M120 70 q 0 -10 12 -10 h 130 q 12 0 12 10 v 80 q 0 10 -12 10 h -130 q -12 0 -12 -10 z"
        fill={CREAM}
        stroke={DEEP}
        strokeWidth="2"
      />
      {/* Lines of "text" */}
      <line x1="138" y1="85" x2="252" y2="85" stroke={DEEP} strokeWidth="2" strokeLinecap="round" />
      <line x1="138" y1="100" x2="240" y2="100" stroke={MUTED} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="138" y1="113" x2="252" y2="113" stroke={MUTED} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="138" y1="126" x2="220" y2="126" stroke={MUTED} strokeWidth="1.5" strokeLinecap="round" />
      {/* Wax seal */}
      <circle cx="248" cy="148" r="12" fill={accent} />
      <circle cx="248" cy="148" r="6" fill={accent} stroke={CREAM} strokeWidth="1.5" />
      {/* Quill */}
      <path d="M295 65 L 335 145" stroke={DEEP} strokeWidth="2.5" strokeLinecap="round" />
      <path
        d="M295 65 q -12 25 0 40 q 12 -10 18 -28 q -8 -2 -18 -12 Z"
        fill={accent}
        opacity="0.85"
      />
      <line x1="0" y1="175" x2="400" y2="175" stroke={DEEP} strokeWidth="1.5" />
    </Frame>
  );
};

const svgs: Record<IllustrationTopic, SvgComponent> = {
  home: HomeSvg,
  'equity-release': EquityReleaseSvg,
  'mobility-aids': MobilityAidsSvg,
  'funeral-planning': FuneralPlanningSvg,
  'tech-guides': TechGuidesSvg,
  benefits: BenefitsSvg,
  'wills-poa': WillsPoaSvg,
};
