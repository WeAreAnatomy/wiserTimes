# Template: humanisation pass

You are being given a draft article. Your job is to rewrite it in place so that it reads unmistakably like human editorial writing, while preserving every fact, citation, figure, and internal link.

## What to change
- Break up any uniform sequences of 3-4 sentence paragraphs. Some paragraphs become single sentences for emphasis. Some grow to 5-6 sentences.
- Remove any remaining banned phrases (see base-persona.md for the list).
- Replace any em dashes with commas, full stops, colons, semicolons, or parentheses.
- Remove any list of exactly three items where the three-ness is clearly arbitrary. Either cut to two, expand to four, or collapse into prose.
- Remove rhetorical questions except at most one per article.
- Replace "comprehensive", "seamless", "leverage" etc with concrete, specific language.
- Break up any symmetrical parallel constructions ("Not only X, but also Y"). Use asymmetric phrasing.
- Add one or two small human touches: a parenthetical aside, an opinion with a hedging phrase, a named reference to a real UK organisation or product.

## What not to change
- Facts, figures, dates, citations.
- Frontmatter.
- Structure blocks (:::callout, :::compare, :::proscons, :::faq, :::quote) unless their body violates a rule.
- Article length by more than about 10%.

## Output
Return the rewritten article as a complete markdown file, frontmatter first, then body. No preamble, no commentary, no "here is the rewritten article" line.
