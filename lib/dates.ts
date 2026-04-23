// Shared date formatting helpers. All visible article dates render in
// en-GB long form (e.g. "5 March 2026") so we keep the formatter in one
// place — every callsite (article header, listing cards, search results)
// must look identical.

export function formatPublishDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
