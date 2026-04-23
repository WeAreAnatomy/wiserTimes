# CLAUDE.md — Wiser Times Engineering Rules

This file is the first thing you should read when working on this repository. Its purpose is to stop you from writing new code when existing code will do. **Every line you add is a liability.** Component reuse is not a "nice to have" here — it is the rule.

If you find yourself about to write a new component, a new utility, a new layout wrapper, or a new piece of MDX-adjacent plumbing, **stop** and work through the checklist below first.

---

## The Golden Rule

> **Compose, don't create.**
>
> Before writing anything new, prove you cannot solve the problem with an existing component, prop, or utility. The default answer is: reuse.

If after an honest search you still need something new, it must:

1. Live in `components/` (never inline), and
2. Be generic enough that the *next* article or page can also use it, and
3. Replace something — i.e. if you're adding a variant, first check if a prop on an existing component would serve the same purpose.

---

## Mandatory pre-code checklist

Before writing a single line of JSX, TSX, or a script helper, you must:

1. **Read `components/README.md`** — it is the canonical index of every component and its props.
2. **Grep the component tree**: `grep -r "ComponentNameIdea" components/` — check if something similar already exists under a different name.
3. **Read the closest existing template**: if you are building a pillar page, read `app/[category]/page.tsx`; if you are building a spoke, read `app/[category]/[slug]/page.tsx`. Do not fork them — extend.
4. **Check the block primitives**: `components/blocks/` contains `Callout`, `ComparisonTable`, `ProsCons`, `FAQ`, `ExpertQuote`, `CTAButton`, `LeadForm`, `AffiliateDisclosure`, `Disclaimer`. Ninety percent of what an article needs is already here.
5. **Check `lib/`**: every piece of content loading, SEO, and schema generation already has a utility. Do not re-implement `getArticleBySlug`, schema builders, or frontmatter parsing.

If all five checks come back empty, you may create a new component. Put it in the correct subdirectory (`layout/`, `content/`, `blocks/`, `seo/`, `compliance/`, `ads/`) and register it in `components/README.md` in the same commit.

---

## Component hierarchy

Components live in one of six folders. Each folder has a specific job. Do not invent new folders.

| Folder | Purpose | Examples |
|---|---|---|
| `components/layout/` | Structural chrome present on every page | `Header`, `Footer`, `Navigation`, `Breadcrumbs`, `Container` |
| `components/content/` | Article-shell primitives | `ArticleHeader`, `ArticleBody`, `TableOfContents`, `RelatedArticles`, `AuthorCard`, `LastUpdated`, `MarkdownRenderer` |
| `components/blocks/` | In-article content blocks an author/markdown can invoke | `Callout`, `ComparisonTable`, `ProsCons`, `FAQ`, `ExpertQuote`, `CTAButton`, `LeadForm`, `Stat` |
| `components/seo/` | Structured-data emitters | `ArticleSchema`, `FAQSchema`, `BreadcrumbSchema`, `HowToSchema`, `ProductSchema`, `OrganizationSchema` |
| `components/compliance/` | Regulatory and disclaimer blocks | `FCADisclaimer`, `MedicalDisclaimer`, `AffiliateDisclosure`, `CookieConsent` |
| `components/ads/` | Monetisation surfaces | `AdSlot`, `AffiliateLink` |

**Rules:**

- A component in `blocks/` must work in *any* article, regardless of vertical. If it is equity-release-specific, it's still a `blocks/` component with content passed via props.
- A component in `seo/` must emit structured data only — no visible UI.
- A component in `compliance/` must read its text from `lib/compliance.ts`, never inline the legal copy at the callsite.
- A component in `layout/` must be used by at least two page templates. If only one template uses it, move it inline — you don't need the abstraction.

---

## Page templates

Pages in `app/` are **thin**. They compose existing components; they do not implement layout themselves.

A typical spoke article page is roughly:

```tsx
<Container>
  <Breadcrumbs ... />
  <ArticleHeader ... />
  <TableOfContents ... />
  <AffiliateDisclosure />   {/* if article has affiliate links */}
  <MarkdownRenderer source={article.body} />
  <FCADisclaimer />          {/* if vertical === 'finance' */}
  <MedicalDisclaimer />      {/* if vertical === 'health' */}
  <RelatedArticles ... />
  <ArticleSchema ... />
  <FAQSchema ... />
  <BreadcrumbSchema ... />
</Container>
```

If your page has more than about 40 lines of JSX, you are probably inlining something that belongs in a component.

---

## Markdown + MDX rules

Articles are markdown with YAML frontmatter, rendered by `MarkdownRenderer`. Authors (including the Claude pipeline) invoke components through a small, fixed vocabulary of **block shortcodes** that `MarkdownRenderer` recognises:

```
:::callout{type="tip" title="Quick note"}
Body text here.
:::

:::compare
| Product | Price | Warranty |
|---|---|---|
| A | £500 | 2 years |
| B | £600 | 5 years |
:::

:::proscons
pros: Easy to install, Low monthly fee
cons: Limited customisation
:::

:::faq
q: How much does it cost?
a: Typically between £500 and £1,200.

q: Is it tax-deductible?
a: No — see HMRC guidance for current rules.
:::

:::quote{author="Sarah, IFA in Bristol"}
Most people I speak to are surprised at how much equity they have.
:::
```

**`:::faq` body format is enforced.** The parser (`parseFAQBody` in `MarkdownRenderer.tsx`) accepts `q:`/`a:` lines, bold-question lines (`**Question?**` followed by an answer paragraph), and `### Question?` heading-style. Anything else produces an empty FAQ block, which (a) won't render visibly and (b) creates a mismatch with the `FAQPage` JSON-LD that Google penalises. **Stick to `q:`/`a:` for new content.**

The page-level FAQ component (`<FAQ items={frontmatter.faqs} />`) is automatically suppressed when an inline `:::faq` block exists in the body, to avoid double-rendering. The FAQ schema is built from the union of both sources via `extractInlineFAQs(article.body)` so on-page and JSON-LD always match.

**Do not invent new shortcodes without adding a block component for them.** Do not render these with raw HTML in the markdown — always go through the shortcode so the component can evolve.

### Defensive markdown handling

`MarkdownRenderer` runs `sanitiseBody()` from `lib/markdown.ts` on every body before parsing. It strips a stray ```` ``` ```` on the first/last line and closes any unbalanced fences so a single artefact can never wrap an entire article in `<pre>`. **You should still fix the source markdown** — `pnpm validate` (run automatically as `prebuild`) refuses to ship articles with stray fences, unbalanced shortcodes, or empty `:::faq` blocks.

---

## Scripts and the content pipeline

All generation scripts live in `scripts/` and share helpers from `scripts/lib/`. Before writing a new script:

1. Check if `scripts/lib/claude.mjs` already has the API wrapper you need. It provides `batchCall`, `cachedSystem`, and model selection by tier.
2. Check if `scripts/lib/banned-words.mjs` already has the filter you want. Extend the list; do not clone the filter.
3. Check if `scripts/lib/markdown.mjs` already reads or writes the frontmatter field.

Scripts must be idempotent. A script that rewrites a file must not rewrite it unchanged.

---

## Prompt library

Prompt templates live in `prompts/`. They are concatenated by `scripts/lib/prompts.mjs` in this order: `base-persona.md` + `personas/<name>.md` + `templates/<content-type>.md` + `banned-words.md`. The whole concatenation is sent as the cached system prompt.

**Do not inline prompt fragments in scripts.** If you need a new editorial voice, add a persona file. If you need a new article shape, add a template file.

---

## Styling

Tailwind only. No CSS modules, no styled-components, no inline `style={{...}}` except for dynamic values that cannot be expressed in utility classes.

Design tokens that recur (base font size, brand colours, max-width) live in `tailwind.config.ts`. Reach for a token before hard-coding a value.

Accessibility minimums (non-negotiable):

- Base body text: 18px minimum (`text-lg` or larger).
- Minimum contrast: WCAG AA. Brand teal on white passes; do not use lighter tints for body text.
- Interactive elements: 44×44px tap targets, visible focus ring.
- No hamburger menus on mobile — the navigation fits.

---

## URLs and links

- The production domain is `wisertimes.com`. The canonical URL is set once in `lib/config.ts` and in the `NEXT_PUBLIC_SITE_URL` env var.
- **All internal references in code, components, content, and templates must use relative paths** (`/equity-release/`, `/go/stannah-starla`), never absolute URLs (`https://wisertimes.com/equity-release/`).
- The only places the full domain should appear are: `lib/config.ts` (the `url` field), `.env.example` / `.env.local`, `public/llms.txt`, structured-data builders in `lib/seo.ts` (which read from `siteConfig.url`), and `<meta>` / Open Graph tags that require an absolute URL.
- If you find an absolute self-referencing URL anywhere else, replace it with a relative path.

---

## TypeScript

- `strict: true`. No `any` unless there is a written comment explaining why.
- Frontmatter shape lives in `lib/types.ts` as `ArticleFrontmatter`. Add fields there before you add them to a markdown file.
- Props types live with the component, named `XxxProps` and exported.

---

## What "done" looks like

A change is done when:

1. `pnpm typecheck` passes.
2. `pnpm validate` passes (structural markdown checks — runs automatically before `pnpm build`).
3. `pnpm build` passes.
4. No new component was created that could have been a prop on an existing one.
5. `components/README.md` reflects any additions.
6. If the change touches content generation, a sample run produces output that passes both `pnpm validate` and `pnpm compliance`.

---

## Things you will be tempted to do. Don't.

- **"I'll just add a one-off `<div className="flex items-center gap-4">` wrapper here."** — That's `Container` or a `Row` prop on an existing component. Find it.
- **"This callout is slightly different, I'll make `CalloutV2`."** — Add a `variant` prop to `Callout`.
- **"I need to render markdown here too, I'll import `remark` again."** — Use `MarkdownRenderer`. It handles the shortcodes.
- **"I'll put the FCA disclaimer text directly in this page."** — Use `<FCADisclaimer />`. The text lives in `lib/compliance.ts` for a reason: it is updated quarterly.
- **"I'll make a new ad position `top-sidebar-alt`."** — `AdSlot` takes a `position` prop. Add the position to the enum in `components/ads/AdSlot.tsx`, don't clone the component.
- **"This script needs to call Claude, I'll set up the client here."** — `scripts/lib/claude.mjs` already sets up the client with batch + caching. Import it.

---

## The test for every new file

Ask yourself, honestly: *"If we deleted this file, would anything actually break, or could the caller have used something already in the repo?"*

If the honest answer is "they could have used X," then delete the file and use X.
