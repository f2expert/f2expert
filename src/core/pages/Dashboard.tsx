import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { FaListCheck } from "react-icons/fa6";
import { LuCalendarClock } from "react-icons/lu";


import { Separator } from "../../components/ui/separator";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";

import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "../../components/ui/chart";

import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { format, parse, startOfWeek, getDay } from "date-fns";

import { enUS } from "date-fns/locale/en-US";
import { Progress } from "../../components/ui/progress";
import { FaChartBar, FaRegCalendarAlt, FaRegCalendarCheck } from "react-icons/fa";

const locales = {
  "en-US": enUS,
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const events = [
  {
    title: "HTML Class",
    start: new Date(2025, 6, 8, 10, 0), // July 8, 2025, 10:00 AM
    end: new Date(2025, 6, 8, 11, 0),
  },
  {
    title: "Exam",
    start: new Date(2025, 6, 9, 14, 0),
    end: new Date(2025, 6, 9, 15, 0),
  },
];
const chartData = [
  { month: "January", HTML: 186, CSS: 80 },
  { month: "February", HTML: 305, CSS: 200 },
  { month: "March", HTML: 237, CSS: 120 },
  { month: "April", HTML: 73, CSS: 190 },
  { month: "May", HTML: 209, CSS: 130 },
  { month: "June", HTML: 214, CSS: 140 },
];
const chartConfig = {
  HTML: {
    label: "HTML",
    color: "#2563eb",
  },
  CSS: {
    label: "CSS",
    color: "#60a5fa",
  },
} satisfies ChartConfig;

export default function Dashboard() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 max-h-[calc(100vh-65px)] overflow-y-auto">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <Card className="bg-muted/50 aspect-video rounded-xl border-[.5px]">
          <CardHeader className=" p-2.5">
            <CardTitle className="text-md text-gray-600">
              <div className="flex items-center space-x-2">
                <FaListCheck />
                <span>Course Progress</span>
              </div>
            </CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="text-sm p-2.5 text-gray-400">
            HTML <Progress value={85} className="[&>div]:bg-green-500 bg-gray-400" />
            CSS <Progress value={55} className="[&>div]:bg-blue-500 bg-gray-400" />
            JS <Progress value={33} className="[&>div]:bg-red-500 bg-gray-400" />
          </CardContent>
        </Card>
        <Card className="bg-muted/50 aspect-video rounded-xl border-[.5px]">
          <CardHeader className=" p-2.5">
            <CardTitle className="text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <FaRegCalendarCheck />
                <span>Today Events</span>
              </div>
               
            </CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="text-sm p-2.5 text-gray-400">
            Details
          </CardContent>
        </Card>
        <Card className="bg-muted/50 aspect-video rounded-xl border-[.5px]">
          <CardHeader className=" p-2.5">
            <CardTitle className="text-md text-gray-600">
              <div className="flex items-center space-x-2">
                <FaRegCalendarAlt />
                <span>Plan Your Day</span>
              </div>              
            </CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="text-sm p-2.5 text-gray-400">
            info
          </CardContent>
        </Card>
      </div>
      <div className="bg-muted/50  flex-1 rounded-xl ">
        <div className="grid auto-rows-min md:grid-cols-2 gap-4">          
          <Card className="bg-muted/50 aspect-video rounded-xl border-[.5px]">
            <CardHeader className=" p-2.5">
              <CardTitle className="text-md text-gray-600">
                <div className="flex items-center space-x-2">
                    <LuCalendarClock />                    
                    <span>Scheduled Classes & Exams</span>
                  </div> 
                
              </CardTitle>
            </CardHeader>
            <Separator />
            <CardContent className="text-sm text-gray-400 p-4 h-[400px]">
                <Calendar
                  localizer={localizer}
                  events={events}
                  startAccessor="start"
                  endAccessor="end"
                  style={{ height: "100%" }}
                  views={['month']}
                />
            </CardContent>
          </Card>
            <Card className="bg-muted/50 aspect-video rounded-xl border-[.5px]">
                <CardHeader className=" p-2.5">
                <CardTitle className="text-md text-gray-600">                  
                  <div className="flex items-center space-x-2">
                    <FaChartBar />
                    <span>Examination Reports</span>
                  </div>                   
                </CardTitle>
                </CardHeader>
                <Separator />
                <CardContent className="text-sm text-gray-400 h-[400px]">
                <ChartContainer
                config={chartConfig}
                className="min-h-[400px] w-full text-sm"
              >
                <BarChart accessibilityLayer data={chartData}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.slice(0, 3)}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent payload={[]} />} />
                  <Bar dataKey="HTML" fill="var(--color-HTML)" radius={4} />
                  <Bar dataKey="CSS" fill="var(--color-CSS)" radius={4} />
                </BarChart>
              </ChartContainer>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
