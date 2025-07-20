"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  DollarSign,
  Calendar,
  TrendingUp,
} from "lucide-react";

interface FinancialMetric {
  title: string;
  value: string;
  change: {
    value: string;
    isPositive: boolean;
  };
  icon: React.ReactNode;
}

interface FinancialOverviewProps {
  metrics?: FinancialMetric[];
}

const FinancialOverview = ({
  metrics = defaultMetrics,
}: FinancialOverviewProps) => {
  return (
    <div className="w-full bg-white dark:bg-gray-900 p-4 rounded-lg">
      <h2 className="text-xl font-semibold mb-4 text-[#002148] dark:text-white">
        Financial Overview
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {metrics.map((metric, index) => (
          <Card
            key={index}
            className="border-[#566B84]/20 hover:shadow-md transition-shadow duration-200"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-[#2B4665] dark:text-gray-200">
                {metric.title}
              </CardTitle>
              <div className="p-2 bg-[#002148]/10 rounded-full">
                {metric.icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#002148] dark:text-white">
                {metric.value}
              </div>
              <div className="flex items-center mt-1">
                <span
                  className={`flex items-center text-xs ${metric.change.isPositive ? "text-green-600" : "text-red-600"}`}
                >
                  {metric.change.isPositive ? (
                    <ArrowUpIcon className="h-3 w-3 mr-1" />
                  ) : (
                    <ArrowDownIcon className="h-3 w-3 mr-1" />
                  )}
                  {metric.change.value}
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
    title: "Total Revenue",
    value: "$24,780",
    change: {
      value: "12%",
      isPositive: true,
    },
    icon: <DollarSign className="h-4 w-4 text-[#002148]" />,
  },
  {
    title: "Total Expenses",
    value: "$8,230",
    change: {
      value: "4%",
      isPositive: false,
    },
    icon: <DollarSign className="h-4 w-4 text-[#002148]" />,
  },
  {
    title: "Upcoming Invoices",
    value: "$12,500",
    change: {
      value: "18%",
      isPositive: true,
    },
    icon: <Calendar className="h-4 w-4 text-[#002148]" />,
  },
];

export default FinancialOverview;
