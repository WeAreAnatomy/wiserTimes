// Composes the cached system prompt from the prompt library.
// Order matters - the stable portion must come first so the cache hits.

import fs from 'node:fs';
import path from 'node:path';

const PROMPTS_ROOT = path.join(process.cwd(), 'prompts');

function read(rel) {
  return fs.readFileSync(path.join(PROMPTS_ROOT, rel), 'utf8').trim();
}

export function composeSystemPrompt({ persona = 'editorial', template }) {
  const parts = [read('base-persona.md'), read('banned-words.md')];
  const personaPath = `personas/${persona}.md`;
  if (fs.existsSync(path.join(PROMPTS_ROOT, personaPath))) parts.push(read(personaPath));
  if (template) parts.push(read(`templates/${template}.md`));
  return parts.join('\n\n---\n\n');
}
