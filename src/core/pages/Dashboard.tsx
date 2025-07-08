import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
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
                  Course Progress
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
                  Scheduled Classes & Exams
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
                  Scheduled 
                </CardTitle>
              </CardHeader>
              <Separator />
              <CardContent className="text-sm p-2.5 text-gray-400">
                Card Content
              </CardContent>
            </Card>
          </div>
          <div className="bg-muted/50  flex-1 rounded-xl ">
            <div className="grid auto-rows-min gap-4 md:grid-cols-2">
              <Card className="bg-muted/50 aspect-video rounded-xl border-[.5px]">
                <CardHeader className=" p-2.5">
                  <CardTitle className="text-md text-gray-600">
                    Progress Report
                  </CardTitle>
                </CardHeader>
                <Separator />
                <CardContent className="text-sm p-2.5 text-gray-400">
                  <ChartContainer
                    config={chartConfig}
                    className="min-h-[200px] w-full"
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
                      <Bar
                        dataKey="HTML"
                        fill="var(--color-HTML)"
                        radius={4}
                      />
                      <Bar
                        dataKey="CSS"
                        fill="var(--color-CSS)"
                        radius={4}
                      />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>
              <Card className="bg-muted/50 aspect-video rounded-xl border-[.5px]">
                <CardHeader className=" p-2.5">
                  <CardTitle className="text-md text-gray-600">
                    Useful Information
                  </CardTitle>
                </CardHeader>
                <Separator />
                <CardContent className="text-sm p-2.5 text-gray-400">
                  Details
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
  );
}
