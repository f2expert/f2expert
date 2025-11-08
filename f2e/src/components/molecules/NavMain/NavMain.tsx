import { Link } from "react-router-dom";

import {
  Collapsible,
  CollapsibleTrigger,
} from "../Sidebar/collapsible";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../Sidebar/sidebar";
import { getIconComponent, type IconName } from "../../../store/slices/sidebarDataSlice";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    path: string;
    icon?: IconName | string; // Support dynamic icon names
    isActive?: boolean;
    menuType?: string; // Type of menu item (e.g., "setting", "main", "navigation")
    children?: {
      title: string;
      path: string;
    }[];
  }[];
}) {
  return (
    <SidebarGroup>
      <SidebarMenu>
        {items
          .filter((item) => item.menuType === "main")
          .map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <Link to={item.path} className="hover:text-yellow-500">
                  <SidebarMenuButton
                    tooltip={item.title}
                    className="hover:text-yellow-500"
                  >
                    {item.icon && (() => {
                      const IconComponent = getIconComponent(item.icon);
                      return <IconComponent className="size-3.5" />;
                    })()}
                    {item.title}
                  </SidebarMenuButton>
                </Link>
              </CollapsibleTrigger>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
