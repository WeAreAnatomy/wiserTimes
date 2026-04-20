import CTAButton from './CTAButton';

export interface LeadFormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'postcode';
  required?: boolean;
  autocomplete?: string;
}

export interface LeadFormProps {
  title: string;
  intro: string;
  submitLabel?: string;
  action: string; // form POST endpoint or partner webhook URL
  partnerName: string; // e.g. "Key Equity Release"
  fields?: LeadFormField[];
  utmCampaign?: string;
}

const defaultFields: LeadFormField[] = [
  { name: 'name', label: 'Your name', type: 'text', required: true, autocomplete: 'name' },
  { name: 'email', label: 'Email address', type: 'email', required: true, autocomplete: 'email' },
  { name: 'phone', label: 'Phone number', type: 'tel', autocomplete: 'tel' },
  { name: 'postcode', label: 'Postcode', type: 'postcode', autocomplete: 'postal-code' },
];

/**
 * Accessible lead-gen form used in high-value verticals (equity release,
 * stairlifts, funeral plans). Includes mandatory consent checkbox per
 * §10.4 of the brief. Actual submission handling is out of scope here —
 * the form POSTs to the provided action URL.
 */
export default function LeadForm({
  title,
  intro,
  submitLabel = 'Request information',
  action,
  partnerName,
  fields = defaultFields,
  utmCampaign,
}: LeadFormProps) {
  return (
    <section className="my-10 rounded-lg border border-brand-teal bg-brand-cream p-5 sm:p-7">
      <h3 className="font-sans text-xl font-semibold text-brand-ink sm:text-2xl">{title}</h3>
      <p className="mt-2 text-lg text-brand-ink">{intro}</p>
      <form action={action} method="POST" className="mt-5 grid gap-4">
        {utmCampaign && <input type="hidden" name="utm_campaign" value={utmCampaign} />}
        <input type="hidden" name="utm_source" value="wiserliving" />
        <input type="hidden" name="partner" value={partnerName} />

        {fields.map((f) => (
          <div key={f.name} className="flex flex-col gap-1">
            <label htmlFor={`lf-${f.name}`} className="font-sans text-base font-semibold text-brand-ink">
              {f.label}
              {f.required && <span className="ml-1 text-warn">*</span>}
            </label>
            <input
              id={`lf-${f.name}`}
              name={f.name}
              type={f.type === 'postcode' ? 'text' : f.type}
              required={f.required}
              autoComplete={f.autocomplete}
              className="min-h-tap rounded-md border border-brand-border bg-white px-3 py-2 text-lg text-brand-ink focus:border-brand-teal focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal"
            />
          </div>
        ))}

        <label className="flex gap-3 text-base text-brand-ink">
          <input
            type="checkbox"
            name="consent"
            required
            className="mt-1 h-5 w-5 flex-none"
          />
          <span>
            I agree that WiserLiving may pass my details to <strong>{partnerName}</strong> so they can
            contact me about this enquiry. I can withdraw consent at any time. See our{' '}
            <a href="/privacy/" className="text-brand-teal underline">
              privacy policy
            </a>
            .
          </span>
        </label>

        <div className="mt-2">
          <CTAButton submit size="lg">
            {submitLabel}
          </CTAButton>
        </div>
      </form>
    </section>
  );
}
