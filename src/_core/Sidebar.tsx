"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { BsFiletypeHtml, BsFiletypeCss, BsFiletypeJs } from "react-icons/bs";
import { FaReact, FaNodeJs } from "react-icons/fa";
import Circle from "./Circle";
import { usePathname } from "next/navigation";

interface ISubItems {
  id: string;
  title: string;
  url: string;
}

const sidebarItems = [
  { id: "html", icon: <BsFiletypeHtml size="32" /> },
  { id: "css", icon: <BsFiletypeCss size="32" /> },
  { id: "js", icon: <BsFiletypeJs size="32" /> },
  { id: "react", icon: <FaReact size="32" /> },
  { id: "node", icon: <FaNodeJs size="32" /> },
];

const subItems: Record<string, ISubItems[]> = {
  html: [
    { id: "html", title: "HTML", url: "/dashboard/html" },
    { id: "head", title: "Head", url: "/dashboard/head" },
    { id: "body", title: "Body", url: "/dashboard/body" },
  ],
  css: [
    { id: "css", title: "CSS", url: "/dashboard/css" },
    { id: "flex", title: "Flex", url: "/dashboard/flex" },
    { id: "grid", title: "Grid", url: "/dashboard/grid" },
  ],
  js: [
    { id: "js", title: "JS", url: "/dashboard/js" },
    { id: "es6", title: "ES6", url: "/dashboard/es6" },
    { id: "dom", title: "DOM", url: "/dashboard/dom" },
  ],
  react: [
    { id: "react", title: "React", url: "/dashboard/react" },
    { id: "hooks", title: "Hooks", url: "/dashboard/hooks" },
    { id: "router", title: "Router", url: "/dashboard/router" },
  ],
  node: [
    { id: "node", title: "Node", url: "/dashboard/node" },
    { id: "express", title: "Express", url: "/dashboard/express" },
    { id: "mongo", title: "Mongo", url: "/dashboard/mongo" },
  ],
};

export default function Sidebar() {
  const cssClasses =
    "flex items-center justify-center h-12 w-12 mt-2 mb-2 mx-auto bg-blue-900 hover:bg-blue-950 dark:bg-gray-800 text-slate-400 hover:text-white hover:rounded-xl rounded-3xl transition-all duration-300 ease-linear cursor-pointer shadow-lg ";

  const [activeMenu, setActiveMenu] = useState<keyof typeof subItems | "">("");

  const iconClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setActiveMenu(e.currentTarget.id === activeMenu ? "" : e.currentTarget.id);
  };

  const pathname = usePathname();
  const submenu = pathname.split('/')[2];

  return (
    <>
      <div className="h-screen flex flex-col items-center min-w-20 bg-blue-900 shadow-lg">
        <div className="bg-blue-950">
          <Link href="/">
            <Image src="/f2expert.png" alt="F2Expert" width="50" height="58" />
          </Link>
        </div>
        <hr className="sidebar-hr" />
        {sidebarItems.map((item) => (
          <Circle
            key={item.id}
            cb={iconClick}
            id={item.id}
            icon={item.icon}
            cssClasses={cssClasses}
            activeClass={activeMenu}
          />
        ))}
      </div>
      <div
        className={`h-screen bg-blue-950 shadow-lg ${
          activeMenu === "" ? "hidden" : ""
        }`}
      >
        <ul className="min-w-44">
          {activeMenu !== "" &&
            subItems[activeMenu]?.map((item: ISubItems, index: number) => (
              <li
                key={index}
                className={`cursor-pointer p-3  
                    text-sm text-slate-400 hover:bg-blue-900 hover:text-white 
                    transition-all duration-300 ease-linear
                    shadow-lg 
                    ${submenu === item.id ? "bg-blue-900 text-white" : ""}`}
              >
                <Link href={item.url}>{item.title}</Link>
              </li>
            ))}
        </ul>
      </div>
    </>
  );
}
