import * as React from "react"
import { cn } from "../../../lib/utils"

const SidebarGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("space-y-2", className)}
    {...props}
  />
))
SidebarGroup.displayName = "SidebarGroup"

const SidebarMenu = React.forwardRef<
  HTMLUListElement,
  React.HTMLAttributes<HTMLUListElement>
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn("space-y-1", className)}
    {...props}
  />
))
SidebarMenu.displayName = "SidebarMenu"

const SidebarMenuItem = React.forwardRef<
  HTMLLIElement,
  React.HTMLAttributes<HTMLLIElement>
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    className={cn("", className)}
    {...props}
  />
))
SidebarMenuItem.displayName = "SidebarMenuItem"

interface SidebarMenuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  tooltip?: string
  asChild?: boolean
  size?: "sm" | "md" | "lg"
}

const SidebarMenuButton = React.forwardRef<
  HTMLElement,
  SidebarMenuButtonProps
>(({ className, tooltip, asChild = false, size = "md", children, ...props }, ref) => {
  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-2 text-sm",
    lg: "px-4 py-3 text-base"
  }
  
  if (asChild) {
    return (
      <div
        ref={ref as React.RefObject<HTMLDivElement>}
        className={cn(
          "flex w-full items-center gap-2 rounded-lg font-medium transition-colors",
          "hover:bg-gray-100 focus:bg-gray-100 focus:outline-none",
          sizeClasses[size],
          className
        )}
        title={tooltip}
      >
        {children}
      </div>
    )
  }
  
  return (
    <button
      ref={ref as React.RefObject<HTMLButtonElement>}
      className={cn(
        "flex w-full items-center gap-2 rounded-lg font-medium transition-colors",
        "hover:bg-gray-100 focus:bg-gray-100 focus:outline-none",
        sizeClasses[size],
        className
      )}
      title={tooltip}
      {...props}
    >
      {children}
    </button>
  )
})
SidebarMenuButton.displayName = "SidebarMenuButton"

const SidebarMenuSub = React.forwardRef<
  HTMLUListElement,
  React.HTMLAttributes<HTMLUListElement>
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn("ml-6 space-y-1 border-l border-gray-200 pl-3", className)}
    {...props}
  />
))
SidebarMenuSub.displayName = "SidebarMenuSub"

const SidebarMenuSubItem = React.forwardRef<
  HTMLLIElement,
  React.HTMLAttributes<HTMLLIElement>
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    className={cn("", className)}
    {...props}
  />
))
SidebarMenuSubItem.displayName = "SidebarMenuSubItem"

interface SidebarMenuSubButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  asChild?: boolean
}

const SidebarMenuSubButton = React.forwardRef<
  HTMLElement,
  SidebarMenuSubButtonProps
>(({ className, asChild = false, children, ...props }, ref) => {
  if (asChild) {
    return (
      <div
        ref={ref as React.RefObject<HTMLDivElement>}
        className={cn(
          "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-600",
          "hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none transition-colors",
          className
        )}
      >
        {children}
      </div>
    )
  }
  
  return (
    <a
      ref={ref as React.RefObject<HTMLAnchorElement>}
      className={cn(
        "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-600",
        "hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none transition-colors",
        className
      )}
      {...props}
    >
      {children}
    </a>
  )
})
SidebarMenuSubButton.displayName = "SidebarMenuSubButton"

export {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
}