import type { ReactNode } from 'react';

export type ContainerWidth = 'prose' | 'content' | 'wide';

export interface ContainerProps {
  children: ReactNode;
  width?: ContainerWidth;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
}

const widthClass: Record<ContainerWidth, string> = {
  prose: 'max-w-prose',
  content: 'max-w-content',
  wide: 'max-w-wide',
};

/**
 * The ONLY horizontal-layout wrapper in the site. Every page body goes
 * through Container - do not write `<div className="max-w-... mx-auto px-...">`
 * inline anywhere.
 */
export default function Container({
  children,
  width = 'content',
  as: Tag = 'div',
  className = '',
}: ContainerProps) {
  const Element = Tag as keyof JSX.IntrinsicElements;
  return (
    <Element className={`mx-auto w-full px-5 sm:px-6 ${widthClass[width]} ${className}`}>
      {children}
    </Element>
  );
}
