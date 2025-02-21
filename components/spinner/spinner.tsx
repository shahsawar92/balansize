"use client";

import React from "react";

import { cn } from "@/lib/utils";

const SpinnerVariant = ["dark", "brown", "light", "transparent"] as const;
const SpinnerSize = ["sm", "md", "lg"] as const;

type SpinnerProps = {
  variant?: (typeof SpinnerVariant)[number];
  size?: (typeof SpinnerSize)[number];
  speed?: "slow" | "normal" | "fast";
  classNames?: {
    container?: string;
    spinner?: string;
  };
};

const Spinner: React.FC<SpinnerProps> = ({
  variant = "light",
  size = "md",
  speed = "normal",
  classNames,
}) => {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-6 h-6 border-3",
    lg: "w-10 h-10 border-4",
  };

  const speedClasses = {
    slow: "animate-spin-slow",
    normal: "animate-spin",
    fast: "animate-spin-fast",
  };

  return (
    <div
      className={cn("flex justify-center items-center", classNames?.container)}>
      <div
        className={cn(
          "rounded-full border border-t-transparent",
          sizeClasses[size],
          speedClasses[speed],
          [
            variant === "brown" && "border-main-brown",
            variant === "transparent" && "border-gray-300",
            variant === "light" && "border-secondary-500",
            variant === "dark" && "border-gray-900",
          ],
          classNames?.spinner
        )}
      />
    </div>
  );
};

export default Spinner;
