import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { 
  FileText, Contact, FileStack, FileVideo2, PlusCircle, BookOpen, GraduationCap, 
  Home, Users, UserCheck, User, Calendar, DollarSign, Settings, Code, Database, 
  Monitor, Smartphone, Server, Cloud, Globe, Layers, Box, Briefcase,
  Award, Book, Play, Video, Image, File, Folder, Archive, Download,
  Upload, Share, Link, Mail, Phone, MapPin, Clock, Bell, Heart,
  Star, Flag, Tag, Search, Filter, Edit, Trash, Plus, Minus,
  Check, X, ChevronRight, ChevronLeft, ChevronUp, ChevronDown,
  ArrowRight, ArrowLeft, ArrowUp, ArrowDown, ExternalLink, Eye,
  EyeOff, Lock, Unlock, Key, Shield, AlertTriangle, Info, HelpCircle,
  CreditCard, Wallet, Receipt, Banknote
} from "lucide-react";

import { 
  FaNodeJs, FaReact, FaVuejs, FaAngular, FaPython, FaPhp,
  FaLaravel, FaSymfony, FaWordpress, FaAws, FaGoogle, 
  FaMicrosoft, FaApple, FaLinux, FaWindows, FaGithub, 
  FaGitlab, FaBitbucket, FaDocker, FaSlack, FaDiscord,
  FaTrello, FaJira, FaConfluence, FaFigma, FaSketch
} from "react-icons/fa";
import { 
  TbFileTypeCss, TbFileTypeHtml, TbFileTypeJs, TbFileTypeTs,
  TbFileTypeSql, TbFileTypePhp, TbBrandCpp, TbBrandCSharp, 
  TbFileTypeDoc, TbFileTypePdf, TbFileTypeXml, TbApi, 
  TbDatabase, TbServer, TbCloud, TbBrandFirebase, 
  TbBrandMongodb, TbBrandMysql
} from "react-icons/tb";
import { 
  GrHtml5, GrCss3, GrJs, GrReactjs, GrNode, GrMysql,
  GrWordpress, GrUbuntu, GrCentos, GrDebian, GrArchlinux
} from "react-icons/gr";
import { 
  PiDatabaseThin, PiCloudThin, PiDeviceMobileThin, PiDesktopThin,
  PiGlobeThin, PiCodeThin, PiTerminalWindowThin, PiBracketsCurlyThin,
  PiFileThin, PiFolderThin, PiImageThin, PiVideoThin
} from "react-icons/pi";
import {
  SiJavascript, SiTypescript, SiPython, SiCplusplus, SiPhp, 
  SiRuby, SiGo, SiRust, SiSwift, SiKotlin, SiReact, 
  SiVuedotjs, SiAngular, SiSvelte, SiNextdotjs, SiNuxtdotjs,
  SiNodedotjs, SiExpress, SiNestjs, SiDjango, SiFlask, 
  SiSpring, SiLaravel, SiSymfony, SiRubyonrails, SiMysql, 
  SiPostgresql, SiMongodb, SiRedis, SiFirebase, SiSupabase,
  SiVercel, SiNetlify, SiDocker, SiKubernetes, SiJenkins, 
  SiGithubactions, SiGitlab, SiFigma, SiSketch, SiAdobe, 
  SiCanva, SiBlender, SiUnity
} from "react-icons/si";

// Dynamic icon mapping with fallback system
export const iconMap = {
  // Lucide React Icons (UI/UX focused)
  Home, FileText, Contact, FileStack, FileVideo2, PlusCircle, BookOpen, GraduationCap,
  Users, UserCheck, User, Calendar, DollarSign, Settings, Code, Database, Monitor,
  Smartphone, Server, Cloud, Globe, Layers, Box, Briefcase, Award, Book,
  Play, Video, Image, File, Folder, Archive, Download, Upload, Share,
  Link, Mail, Phone, MapPin, Clock, Bell, Heart, Star, Flag, Tag,
  Search, Filter, Edit, Trash, Plus, Minus, Check, X, ChevronRight,
  ChevronLeft, ChevronUp, ChevronDown, ArrowRight, ArrowLeft, ArrowUp,
  ArrowDown, ExternalLink, Eye, EyeOff, Lock, Unlock, Key, Shield,
  AlertTriangle, Info, HelpCircle, CreditCard, Wallet, Receipt, Banknote,

  // React Icons - Font Awesome
  FaNodeJs, FaReact, FaVuejs, FaAngular, FaPython, FaPhp, FaLaravel, 
  FaSymfony, FaWordpress, FaAws, FaGoogle, FaMicrosoft, FaApple, 
  FaLinux, FaWindows, FaGithub, FaGitlab, FaBitbucket, FaDocker, 
  FaSlack, FaDiscord, FaTrello, FaJira, FaConfluence, FaFigma, FaSketch,

  // Tabler Icons (File types and tech)
  TbFileTypeCss, TbFileTypeHtml, TbFileTypeJs, TbFileTypeTs, TbFileTypeSql,
  TbFileTypePhp, TbBrandCpp, TbBrandCSharp, TbFileTypeDoc, TbFileTypePdf, 
  TbFileTypeXml, TbApi, TbDatabase, TbServer, TbCloud, TbBrandFirebase, 
  TbBrandMongodb, TbBrandMysql,

  // Grommet Icons
  GrHtml5, GrCss3, GrJs, GrReactjs, GrNode, GrMysql, GrWordpress,
  GrUbuntu, GrCentos, GrDebian, GrArchlinux,

  // Phosphor Icons
  PiDatabaseThin, PiCloudThin, PiDeviceMobileThin, PiDesktopThin, PiGlobeThin,
  PiCodeThin, PiTerminalWindowThin, PiBracketsCurlyThin, PiFileThin,
  PiFolderThin, PiImageThin, PiVideoThin,

  // Simple Icons
  SiJavascript, SiTypescript, SiPython, SiCplusplus, SiPhp, SiRuby, 
  SiGo, SiRust, SiSwift, SiKotlin, SiReact, SiVuedotjs, SiAngular, 
  SiSvelte, SiNextdotjs, SiNuxtdotjs, SiNodedotjs, SiExpress, SiNestjs, 
  SiDjango, SiFlask, SiSpring, SiLaravel, SiSymfony, SiRubyonrails, 
  SiMysql, SiPostgresql, SiMongodb, SiRedis, SiFirebase, SiSupabase,
  SiVercel, SiNetlify, SiDocker, SiKubernetes, SiJenkins, SiGithubactions, 
  SiGitlab, SiFigma, SiSketch, SiAdobe, SiCanva, SiBlender, SiUnity,
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
  path: string;
  icon: IconName | string; // Support both predefined and dynamic icon names
  isActive?: boolean;
  menuType?: string; // Type of menu item (e.g., "setting", "main", "navigation")
  children?: {
    title: string;
    path: string;
    contentId?: string;
  }[];
}

// Helper function to get icon component with fallback
export const getIconComponent = (iconName: string | IconName) => {
  // First try to get from iconMap
  if (iconName in iconMap) {
    return iconMap[iconName as keyof typeof iconMap];
  }
  
  // Fallback to default icon for unknown icons
  console.warn(`Icon "${iconName}" not found in iconMap, using default FileStack icon`);
  return FileStack;
};

export interface SidebarDataState {
  teams: Team[];
  navMain: NavItem[];
}

// Initial data
const initialState: SidebarDataState = {
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
      path: "#",
      icon: "GrHtml5",
      isActive: true,
      children: [
        {
          title: "History",
          path: "/dashboard/html/history",
          contentId: "Ok3TQXserUI",
        },
        {
          title: "Starred",
          path: "/dashboard/html/starred",
          contentId: "QQZNZ-vDW5U",
        },
        {
          title: "Settings",
          path: "/dashboard/html/settings",
          contentId: "PJAWLl92J3U",
        },
      ],
    },
    {
      title: "CSS",
      path: "#",
      icon: "TbFileTypeCss",
      children: [
        {
          title: "Genesis",
          path: "/dashboard/css/genesis",
          contentId: "Ok3TQXserUI",
        },
        {
          title: "Explorer",
          path: "/dashboard/css/explorer",
          contentId: "Ok3TQXserUI",
        },
        {
          title: "Quantum",
          path: "/dashboard/css/quantum",
          contentId: "Ok3TQXserUI",
        },
      ],
    },
    {
      title: "JavaScript",
      path: "#",
      icon: "FaReact",
      children: [
        {
          title: "Basics",
          path: "/dashboard/javascript/basics",
          contentId: "Ok3TQXserUI",
        },
        {
          title: "Advanced",
          path: "/dashboard/javascript/advanced",
          contentId: "Ok3TQXserUI",
        },
        {
          title: "Frameworks",
          path: "/dashboard/javascript/frameworks",
          contentId: "Ok3TQXserUI",
        },
      ],
    },
    {
      title: "Node.js",
      path: "#",
      icon: "FaNodeJs",
      children: [
        {
          title: "Introduction",
          path: "/dashboard/nodejs/intro",
          contentId: "Ok3TQXserUI",
        },
        {
          title: "Express.js",
          path: "/dashboard/nodejs/express",
          contentId: "Ok3TQXserUI",
        },
        {
          title: "MongoDB",
          path: "/dashboard/nodejs/mongodb",
          contentId: "Ok3TQXserUI",
        },
      ],
    },
    {
      title: "Database",
      path: "#",
      icon: "PiDatabaseThin",
      children: [
        {
          title: "SQL",
          path: "/dashboard/database/sql",
          contentId: "Ok3TQXserUI",
        },
        {
          title: "NoSQL",
          path: "/dashboard/database/nosql",
          contentId: "Ok3TQXserUI",
        },
        {
          title: "Design",
          path: "/dashboard/database/design",
          contentId: "Ok3TQXserUI",
        },
      ],
    },
    {
      title: "Management",
      path: "#",
      icon: "Settings",
      isActive: false,
      children: [
        {
          title: "Student Management",
          path: "/dashboard/student-management",
        },
        {
          title: "Trainer Management",
          path: "/dashboard/trainer-management",
        },
        {
          title: "Salary Management",
          path: "/dashboard/salary-management",
        },
        {
          title: "Class Management",
          path: "/dashboard/class-management",
        },
        {
          title: "Course Management",
          path: "/dashboard/course-management",
        },
      ],
    },
    // Setting menu items for NavUser dropdown
    {
      title: "Profile Settings",
      path: "/dashboard/profile",
      icon: "User",
      menuType: "setting",
    },
    {
      title: "Account Settings",
      path: "/dashboard/account-settings",
      icon: "Settings",
      menuType: "setting",
    },
    {
      title: "Preferences",
      path: "/dashboard/preferences",
      icon: "Calendar",
      menuType: "setting",
    },
    {
      title: "Billing",
      path: "/dashboard/billing",
      icon: "DollarSign",
      menuType: "setting",
    },
    {
      title: "Fee Details",
      path: "/dashboard/fee-details",
      icon: "Receipt",
      menuType: "setting",
    },
  ],
};

const sidebarDataSlice = createSlice({
  name: "sidebarData",
  initialState,
  reducers: {
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

      if (langNav && langNav.children) {
        const topicItem = langNav.children.find(
          (item) =>
            item.title.toLowerCase() === topic.toLowerCase() ||
            item.path.includes(`/${language}/${topic}`)
        );

        if (topicItem) {
          topicItem.contentId = contentId;
        }
      }
    },
  },
});

export const {
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
