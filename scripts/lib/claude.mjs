// Thin wrapper around the Anthropic SDK. Every generation script imports
// from here rather than instantiating the client directly, so that prompt
// caching and batch processing are applied consistently.

import Anthropic from '@anthropic-ai/sdk';
import 'dotenv/config';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Tiered model strategy per brief §5.1. Always start at Haiku; only escalate
// where the job genuinely needs it. YMYL finance content (equity release,
// pensions) is the only place Opus is justified.
export const MODELS = {
  haiku: 'claude-haiku-4-5',
  sonnet: 'claude-sonnet-4-6',
  opus: 'claude-opus-4-6',
};

export function modelForTask({ contentType, regulatoryDomain, stage }) {
  // SEO metadata, outlines, banned-word detection, internal link mapping
  if (['metadata', 'outline', 'keyword', 'filter'].includes(stage)) return MODELS.haiku;
  // YMYL finance content uses Opus for the main body, Sonnet for humanisation
  if (regulatoryDomain === 'finance' && contentType !== 'spoke' && stage === 'body') {
    return MODELS.opus;
  }
  // Article body and humanisation on everything else
  if (stage === 'humanise') return MODELS.haiku;
  return MODELS.sonnet;
}

/**
 * Build a cached-system + short-user message call. The system prompt is
 * passed as cache_control: ephemeral so that repeat calls in the same
 * batch hit the 10% cached input price per brief §5.2.
 */
export function cachedSystem(systemText) {
  return [{ type: 'text', text: systemText, cache_control: { type: 'ephemeral' } }];
}

/**
 * Submit an array of prompts as a batch. Returns the batch id.
 * Each request in `requests` is { custom_id, model, system, user, max_tokens }.
 * Batch pricing is 50% of standard, which stacks with prompt caching - brief §5.3.
 */
export async function submitBatch(requests) {
  const batch = await client.messages.batches.create({
    requests: requests.map((r) => ({
      custom_id: r.custom_id,
      params: {
        model: r.model,
        max_tokens: r.max_tokens,
        system: r.system,
        messages: [{ role: 'user', content: r.user }],
      },
    })),
  });
  return batch.id;
}

export async function pollBatch(batchId, { intervalMs = 30_000, timeoutMs = 6 * 60 * 60 * 1000 } = {}) {
  const start = Date.now();
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const b = await client.messages.batches.retrieve(batchId);
    if (b.processing_status === 'ended') return b;
    if (Date.now() - start > timeoutMs) throw new Error(`Batch ${batchId} timed out`);
    await new Promise((r) => setTimeout(r, intervalMs));
  }
}

export async function fetchBatchResults(batchId) {
  const results = [];
  for await (const r of await client.messages.batches.results(batchId)) {
    results.push(r);
  }
  return results;
}

/**
 * Convenience: for iterative / debugging use only. Not cheap - always use
 * submitBatch + pollBatch for production pipelines.
 */
export async function oneShot({ model, system, user, max_tokens = 3000 }) {
  const resp = await client.messages.create({
    model,
    max_tokens,
    system,
    messages: [{ role: 'user', content: user }],
  });
  return resp.content
    .filter((c) => c.type === 'text')
    .map((c) => c.text)
    .join('\n');
}

export { client };
