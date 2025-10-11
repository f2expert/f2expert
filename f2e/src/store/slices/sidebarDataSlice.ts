import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { FileText, Contact, FileStack, FileVideo2, Home } from "lucide-react";
import { FaNodeJs, FaReact } from "react-icons/fa";
import { TbFileTypeCss } from "react-icons/tb";
import { GrHtml5 } from "react-icons/gr";
import { PiDatabaseThin } from "react-icons/pi";

// Icon mapping for serializable storage
export const iconMap = {
  Home,
  FileText,
  Contact,
  FileStack,
  FileVideo2,
  FaNodeJs,
  FaReact,
  TbFileTypeCss,
  GrHtml5,
  PiDatabaseThin,
} as const;

export type IconName = keyof typeof iconMap;

// Types
export interface Team {
  name: string;
  logo: IconName;
  plan: string;
  topic: string;
}

export interface NavItem {
  title: string;
  url: string;
  icon: IconName;
  isActive?: boolean;
  items?: {
    title: string;
    url: string;
    contentId?: string;
  }[];
}

export interface SidebarUser {
  name: string;
  email: string;
  avatar: string;
}

export interface SidebarDataState {
  user: SidebarUser;
  teams: Team[];
  navMain: NavItem[];
}

// Initial data
const initialState: SidebarDataState = {
  user: {
    name: "Rhythm",
    email: "rhythm@gmail.com",
    avatar: "/assets/student/user.jpg",
  },
  teams: [
    {
      name: "Home ",
      logo: "Home",
      plan: "Training Center",
      topic: "/",
    },
    {
      name: "About Us",
      logo: "FileText",
      plan: "About F2expert",
      topic: "/about",
    },
    {
      name: "Contact Us",
      logo: "Contact",
      plan: "Contact to F2expert",
      topic: "/contact",
    },
    {
      name: "Courses",
      logo: "FileStack",
      plan: "Courses of F2expert",
      topic: "/courses",
    },
    {
      name: "Tutorials",
      logo: "FileVideo2",
      plan: "Tutorials of F2expert",
      topic: "/tutorial",
    },
  ],
  navMain: [
    {
      title: "HTML",
      url: "#",
      icon: "GrHtml5",
      isActive: true,
      items: [
        {
          title: "History",
          url: "/dashboard/html/history",
          contentId: "Ok3TQXserUI",
        },
        {
          title: "Starred",
          url: "/dashboard/html/starred",
          contentId: "QQZNZ-vDW5U",
        },
        {
          title: "Settings",
          url: "/dashboard/html/settings",
          contentId: "PJAWLl92J3U",
        },
      ],
    },
    {
      title: "CSS",
      url: "#",
      icon: "TbFileTypeCss",
      items: [
        {
          title: "Genesis",
          url: "/dashboard/css/genesis",
          contentId: "Ok3TQXserUI",
        },
        {
          title: "Explorer",
          url: "/dashboard/css/explorer",
          contentId: "Ok3TQXserUI",
        },
        {
          title: "Quantum",
          url: "/dashboard/css/quantum",
          contentId: "Ok3TQXserUI",
        },
      ],
    },
    {
      title: "JavaScript",
      url: "#",
      icon: "FaReact",
      items: [
        {
          title: "Basics",
          url: "/dashboard/javascript/basics",
          contentId: "Ok3TQXserUI",
        },
        {
          title: "Advanced",
          url: "/dashboard/javascript/advanced",
          contentId: "Ok3TQXserUI",
        },
        {
          title: "Frameworks",
          url: "/dashboard/javascript/frameworks",
          contentId: "Ok3TQXserUI",
        },
      ],
    },
    {
      title: "Node.js",
      url: "#",
      icon: "FaNodeJs",
      items: [
        {
          title: "Introduction",
          url: "/dashboard/nodejs/intro",
          contentId: "Ok3TQXserUI",
        },
        {
          title: "Express.js",
          url: "/dashboard/nodejs/express",
          contentId: "Ok3TQXserUI",
        },
        {
          title: "MongoDB",
          url: "/dashboard/nodejs/mongodb",
          contentId: "Ok3TQXserUI",
        },
      ],
    },
    {
      title: "Database",
      url: "#",
      icon: "PiDatabaseThin",
      items: [
        {
          title: "SQL",
          url: "/dashboard/database/sql",
          contentId: "Ok3TQXserUI",
        },
        {
          title: "NoSQL",
          url: "/dashboard/database/nosql",
          contentId: "Ok3TQXserUI",
        },
        {
          title: "Design",
          url: "/dashboard/database/design",
          contentId: "Ok3TQXserUI",
        },
      ],
    },
  ],
};

const sidebarDataSlice = createSlice({
  name: "sidebarData",
  initialState,
  reducers: {
    updateUser: (state, action: PayloadAction<Partial<SidebarUser>>) => {
      state.user = { ...state.user, ...action.payload };
    },
    updateTeams: (state, action: PayloadAction<Team[]>) => {
      state.teams = action.payload;
    },
    addTeam: (state, action: PayloadAction<Team>) => {
      state.teams.push(action.payload);
    },
    removeTeam: (state, action: PayloadAction<string>) => {
      state.teams = state.teams.filter((team) => team.name !== action.payload);
    },
    updateNavMain: (state, action: PayloadAction<NavItem[]>) => {
      state.navMain = action.payload;
    },
    addNavItem: (state, action: PayloadAction<NavItem>) => {
      state.navMain.push(action.payload);
    },
    removeNavItem: (state, action: PayloadAction<string>) => {
      state.navMain = state.navMain.filter(
        (nav) => nav.title !== action.payload
      );
    },
    setActiveNavItem: (state, action: PayloadAction<string>) => {
      state.navMain.forEach((nav) => {
        nav.isActive = nav.title === action.payload;
      });
    },
    updateContentId: (
      state,
      action: PayloadAction<{
        language: string;
        topic: string;
        contentId: string;
      }>
    ) => {
      const { language, topic, contentId } = action.payload;
      const langNav = state.navMain.find(
        (nav) => nav.title.toLowerCase() === language.toLowerCase()
      );

      if (langNav && langNav.items) {
        const topicItem = langNav.items.find(
          (item) =>
            item.title.toLowerCase() === topic.toLowerCase() ||
            item.url.includes(`/${language}/${topic}`)
        );

        if (topicItem) {
          topicItem.contentId = contentId;
        }
      }
    },
  },
});

export const {
  updateUser,
  updateTeams,
  addTeam,
  removeTeam,
  updateNavMain,
  addNavItem,
  removeNavItem,
  setActiveNavItem,
  updateContentId,
} = sidebarDataSlice.actions;

export default sidebarDataSlice.reducer;
