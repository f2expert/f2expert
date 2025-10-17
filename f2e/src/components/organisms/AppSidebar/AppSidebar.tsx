import * as React from "react"

import { NavMain } from "../../molecules/NavMain/NavMain"
import { TeamSwitcher } from "../../molecules/TeamSwitcher/TeamSwitcher"
import { NavUser } from "../../molecules/NavUser/NavUser"
import { Separator } from "../../atoms/Separator";
import { useSidebarRedux, useSidebarData, useMenuApi } from '../../../hooks';
import { cn } from '../../../lib/utils';

interface AppSidebarProps {
  userName?: string;
  userEmail?: string;
  onLogout?: () => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  userName,
  userEmail,
  onLogout,
}) => {
  const { open, isMobile, openMobile, setOpenMobile, setIsMobile } = useSidebarRedux();
  const { user, teams, navMain, updateUser } = useSidebarData();
  const { isLoading: menuLoading, error: menuError, refreshMenu } = useMenuApi();
  const lastUpdateRef = React.useRef({ userName: '', userEmail: '' });

  // Handle mobile detection
  React.useEffect(() => {
    const checkMobile = () => {
      const isMobileScreen = window.innerWidth < 768;
      setIsMobile(isMobileScreen);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [setIsMobile]);

  // Update user data in Redux when props change
  React.useEffect(() => {
    if (userName || userEmail) {
      // Only update if values actually changed since last update
      if (userName !== lastUpdateRef.current.userName || userEmail !== lastUpdateRef.current.userEmail) {
        const updates: { name?: string; email?: string } = {};
        if (userName && userName !== user.name) updates.name = userName;
        if (userEmail && userEmail !== user.email) updates.email = userEmail;
        if (Object.keys(updates).length > 0) {
          updateUser(updates);
          lastUpdateRef.current = { userName: userName || '', userEmail: userEmail || '' };
          
          // Refresh menu when user data changes (role might have changed)
          refreshMenu();
        }
      }
    }
  }, [userName, userEmail, user.name, user.email, updateUser, refreshMenu]);

  // Debug logging for menu state
  React.useEffect(() => {
    if (menuError) {
      console.error('Menu API error:', menuError);
    }
    if (menuLoading) {
      console.log('Loading dynamic menu...');
    }
  }, [menuError, menuLoading]);

  // Use updated user data
  const userData = {
    name: userName || user.name,
    email: userEmail || user.email,
    avatar: user.avatar,
  };

  // Always render desktop sidebar, handle mobile with CSS
  return (
    <>
      {/* Mobile overlay */}
      {isMobile && (
        <div 
          className={cn(
            "fixed inset-0 z-50 bg-black/50 transition-opacity md:hidden",
            openMobile ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
          onClick={() => setOpenMobile(false)}
        >
          <aside 
            className={cn(
              "fixed left-0 top-0 z-60 h-screen w-80 transform bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out flex flex-col",
              openMobile ? "translate-x-0" : "-translate-x-full"
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col h-full">
              <div className="p-4">
                <TeamSwitcher teams={teams} />
              </div>
              <Separator />
              <div className="flex-1 overflow-auto p-4">
                <NavMain items={navMain} />
              </div>
              <Separator />
              <div className="p-4">
                <NavUser 
                  user={userData} 
                  onLogout={onLogout}
                />
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* Desktop sidebar - always visible */}
      <aside className={cn(
        "flex h-screen bg-white border-r border-gray-200 transition-all duration-300 ease-in-out flex-col shrink-0",
        "hidden md:flex", // Only show on desktop
        open ? "w-80" : "w-16"
      )}>
        <div className="flex flex-col h-full w-full overflow-hidden">
          <div className="p-1">
            <TeamSwitcher teams={teams} />
          </div>
          <Separator />
          <div className="flex-1 overflow-auto p-4">
            {menuLoading ? (
              <div className="flex items-center justify-center p-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-sm text-gray-500">Loading menu...</span>
              </div>
            ) : menuError ? (
              <div className="p-4">
                <div className="text-sm text-red-600 mb-2">Failed to load menu</div>
                <button 
                  onClick={refreshMenu}
                  className="text-xs text-blue-600 hover:text-blue-800"
                >
                  Retry
                </button>
              </div>
            ) : (
              <NavMain items={navMain} />
            )}
          </div>
          <Separator />
          <div className="p-1">
            <NavUser 
              user={userData} 
              onLogout={onLogout}
            />
          </div>
        </div>
      </aside>
    </>
  );
};

export default AppSidebar;