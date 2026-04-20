import type { ReactNode } from 'react';

export type CalloutType = 'tip' | 'warning' | 'info' | 'important';

export interface CalloutProps {
  type?: CalloutType;
  title?: string;
  children: ReactNode;
}

const styles: Record<CalloutType, { bg: string; border: string; label: string; icon: string }> = {
  tip: {
    bg: 'bg-ok/5',
    border: 'border-ok',
    label: 'Tip',
    icon: '💡',
  },
  warning: {
    bg: 'bg-warn/5',
    border: 'border-warn',
    label: 'Warning',
    icon: '⚠️',
  },
  info: {
    bg: 'bg-brand-teal/5',
    border: 'border-brand-teal',
    label: 'Note',
    icon: 'ℹ️',
  },
  important: {
    bg: 'bg-brand-sand',
    border: 'border-brand-ink',
    label: 'Important',
    icon: '★',
  },
};

/**
 * Generic callout. If you find yourself wanting a new callout variant,
 * add it to the CalloutType union — do not create a second component.
 */
export default function Callout({ type = 'info', title, children }: CalloutProps) {
  const s = styles[type];
  return (
    <aside
      className={`my-6 rounded-lg border-l-4 ${s.border} ${s.bg} px-5 py-4`}
      role="note"
      aria-label={title ?? s.label}
    >
      <p className="mb-1 flex items-center gap-2 font-sans text-base font-semibold text-brand-ink">
        <span aria-hidden="true">{s.icon}</span>
        {title ?? s.label}
      </p>
      <div className="text-lg text-brand-ink">{children}</div>
    </aside>
  );
}
