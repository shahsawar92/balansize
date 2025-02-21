import { LucideIcon } from "lucide-react";
import * as React from "react";
import { IconType } from "react-icons";
import { ImSpinner2 } from "react-icons/im";

import { cn } from "@/lib/utils";

const ButtonVariant = ["dark", "brown", "light", "transparent"] as const;
const ButtonSize = ["sm", "base", "large"] as const;

type ButtonProps = {
  isLoading?: boolean;
  isDarkBg?: boolean;
  variant?: (typeof ButtonVariant)[number];
  sizeOfButton?: (typeof ButtonSize)[number];
  leftIcon?: IconType | LucideIcon;
  rightIcon?: IconType | LucideIcon;
  classNames?: {
    leftIcon?: string;
    rightIcon?: string;
  };
} & React.ComponentPropsWithRef<"button">;

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      disabled: buttonDisabled,
      isLoading,
      variant = "primary",
      sizeOfButton = "base",
      isDarkBg = false,
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      classNames,
      ...rest
    },
    ref
  ) => {
    const disabled = isLoading || buttonDisabled;
    return (
      <button
        ref={ref}
        type='button'
        disabled={disabled}
        className={cn(
          "inline-flex items-center rounded font-medium",
          "focus-visible:ring-secondary-500 focus:outline-none focus-visible:ring",
          "shadow-sm",
          "transition-colors duration-75",
          [
            sizeOfButton === "large" && ["px-4 py-2", "text-base md:text-lg"],
            sizeOfButton === "base" && ["px-3 py-1.5", "text-sm md:text-base"],
            sizeOfButton === "sm" && ["px-2 py-1", "text-xs md:text-sm"],
          ],

          [
            variant === "brown" && [
              "bg-main-brown text-white",
              "border-main-brown border",
              "hover:bg-main-brownHover hover:text-white",
              "active:bg-main-brownHover",
              "disabled:bg-main-brownHover",
            ],
            variant === "transparent" && [
              "bg-transparent text-main-brown",
              "border-main-brown border",
              "hover:bg-main-brownHover hover:text-white",
              "active:bg-main-brownHover",
              "disabled:bg-main-brownHover",
            ],
            variant === "light" && [
              "bg-white text-gray-700",
              "border border-gray-300",
              "hover:text-dark hover:bg-gray-100",
              "active:bg-white/80 disabled:bg-gray-200",
            ],
            variant === "dark" && [
              "bg-gray-900 text-white",
              "border border-gray-600",
              "hover:bg-gray-800 active:bg-gray-700 disabled:bg-gray-700",
            ],
          ],
          //#endregion  //*======== Variants ===========
          "disabled:cursor-not-allowed",
          isLoading &&
            "relative text-transparent transition-none hover:text-transparent disabled:cursor-wait",
          className
        )}
        {...rest}>
        {isLoading && (
          <div
            className={cn(
              "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
              {
                "text-white": ["dark", "brown"].includes(variant),
                "text-black": ["light", "transparent"].includes(variant),
              }
            )}>
            <ImSpinner2 className='animate-spin ' />
          </div>
        )}
        {LeftIcon && (
          <div
            className={cn([
              sizeOfButton === "base" && "mr-1",
              sizeOfButton === "sm" && "mr-1.5",
            ])}>
            <LeftIcon
              size='1em'
              className={cn(
                [
                  sizeOfButton === "base" && "md:text-md text-md",
                  sizeOfButton === "sm" && "md:text-md text-sm",
                ],
                classNames?.leftIcon
              )}
            />
          </div>
        )}
        {children}
        {RightIcon && (
          <div
            className={cn([
              sizeOfButton === "base" && "ml-1",
              sizeOfButton === "sm" && "ml-1.5",
            ])}>
            <RightIcon
              size='1em'
              className={cn(
                [
                  sizeOfButton === "base" && "text-md md:text-md",
                  sizeOfButton === "sm" && "md:text-md text-sm",
                ],
                classNames?.rightIcon
              )}
            />
          </div>
        )}
      </button>
    );
  }
);

export default Button;
