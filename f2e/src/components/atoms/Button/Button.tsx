import React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../../lib/utils';

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-lg text-base font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-blue-600 text-white hover:bg-blue-700",
        secondary: "bg-transparent border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white",
        outline: "border border-gray-300 bg-transparent hover:bg-gray-50",
        ghost: "hover:bg-gray-100",
        destructive: "bg-red-600 text-white hover:bg-red-700",
      },
      size: {
        sm: "h-8 px-3 text-sm",
        default: "h-10 px-5 py-2.5",
        lg: "h-12 px-8 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

type ButtonOwnProps<T extends React.ElementType = React.ElementType> = {
  as?: T;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'default' | 'lg' | 'icon';
};

type ButtonProps<T extends React.ElementType> = ButtonOwnProps<T> &
  Omit<React.ComponentProps<T>, keyof ButtonOwnProps>;

export const Button = <T extends React.ElementType = 'button'>({
  as,
  className,
  variant,
  size,
  ...props
}: ButtonProps<T>) => {
  const Component = as || 'button';
  
  return (
    <Component
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
};

export default Button;