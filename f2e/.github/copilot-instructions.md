# Copilot Instructions for F2Expert React App

## Architecture Overview

This is a React + TypeScript + Vite app following **Atomic Design methodology** with Redux Toolkit state management, Radix UI components, and Tailwind CSS styling.

### Key Design Patterns

**Atomic Design Structure**: Components are organized in 5 levels:
- `atoms/` - Basic building blocks (Button, Logo, Text)
- `molecules/` - Simple combinations (LogoGroup, Counter, Navigation)  
- `organisms/` - Complex sections (Header, Footer, Sidebar)
- `templates/` - Page layouts (Public, Protected)
- `pages/` - Specific instances with real content

**Component Variants with CVA**: Use `class-variance-authority` for component variants:
```tsx
const buttonVariants = cva("base-styles", {
  variants: { variant: { primary: "...", secondary: "..." } }
});
```

**Template Usage**: Use `Public` template for unauthenticated pages and `Protected` template for authenticated dashboard pages.

### State Management

**Redux Toolkit Setup**: 5 main slices in `src/store/slices/`:
- `authSlice` - Authentication state
- `sidebarSlice` - Sidebar visibility and mobile state  
- `sidebarDataSlice` - Dynamic sidebar menu data
- `coursesSlice` - Course content management
- `userSlice` - User profile data

**Custom Hooks Pattern**: Always use typed hooks from `src/store/hooks.ts`:
```tsx
import { useAppDispatch, useAppSelector } from '../store/hooks';
```

**Sidebar State Management**: Use `useSidebarRedux()` hook for all sidebar interactions - handles both desktop and mobile states with proper Redux integration.

### Authentication Flow

**Redux-Based Authentication**: Auth uses Redux Toolkit (`authSlice`) for all authentication state management. Login/logout operations are handled through Redux actions with clean state management.

**Template Routing**: Routes dynamically show different menu items based on auth state. Use `Protected` template for authenticated routes.

### Styling Conventions

**Tailwind + CSS Variables**: Uses HSL color system with CSS custom properties. Extend colors in `tailwind.config.js` following the `hsl(var(--color-name))` pattern.

**Utility Helper**: Always use `cn()` from `src/lib/utils.ts` for conditional className merging:
```tsx
className={cn(buttonVariants({ variant, size }), className)}
```

### Development Commands

```bash
npm run dev        # Start dev server on port 3000
npm run build      # TypeScript compilation + Vite build
npm run lint       # ESLint with React hooks rules
```

### File Structure Conventions

- Each component gets its own folder with `ComponentName.tsx` and `index.ts`
- Use barrel exports: `src/components/index.ts` exports all components
- Pages follow same pattern in `src/pages/PageName/`
- Custom hooks in `src/hooks/` with descriptive names like `useSidebarRedux`

### Integration Points

**Radix UI**: Pre-configured with Tailwind. See `RADIX_UI_GUIDE.md` for component patterns.
**React Router**: Uses `createBrowserRouter` with nested routes and error boundaries.
**Icons**: Combination of `lucide-react`, `react-icons`, and `@radix-ui/react-icons`.

When adding new features, follow the atomic design hierarchy and use existing patterns for state management and styling.