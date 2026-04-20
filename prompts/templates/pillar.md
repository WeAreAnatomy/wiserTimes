# Template: pillar page

Produce a pillar page of approximately 2,500-3,500 words.

## Structure guidance
- Open with a direct answer to the core question in the first 100 words. No preamble.
- Use 6-10 H2 sections with question-based headings that mirror real queries.
- Mix prose and structured blocks. Use `:::compare` for factual feature comparisons. Use `:::proscons` sparingly, only where a fair-minded summary is genuinely useful. Use `:::faq` for a short FAQ at the end (4-8 items).
- Include at least one editorial `:::quote` with an illustrative commentary framed as editorial opinion (never presented as a real testimonial).
- Cite at least three authoritative UK sources inline with a link.

## Required frontmatter
```
---
title: <H1, under 65 characters>
description: <meta description, 140-160 characters, lead with the answer>
vertical: <one of: equity-release | mobility-aids | funeral-planning | tech-guides | benefits | wills-poa>
contentType: pillar
intent: informational
regulatoryDomain: <finance | health | legal | general>
slug: <kebab-case URL slug>
author: <david | margaret | priya | editorial>
published: <ISO date>
lastReviewed: <ISO date>
keywords: [<primary>, <secondary>, ...]
faqs:
  - q: <question>
    a: <answer, 40-80 words>
---
```

## What not to do
- Do not include a disclaimer block in the article body. The template injects the correct one automatically.
- Do not use em dashes. Not even once.
- Do not default to lists of three.
- Do not say "comprehensive", "seamless", "leverage", "navigate" etc — see base-persona.md for the full ban.
