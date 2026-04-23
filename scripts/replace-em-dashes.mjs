// One-off cleanup: replace U+2014 em dashes in content/*.md with comma, colon,
// or other punctuation per the rule in prompts/banned-words.md.
//
// Heuristic:
//   - Heading lines (start with #): replace " - " with ": ".
//   - List item lines (start with -, *, or "  - q:" style) where the text
//     before the first em dash on that line contains no sentence punctuation
//     (.,:;!?) after the bullet: replace first " - " with ": ", remaining
//     occurrences with ", ".
//   - All other lines: replace " - " with ", ".
//
// Idempotent: re-running on a file with no em dashes leaves it untouched.

import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = new URL('../content/', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');

const EM = '\u2014';
const SPACED_EM = ` ${EM} `;

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) walk(full, out);
    else if (entry.endsWith('.md')) out.push(full);
  }
  return out;
}

function transformLine(line) {
  if (!line.includes(EM)) return line;

  const headingMatch = /^\s*#{1,6}\s+/.test(line);
  if (headingMatch) {
    return line.split(SPACED_EM).join(': ');
  }

  const bulletMatch = line.match(/^(\s*[-*]\s+(?:[a-z]:\s+)?)/i);
  if (bulletMatch) {
    const prefixLen = bulletMatch[0].length;
    const dashIdx = line.indexOf(SPACED_EM);
    if (dashIdx > prefixLen) {
      const labelPart = line.slice(prefixLen, dashIdx);
      if (!/[.,:;!?]/.test(labelPart)) {
        const before = line.slice(0, dashIdx);
        const after = line.slice(dashIdx + SPACED_EM.length);
        return `${before}: ${after.split(SPACED_EM).join(', ')}`;
      }
    }
  }

  return line.split(SPACED_EM).join(', ');
}

function transformFile(path) {
  const original = readFileSync(path, 'utf8');
  if (!original.includes(EM)) return { path, changed: false, count: 0 };

  const lines = original.split('\n');
  const out = lines.map(transformLine);
  let result = out.join('\n');

  if (result.includes(EM)) {
    result = result.split(EM).join(',');
  }

  if (result === original) return { path, changed: false, count: 0 };

  const count = (original.match(/\u2014/g) || []).length;
  writeFileSync(path, result, 'utf8');
  return { path, changed: true, count };
}

const files = walk(ROOT);
let total = 0;
for (const f of files) {
  const { changed, count } = transformFile(f);
  if (changed) {
    total += count;
    console.log(`  rewrote ${count.toString().padStart(3)}  ${f}`);
  }
}
console.log(`\nDone. Replaced ${total} em dashes across ${files.length} files.`);
