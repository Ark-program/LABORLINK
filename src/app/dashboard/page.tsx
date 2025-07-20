"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  PlusCircle,
  MessageSquare,
  BarChart3,
  FileText,
  CreditCard,
} from "lucide-react";
import FinancialOverview from "@/components/dashboard/FinancialOverview";
import AIChatPanel from "@/components/dashboard/AIChatPanel";
import ExpenseVisualization from "@/components/dashboard/ExpenseVisualization";

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-background px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="rounded-md bg-[#002148] p-2">
              <span className="text-lg font-bold text-white">LL</span>
            </div>
            <h1 className="text-xl font-bold text-[#002148]">
              Labor Link Finance
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm">
              <CreditCard className="mr-2 h-4 w-4" />
              Connect Cards
            </Button>
            <div className="h-8 w-8 overflow-hidden rounded-full bg-[#566B84]">
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=John"
                alt="User Avatar"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 flex-col lg:flex-row">
        {/* Left Side - Financial Overview & Expense Visualization */}
        <div className="flex flex-1 flex-col p-6">
          <h2 className="mb-6 text-2xl font-bold text-[#002148]">
            Financial Dashboard
          </h2>

          {/* Financial Overview Cards */}
          <section className="mb-6">
            <FinancialOverview />
          </section>

          {/* Expense Visualization */}
          <section className="flex-1">
            <Card className="h-full border-[#2B4665]/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl text-[#002148]">
                      Expense Visualization
                    </CardTitle>
                    <CardDescription>
                      Track and analyze your business expenses
                    </CardDescription>
                  </div>
                  <Tabs defaultValue="chart" className="w-[400px]">
                    <TabsList>
                      <TabsTrigger value="chart">
                        <BarChart3 className="mr-2 h-4 w-4" />
                        Charts
                      </TabsTrigger>
                      <TabsTrigger value="transactions">
                        <FileText className="mr-2 h-4 w-4" />
                        Transactions
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </CardHeader>
              <CardContent>
                <ExpenseVisualization />
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Right Side - AI Chat Panel */}
        <div className="w-full border-t border-border p-6 lg:w-[450px] lg:border-l lg:border-t-0">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-[#002148]">AI Assistant</h2>
            <Button variant="outline" size="sm">
              <PlusCircle className="mr-2 h-4 w-4" />
              New Chat
            </Button>
          </div>
          <div className="mt-4">
            <Card className="border-[#2B4665]/20">
              <CardContent className="p-0">
                <AIChatPanel />
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="mt-6">
            <h3 className="mb-3 text-sm font-medium text-muted-foreground">
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" className="justify-start">
                <FileText className="mr-2 h-4 w-4" />
                Create Invoice
              </Button>
              <Button variant="outline" className="justify-start">
                <FileText className="mr-2 h-4 w-4" />
                Create Contract
              </Button>
              <Button variant="outline" className="justify-start">
                <BarChart3 className="mr-2 h-4 w-4" />
                Financial Insights
              </Button>
              <Button variant="outline" className="justify-start">
                <CreditCard className="mr-2 h-4 w-4" />
                Connect Cards
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
