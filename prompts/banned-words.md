# Banned words and patterns (hard enforcement)

This list is enforced by `scripts/compliance-check.mjs` and by the in-line banned-words filter in `scripts/lib/banned-words.mjs`. Any article containing any of the following is flagged and sent back to the humanisation pass.

## Hard-banned phrases (case-insensitive substring match)
- delve
- landscape
- it's important to note
- in today's world
- whether you're a beginner or expert
- let's dive in
- navigating
- leverage
- comprehensive
- crucial
- streamline
- game-changer
- unlock (verb)
- empower
- robust
- seamless
- let's explore
- let's take a closer look
- without further ado
- so, what exactly is
- now that we've covered

## Hard-banned characters
- U+2014 em dash (-) - use comma, full stop, colon, semicolon, or parenthesis instead.

## Context-sensitive bans (financial content only)
- we recommend
- we advise
- you should invest
- the best option is
- guaranteed returns
- risk-free

## Pattern rules
- No two consecutive paragraphs starting with the same word or phrase pattern.
- No list of exactly three items where the three-ness is arbitrary.
- No rhetorical question as the opening line of an article or section.
- Maximum one rhetorical question per article.
- Oxford commas only where omission creates genuine ambiguity.
