"use client"

import { ChevronsUpDown } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../Sidebar/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../Sidebar/sidebar"
import { useSidebarRedux } from "../../../hooks/useSidebarRedux"
import { useNavigate } from "react-router-dom"
import { iconMap, type Team } from "../../../store/slices/sidebarDataSlice"

export function TeamSwitcher({
  teams,
}: {
  teams: Team[]
}) {
  const { isMobile } = useSidebarRedux()
  const navigate = useNavigate();
  
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <img src="/assets/f2expert.png" alt="F2expert Logos" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{teams[0].name}</span>
                <span className="truncate text-xs">{teams[0].plan}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              F2expert Training Center
            </DropdownMenuLabel>
            <DropdownMenuSeparator /> 
            {teams.map((team) => {
              const IconComponent = iconMap[team.logo as keyof typeof iconMap];
              return (
                <DropdownMenuItem
                  key={team.name}
                  onClick={() => {
                    navigate(team.topic ?? "/"); // or any path you want to redirect to
                  }}
                  className="gap-2 p-2"
                >
                  <div className="flex size-6 items-center justify-center rounded-md border">
                    {IconComponent && <IconComponent className="size-3.5 shrink-0" />}
                  </div>
                  {team.name}
                </DropdownMenuItem>
              );
            })}
                       
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}