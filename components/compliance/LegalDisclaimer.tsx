import { disclaimers } from '@/lib/compliance';
import Disclaimer from './Disclaimer';

export default function LegalDisclaimer() {
  return (
    <Disclaimer title={disclaimers.legal.title} tone="regulatory" id="legal-disclaimer">
      <p>{disclaimers.legal.body}</p>
    </Disclaimer>
  );
}
