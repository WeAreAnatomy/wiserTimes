// Single authoritative source for banned-word and pattern enforcement.
// Mirrored from lib/compliance.ts + prompts/banned-words.md. Any change
// to the list must be made here AND in lib/compliance.ts to keep the
// runtime compliance badge, the content pipeline, and the site UI in sync.

export const aiSignalBanned = [
  'delve',
  'landscape',
  "it's important to note",
  "in today's world",
  "whether you're a beginner or expert",
  "let's dive in",
  'navigating',
  'leverage',
  'comprehensive',
  'crucial',
  'streamline',
  'game-changer',
  'unlock',
  'empower',
  'robust',
  'seamless',
  "let's explore",
  "let's take a closer look",
  'without further ado',
  'so, what exactly is',
  "now that we've covered",
];

export const financialAdviceBanned = [
  'we recommend',
  'we advise',
  'you should invest',
  'the best option is',
  'guaranteed returns',
  'risk-free',
];

export const EM_DASH = /\u2014/;

/** Returns array of violation objects { term, index, line }. */
export function scan(text, { regulatoryDomain } = {}) {
  const violations = [];
  const lowered = text.toLowerCase();

  for (const term of aiSignalBanned) {
    const idx = lowered.indexOf(term);
    if (idx >= 0) violations.push({ term, index: idx, line: lineAt(text, idx) });
  }

  if (regulatoryDomain === 'finance') {
    for (const term of financialAdviceBanned) {
      const idx = lowered.indexOf(term);
      if (idx >= 0) violations.push({ term, index: idx, line: lineAt(text, idx), severity: 'hard' });
    }
  }

  const dashMatch = EM_DASH.exec(text);
  if (dashMatch) {
    violations.push({ term: 'em-dash', index: dashMatch.index, line: lineAt(text, dashMatch.index), severity: 'hard' });
  }

  return violations;
}

function lineAt(text, index) {
  return text.slice(0, index).split('\n').length;
}
