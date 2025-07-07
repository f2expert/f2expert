import  { useRef } from 'react';
import {useOutsideClick} from '../../utils/outsideClick';
import Nav from '../molecules/Nav';
//import SettingButton from './sidebar/SettingButton';
import Logo from '../atoms/Logo';

interface SidebarProps {
    mobileNavsidebar: boolean;
}

const Sidebar = ({mobileNavsidebar}: SidebarProps) => {
    const sidebarRef = useRef<HTMLElement>(null as unknown as HTMLElement);;
    const sidebarOutsideClick = useOutsideClick(sidebarRef);

    //console.log("sidebar Ref", sidebarRef)
    //console.log("sidebar Ref sidebarOutsideClick", sidebarOutsideClick)
    return (
        <aside className={`${mobileNavsidebar ? 'block' : 'hidden'} sm:flex sm:flex-col z-50`} ref={sidebarRef}>
            <Logo />
            <div className="flex-grow flex flex-col justify-between text-white bg-gray-800 max-w-[97px]">
                <Nav sidebarOutsideClick={sidebarOutsideClick} />
                {/*<SettingButton />*/}
            </div>
        </aside>
    );
};

export default Sidebar;