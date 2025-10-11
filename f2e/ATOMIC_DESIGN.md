# Atomic Design Structure

This project follows the Atomic Design methodology by Brad Frost, organizing components into five distinct levels:

## Component Hierarchy

### 🔬 **Atoms** (`src/components/atoms/`)
Basic building blocks - the smallest functional units.

- **Button** - Reusable button component with variants
- **Logo** - Configurable logo component with hover effects and animation
- **Text** - Typography component with semantic variants (heading, body, caption, code)

### 🧬 **Molecules** (`src/components/molecules/`)
Simple groups of atoms functioning together.

- **LogoGroup** - Combines multiple Logo atoms (Vite + React logos)
- **Counter** - Interactive counter combining Button and Text atoms

### 🦠 **Organisms** (`src/components/organisms/`)
Complex, distinct interface sections combining molecules and atoms.

- **Header** - Page header containing LogoGroup and title
- **MainContent** - Main content area with Counter molecule and description text

### 📄 **Templates** (`src/components/templates/`)
Page-level objects that place organisms into a layout.

- **Public** - Layout for public/marketing pages with header and footer
- **Protected** - Dashboard layout with navbar and sidebar for authenticated users

### 📱 **Pages** (`src/pages/`)
Specific instances of templates with real content.

- **HomePage** - Landing page using Public template
- **DashboardPage** - Protected dashboard using Protected template

## File Structure

```
src/
├── components/
│   ├── atoms/
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.css
│   │   │   └── index.ts
│   │   ├── Logo/
│   │   ├── Text/
│   │   ├── Dialog/
│   │   ├── DropdownMenu/
│   │   ├── Tooltip/
│   │   └── index.ts
│   ├── molecules/
│   │   ├── LogoGroup/
│   │   ├── Counter/
│   │   ├── ConfirmDialog/
│   │   ├── UserMenu/
│   │   └── index.ts
│   ├── organisms/
│   │   ├── Header/
│   │   ├── MainContent/
│   │   ├── Navbar/
│   │   ├── Sidebar/
│   │   └── index.ts
│   ├── templates/
│   │   ├── Public/
│   │   ├── Protected/
│   │   └── index.ts
│   └── index.ts
├── pages/
│   ├── HomePage/
│   ├── DashboardPage/
│   └── index.ts
├── contexts/
│   └── AuthContext.tsx
└── App.tsx
```

## Benefits

- **Modularity**: Each component has a single responsibility
- **Reusability**: Atoms and molecules can be composed into different organisms
- **Maintainability**: Clear separation of concerns and consistent naming
- **Scalability**: Easy to add new components following the established pattern
- **Testing**: Each level can be tested independently
- **Documentation**: Natural hierarchy makes the design system self-documenting

## Usage

Import components using the barrel exports:

```tsx
// Import specific atoms
import { Button, Text } from './components/atoms';

// Import specific molecules
import { Counter } from './components/molecules';

// Import specific organisms
import { Header } from './components/organisms';

// Import pages
import { HomePage } from './pages';
```