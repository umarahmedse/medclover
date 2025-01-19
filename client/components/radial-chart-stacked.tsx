"use client";

import { TrendingUp } from "lucide-react";
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [{ month: "january", cases: 75, remaining: 25 }];

export function RadialChartStacked({
  chartFirstColor,
  chartSecondColor,
  title,
  subtitle,
  chartFooter,
}: {
  chartFirstColor: string;
  chartSecondColor: string;
  title: string;
  subtitle: string;
  chartFooter: string;
}) {
  const chartConfig = {
    cases: {
      label: "Cases",
      color: chartFirstColor,
    },
    remaining: {
      color: chartSecondColor,
    },
  } satisfies ChartConfig;

  const totalVisitors = chartData[0].cases;

  return (
    <Card className="flex flex-col flex-grow">
      <CardHeader className="items-center pb-2">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{subtitle}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-[4/3] w-full max-w-[400px]"
        >
          <RadialBarChart
            data={chartData}
            startAngle={180}
            endAngle={0}
            innerRadius={80}
            outerRadius={140}
            barSize={30}
          >
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={(viewBox.cy ?? 0) + 40}
                        textAnchor="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 30}
                          className="fill-foreground text-3xl font-bold"
                          style={{ fill: chartFirstColor }}
                        >
                          {totalVisitors.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 55}
                          className="fill-muted-foreground text-sm"
                        >
                          {chartFooter}
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
            <RadialBar
              dataKey="cases"
              stackId="a"
              cornerRadius={15}
              fill={chartFirstColor}
              className="stroke-background stroke-2"
            />
            <RadialBar
              dataKey="remaining"
              fill={chartSecondColor}
              stackId="a"
              cornerRadius={15}
              className="stroke-background stroke-2"
            />
          </RadialBarChart>
        </ChartContainer>
        <div className="flex flex-col items-center gap-1 -mt-8">
          <div className="flex items-center gap-2 font-medium text-sm">
            Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
          </div>
          <div className="text-xs text-muted-foreground">
            Showing total visitors for the last 6 months
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
