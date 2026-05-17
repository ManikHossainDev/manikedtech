import React, { ReactNode } from 'react';

type TextTag = 'span' | 'p' | 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'label' | 'strong' | 'em';

interface TranslatableTextProps extends React.HTMLAttributes<HTMLElement> {
  children: ReactNode;
  tag?: TextTag;
}

/**
 * A wrapper component that ensures text content is translatable by Google Translate
 * and other translation services by adding the translate="yes" attribute
 */
const TranslatableText: React.FC<TranslatableTextProps> = ({
  children,
  className = '',
  tag: Tag = 'span',
  ...props
}) => {
  return (
    <Tag
      {...props}
      className={className}
      translate="yes"
    >
      {children}
    </Tag>
  );
};

export default TranslatableText;