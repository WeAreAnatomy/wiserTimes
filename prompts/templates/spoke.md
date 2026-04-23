# Template: spoke article

Produce a focused spoke article of approximately 1,500-2,200 words.

## Structure guidance
- Open with a direct answer in the first 100 words. The reader came from a specific search query - give them the answer, then expand.
- 4-7 H2 sections. Use question-based headings where the reader's query is a question.
- Use structured blocks when they add genuine value: `:::callout` for a practical tip or warning, `:::compare` if you're comparing products or options factually, `:::faq` for 3-6 follow-up questions at the end.
- Link internally to the pillar page for this vertical at least once.
- Reference real UK brands and figures where relevant.

## Required frontmatter
```
---
title: <H1, under 65 characters, ideally question-based>
description: <meta description, 140-160 characters, lead with the answer>
vertical: <one of the six>
contentType: spoke
intent: <informational | commercial | transactional>
regulatoryDomain: <finance | health | legal | general>
slug: <kebab-case URL slug>
author: <persona slug>
published: <ISO date>
lastReviewed: <ISO date>
keywords: [<primary>, <secondary>, ...]
faqs:
  - q: <question>
    a: <answer, 40-80 words>
affiliates: []  # populated later by the pipeline
---
```

## Hard rules
- No em dashes.
- No Oxford commas unless ambiguous.
- No groups of three by default.
- No "comprehensive" / "seamless" / other banned words (see base-persona.md).
- Never rank products by "suitability" or claim one is "the best".
