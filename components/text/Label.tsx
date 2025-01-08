import { LabelHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  htmlFor?: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}

export default function Label({
  htmlFor,
  required = false,
  className,
  children,
  ...props
}: LabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn(
        "block text-sm font-medium text-dark mb-1",
        required && 'after:content-["*"] after:ml-0.5 after:text-red-500',
        className
      )}
      {...props}>
      {children}
    </label>
  );
}
