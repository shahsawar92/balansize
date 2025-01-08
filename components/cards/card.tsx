import * as React from "react";

import { cn } from "@/lib/utils";

import Text from "../text/Text";

type CardProps = React.ComponentPropsWithoutRef<"div"> & {
  className?: string;
  children: React.ReactNode;
};

type CardTitleProps = React.ComponentPropsWithoutRef<"h2"> & {
  className?: string;
  children: React.ReactNode;
};

type CardContentProps = React.ComponentPropsWithoutRef<"div"> & {
  className?: string;
  children: React.ReactNode;
};

const Card: React.FC<CardProps> = ({ children, className, ...rest }) => {
  return (
    <div
      className={cn(
        "rounded-lg shadow-md bg-white p-4 border border-gray-200",
        className
      )}
      {...rest}>
      {children}
    </div>
  );
};

const CardHeader: React.FC<CardProps> = ({ children, className, ...rest }) => {
  return (
    <div
      className={cn("mb-4 border-b border-gray-300 pb-2", className)}
      {...rest}>
      {children}
    </div>
  );
};

const CardTitle: React.FC<CardTitleProps> = ({
  children,
  className,
  ...rest
}) => {
  return (
    <Text
      tagName='h2'
      size='2xl'
      weight='bold'
      variant='main'
      classNames={cn("mb-2", className)}
      {...rest}>
      {children}
    </Text>
  );
};

const CardContent: React.FC<CardContentProps> = ({
  children,
  className,
  ...rest
}) => {
  return (
    <div className={cn("text-gray-700", className)} {...rest}>
      {children}
    </div>
  );
};

export { Card, CardContent, CardHeader, CardTitle };
