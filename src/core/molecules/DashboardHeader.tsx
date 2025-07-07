import { MoonIcon } from '@heroicons/react/24/solid';
import LogOutButton from '../atoms/LogOutButton';
import Notifications from '../atoms/Notifications';
import UserMenu from '../atoms/UserMenu';

type DashboardHeaderProps = {
  mobileNavsidebar: boolean;
  setMobileNavsidebar: (value: boolean) => void;
};

const DashboardHeader = ({mobileNavsidebar, setMobileNavsidebar}: DashboardHeaderProps) => {
  return (
    <header className="flex items-center h-20 px-6 sm:px-10 bg-white">
        
        <MoonIcon className='h-12 stroke-slate-600 cursor-pointer sm:hidden' onClick={()=>setMobileNavsidebar(!mobileNavsidebar)}/>        
        <div className="flex flex-shrink-0 items-center ml-auto">
         <UserMenu />
          <div className="border-l pl-3 ml-3 space-x-1">
            <Notifications />
            <LogOutButton />
          </div>
        </div>
      </header>
  );
};

export default DashboardHeader;