import {
  Bell,
  ChevronsUpDown,
  CreditCard,
  User,
  LogOut,
  PlusCircle,
  BookOpen,
  Users,
  UserCheck,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../atoms/Avatar/Avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../Sidebar/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../Sidebar/sidebar"
import { useSidebarRedux } from "../../../hooks/useSidebarRedux"
import { Link } from "react-router-dom"

export function NavUser({
  user,
  onLogout
}: {
  user: {
    name: string
    email: string
    photo: string
  }
  onLogout?: () => void
}) {
  const { isMobile } = useSidebarRedux()
console.log('NavUser render: ',  user );
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.photo} alt={user.name} />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.photo} alt={user.name} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <User />
                <Link to="/dashboard/profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <PlusCircle />
                <Link to="/dashboard/create-course">Create Course</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <PlusCircle />
                <Link to="/dashboard/create-tutorial">Create Tutorial</Link>
              </DropdownMenuItem>
              <DropdownMenuItem >
                <CreditCard />
                <Link to="/dashboard/fee-details">Fee Details</Link>
              </DropdownMenuItem>
              <DropdownMenuItem >
                <BookOpen />
                <Link to="/dashboard/enrolled-courses">Enrolled Courses</Link>
              </DropdownMenuItem>
              <DropdownMenuItem >
                <Users />
                <Link to="/dashboard/student-management">Student Management</Link>
              </DropdownMenuItem>
              <DropdownMenuItem >
                <UserCheck />
                <Link to="/dashboard/trainer-management">Trainer Management</Link>
              </DropdownMenuItem>
              <DropdownMenuItem >
                <Bell />
                <Link to="/dashboard/notifications">Notifications</Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => {
              console.log('NavUser: Logout clicked, onLogout function:', onLogout);
              try {
                if (onLogout && typeof onLogout === 'function') {
                  onLogout();
                  console.log('NavUser: onLogout called successfully');
                } else {
                  console.error('NavUser: onLogout is not a function');
                }
              } catch (error) {
                console.error('NavUser: Error calling onLogout:', error);
              }
            }}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}