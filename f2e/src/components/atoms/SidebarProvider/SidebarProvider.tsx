import React from 'react';
import { cn } from '../../../lib/utils';
import { SidebarContext, type SidebarContextProps } from './useSidebar';

interface SidebarProviderProps {
  children: React.ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

export const SidebarProvider = React.forwardRef<HTMLDivElement, SidebarProviderProps>(
  ({ 
    children, 
    defaultOpen = true, 
    open: openProp, 
    onOpenChange: setOpenProp,
    className,
    ...props 
  }, ref) => {
    const [openMobile, setOpenMobile] = React.useState(false);
    const [_open, _setOpen] = React.useState(defaultOpen);
    const open = openProp ?? _open;
    
    const setOpen = React.useCallback(
      (value: boolean | ((value: boolean) => boolean)) => {
        const openState = typeof value === "function" ? value(open) : value;
        if (setOpenProp) {
          setOpenProp(openState);
        } else {
          _setOpen(openState);
        }
      },
      [setOpenProp, open]
    );

    const isMobile = React.useMemo(() => {
      if (typeof window === 'undefined') return false;
      return window.innerWidth < 768;
    }, []);

    const toggleSidebar = React.useCallback(() => {
      return isMobile ? setOpenMobile((open) => !open) : setOpen((open) => !open);
    }, [isMobile, setOpen, setOpenMobile]);

    const state: "expanded" | "collapsed" = open ? "expanded" : "collapsed";

    const contextValue = React.useMemo<SidebarContextProps>(
      () => ({
        state,
        open,
        setOpen,
        isMobile,
        openMobile,
        setOpenMobile,
        toggleSidebar,
      }),
      [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar]
    );

    return (
      <SidebarContext.Provider value={contextValue}>
        <div
          ref={ref}
          className={cn(
            "group/sidebar-wrapper flex min-h-screen w-full",
            className
          )}
          {...props}
        >
          {children}
        </div>
      </SidebarContext.Provider>
    );
  }
);

SidebarProvider.displayName = "SidebarProvider";