# Template: how-to guide

Produce a step-by-step how-to of approximately 1,200-1,800 words.

## Structure guidance
- Open with one paragraph that explains who this is for and what they'll be able to do at the end.
- Numbered H2 steps (Step 1, Step 2, ...). Keep steps short, one core action each.
- Under each step, a short paragraph of context or why, then the specific thing to click, tap, or say.
- Include a `:::callout{type="warning"}` where a common mistake trips people up.
- End with a short `:::faq` covering 3-5 real follow-up questions.

## Required frontmatter
Must include `howTo` block for schema.org/HowTo:

```
howTo:
  totalTime: PT15M
  steps:
    - name: <step name>
      text: <one-sentence description>
```

Frontmatter otherwise matches spoke.md.

## Tone notes for how-to content
- Particularly for tech guides: assume the reader has never done this before, but do not be patronising.
- Where an option name varies by device (iPad vs iPhone, Android variants), name both briefly.
- Where a user might be nervous (installing an app, connecting a payment card), acknowledge the concern and reassure with specifics.
