"use client";

import { Check, ChevronDown } from "lucide-react";
import React, { useState } from "react";

import { cn } from "@/lib/utils"; // Replace with your utility function if needed

const SelectVariant = ["dark", "brown", "light", "transparent"] as const;
const SelectSize = ["sm", "base", "large"] as const;

type SelectProps = {
  options: { value: string; label: string }[]; // Dropdown options
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  variant?: (typeof SelectVariant)[number];
  size?: (typeof SelectSize)[number];
  withBorder?: boolean;
  error?: string;
  label?: string;
  classNames?: {
    container?: string;
    trigger?: string;
    dropdown?: string;
    option?: string;
    selected?: string;
    label?: string;
    error?: string;
  };
};

const CustomSelect: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  variant = "light",
  size = "base",
  withBorder = true,
  error,
  label,
  classNames,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen((prev) => !prev);
  const handleOptionClick = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className={cn("flex flex-col gap-1.5", classNames?.container)}>
      {label && (
        <label
          className={cn(
            "text-sm font-medium text-gray-700",
            classNames?.label
          )}>
          {label}
        </label>
      )}
      <div className='relative'>
        <button
          onClick={toggleDropdown}
          className={cn(
            
            "flex items-center justify-between rounded font-medium focus:outline-none focus:ring-2 transition-all duration-75 ",
            [
              size === "large" && "px-4 py-2",
              "text-base md:text-lg",
              size === "base" && "px-3 py-1.5 text-sm",
              size === "sm" && "px-2 py-1 text-xs",
            ],
            [
              variant === "brown" && [
                "bg-main-brown text-white",
                "border border-main-brown",
                "placeholder:text-white",
                "focus:ring-main-brownHover",
              ],
              variant === "transparent" && [
                "bg-transparent text-main-brown",
                "border border-main-brown",
                "placeholder:text-main-brown",
                "focus:ring-main-brownHover",
              ],
              variant === "light" && [
                "bg-white text-dark",
                withBorder && "border border-secondary-500",
                "placeholder:text-gray-500",
                "focus:ring-secondary-500",
              ],
              variant === "dark" && [
                "bg-gray-900 text-white",
                "border border-gray-600",
                "placeholder:text-gray-400",
                "focus:ring-gray-700",
              ],
            ],
            withBorder && "border",
            error && "border-red-500",
            classNames?.trigger
          )}>
          <span
            className={cn(
              "text-sm",
              value ? "text-dark" : "text-gray-500",
              classNames?.selected
            )}>
            {options.find((opt) => opt.value === value)?.label || placeholder}
          </span>
          <ChevronDown className='h-4 w-4 opacity-50' />
        </button>
        {isOpen && (
          <div
            className={cn(
              "absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg border border-gray-200",
              classNames?.dropdown
            )}>
            {options.map((option) => (
              <div
                key={option.value}
                onClick={() => handleOptionClick(option.value)}
                className={cn(
                  "flex items-center px-3 py-2 text-sm cursor-pointer hover:bg-gray-100",
                  option.value === value && "bg-gray-100",
                  classNames?.option
                )}>
                {option.value === value && (
                  <Check className='h-4 w-4 mr-2 text-blue-500' />
                )}
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>
      {error && (
        <p className={cn("text-xs text-red-500", classNames?.error)}>{error}</p>
      )}
    </div>
  );
};

export default CustomSelect;
