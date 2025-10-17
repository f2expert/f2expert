import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

import {
  Collapsible,
} from "../Sidebar/collapsible";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../Sidebar/sidebar";
import { iconMap, type IconName } from "../../../store/slices/sidebarDataSlice";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    path: string;
    icon?: IconName;
    isActive?: boolean;
    children?: {
      title: string;
      path: string;
    }[];
  }[];
}) {
  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem>
                <SidebarMenuButton tooltip={item.title} className="hover:text-yellow-500">
                  {item.icon && (() => {
                    const IconComponent = iconMap[item.icon as keyof typeof iconMap];
                    return IconComponent ? <IconComponent className="size-3.5" /> : null;
                  })()}
                  <Link to={item.path}>
                    <span>{item.title}</span>
                  </Link>
                  <ChevronRight className="ml-auto size-4 text-gray-500 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}