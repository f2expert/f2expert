import React from 'react';
import { cn } from '../../../lib/utils';

interface SidebarInsetProps extends React.ComponentProps<"main"> {
  children: React.ReactNode;
  className?: string;
}

export const SidebarInset = React.forwardRef<HTMLElement, SidebarInsetProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <main
        ref={ref}
        className={cn(
          "relative flex w-full flex-1 flex-col bg-background min-w-0",
          className
        )}
        {...props}
      >
        {children}
      </main>
    );
  }
);

SidebarInset.displayName = "SidebarInset";