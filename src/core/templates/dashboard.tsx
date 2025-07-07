import { Outlet } from "react-router-dom";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "../../components/ui/sidebar";
import { AppSidebar } from "../../components/ui/app-sidebar";
import { Separator } from "../../components/ui/separator";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";

export default function Dashboard() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
          </div>
        </header>
        <Separator />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-4 max-h-[calc(100vh-65px)] overflow-y-auto">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <Card className="bg-muted/50 aspect-video rounded-xl border-[.5px]">
              <CardHeader className=" p-2.5">
                <CardTitle className="text-md text-gray-600">
                  Card Title
                </CardTitle>
              </CardHeader>
              <Separator />
              <CardContent className="text-sm p-2.5 text-gray-400">
                Card Content
              </CardContent>
            </Card>
            <Card className="bg-muted/50 aspect-video rounded-xl border-[.5px]">
              <CardHeader className=" p-2.5">
                <CardTitle className="text-md text-gray-600">
                  Card Title
                </CardTitle>
              </CardHeader>
              <Separator />
              <CardContent className="text-sm p-2.5 text-gray-400">
                Card Content
              </CardContent>
            </Card>
            <Card className="bg-muted/50 aspect-video rounded-xl border-[.5px]">
              <CardHeader className=" p-2.5">
                <CardTitle className="text-md text-gray-600">
                  Card Title
                </CardTitle>
              </CardHeader>
              <Separator />
              <CardContent className="text-sm p-2.5 text-gray-400">
                Card Content
              </CardContent>
            </Card>
          </div>
          <div className="bg-muted/50  flex-1 rounded-xl ">
            <Outlet />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
