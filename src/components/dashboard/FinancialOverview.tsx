"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  DollarSign,
  Calendar,
  TrendingUp,
  FileText,
  CheckCircle,
} from "lucide-react";

interface FinancialMetric {
  label: string;
  value: number | string;
  trend: "up" | "down" | "neutral";
  trendValue: number;
  icon: React.ReactNode;
  formatValue?: boolean;
}

interface FinancialOverviewProps {
  metrics?: FinancialMetric[];
}

const FinancialOverview = ({
  metrics = defaultMetrics,
}: FinancialOverviewProps) => {
  const formatValue = (
    value: number | string,
    shouldFormat: boolean = false,
  ) => {
    if (typeof value === "number" && shouldFormat) {
      return `${value.toLocaleString()}`;
    }
    return value;
  };

  const getTrendIcon = (trend: FinancialMetric["trend"]) => {
    switch (trend) {
      case "up":
        return <ArrowUpIcon className="h-3 w-3 mr-1" />;
      case "down":
        return <ArrowDownIcon className="h-3 w-3 mr-1" />;
      default:
        return null;
    }
  };

  const getTrendColor = (trend: FinancialMetric["trend"]) => {
    switch (trend) {
      case "up":
        return "text-green-600";
      case "down":
        return "text-red-600";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div className="w-full bg-white dark:bg-gray-900 p-4 rounded-lg">
      <h2 className="text-xl font-semibold mb-4 text-[#002148] dark:text-white">
        Financial Overview
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <Card
            key={index}
            className="border-[#566B84]/20 hover:shadow-md transition-shadow duration-200"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-[#2B4665] dark:text-gray-200">
                {metric.label}
              </CardTitle>
              <div className="p-2 bg-[#002148]/10 rounded-full">
                {metric.icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#002148] dark:text-white">
                {formatValue(metric.value, metric.formatValue)}
              </div>
              <div className="flex items-center mt-1">
                <span
                  className={`flex items-center text-xs ${getTrendColor(metric.trend)}`}
                >
                  {getTrendIcon(metric.trend)}
                  {metric.trendValue}%
                </span>
                <span className="text-xs text-gray-500 ml-1">
                  from last month
                </span>
              </div>
              <div className="mt-4 h-10">
                {/* Placeholder for mini chart - would be replaced with actual chart component */}
                <div className="w-full h-full bg-gradient-to-r from-[#032349]/10 to-[#2B4665]/20 rounded-md flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-[#002148] opacity-50" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

const defaultMetrics: FinancialMetric[] = [
  {
    label: "Total Revenue",
    value: 125000,
    trend: "up",
    trendValue: 5.4,
    icon: <DollarSign className="h-4 w-4 text-[#002148]" />,
    formatValue: true,
  },
  {
    label: "Monthly Expenses",
    value: 45000,
    trend: "down",
    trendValue: 2.1,
    icon: <DollarSign className="h-4 w-4 text-[#002148]" />,
    formatValue: true,
  },
  {
    label: "Pending Invoices",
    value: 12,
    trend: "up",
    trendValue: 10,
    icon: <FileText className="h-4 w-4 text-[#002148]" />,
    formatValue: false,
  },
  {
    label: "Completed Jobs",
    value: 87,
    trend: "up",
    trendValue: 3.2,
    icon: <CheckCircle className="h-4 w-4 text-[#002148]" />,
    formatValue: false,
  },
];

export default FinancialOverview;
