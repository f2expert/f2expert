// Debug utility for menu icons
interface MenuItemDebug {
  title: string;
  icon?: string;
  children?: MenuItemDebug[];
}

export const debugMenuIcons = (menuItems: MenuItemDebug[]) => {
  console.log('🎨 Debugging Menu Icons:');
  console.log('Available IconName types:', [
    'Home', 'FileText', 'Contact', 'FileStack', 'FileVideo2', 
    'FaNodeJs', 'FaReact', 'TbFileTypeCss', 'GrHtml5', 'PiDatabaseThin'
  ]);
  
  const iconStats = new Map<string, number>();
  
  menuItems.forEach((item, index) => {
    console.log(`📋 Item ${index + 1}:`, {
      title: item.title,
      icon: item.icon,
      iconType: typeof item.icon,
      hasChildren: !!item.children,
      childrenCount: item.children?.length || 0
    });
    
    if (item.icon) {
      iconStats.set(item.icon, (iconStats.get(item.icon) || 0) + 1);
    }
    
    // Debug children icons too
    if (item.children) {
      item.children.forEach((child: MenuItemDebug, childIndex: number) => {
        if (child.icon) {
          console.log(`  📄 Child ${childIndex + 1}:`, {
            title: child.title,
            icon: child.icon
          });
          iconStats.set(child.icon, (iconStats.get(child.icon) || 0) + 1);
        }
      });
    }
  });
  
  console.log('📊 Icon usage statistics:', Object.fromEntries(iconStats));
  return iconStats;
};