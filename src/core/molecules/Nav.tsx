import {
  CloudIcon, DocumentIcon, DocumentTextIcon, FolderIcon
} from "@heroicons/react/24/solid";
import  { useEffect, useState } from "react";
import NavItem from "../atoms/NavItem";

interface NavProps {
  sidebarOutsideClick: boolean;
}

const Nav = ({ sidebarOutsideClick }: NavProps) => {
  const [sidebarStatus, setSidebarStatus] = useState(false);
  const [subMenuToggleStatus, setSubMenuToggleStatus] = useState(false);

  const sidebarClose = () => {
    setSidebarStatus(false);
  };

  const sidebarOpen = () => {
    setSidebarStatus(true);
  };

  const subMenuToggle = () => {
    setSubMenuToggleStatus(!subMenuToggleStatus);
  };

   //if menu has chile menu then  use seperate array
   const childMenu = [
    {
      subMenuTitle: "Testimonial One",
      linkHref: "css"
    },
    {
      subMenuTitle: "child Two",
      linkHref: "/"
    },
    {
      subMenuTitle: "child Three",
      linkHref: "html"
    }
  ];

  useEffect(() => {
    if (sidebarOutsideClick) {
      setSidebarStatus(false);
    }
  }, [sidebarOutsideClick]);
  //console.log("sidebar Nav", sidebarOutsideClick)
  return (
    <>
      <div className="flex">
      <nav className="flex flex-col mx-4 my-6 space-y-4">
       <NavItem
         hrefLink='/dashboard/category'
         sidebarStatus={sidebarStatus}
         menuTitle="Category"
         subMenu={false}
         subMenuArray={null}
       >
         <CloudIcon className="h-10" />
       </NavItem> 

       <NavItem
         hrefLink='/dashboard/sub-category'
         sidebarStatus={sidebarStatus}
         menuTitle="Sub-Category"
         subMenu={false}
         subMenuArray={null}
       >
         <DocumentIcon className="h-10" />
       </NavItem> 

       {/* this menu has child Menu     */}
       <NavItem
         hrefLink='#'
         sidebarStatus={sidebarStatus}
         menuTitle="Chiled Menu"
         subMenu={true}
         subMenuArray={childMenu}
       >
         <FolderIcon className="h-10" />
       </NavItem> 
       <NavItem
         hrefLink='#'
         sidebarStatus={sidebarStatus}
         menuTitle="Chiled Menu"
         subMenu={true}
         subMenuArray={childMenu}
       >
         <DocumentTextIcon className="h-10 text-orange-500" title="HTML5"/>
       </NavItem> 
      
     </nav>
      </div>
      <div>

      </div>
      
    </>
  );
};

export default Nav;
