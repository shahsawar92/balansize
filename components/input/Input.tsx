import { LucideIcon } from 'lucide-react';
import * as React from 'react';
import { IconType } from 'react-icons';
import { HiEye, HiEyeOff } from 'react-icons/hi';

import { cn } from '@/lib/utils';

const InputVariant = ['dark', 'brown', 'light', 'transparent'] as const;
const sizeOfInput = ['sm', 'base', 'large'] as const;
type InputProps = {
  isInvalid?: boolean;
  errorMessage?: string;
  isPassword?: boolean;
  variant?: (typeof InputVariant)[number];
  sizeOfInput?: (typeof sizeOfInput)[number];
  leftIcon?: IconType | LucideIcon;
  withBorder?: boolean;
  classNames?: {
    container?: string;
    input?: string;
    leftIcon?: string;
    rightIcon?: string;
    errorMessage?: string;
  };
} & React.ComponentPropsWithRef<'input'>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      isInvalid,
      errorMessage,
      isPassword = false,
      variant = 'light',
      sizeOfInput = 'base',
      withBorder = true,
      leftIcon: LeftIcon,
      classNames,
      ...rest
    },
    ref
  ) => {
    const [isVisible, setIsVisible] = React.useState(false);

    return (
      <div className={cn('flex flex-col', classNames?.container)}>
        <div className="relative flex items-center">
          {LeftIcon && (
            <div className={cn('absolute left-3', classNames?.leftIcon)}>
              <LeftIcon className="text-gray-500" />
            </div>
          )}
          <input
            ref={ref}
            type={isPassword && !isVisible ? 'password' : 'text'}
            className={cn(
              'block w-full rounded-full font-medium focus:outline-none focus:ring-2',
              'transition-all duration-75',
              [
                sizeOfInput === 'large' && ['px-4 py-2 text-base'],
                sizeOfInput === 'base' && ['px-3 py-1.5 text-sm'],
                sizeOfInput === 'sm' && ['px-2 py-1 text-xs'],
              ],
              [
                variant === 'brown' && [
                  'bg-main-brown text-white',
                  'border border-main-brown',
                  'placeholder:text-white',
                  'focus:ring-main-brownHover',
                ],
                variant === 'transparent' && [
                  'bg-transparent text-main-brown',
                  'border border-main-brown',
                  'placeholder:text-main-brown',
                  'focus:ring-main-brownHover',
                ],
                variant === 'light' && [
                  'bg-white text-dark',
                  withBorder && 'border border-secondary-500',
                  'placeholder:text-gray-500', 
                  'focus:ring-secondary-500',
                ],
                variant === 'dark' && [
                  'bg-gray-900 text-white',
                  'border border-gray-600',
                  'placeholder:text-gray-400',
                  'focus:ring-gray-700',
                ],
              ],
              LeftIcon && 'pl-10',
              isPassword && 'pr-10',
              isInvalid && 'border-red-500',
              className,
              classNames?.input
            )}
            {...rest}
          />
          {isPassword && (
            <div
              className="absolute right-3 cursor-pointer text-gray-500"
              onClick={() => setIsVisible(!isVisible)}
            >
              {isVisible ? <HiEyeOff /> : <HiEye />}
            </div>
          )}
        </div>
        {isInvalid && errorMessage && (
          <p
            className={cn(
              'mt-1 ml-4 text-xs text-red-500',
              classNames?.errorMessage
            )}
          >
            {errorMessage}
          </p>
        )}
      </div>
    );
  }
);

export default Input;
