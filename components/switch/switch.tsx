import React from "react";
import { cn } from "@/lib/utils";

interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

const Switch: React.FC<SwitchProps> = ({
  checked,
  onCheckedChange,
  className,
  ...props
}) => {
  return (
    <label
      className={cn(
        "relative inline-flex items-center cursor-pointer",
        className
      )}>
      <input
        type='checkbox'
        checked={checked}
        onChange={(e) => onCheckedChange(e.target.checked)}
        className='sr-only'
        {...props}
      />
      <div
        className={cn(
          "w-11 h-6 bg-gray-200 rounded-full transition-colors",
          checked ? "bg-main-brown" : "bg-gray-200"
        )}
      />
      <span
        className={cn(
          "absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform",
          checked ? "transform translate-x-5" : "transform translate-x-0"
        )}
      />
    </label>
  );
};

export { Switch };
