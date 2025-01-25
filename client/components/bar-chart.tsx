/* eslint-disable */

"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChartSkeleton } from "./bar-chart-skeleton";

// Define chart configuration
const chartConfig = {
  deaths: {
    label: "Deaths",
    color: "rgb(81, 207, 102)",
  },
  label: {
    color: "hsl(var(--background))",
  },
} satisfies ChartConfig;

export function BarChartStacked() {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/charts"); // Replace with your actual API route
        const diseases = response.data;

        // Transform data for Recharts
        const formattedData = diseases.map((disease: any) => ({
          name: disease.disease,
          deaths: disease.deaths, // Keep numeric for scaling
          deathsDisplay: (disease.deaths / 1000).toFixed(1) + "k", // Format for display
          recoveryRate: disease.recovery_rate,
        }));

        setChartData(formattedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false); // Set loading to false after data fetch
      }
    };

    fetchData();
  }, []);

  return (
    <Card className="md:h-[350px]">
      <CardHeader>
        <CardTitle>Deadly Diseases Chart</CardTitle>
        <CardDescription>Top Occurring Diseases In Area</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          // Show your custom skeleton component here
          <BarChartSkeleton/> // Custom skeleton loader, replace with your own
        ) : (
          <ChartContainer config={chartConfig}>
            <BarChart
              accessibilityLayer
              data={chartData}
              layout="vertical"
              margin={{
                right: 0,
              }}
            >
              <CartesianGrid horizontal={false} />
              <YAxis
                dataKey="name"
                type="category"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                hide
              />
              <XAxis dataKey="deaths" type="number" />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    indicator="line"
                    formatter={(value: number | string | (number | string)[]) => {
                      if (Array.isArray(value)) {
                        return value
                          .map((v) =>
                            typeof v === "number"
                              ? `${(v / 1000).toFixed(1)}k`
                              : v
                          )
                          .join(", ");
                      }
                      return typeof value === "number"
                        ? `${(value / 1000).toFixed(1)}k`
                        : value;
                    }}
                  />
                }
              />
              <Bar dataKey="deaths" fill="var(--color-deaths)" radius={4}>
                <LabelList
                  dataKey="name"
                  position="insideLeft"
                  offset={8}
                  className="fill-[--color-label] "
                  fontSize={12}
                />
                <LabelList
                  dataKey="deathsDisplay"
                  position="right"
                  offset={8}
                  className="fill-foreground"
                  fontSize={12}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Disease Trends <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Data fetched from AI-enhanced sources
        </div>
      </CardFooter>
    </Card>
  );
}
