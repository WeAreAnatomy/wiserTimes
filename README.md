# Wiser Times

> Clear, practical guidance for later life.

An AI-automated content platform for the UK 55+ audience, covering equity release, mobility aids, funeral planning, benefits, wills & LPA, and simple tech guides. Built on Next.js 14 (App Router) with a static export and a Claude-powered content pipeline.

This repo contains **the whole site** - the Next.js app, the content itself (markdown in `content/`), and the scripts that generate, humanise, metadata-enrich, and audit that content.

---

## Quick start

```bash
git clone …
cd wisertimes
npm install
cp .env.example .env.local    # fill in the keys you need
npm run dev                   # http://localhost:3000
```

Requires **Node 20+**.

---

## What's in the box

```
app/                    Next.js App Router pages, layouts, sitemap, robots.
components/             React components. See components/README.md before adding anything.
  layout/               Header, footer, nav, breadcrumbs, Container, Prose, SkipLink.
  content/              ArticleHeader, AuthorCard, TableOfContents, MarkdownRenderer, …
  blocks/               Callout, ComparisonTable, ProsCons, FAQ, ExpertQuote, Stat, CTAButton, LeadForm.
  seo/                  JSON-LD wrappers - Article, FAQ, Breadcrumb, HowTo, Product, Organization.
  compliance/           FCA/Medical/Legal/Affiliate/CookieConsent - copy lives in lib/compliance.ts.
  ads/                  AdSlot (the ONE ad surface) and AffiliateLink.
lib/                    Types, site config, authors, markdown & shortcode parser, SEO schema builders.
content/                Published articles, one folder per vertical, one markdown file per URL.
prompts/                System-prompt fragments assembled by scripts/lib/prompts.mjs.
  base-persona.md       Voice rules - British English, em dash ban, banned phrases, tone.
  banned-words.md       The enforceable word/phrase list.
  personas/             margaret · david · priya · (editorial is implicit).
  templates/            pillar · spoke · how-to · humanise · metadata.
scripts/                Node scripts for the content pipeline. See "Pipeline" below.
  lib/                  Shared helpers - Claude SDK wrapper, prompt composer, markdown IO, banned-words scanner.
data/                   topics.csv - the input to scripts/generate.mjs.
reports/                Auto-generated weekly revenue + compliance reports (committed).
public/                 Static assets (favicon, images, robots-ignored files).
```

---

## The content pipeline

Every script reads from `content/` and writes back to `content/`. They are designed to be run by cron or a GitHub Action with no dashboard - the committed markdown *is* the database.

| Command | What it does |
|---|---|
| `npm run generate` | Reads `data/topics.csv`, batches the rows through the Anthropic Messages Batch API with the appropriate template + persona, writes markdown into `content/<vertical>/<slug>.md`. |
| `npm run humanise` | Second-pass rewrite against `prompts/templates/humanise.md`. `--flagged` reruns anything that currently trips the banned-words scanner. Pass `<vertical>/<slug>` pairs to humanise specific files. |
| `npm run metadata` | Regenerates title / description / keywords / FAQs for articles missing them. `--all` rewrites everything (for a SERP-wide refresh). |
| `npm run compliance` | Scans every article for banned phrases, em dashes, missing frontmatter, financial/medical/legal disclaimers, and stale `lastReviewed`. Writes `reports/compliance-YYYY-MM-DD.md` and exits `2` on hard violations. |
| `npm run report` | Weekly pull from Search Console, Analytics, AdSense, Awin, and Amazon. Writes `reports/weekly-YYYY-MM-DD.md` and flags underperforming pages. |
| `npm run refresh` | Flags articles older than 90 days. Stamps `lastReviewed` by default; with `--rewrite` it prints the `humanise` command for the stale set. |

The pipeline uses three Claude tiers. Haiku handles the bulk (generation, humanisation, metadata). Sonnet is reserved for the hardest pillars. Opus is kept out of the automation path. Prompt caching (`cache_control: ephemeral`) is applied to the system prompt on every batch so the expensive shared context is charged once per five-minute window.

Set `ANTHROPIC_API_KEY` in `.env.local` before running any generation step.

---

## Site configuration

`lib/config.ts` defines the six verticals, the site owner, and the tagline. `lib/authors.ts` defines the editorial personae (margaret, david, priya, editorial). `lib/types.ts` is the single source of truth for every frontmatter field - **add fields there before writing them into markdown.**

Two files set the rules: [`CLAUDE.md`](./CLAUDE.md) at the root, and [`components/README.md`](./components/README.md). Read them both before writing code.

---

## Compliance baseline

The brief sets out four regulatory dimensions and the code makes each one hard to forget:

- **FCA** (finance verticals) - `<FCADisclaimer>` renders text from `lib/compliance.ts::disclaimers.fca`. The `compliance-check` script fails the build if the disclaimer is missing on a finance article.
- **ASA / CAP** - Affiliate pages must include `<AffiliateDisclosure>` above the fold. `<ExpertQuote>` is framed as editorial, not testimonial.
- **UK GDPR** - `<CookieConsent>` stores a first-party `wl-consent` cookie. `<AdSlot>` listens for the `wl-consent` event and renders nothing without consent.
- **WCAG 2.1 AA** - 18 px base font, 44 px minimum tap targets, visible focus states, skip link, keyboard nav, colour contrast enforced via Tailwind theme.

The banned-words list in `prompts/banned-words.md` and `scripts/lib/banned-words.mjs` enforces the em-dash ban, the AI-signal phrase ban, the Oxford-comma restriction, and the financial-advice-phrase ban.

---

## Content conventions

Articles are markdown with YAML frontmatter. The shortcode grammar (parsed by `lib/markdown.ts` and rendered by `components/content/MarkdownRenderer.tsx`) is:

```
:::callout{type="info|tip|warning|note" title="..."}
Body.
:::

:::compare{title="..."}
| Header | Header |
|---|---|
| Row    | Row    |
:::

:::proscons{title="..."}
pros:
- item
- item
cons:
- item
:::

:::quote{author="..." role="..."}
The quoted text.
:::

:::faq
- q: Question
  a: Answer
:::
```

`faqs` in frontmatter is preferred over the inline `:::faq` shortcode so the JSON-LD schema has a canonical source.

---

## Scripts are the dashboard

There is no admin UI. `reports/` is the dashboard. If you want to know what the site is doing this week, read the latest `weekly-*.md` and `compliance-*.md`.

---

## Licence and ownership

© Wiser Times
