import { disclaimers } from '@/lib/compliance';
import Disclaimer from './Disclaimer';

export interface FCADisclaimerProps {
  /** If true, append the equity-release-specific addendum. */
  equityRelease?: boolean;
}

export default function FCADisclaimer({ equityRelease }: FCADisclaimerProps) {
  return (
    <Disclaimer title={disclaimers.fca.title} tone="regulatory" id="fca-disclaimer">
      <p>{disclaimers.fca.body}</p>
      {equityRelease && (
        <p className="mt-3">
          <strong>{disclaimers.equityRelease.title}.</strong> {disclaimers.equityRelease.body}
        </p>
      )}
    </Disclaimer>
  );
}
