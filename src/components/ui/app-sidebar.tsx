
import * as React from "react"
import {
  Frame,
  Map,
  PieChart,
  FileText,
  Contact,
  FileStack,
  FileVideo2,
  Home
} from "lucide-react"

import { FaNodeJs, FaReact } from "react-icons/fa";
import { TbFileTypeCss } from "react-icons/tb";
import { GrHtml5 } from "react-icons/gr";
import { PiDatabaseThin } from "react-icons/pi";

import { NavMain } from "./nav-main"
import { TeamSwitcher } from "./team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "../../components/ui/sidebar"
import { NavUser } from "./nav-user"
import { Separator } from "./separator";

// This is sample data.
const data = {
  user: {
    name: "Rhythm",
    email: "rhythm@gmail.com",
    avatar: "/assets/avatars/user.jpg",
  },
  teams: [
    {
      name: "Home ",
      logo: Home,
      plan: "Training Center",
      topic: "/",
    },
    {
      name: "About Us",
      logo: FileText,
      plan: "About F2expert",
      topic: "/about",
    },
    {
      name: "Contact Us",
      logo: Contact,
      plan: "Contact to F2expert",
      topic: "/contact",
    },
    {
      name: "Courses",
      logo: FileStack,
      plan: "Courses of F2expert",
      topic: "/courses",
    },
    {
      name: "Tutorials",
      logo: FileVideo2,
      plan: "Tutorials of F2expert",

    },
  ],
  navMain: [
    {
      title: "HTML",
      url: "#",
      icon: GrHtml5,
      isActive: true,
      items: [
        {
          title: "History",
          url: "/dashboard/react",
        },
        {
          title: "Starred",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
    {
      title: "CSS",
      url: "#",
      icon: TbFileTypeCss,
      items: [
        {
          title: "Genesis",
          url: "#",
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
    {
      title: "Java Script",
      url: "#",
      icon: FaNodeJs,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "React JS",
      url: "#",
      icon: FaReact,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
    {
      title: "Node JS",
      url: "#",
      icon: FaNodeJs,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
    {
      title: "Mongo DB",
      url: "#",
      icon: PiDatabaseThin,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <Separator />
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <Separator />
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
