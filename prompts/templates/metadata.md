# Template: SEO metadata pass

You are being given a finished article. Return a JSON object with these fields, nothing else:

```
{
  "title": "<meta <title>, under 60 characters, front-loaded with the primary keyword>",
  "description": "<meta description, 140-160 characters, leads with the answer>",
  "keywords": ["<primary>", "<secondary>", "<tertiary>"],
  "faqs": [{"q": "...", "a": "<40-80 word answer>"}, ...],
  "suggestedInternalLinks": ["<slug>", "<slug>"]
}
```

## Rules
- FAQ answers must be 40-80 words each, written in the article's voice.
- Keywords must be the natural-language phrases a user would actually type, not awkward exact-match spam.
- Do not repeat the H1 verbatim in the title; rephrase for the SERP context if needed.
- No em dashes. No banned words (see base-persona.md).
