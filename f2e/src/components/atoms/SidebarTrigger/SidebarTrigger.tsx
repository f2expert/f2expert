import React from 'react';
import { Button } from '../../atoms/Button';
import { useSidebarRedux } from '../../../hooks/useSidebarRedux';
import { PanelLeft } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface SidebarTriggerProps extends React.ComponentProps<typeof Button> {
  className?: string;
}

export const SidebarTrigger = React.forwardRef<
  React.ElementRef<typeof Button>,
  SidebarTriggerProps
>(({ className, onClick, ...props }, ref) => {
  const { toggle } = useSidebarRedux();

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      className={cn("h-7 w-7", className)}
      onClick={(event) => {
        onClick?.(event);
        toggle();
      }}
      {...props}
    >
      <PanelLeft className="h-4 w-4" />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  );
});

SidebarTrigger.displayName = "SidebarTrigger";