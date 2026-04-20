import type { ReactNode } from 'react';
import { Lightbulb, AlertTriangle, Info, Star } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type CalloutType = 'tip' | 'warning' | 'info' | 'important';

export interface CalloutProps {
  type?: CalloutType;
  title?: string;
  children: ReactNode;
}

const styles: Record<
  CalloutType,
  { bg: string; border: string; iconBg: string; iconColor: string; label: string; Icon: LucideIcon }
> = {
  tip: {
    bg: 'bg-ok/5',
    border: 'border-ok',
    iconBg: 'bg-ok/10',
    iconColor: 'text-ok',
    label: 'Tip',
    Icon: Lightbulb,
  },
  warning: {
    bg: 'bg-warn/5',
    border: 'border-warn',
    iconBg: 'bg-warn/10',
    iconColor: 'text-warn',
    label: 'Warning',
    Icon: AlertTriangle,
  },
  info: {
    bg: 'bg-brand-teal/5',
    border: 'border-brand-teal',
    iconBg: 'bg-brand-teal/10',
    iconColor: 'text-brand-teal',
    label: 'Note',
    Icon: Info,
  },
  important: {
    bg: 'bg-brand-sand',
    border: 'border-brand-ink',
    iconBg: 'bg-brand-ink/10',
    iconColor: 'text-brand-ink',
    label: 'Important',
    Icon: Star,
  },
};

/**
 * Generic callout. If you find yourself wanting a new callout variant,
 * add it to the CalloutType union — do not create a second component.
 */
export default function Callout({ type = 'info', title, children }: CalloutProps) {
  const s = styles[type] ?? styles.info;
  const { Icon } = s;
  return (
    <aside
      className={`my-6 rounded-lg border-l-4 ${s.border} ${s.bg} px-5 py-4`}
      role="note"
      aria-label={title ?? s.label}
    >
      <p className="mb-2 flex items-center gap-2.5 font-sans text-base font-semibold text-brand-ink">
        <span aria-hidden="true" className={`flex h-6 w-6 flex-none items-center justify-center rounded-full ${s.iconBg}`}>
          <Icon size={14} className={s.iconColor} strokeWidth={2.5} />
        </span>
        {title ?? s.label}
      </p>
      <div className="text-lg text-brand-ink">{children}</div>
    </aside>
  );
}
