import React from 'react';
import { Button } from '../../atoms/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../atoms/DropdownMenu';
import { 
  PersonIcon, 
  GearIcon, 
  ExitIcon,
  QuestionMarkCircledIcon,
  PlusIcon,
  VideoIcon
} from '@radix-ui/react-icons';

export interface UserMenuProps {
  userName: string;
  userEmail?: string;
  onProfile?: () => void;
  onSettings?: () => void;
  onCreateCourse?: () => void;
  onCreateTutorial?: () => void;
  onHelp?: () => void;
  onLogout?: () => void;
  className?: string;
}

export const UserMenu: React.FC<UserMenuProps> = ({
  userName,
  userEmail,
  onProfile,
  onSettings,
  onCreateCourse,
  onCreateTutorial,
  onHelp,
  onLogout,
  className = ''
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm"
          className={`flex items-center gap-2 ${className}`}
        >
          <PersonIcon className="h-4 w-4" />
          {userName}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">S{userName}</p>
            {userEmail && (
              <p className="text-xs leading-none text-gray-600">{userEmail}</p>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {onProfile && (
          <DropdownMenuItem onClick={onProfile}>
            <PersonIcon className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
        )}
        {onSettings && (
          <DropdownMenuItem onClick={onSettings}>
            <GearIcon className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
        )}
        {onCreateCourse && (
          <DropdownMenuItem onClick={onCreateCourse}>
            <PlusIcon className="mr-2 h-4 w-4" />
            <span>Create Course</span>
          </DropdownMenuItem>
        )}
        {onCreateTutorial && (
          <DropdownMenuItem onClick={onCreateTutorial}>
            <VideoIcon className="mr-2 h-4 w-4" />
            <span>Create Tutorial</span>
          </DropdownMenuItem>
        )}
        {onHelp && (
          <DropdownMenuItem onClick={onHelp}>
            <QuestionMarkCircledIcon className="mr-2 h-4 w-4" />
            <span>Help</span>
          </DropdownMenuItem>
        )}
        {onLogout && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onLogout}>
              <ExitIcon className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;