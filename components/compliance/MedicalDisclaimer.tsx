import { disclaimers } from '@/lib/compliance';
import Disclaimer from './Disclaimer';

export default function MedicalDisclaimer() {
  return (
    <Disclaimer title={disclaimers.medical.title} tone="regulatory" id="medical-disclaimer">
      <p>{disclaimers.medical.body}</p>
    </Disclaimer>
  );
}
