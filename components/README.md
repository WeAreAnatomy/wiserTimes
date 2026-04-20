# Components — canonical index

This file is referenced by `CLAUDE.md`. Before you write any new component, scan this list. If something here does the job — or nearly does it — use it, or extend it through its props. Adding a new component should be a last resort.

Every component is a default export. Props are listed in the order the source file declares them.

---

## layout/

UI chrome that wraps content. These are the only place the site's structural styling lives. Do not re-declare container widths, breadcrumb markup, or typography at a page level.

### `Container.tsx`
Wraps a max-width column around children. Three widths available via the `width` prop.
- `children: ReactNode`
- `width?: 'prose' | 'content' | 'wide'` — default `'content'`
- `as?: keyof JSX.IntrinsicElements` — render as a different tag
- `className?: string`

### `Prose.tsx`
Applies the site's reading typography (18 px base, brand heading font, brand link colours) to arbitrary children. Use for every rendered block of HTML/markdown — policy pages, article bodies, anything with running text. We do **not** use `@tailwindcss/typography`.
- `children: ReactNode`
- `className?: string`

### `Header.tsx`
Site header. No props. Composes `<Container>` + `<Navigation variant="header">`.

### `Footer.tsx`
Site footer. No props. Composes `<Container>` + `<Navigation variant="footer">` + legal links.

### `Navigation.tsx`
The same navigation list rendered in header or footer styling.
- `variant?: 'header' | 'footer'` — default `'header'`

### `Breadcrumbs.tsx`
Visible breadcrumb trail. Pair with `<BreadcrumbSchema />` for JSON-LD. Do not hand-roll breadcrumb markup on pages.
- `crumbs: BreadcrumbCrumb[]` — `{ label, href? }`; missing href = current page.

### `SkipLink.tsx`
WCAG skip-to-content link. Rendered once in the root layout. No props.

---

## content/

Article page composition. The spoke/pillar page templates compose these — they should never re-implement the parts.

### `ArticleHeader.tsx`
Header block shown at the top of every article. Internally composes `<LastUpdated>` + inline `<AuthorCard variant="inline">`. Do not rebuild this trio.
- `article: Article`

### `LastUpdated.tsx`
Published / last-reviewed / reading-time line. GB date format is handled here.
- `published: string` (ISO)
- `lastReviewed: string` (ISO)
- `readingTimeMinutes?: number`

### `AuthorCard.tsx`
Author attribution for E-E-A-T signals. Resolves the slug against `lib/authors.ts` — do not pass raw names.
- `authorSlug: string`
- `variant?: 'inline' | 'full'` — default `'full'`

### `TableOfContents.tsx`
Builds a TOC from H2 headings in the raw markdown body.
- `body: string`
- `minHeadings?: number` — default `3`; TOC is hidden below this threshold.

### `MarkdownRenderer.tsx`
The orchestrator for article bodies. Extracts `:::shortcode` blocks, renders the rest of the markdown to HTML via `lib/markdown.ts`, and interleaves `Callout`, `ComparisonTable`, `ProsCons`, `FAQ`, and `ExpertQuote` components into the stream. Wrap the output in `<Prose>` — the renderer does that for you.
- `source: string`

### `RelatedArticles.tsx`
Grid of related article cards at the foot of a page.
- `articles: Article[]`
- `title?: string` — default `'Related guides'`

---

## blocks/

Re-usable content blocks that appear inside article bodies. Every one of these is addressable via a `:::shortcode` in markdown — see `lib/markdown.ts` for the grammar. If you think you need a new block, check whether one of these can be used (or extended with a new `type`/`variant`) first.

### `Callout.tsx`
Shortcode: `:::callout{type="info|tip|warning|note" title="..."}` … `:::`
- `type?: 'info' | 'tip' | 'warning' | 'note'` — default `'info'`
- `title?: string`
- `children: ReactNode`

### `ComparisonTable.tsx`
Shortcode: `:::compare{title="..."}` with a GFM pipe table inside.
- `caption?: string`
- `headers: string[]`
- `rows: string[][]`
- `factualNote?: boolean` — ASA/CAP factual-tone banner.

### `ProsCons.tsx`
Shortcode: `:::proscons{title="..."}` with `pros:` / `cons:` YAML-style lists inside.
- `pros: string[]`
- `cons: string[]`
- `title?: string`

### `FAQ.tsx`
Visible FAQ block. The page-level `<FAQSchema>` emits the paired JSON-LD. Pass the same `items` to both.
- `items: FAQItem[]` — `{ q, a }`
- `title?: string` — default `'Frequently asked questions'`

### `ExpertQuote.tsx`
Shortcode: `:::quote{author="..." role="..."}` … `:::`. Framed as editorial, not testimonial (ASA/CAP §10.3).
- `author?: string`
- `role?: string`
- `children: ReactNode`

### `Stat.tsx`
Big-number stat with source attribution. Use whenever you cite a figure.
- `value: string`
- `label: string`
- `source?: string`
- `sourceUrl?: string`

### `TopicIllustration.tsx`
Editorial inline-SVG topic imagery. One component, many topics — add a new SVG inside this file rather than creating a sibling. Used as the home-page hero, on each topic card on the home page, and as the banner on each `/[vertical]/` landing page. Fully owned (no external requests, no licensing risk), brand-palette-matched, scales to any size.
- `topic: Vertical | 'home'`
- `variant?: 'card' | 'hero'` — default `'card'`; `hero` is taller for banners.
- `label?: string` — when set, the SVG is exposed to assistive tech with this label; otherwise it is `aria-hidden`.
- `className?: string`

### `CTAButton.tsx`
The one button component. Discriminated union — either a link or a form submit.
- Link mode: `href: string`, `external?: boolean`, `sponsored?: boolean`, plus common props.
- Submit mode: `submit: true`, `form?: string`, plus common props.
- Common: `children`, `variant?: 'primary' | 'secondary' | 'ghost'`, `size?`, `ariaLabel?`, `className?`.
- `sponsored` applies `rel="sponsored nofollow noopener"` — use it for affiliates.

### `LeadForm.tsx`
Partner lead-generation form. Uses `<CTAButton submit>` as its submit — do not wire up a raw `<button type="submit">` elsewhere.
- `title, intro, submitLabel?, action, partnerName, fields?, utmCampaign?`
- `fields?: LeadFormField[]` — sensible default set is provided.

---

## seo/

JSON-LD schema emitters. Each is a thin wrapper around `<JsonLd>`. Never write your own `<script type="application/ld+json">` on a page.

### `JsonLd.tsx`
The primitive. All other schema components delegate here.
- `data: Record<string, unknown> | null` — `null` renders nothing.

### `ArticleSchema.tsx`
Emits `schema.org/Article`.
- `article: Article`

### `FAQSchema.tsx`
Emits `schema.org/FAQPage`. Pair with the visible `<FAQ>`.
- `{ frontmatter: ArticleFrontmatter }` (uses `frontmatter.faqs`).

### `BreadcrumbSchema.tsx`
Emits `schema.org/BreadcrumbList`. Pair with the visible `<Breadcrumbs>`.
- `items: BreadcrumbItem[]`

### `HowToSchema.tsx`
Emits `schema.org/HowTo`. Driven by `frontmatter.howTo` — returns null if absent.
- `{ frontmatter: ArticleFrontmatter }`

### `ProductSchema.tsx`
Emits `schema.org/Product`. Driven by `frontmatter.product` — returns null if absent.
- `{ frontmatter: ArticleFrontmatter }`

### `OrganizationSchema.tsx`
Emits `schema.org/Organization` for the site owner. Rendered once in the root layout. No props.

---

## compliance/

Regulatory UI. The actual copy lives in `lib/compliance.ts` — these components only render it. Do not inline FCA/medical/legal copy on a page.

### `Disclaimer.tsx`
Generic disclaimer wrapper. Compose specific disclaimers from this; don't reach for a raw `<section>`.
- `title: string`
- `children: ReactNode`
- `tone?: 'neutral' | 'warning' | 'regulatory'`
- `id?: string`

### `FCADisclaimer.tsx`
FCA regulated-information disclaimer. Required on every finance-vertical article.
- `equityRelease?: boolean` — appends the equity-release-specific addendum.

### `MedicalDisclaimer.tsx`
"Not medical advice" disclaimer for the `mobility-aids` vertical. No props.

### `LegalDisclaimer.tsx`
"Not legal advice" disclaimer for the `wills-poa` vertical. No props.

### `AffiliateDisclosure.tsx`
"This page may include affiliate links" banner. Required above the fold on any article with affiliates. No props.

### `CookieConsent.tsx`
Client-side consent banner. Writes the `wl-consent` first-party cookie and dispatches the `wl-consent` event that `<AdSlot>` listens for. Rendered once in the root layout. No props.

---

## ads/

Ad and affiliate surfaces. There is ONE ad component. Do not write a second.

### `AdSlot.tsx`
The single ad rendering surface. Respects `wl-consent`; renders nothing without consent.
- `position: AdPosition`
- `slotId?: string` — AdSense slot; omitted = dev placeholder.
- `height?: number` — default `280`.

### `AffiliateLink.tsx`
Inline affiliate link. Applies `rel="sponsored nofollow noopener"` and appends a small "Ad" marker. Does **not** replace the top-of-page `<AffiliateDisclosure>`.
- `affiliate: AffiliateReference`
- `children: ReactNode`
- `as?: 'text' | 'cta'` — default `'text'`.

---

## Where things do not live

If you cannot find what you need above, pause before creating anything. Most of the time, one of the following is the correct answer instead of a new component:

- **A new variant of an existing block.** Add to the `type` / `variant` / `tone` union rather than a sibling file.
- **Shared copy.** Goes in `lib/compliance.ts`, `lib/config.ts`, or `lib/authors.ts` — never hard-coded in a component.
- **A new schema.org type.** Add a thin wrapper in `seo/` that delegates to `<JsonLd>`.
- **A markdown shortcode.** Add the grammar in `lib/markdown.ts` and wire it through `MarkdownRenderer`.

If after all that you really do need a new component, update this file **in the same commit** that adds it.
