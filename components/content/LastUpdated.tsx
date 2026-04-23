import { formatPublishDate } from '@/lib/dates';

export interface LastUpdatedProps {
  published: string; // ISO
  lastReviewed: string; // ISO
  readingTimeMinutes?: number;
}

/**
 * Publication + review metadata. AI answer engines weight "last updated"
 * heavily (brief §3.2), so every article shows both dates prominently.
 */
export default function LastUpdated({
  published,
  lastReviewed,
  readingTimeMinutes,
}: LastUpdatedProps) {
  const showReview = lastReviewed && lastReviewed !== published;
  return (
    <p className="text-base text-brand-muted">
      <span>
        Published <time dateTime={published}>{formatPublishDate(published)}</time>
      </span>
      {showReview && (
        <>
          {' · '}
          <span>
            Last reviewed <time dateTime={lastReviewed}>{formatPublishDate(lastReviewed)}</time>
          </span>
        </>
      )}
      {readingTimeMinutes && (
        <>
          {' · '}
          <span>{readingTimeMinutes} min read</span>
        </>
      )}
    </p>
  );
}
