import React from 'react';
import { Button } from '../../atoms/Button';
import { UserMenu } from '../../molecules/UserMenu';
import { 
  HamburgerMenuIcon, 
  MagnifyingGlassIcon,
  BellIcon 
} from '@radix-ui/react-icons';
import { cn } from '../../../lib/utils';

export interface NavbarProps {
  onMenuToggle?: () => void;
  userName?: string;
  userEmail?: string;
  onProfile?: () => void;
  onSettings?: () => void;
  onLogout?: () => void;
  className?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  onMenuToggle,
  userName = "John Doe",
  userEmail = "john@example.com",
  onProfile,
  onSettings,
  onLogout,
  className = ''
}) => {
  return (
    <header className={cn(
      'bg-white border-b border-gray-200 shadow-sm z-30 fixed top-0 left-0 right-0',
      className
    )}>
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        {/* Left section */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuToggle}
            className="lg:hidden"
          >
            <HamburgerMenuIcon className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center space-x-3">
            <h1 className="text-xl font-semibold text-gray-900">
              F2Export
            </h1>
            <span className="hidden sm:inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
              Dashboard
            </span>
          </div>
        </div>

        {/* Center section - Search */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="relative">
            <BellIcon className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-xs text-white font-medium">3</span>
            </span>
          </Button>

          <UserMenu
            userName={userName}
            userEmail={userEmail}
            onProfile={onProfile}
            onSettings={onSettings}
            onLogout={onLogout}
          />
        </div>
      </div>
    </header>
  );
};

export default Navbar;