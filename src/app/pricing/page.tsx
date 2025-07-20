"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Zap, CreditCard, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { createSupabaseClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";

const PricingPage = () => {
  const [loading, setLoading] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createSupabaseClient();

  const handleSubscribe = async (priceId: string, planName: string) => {
    try {
      setLoading(priceId);

      // Get current user
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        router.push("/auth/login");
        return;
      }

      // Call Stripe checkout function
      const { data, error } = await supabase.functions.invoke(
        "supabase-functions-stripe-checkout",
        {
          body: {
            priceId: priceId,
            userId: user.id,
            type: "subscription",
          },
        },
      );

      if (error) {
        console.error("Error creating checkout session:", error);
        alert("Error creating checkout session. Please try again.");
        return;
      }

      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  const handleBuyCredits = async (amount: number, credits: number) => {
    try {
      setLoading(`credits-${amount}`);

      // Get current user
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        router.push("/auth/login");
        return;
      }

      // Create a one-time payment price (you would create these in Stripe dashboard)
      // For demo purposes, using placeholder price IDs
      const creditPriceIds: { [key: number]: string } = {
        5: "price_credits_5", // $5 for 50 credits
        10: "price_credits_10", // $10 for 100 credits
        25: "price_credits_25", // $25 for 250 credits
      };

      const { data, error } = await supabase.functions.invoke(
        "supabase-functions-stripe-checkout",
        {
          body: {
            priceId: creditPriceIds[amount],
            userId: user.id,
            type: "credits",
          },
        },
      );

      if (error) {
        console.error("Error creating checkout session:", error);
        alert("Error creating checkout session. Please try again.");
        return;
      }

      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <div className="rounded-md bg-[#002148] p-2">
                  <span className="text-lg font-bold text-white">LL</span>
                </div>
                <h1 className="text-xl font-bold text-[#002148]">
                  Labor Link Finance
                </h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#002148] mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get started with our AI-powered financial assistant. Choose a plan
            that fits your business needs.
          </p>
        </div>

        {/* Subscription Plans */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* Starter Plan */}
          <Card className="border-2 border-border hover:border-[#002148]/20 transition-colors">
            <CardHeader>
              <CardTitle className="text-2xl text-[#002148]">Starter</CardTitle>
              <CardDescription>
                Perfect for small trade businesses getting started
              </CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold text-[#002148]">$10</span>
                <span className="text-muted-foreground">/month</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  <span>100 AI credits per month</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  <span>Invoice generation</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  <span>Contract templates</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  <span>Basic financial insights</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  <span>Email support</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full bg-[#002148] hover:bg-[#2B4665]"
                onClick={() =>
                  handleSubscribe("price_starter_monthly", "Starter")
                }
                disabled={loading === "price_starter_monthly"}
              >
                {loading === "price_starter_monthly"
                  ? "Processing..."
                  : "Get Started"}
              </Button>
            </CardFooter>
          </Card>

          {/* Professional Plan */}
          <Card className="border-2 border-[#002148] relative hover:border-[#002148]/80 transition-colors">
            <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[#002148] text-white">
              Most Popular
            </Badge>
            <CardHeader>
              <CardTitle className="text-2xl text-[#002148]">
                Professional
              </CardTitle>
              <CardDescription>
                Ideal for growing trade businesses with regular needs
              </CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold text-[#002148]">$25</span>
                <span className="text-muted-foreground">/month</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  <span>300 AI credits per month</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  <span>Advanced invoice customization</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  <span>Custom contract templates</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  <span>Detailed financial analytics</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  <span>Priority support</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  <span>Export to PDF/Excel</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full bg-[#002148] hover:bg-[#2B4665]"
                onClick={() =>
                  handleSubscribe("price_professional_monthly", "Professional")
                }
                disabled={loading === "price_professional_monthly"}
              >
                {loading === "price_professional_monthly"
                  ? "Processing..."
                  : "Upgrade Now"}
              </Button>
            </CardFooter>
          </Card>

          {/* Enterprise Plan */}
          <Card className="border-2 border-border hover:border-[#002148]/20 transition-colors">
            <CardHeader>
              <CardTitle className="text-2xl text-[#002148]">
                Enterprise
              </CardTitle>
              <CardDescription>
                For large trade businesses with extensive requirements
              </CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold text-[#002148]">$75</span>
                <span className="text-muted-foreground">/month</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  <span>1000 AI credits per month</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  <span>Unlimited document generation</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  <span>API access</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  <span>Advanced integrations</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  <span>Dedicated account manager</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  <span>24/7 phone support</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full bg-[#002148] hover:bg-[#2B4665]"
                onClick={() =>
                  handleSubscribe("price_enterprise_monthly", "Enterprise")
                }
                disabled={loading === "price_enterprise_monthly"}
              >
                {loading === "price_enterprise_monthly"
                  ? "Processing..."
                  : "Contact Sales"}
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Credit Packages */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-[#002148] mb-4">
            Need More Credits?
          </h2>
          <p className="text-lg text-muted-foreground">
            Purchase additional credits anytime to power your AI assistant
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {/* Credit Package 1 */}
          <Card className="border-2 border-border hover:border-[#566B84]/20 transition-colors">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-[#566B84]/10 rounded-full w-fit">
                <Zap className="h-8 w-8 text-[#566B84]" />
              </div>
              <CardTitle className="text-xl text-[#002148]">
                50 Credits
              </CardTitle>
              <CardDescription>Perfect for occasional use</CardDescription>
              <div className="mt-2">
                <span className="text-3xl font-bold text-[#002148]">$5</span>
              </div>
            </CardHeader>
            <CardFooter>
              <Button
                variant="outline"
                className="w-full border-[#566B84] text-[#566B84] hover:bg-[#566B84] hover:text-white"
                onClick={() => handleBuyCredits(5, 50)}
                disabled={loading === "credits-5"}
              >
                {loading === "credits-5" ? "Processing..." : "Buy Credits"}
              </Button>
            </CardFooter>
          </Card>

          {/* Credit Package 2 */}
          <Card className="border-2 border-[#566B84] hover:border-[#566B84]/80 transition-colors">
            <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[#566B84] text-white">
              Best Value
            </Badge>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-[#566B84]/10 rounded-full w-fit">
                <CreditCard className="h-8 w-8 text-[#566B84]" />
              </div>
              <CardTitle className="text-xl text-[#002148]">
                100 Credits
              </CardTitle>
              <CardDescription>Great for regular users</CardDescription>
              <div className="mt-2">
                <span className="text-3xl font-bold text-[#002148]">$10</span>
                <div className="text-sm text-green-600 font-medium">
                  Save $0
                </div>
              </div>
            </CardHeader>
            <CardFooter>
              <Button
                className="w-full bg-[#566B84] hover:bg-[#566B84]/90"
                onClick={() => handleBuyCredits(10, 100)}
                disabled={loading === "credits-10"}
              >
                {loading === "credits-10" ? "Processing..." : "Buy Credits"}
              </Button>
            </CardFooter>
          </Card>

          {/* Credit Package 3 */}
          <Card className="border-2 border-border hover:border-[#566B84]/20 transition-colors">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-[#566B84]/10 rounded-full w-fit">
                <Zap className="h-8 w-8 text-[#566B84]" />
              </div>
              <CardTitle className="text-xl text-[#002148]">
                250 Credits
              </CardTitle>
              <CardDescription>For power users</CardDescription>
              <div className="mt-2">
                <span className="text-3xl font-bold text-[#002148]">$25</span>
                <div className="text-sm text-green-600 font-medium">
                  Save $0
                </div>
              </div>
            </CardHeader>
            <CardFooter>
              <Button
                variant="outline"
                className="w-full border-[#566B84] text-[#566B84] hover:bg-[#566B84] hover:text-white"
                onClick={() => handleBuyCredits(25, 250)}
                disabled={loading === "credits-25"}
              >
                {loading === "credits-25" ? "Processing..." : "Buy Credits"}
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-[#002148] mb-4">
            Frequently Asked Questions
          </h3>
          <div className="max-w-2xl mx-auto text-left space-y-4">
            <div>
              <h4 className="font-semibold text-[#002148] mb-2">
                What are AI credits?
              </h4>
              <p className="text-muted-foreground">
                AI credits are used each time you interact with our AI
                assistant. One credit = one AI response.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-[#002148] mb-2">
                Can I cancel my subscription anytime?
              </h4>
              <p className="text-muted-foreground">
                Yes, you can cancel your subscription at any time. You'll
                continue to have access until the end of your billing period.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-[#002148] mb-2">
                Do unused credits roll over?
              </h4>
              <p className="text-muted-foreground">
                Monthly subscription credits reset each month. Purchased credit
                packages never expire.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PricingPage;
