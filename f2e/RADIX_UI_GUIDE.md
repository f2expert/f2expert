# Radix UI Integration Guide

This project now includes Radix UI components integrated with our Atomic Design pattern and Tailwind CSS styling.

## 🎯 **What's Included**

### **Core Libraries**
- `@radix-ui/react-dialog` - Modal dialogs
- `@radix-ui/react-dropdown-menu` - Dropdown menus
- `@radix-ui/react-select` - Select dropdowns
- `@radix-ui/react-tooltip` - Tooltips
- `@radix-ui/react-separator` - Visual separators
- `@radix-ui/react-switch` - Toggle switches
- `@radix-ui/react-tabs` - Tab navigation
- `@radix-ui/react-accordion` - Collapsible content
- `@radix-ui/react-icons` - Icon library
- `@radix-ui/colors` - Color system

### **Utility Libraries**
- `class-variance-authority` - Type-safe variant styling
- `clsx` - Conditional class names
- `tailwind-merge` - Intelligent Tailwind class merging

## 🔧 **Enhanced Components**

### **Atoms (Radix-Based)**

#### **Button** (`src/components/atoms/Button/`)
Enhanced with class-variance-authority for type-safe variants:
```tsx
<Button variant="primary" size="lg">Click me</Button>
<Button variant="destructive" size="sm">Delete</Button>
<Button variant="outline" size="icon">👤</Button>
```

Available variants: `primary`, `secondary`, `outline`, `ghost`, `destructive`
Available sizes: `sm`, `default`, `lg`, `icon`

#### **Dialog** (`src/components/atoms/Dialog/`)
Complete modal dialog system:
```tsx
<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Are you sure?</DialogTitle>
      <DialogDescription>This action cannot be undone.</DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <Button variant="outline">Cancel</Button>
      <Button>Confirm</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

#### **DropdownMenu** (`src/components/atoms/DropdownMenu/`)
Feature-rich dropdown menus:
```tsx
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline">Options</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel>My Account</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem>Profile</DropdownMenuItem>
    <DropdownMenuItem>Settings</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

#### **Tooltip** (`src/components/atoms/Tooltip/`)
Accessible tooltips:
```tsx
<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
      <Button variant="outline">Hover me</Button>
    </TooltipTrigger>
    <TooltipContent>
      <p>Add to library</p>
    </TooltipContent>
  </Tooltip>
</TooltipProvider>
```

### **Molecules (Radix + Tailwind)**

#### **ConfirmDialog** (`src/components/molecules/ConfirmDialog/`)
Pre-built confirmation dialog:
```tsx
<ConfirmDialog
  trigger={<Button variant="destructive">Delete Item</Button>}
  title="Delete Item"
  description="Are you sure you want to delete this item? This action cannot be undone."
  onConfirm={() => console.log('Deleted!')}
  variant="destructive"
  confirmText="Delete"
  cancelText="Cancel"
/>
```

#### **UserMenu** (`src/components/molecules/UserMenu/`)
Complete user dropdown menu:
```tsx
<UserMenu
  userName="John Doe"
  userEmail="john@example.com"
  onProfile={() => console.log('Profile')}
  onSettings={() => console.log('Settings')}
  onHelp={() => console.log('Help')}
  onLogout={() => console.log('Logout')}
/>
```

## 🎨 **Styling Architecture**

### **Utility Function**
We use a utility function (`src/lib/utils.ts`) for intelligent class merging:
```tsx
import { cn } from '../../../lib/utils';

// Merges Tailwind classes intelligently
const className = cn(
  "base-classes",
  condition && "conditional-classes",
  props.className
);
```

### **Class Variance Authority**
Type-safe variant management:
```tsx
const buttonVariants = cva(
  "base-classes", // Base styles
  {
    variants: {
      variant: {
        primary: "bg-blue-600 text-white",
        secondary: "bg-gray-600 text-white",
      },
      size: {
        sm: "text-sm px-3 py-1",
        lg: "text-lg px-6 py-3",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);
```

### **Tailwind Configuration**
Enhanced with Radix-compatible tokens and animations:
- Custom color system with CSS variables
- Radix-specific animations (accordion, fade, zoom, slide)
- Consistent border radius system
- Typography scale

## 🚀 **Usage Examples**

### **Basic Dialog**
```tsx
import { Dialog, DialogContent, DialogTrigger } from './components/atoms';
import { Button } from './components/atoms';

function MyComponent() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open Settings</Button>
      </DialogTrigger>
      <DialogContent>
        <h2>Settings</h2>
        <p>Configure your preferences</p>
      </DialogContent>
    </Dialog>
  );
}
```

### **User Navigation**
```tsx
import { UserMenu } from './components/molecules';

function Header() {
  return (
    <header className="flex justify-between items-center p-4">
      <h1>My App</h1>
      <UserMenu
        userName="Alice Smith"
        userEmail="alice@example.com"
        onLogout={() => {/* handle logout */}}
      />
    </header>
  );
}
```

### **Confirmation Flow**
```tsx
import { ConfirmDialog } from './components/molecules';
import { Button } from './components/atoms';

function DangerousAction() {
  return (
    <ConfirmDialog
      trigger={<Button variant="destructive">Delete Account</Button>}
      title="Delete Account"
      description="This will permanently delete your account and all associated data."
      variant="destructive"
      onConfirm={() => {/* handle deletion */}}
    />
  );
}
```

## 🎯 **Benefits**

1. **Accessibility**: All Radix components are built with accessibility in mind
2. **Type Safety**: Full TypeScript support with intelligent IntelliSense
3. **Customization**: Easy to customize with Tailwind CSS
4. **Performance**: Tree-shakeable and optimized bundle size
5. **Developer Experience**: Consistent API across all components
6. **Design System**: Cohesive design tokens and styling patterns

## 📦 **Available Components**

### **Ready to Use**
- ✅ Button (enhanced with variants)
- ✅ Dialog & DialogContent
- ✅ DropdownMenu & Items
- ✅ Tooltip & TooltipContent
- ✅ ConfirmDialog (molecule)
- ✅ UserMenu (molecule)

### **Available for Implementation**
- 🔄 Select & SelectContent
- 🔄 Switch & Toggle
- 🔄 Tabs & TabsContent
- 🔄 Accordion & AccordionContent
- 🔄 Separator
- 🔄 Form components with validation

## 🔧 **Next Steps**

1. Wrap your app with `TooltipProvider` for global tooltip support
2. Add theme switching using Radix Colors
3. Implement form components with validation
4. Create additional molecular components as needed
5. Set up Storybook for component documentation

Your Atomic Design architecture now has powerful, accessible, and beautiful Radix UI components! 🎉