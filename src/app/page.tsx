import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-navy text-white">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-platinum">
            LaborLink Finance
          </div>
          <div className="flex gap-4">
            <Link href="/auth/login">
              <Button
                variant="outline"
                className="border-platinum text-platinum hover:bg-platinum hover:text-navy"
              >
                Log In
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button className="bg-platinum text-navy hover:bg-white">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
            Your AI-Powered CFO for Trade Businesses
          </h1>
          <p className="text-xl md:text-2xl mb-12 text-platinum max-w-3xl mx-auto">
            Manage invoices, track expenses, and unlock credit using AI. Built
            for electricians, plumbers, and all trades.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/auth/signup">
              <Button
                size="lg"
                className="bg-platinum text-navy hover:bg-white text-lg px-8 py-4 w-full sm:w-auto"
              >
                Get Started Free
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button
                size="lg"
                variant="outline"
                className="border-platinum text-platinum hover:bg-platinum hover:text-navy text-lg px-8 py-4 w-full sm:w-auto"
              >
                Sign In
              </Button>
            </Link>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <Card className="bg-navy border-platinum/20">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-platinum rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <span className="text-navy font-bold text-xl">AI</span>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">
                  AI-Powered Insights
                </h3>
                <p className="text-platinum/80">
                  Get intelligent financial recommendations tailored to your
                  trade business
                </p>
              </CardContent>
            </Card>

            <Card className="bg-navy border-platinum/20">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-platinum rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <span className="text-navy font-bold text-xl">📊</span>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">
                  Smart Invoicing
                </h3>
                <p className="text-platinum/80">
                  Create professional invoices and track payments effortlessly
                </p>
              </CardContent>
            </Card>

            <Card className="bg-navy border-platinum/20">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-platinum rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <span className="text-navy font-bold text-xl">💳</span>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">
                  Credit Access
                </h3>
                <p className="text-platinum/80">
                  Unlock business credit opportunities based on your financial
                  data
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-platinum/20 mt-24">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-platinum/80 text-sm">
              © 2024 LaborLink Finance. All rights reserved.
            </div>
            <div className="flex gap-4">
              <Link
                href="#"
                className="text-platinum/60 hover:text-platinum transition-colors"
              >
                <Facebook size={20} />
              </Link>
              <Link
                href="#"
                className="text-platinum/60 hover:text-platinum transition-colors"
              >
                <Linkedin size={20} />
              </Link>
              <Link
                href="#"
                className="text-platinum/60 hover:text-platinum transition-colors"
              >
                <Twitter size={20} />
              </Link>
              <Link
                href="#"
                className="text-platinum/60 hover:text-platinum transition-colors"
              >
                <Instagram size={20} />
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
