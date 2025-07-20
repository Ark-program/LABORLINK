"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, PlusIcon, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExpenseVisualizationProps {
  className?: string;
}

const ExpenseVisualization = ({
  className = "",
}: ExpenseVisualizationProps) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [dateRange, setDateRange] = useState<
    "week" | "month" | "quarter" | "year"
  >("month");
  const [category, setCategory] = useState<string>("all");

  // Mock data for visualizations
  const mockPieChartData = [
    { category: "Materials", value: 35, color: "#566B84" },
    { category: "Labor", value: 25, color: "#002148" },
    { category: "Equipment", value: 15, color: "#032349" },
    { category: "Transportation", value: 10, color: "#002147" },
    { category: "Office", value: 15, color: "#2B4665" },
  ];

  const mockBarChartData = [
    { month: "Jan", amount: 1200 },
    { month: "Feb", amount: 1800 },
    { month: "Mar", amount: 1400 },
    { month: "Apr", amount: 2200 },
    { month: "May", amount: 1900 },
    { month: "Jun", amount: 2400 },
  ];

  const mockLineChartData = [
    { date: "Week 1", amount: 500 },
    { date: "Week 2", amount: 700 },
    { date: "Week 3", amount: 600 },
    { date: "Week 4", amount: 900 },
  ];

  const categories = [
    "All Categories",
    "Materials",
    "Labor",
    "Equipment",
    "Transportation",
    "Office",
  ];

  // Render pie chart with mock data
  const renderPieChart = () => {
    const total = mockPieChartData.reduce((sum, item) => sum + item.value, 0);
    let cumulativeAngle = 0;

    return (
      <div className="relative w-64 h-64 mx-auto">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {mockPieChartData.map((item, index) => {
            const startAngle = cumulativeAngle;
            const percentage = (item.value / total) * 100;
            const angle = (percentage / 100) * 360;
            cumulativeAngle += angle;
            const endAngle = cumulativeAngle;

            const startRad = ((startAngle - 90) * Math.PI) / 180;
            const endRad = ((endAngle - 90) * Math.PI) / 180;

            const x1 = 50 + 40 * Math.cos(startRad);
            const y1 = 50 + 40 * Math.sin(startRad);
            const x2 = 50 + 40 * Math.cos(endRad);
            const y2 = 50 + 40 * Math.sin(endRad);

            const largeArcFlag = angle > 180 ? 1 : 0;

            const pathData = [
              `M 50 50`,
              `L ${x1} ${y1}`,
              `A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2}`,
              `Z`,
            ].join(" ");

            return (
              <path
                key={index}
                d={pathData}
                fill={item.color}
                stroke="#fff"
                strokeWidth="0.5"
              />
            );
          })}
        </svg>
      </div>
    );
  };

  // Render bar chart with mock data
  const renderBarChart = () => {
    const maxAmount = Math.max(...mockBarChartData.map((item) => item.amount));

    return (
      <div className="h-64 flex items-end space-x-4 pt-6 px-4">
        {mockBarChartData.map((item, index) => {
          const height = (item.amount / maxAmount) * 100;

          return (
            <div key={index} className="flex flex-col items-center flex-1">
              <div
                className="w-full bg-oxford-blue rounded-t-md"
                style={{ height: `${height}%` }}
              ></div>
              <span className="text-xs mt-2">{item.month}</span>
            </div>
          );
        })}
      </div>
    );
  };

  // Render line chart with mock data
  const renderLineChart = () => {
    const maxAmount = Math.max(...mockLineChartData.map((item) => item.amount));
    const points = mockLineChartData
      .map((item, index) => {
        const x = (index / (mockLineChartData.length - 1)) * 100;
        const y = 100 - (item.amount / maxAmount) * 100;
        return `${x},${y}`;
      })
      .join(" ");

    return (
      <div className="h-64 w-full relative pt-6">
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          <polyline
            points={points}
            fill="none"
            stroke="#002148"
            strokeWidth="2"
          />
          {mockLineChartData.map((item, index) => {
            const x = (index / (mockLineChartData.length - 1)) * 100;
            const y = 100 - (item.amount / maxAmount) * 100;

            return <circle key={index} cx={x} cy={y} r="2" fill="#002148" />;
          })}
        </svg>
        <div className="flex justify-between mt-2">
          {mockLineChartData.map((item, index) => (
            <span key={index} className="text-xs">
              {item.date}
            </span>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Card className={cn("bg-white", className)}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-bold text-oxford-blue-3">
          Expense Visualization
        </CardTitle>
        <div className="flex space-x-2">
          <Select
            value={dateRange}
            onValueChange={(value) => setDateRange(value as any)}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Week</SelectItem>
              <SelectItem value="month">Month</SelectItem>
              <SelectItem value="quarter">Quarter</SelectItem>
              <SelectItem value="year">Year</SelectItem>
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[180px] justify-start text-left font-normal",
                  !date && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat, index) => (
                <SelectItem
                  key={index}
                  value={cat.toLowerCase().replace(" ", "-")}
                >
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="pie" className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="pie">Pie Chart</TabsTrigger>
            <TabsTrigger value="bar">Bar Graph</TabsTrigger>
            <TabsTrigger value="line">Line Chart</TabsTrigger>
          </TabsList>

          <TabsContent value="pie" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>{renderPieChart()}</div>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-oxford-blue-3">
                  Expense Breakdown
                </h3>
                <div className="space-y-2">
                  {mockPieChartData.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center">
                        <div
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: item.color }}
                        ></div>
                        <span>{item.category}</span>
                      </div>
                      <span className="font-medium">{item.value}%</span>
                    </div>
                  ))}
                </div>
                <div className="pt-4 border-t">
                  <div className="flex justify-between">
                    <span className="font-medium">Total Expenses:</span>
                    <span className="font-bold">$12,500</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="bar">
            <div className="space-y-6">
              {renderBarChart()}
              <div className="flex justify-between items-center pt-4 border-t">
                <div>
                  <h3 className="text-lg font-semibold text-oxford-blue-3">
                    Monthly Expenses
                  </h3>
                  <p className="text-sm text-gray-500">First half of 2023</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Total</p>
                  <p className="font-bold">$10,900</p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="line">
            <div className="space-y-6">
              {renderLineChart()}
              <div className="flex justify-between items-center pt-4 border-t">
                <div>
                  <h3 className="text-lg font-semibold text-oxford-blue-3">
                    Weekly Expenses
                  </h3>
                  <p className="text-sm text-gray-500">Current month</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Average</p>
                  <p className="font-bold">$675 / week</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-8 pt-6 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h3 className="text-lg font-semibold text-oxford-blue-3">
                Connect Your Company Cards
              </h3>
              <p className="text-sm text-gray-500">
                Link your business cards to automatically track and categorize
                expenses
              </p>
            </div>
            <Button className="bg-oxford-blue hover:bg-indigo-dye">
              <CreditCard className="mr-2 h-4 w-4" />
              Connect Cards
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpenseVisualization;
