import * as React from 'react';

import { cn } from '@/lib/utils';

const TextVariant = ['main', 'secondary/beige', 'secondary', 'light'] as const;
const TextSize = ['5xl','4xl', '3xl', '2xl', 'base', 'lg', 'sm', 'xs'] as const;
const TextWeight = ['normal', 'bold', 'semibold', 'light'] as const;
const TextTagName = ['p', 'span', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const;

type TextProps = {
  variant?: (typeof TextVariant)[number];
  size?: (typeof TextSize)[number];
  weight?: (typeof TextWeight)[number];
  isCenterAligned?: boolean;
  isUppercase?: boolean;
  isItalic?: boolean;
  tagName?: (typeof TextTagName)[number];
  classNames?: string;
  ref ?: React.Ref<HTMLElement>;
} & React.ComponentPropsWithRef<'p'>;

const Text = React.forwardRef<HTMLElement, TextProps>(
  (
    {
      children,
      variant = 'light',
      size = 'base',
      weight = 'normal',
      isCenterAligned = false,
      isUppercase = false,
      isItalic = false,
      tagName: Tag = 'p',
      classNames,
      ...rest
    },
    ref: React.Ref<HTMLElement>
  ) => {
    return (
      <Tag
        ref={ref as React.Ref<any>}
        className={cn(
          'transition-all duration-75', 
          [
            size === '5xl' && 'text-3xl md:text-4xl lg:text-5xl',
            size === '4xl' && 'text-3xl md:text-2xl lg:text-4xl',
            size === '3xl' && 'text-2xl md:text-xl lg:text-3xl',
            size === '2xl' && 'text-xl md:text-lg lg:text-2xl',
            size === 'base' && 'text-base md:text-sm lg:text-xs',
            size === 'lg' && 'text-base md:text-lg',
            size === 'sm' && 'text-xs md:text-sm',
            size === 'xs' && 'text-xs',
          ],
          [
            weight === 'bold' && 'font-bold',
            weight === 'semibold' && 'font-semibold',
            weight === 'light' && 'font-light',
            weight === 'normal' && 'font-normal',
          ],
          [
            variant === 'main' && 'text-text-main',
            variant === 'secondary' && 'text-text-2',
            variant === 'secondary/beige' && 'text-secondary-500',
            variant === 'light' && 'text-light',
          ],
          isCenterAligned && 'text-center',
          isUppercase && 'uppercase',
          isItalic && 'italic',
          classNames
        )}
        {...rest}
      >
        {children}
      </Tag>
    );
  }
);

export default Text;
