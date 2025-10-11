import React from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { AppSidebar } from '../../organisms/AppSidebar';
import { SidebarInset, SidebarTrigger } from '../../atoms';
import { Separator } from '../../atoms/Separator';
// import { SidebarDataManager } from '../../debug/SidebarDataManager/SidebarDataManager';
import { 
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '../../atoms/Breadcrumb';

export interface ProtectedProps {
  children?: React.ReactNode;
  className?: string;
  userName?: string;
  userEmail?: string;
  isAuthenticated?: boolean;
  onLogout?: () => void;
}

export const Protected: React.FC<ProtectedProps> = ({
  userName = "John Doe",
  userEmail = "john@example.com",
  onLogout,
}) => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);
  
  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar 
        userName={userName}
        userEmail={userEmail}
        onLogout={onLogout}
      />
      <SidebarInset className="flex-1">
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/">Home</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                {pathnames?.map((name, index) => {
                  const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
                  const isLast = index === pathnames.length - 1;
                  const label = decodeURIComponent(name).replace(/-/g, " ").replace(/^\w/, (c) => c.toUpperCase());
                  return isLast ? (
                    <BreadcrumbItem key={routeTo}>
                      <BreadcrumbPage>{label}</BreadcrumbPage>
                    </BreadcrumbItem>
                  ) : (
                    <React.Fragment key={routeTo}>
                      <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                          <Link to={routeTo}>{label}</Link>
                        </BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator />
                    </React.Fragment>
                  );
                })}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <Separator/>
        <div className="flex flex-1 flex-col gap-4 p-4 max-h-[calc(100vh-65px)] overflow-y-auto">
          {/* Uncomment below to show sidebar data manager for testing */}
          {/* <SidebarDataManager /> */}
          <Outlet />
        </div>
      </SidebarInset>
    </div>
  );
};

export default Protected;