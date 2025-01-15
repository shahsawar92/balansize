import React from "react";

import { cn } from "@/lib/utils";

type SeparatorProps = {
  orientation?: "horizontal" | "vertical"; // Orientation of the separator
  color?: "primary" | "secondary" | "muted"; // Color variants
  thickness?: "thin" | "medium" | "thick"; // Thickness variants
  className?: string; // Additional Tailwind classes
  margin?: string; // Margin customization (e.g., "my-4" or "mx-2")
};

const Separator: React.FC<SeparatorProps> = ({
  orientation = "horizontal",
  color = "muted",
  thickness = "thin",
  className,
  margin = "my-2",
}) => {
  const baseClasses = "bg-gray-300"; // Default color
  const orientationClasses =
    orientation === "horizontal" ? "w-full h-[1px]" : "h-full w-[1px]";
  const colorClasses = {
    primary: "bg-blue-500",
    secondary: "bg-green-500",
    muted: "bg-gray-300",
  };
  const thicknessClasses = {
    thin: orientation === "horizontal" ? "h-[1px]" : "w-[1px]",
    medium: orientation === "horizontal" ? "h-[2px]" : "w-[2px]",
    thick: orientation === "horizontal" ? "h-[4px]" : "w-[4px]",
  };

  return (
    <div
      className={cn(
        baseClasses,
        orientationClasses,
        colorClasses[color],
        thicknessClasses[thickness],
        margin,
        className
      )}
    />
  );
};

export default Separator;
