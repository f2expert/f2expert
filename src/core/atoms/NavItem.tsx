import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';


interface NavItemProps {
    sidebarStatus: boolean;
    menuTitle: string;
    subMenu?: boolean;
    subMenuArray?: { linkHref: string; subMenuTitle: string }[];
    hrefLink: string;
    children: React.ReactNode;
}

const NavItem = ({sidebarStatus, menuTitle, subMenu, subMenuArray, hrefLink, children}: NavItemProps) => {
    const [subMenuToggleStatus, setSubMenuToggleStatus] = useState(false);
    const subMenuToggle = ()=>{
        setSubMenuToggleStatus(!subMenuToggleStatus)
      }
      
    useEffect(()=>{
        if(!sidebarStatus){
            setSubMenuToggleStatus(false)
        }
    },[sidebarStatus])  
    //console.log('submenu', sidebarStatus)
    return (
        <>  
            <Link to={hrefLink}>
               <span  className="inline-flex items-center justify-between py-3 hover:text-gray-400 hover:bg-gray-700 focus:text-gray-400 focus:bg-gray-700 rounded-lg px-3 cursor-pointer relative group" onClick={subMenuToggle}>
                    {children}
                     <span className={`${sidebarStatus ? 'text-base ml-2' : 'sr-only'}`}>{menuTitle}</span> 
                     {/*<span className={`${sidebarStatus ? 'hidden' : 'hidden group-hover:block'} absolute left-0 -bottom-5 bg-yellow-500 text-white p-1 text-xs`}>{menuTitle}</span>*/}
                </span>
            </Link>

            {/* Chile Menu */}
            {subMenu && (
                <ul className={`${subMenuToggleStatus ? '' : 'hidden'} absolute top-[63px] left-24 bg-gray-700 text-white space-y-2 p-3 shadow-md w-fit text-nowrap h-[calc(100vh-80px)]`}>
                    {subMenuArray?.map((subMenuSingle, index)=> (
                        <li key={index} className='cursor-pointer active:text-orange-400 hover:text-purple-500' >
                            <Link to={subMenuSingle.linkHref}>{subMenuSingle.subMenuTitle}</Link>
                        </li>
                        ))
                    }
                </ul>      
            )}
          
          
        </>
    );
};

export default NavItem;