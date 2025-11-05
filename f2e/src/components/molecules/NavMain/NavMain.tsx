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
              <CollapsibleTrigger asChild>
                <Link to={item.path} className="hover:text-yellow-500">
                  <SidebarMenuButton
                    tooltip={item.title}
                    className="hover:text-yellow-500"
                  >
                    {item.icon &&
                      (() => {
                        const IconComponent =
                          iconMap[item.icon as keyof typeof iconMap];
                        return IconComponent ? (
                          <IconComponent className="size-3.5" />
                        ) : null;
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
