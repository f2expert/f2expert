# Dynamic Icon System for F2Expert

## Overview

The F2Expert React app now supports dynamic icon loading from your API responses. The system includes over 200+ icons from multiple icon libraries and has a smart fallback mechanism.

## Icon Libraries Included

### 1. Lucide React (UI/UX Icons)
- **Usage**: General UI elements, actions, navigation
- **Examples**: `Home`, `FileText`, `Users`, `Settings`, `Calendar`
- **Style**: Clean, modern outline icons

### 2. React Icons - Font Awesome (Brand Icons)
- **Usage**: Technology brands, social media, platforms
- **Examples**: `FaReact`, `FaNodeJs`, `FaGithub`, `FaDocker`
- **Style**: Solid brand icons

### 3. Tabler Icons (File Types & Tech)
- **Usage**: File types, technical concepts
- **Examples**: `TbFileTypeJs`, `TbFileTypeCss`, `TbDatabase`
- **Style**: Consistent stroke-based icons

### 4. Grommet Icons (Web Technologies)
- **Usage**: Web development technologies
- **Examples**: `GrHtml5`, `GrCss3`, `GrReactjs`
- **Style**: Minimalist tech icons

### 5. Phosphor Icons (Thin Style)
- **Usage**: Subtle UI elements
- **Examples**: `PiDatabaseThin`, `PiCloudThin`, `PiCodeThin`
- **Style**: Thin, elegant icons

### 6. Simple Icons (Brand Specific)
- **Usage**: Specific technology brands
- **Examples**: `SiJavascript`, `SiTypescript`, `SiPython`, `SiMongodb`
- **Style**: Official brand icons

## API Integration

### Expected API Response Format

Your API should return menu items in this format:

\`\`\`json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "title": "HTML",
      "path": "/dashboard/html",
      "icon": "GrHtml5",
      "isActive": true,
      "children": [
        {
          "id": "1-1",
          "title": "Introduction",
          "path": "/dashboard/html/introduction",
          "contentId": "abc123"
        }
      ]
    },
    {
      "id": "2",
      "title": "JavaScript",
      "path": "/dashboard/javascript",
      "icon": "SiJavascript",
      "children": []
    }
  ]
}
\`\`\`

### Dynamic Icon Names

You can use any of these icon names in your API response:

#### Popular Technology Icons
- **HTML**: `GrHtml5`, `TbFileTypeHtml`
- **CSS**: `TbFileTypeCss`, `GrCss3`
- **JavaScript**: `SiJavascript`, `TbFileTypeJs`
- **React**: `FaReact`, `SiReact`, `GrReactjs`
- **Node.js**: `FaNodeJs`, `SiNodedotjs`
- **Python**: `FaPython`, `SiPython`
- **Database**: `Database`, `PiDatabaseThin`, `TbDatabase`

#### UI/UX Icons
- **Navigation**: `Home`, `ArrowRight`, `ChevronDown`
- **Actions**: `Edit`, `Trash`, `Plus`, `Check`
- **Files**: `File`, `Folder`, `FileText`, `Archive`
- **Communication**: `Mail`, `Phone`, `Bell`

#### Brand Icons
- **Platforms**: `FaGithub`, `FaGitlab`, `FaDocker`
- **Cloud**: `FaAws`, `FaGoogle`, `FaMicrosoft`
- **Design**: `FaFigma`, `SiFigma`, `FaSketch`

### Fallback System

If an icon name from your API is not found in the icon map:

1. **Automatic Fallback**: The system will use `FileStack` as the default icon
2. **Console Warning**: You'll see a warning in the console: \`Icon "unknown-icon" not found in iconMap, using default FileStack icon\`
3. **No Breaking**: Your app will continue to work normally

## Implementation Examples

### 1. Basic Menu Item
\`\`\`json
{
  "title": "Dashboard",
  "path": "/dashboard",
  "icon": "Home"
}
\`\`\`

### 2. Technology Course
\`\`\`json
{
  "title": "React Course",
  "path": "/courses/react",
  "icon": "FaReact",
  "children": [
    {
      "title": "Components",
      "path": "/courses/react/components"
    }
  ]
}
\`\`\`

### 3. File Management
\`\`\`json
{
  "title": "Documents",
  "path": "/documents",
  "icon": "Folder",
  "children": [
    {
      "title": "PDFs",
      "path": "/documents/pdfs",
      "icon": "TbFileTypePdf"
    }
  ]
}
\`\`\`

## Usage in Components

The `NavMain` component automatically handles dynamic icons:

\`\`\`tsx
// Your menu data from API
const menuItems = [
  {
    title: "HTML Course",
    path: "/html",
    icon: "GrHtml5", // Dynamic icon from API
    children: [...]
  }
];

// Component usage (handles dynamic icons automatically)
<NavMain items={menuItems} />
\`\`\`

## Adding New Icons

To add more icons to the system:

1. **Install the icon library**:
   \`\`\`bash
   npm install react-icons
   \`\`\`

2. **Import in sidebarDataSlice.ts**:
   \`\`\`tsx
   import { NewIcon } from "react-icons/some-library";
   \`\`\`

3. **Add to iconMap**:
   \`\`\`tsx
   export const iconMap = {
     // ... existing icons
     NewIcon,
   } as const;
   \`\`\`

## Testing

Use the built-in mock menu function for testing:

\`\`\`tsx
const { loadMockMenu } = useMenuApi();

// Load test menu with various icon types
loadMockMenu();
\`\`\`

## Best Practices

1. **Consistent Naming**: Use descriptive, technology-specific icon names in your API
2. **Fallback Planning**: Always have a default icon strategy
3. **Performance**: The icon system is optimized for tree-shaking
4. **Accessibility**: All icons include proper accessibility attributes
5. **Documentation**: Document your API's available icon names

## API Endpoint Configuration

Update your API endpoint in \`useMenuApi.ts\`:

\`\`\`tsx
const response = await fetch('/api/menu', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': \`Bearer \${token}\`,
  },
});
\`\`\`

This system provides maximum flexibility for your dynamic menu system while maintaining type safety and performance.