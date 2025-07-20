"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  FileText,
  FileSpreadsheet,
  TrendingUp,
  X,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import DocumentPreview from "./DocumentPreview";

type Message = {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
  type?: "text" | "invoice" | "contract" | "insight";
  documentData?: any;
};

const AIChatPanel = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "Hello! I'm your financial assistant. How can I help you today?",
      sender: "ai",
      timestamp: new Date(),
      type: "text",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");
  const [showDocumentPreview, setShowDocumentPreview] = useState(false);
  const [currentDocument, setCurrentDocument] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages when new message is added
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!inputValue.trim()) return;

    const newUserMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
      type: "text",
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setInputValue("");
    setIsLoading(true);

    // Simulate AI response after a delay
    setTimeout(() => {
      handleAIResponse(inputValue);
      setIsLoading(false);
    }, 1500);
  };

  const handleAIResponse = (userMessage: string) => {
    const lowerCaseMessage = userMessage.toLowerCase();
    let responseType: "text" | "invoice" | "contract" | "insight" = "text";
    let responseContent = "";
    let documentData = null;

    if (lowerCaseMessage.includes("invoice")) {
      responseType = "invoice";
      responseContent =
        "I've created an invoice based on your request. You can preview, edit, and download it.";
      documentData = {
        type: "invoice",
        title: "Invoice",
        recipient: "Client Name",
        date: new Date().toLocaleDateString(),
        items: [
          { description: "Service", quantity: 1, rate: 100, amount: 100 },
        ],
        total: 100,
        notes: "Thank you for your business!",
      };
    } else if (lowerCaseMessage.includes("contract")) {
      responseType = "contract";
      responseContent =
        "I've drafted a contract based on your requirements. You can review, edit, and download it.";
      documentData = {
        type: "contract",
        title: "Service Contract",
        parties: ["Your Company", "Client Name"],
        date: new Date().toLocaleDateString(),
        terms: ["Term 1", "Term 2", "Term 3"],
        signatures: ["Service Provider", "Client"],
      };
    } else if (
      lowerCaseMessage.includes("insight") ||
      lowerCaseMessage.includes("analysis") ||
      lowerCaseMessage.includes("report")
    ) {
      responseType = "insight";
      responseContent =
        "Based on your financial data, here's an insight into your business performance.";
      documentData = {
        type: "insight",
        title: "Financial Insight",
        summary: "Your business is showing positive growth trends.",
        metrics: {
          revenue: "$10,000",
          expenses: "$6,000",
          profit: "$4,000",
        },
        recommendations: [
          "Consider investing in new equipment",
          "Optimize pricing strategy",
        ],
      };
    } else {
      responseContent =
        "I'm here to help with your financial needs. You can ask me to create invoices, contracts, or provide financial insights.";
    }

    const newAIMessage: Message = {
      id: Date.now().toString(),
      content: responseContent,
      sender: "ai",
      timestamp: new Date(),
      type: responseType,
      documentData: documentData,
    };

    setMessages((prev) => [...prev, newAIMessage]);
  };

  const handleQuickAction = (action: string) => {
    let prompt = "";
    switch (action) {
      case "invoice":
        prompt = "Create an invoice for a plumbing job worth $500";
        break;
      case "contract":
        prompt = "Draft a service contract for a home renovation project";
        break;
      case "insight":
        prompt = "Provide insights on my business expenses for this month";
        break;
      default:
        prompt = "";
    }
    setInputValue(prompt);
  };

  const handleViewDocument = (document: any) => {
    setCurrentDocument(document);
    setShowDocumentPreview(true);
  };

  const renderMessageContent = (message: Message) => {
    if (message.sender === "ai" && message.documentData) {
      return (
        <div className="space-y-2">
          <p>{message.content}</p>
          <Button
            variant="outline"
            className="flex items-center gap-2 bg-white/10"
            onClick={() => handleViewDocument(message.documentData)}
          >
            {message.type === "invoice" && <FileText size={16} />}
            {message.type === "contract" && <FileSpreadsheet size={16} />}
            {message.type === "insight" && <TrendingUp size={16} />}
            View {message.type === "insight" ? "Insights" : message.type}
          </Button>
        </div>
      );
    }
    return <p>{message.content}</p>;
  };

  return (
    <Card className="flex flex-col h-full bg-white border-[#566B84] shadow-md">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex flex-col h-full"
      >
        <CardHeader className="bg-[#002148] text-white py-3 px-4 rounded-t-lg">
          <CardTitle className="text-lg flex items-center justify-between">
            <span>AI Financial Assistant</span>
            <TabsList className="bg-[#2B4665]">
              <TabsTrigger
                value="chat"
                className="text-xs data-[state=active]:bg-[#566B84]"
              >
                Chat
              </TabsTrigger>
              <TabsTrigger
                value="history"
                className="text-xs data-[state=active]:bg-[#566B84]"
              >
                History
              </TabsTrigger>
            </TabsList>
          </CardTitle>
        </CardHeader>

        <TabsContent value="chat" className="flex-grow flex flex-col p-0 m-0">
          <CardContent className="flex-grow p-0 overflow-hidden">
            <ScrollArea className="h-[400px] p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.sender === "user"
                          ? "bg-[#032349] text-white"
                          : "bg-[#f0f4f9] border border-[#e0e4e9]"
                      }`}
                    >
                      {message.sender === "ai" && (
                        <div className="flex items-center mb-2">
                          <Avatar className="h-6 w-6 mr-2">
                            <AvatarImage src="/ai-assistant.png" alt="AI" />
                            <AvatarFallback className="bg-[#002147] text-white text-xs">
                              AI
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs font-medium text-[#566B84]">
                            Financial Assistant
                            {message.type && message.type !== "text" && (
                              <Badge
                                variant="outline"
                                className="ml-2 text-[10px] py-0 h-4"
                              >
                                {message.type}
                              </Badge>
                            )}
                          </span>
                        </div>
                      )}
                      {renderMessageContent(message)}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
          </CardContent>

          <CardFooter className="border-t p-3 bg-gray-50">
            <div className="w-full space-y-3">
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1 text-xs bg-white"
                  onClick={() => handleQuickAction("invoice")}
                >
                  <FileText size={14} />
                  Create Invoice
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1 text-xs bg-white"
                  onClick={() => handleQuickAction("contract")}
                >
                  <FileSpreadsheet size={14} />
                  Create Contract
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1 text-xs bg-white"
                  onClick={() => handleQuickAction("insight")}
                >
                  <TrendingUp size={14} />
                  Get Insights
                </Button>
              </div>

              <form onSubmit={handleSendMessage} className="flex gap-2">
                <Input
                  placeholder="Ask me to create an invoice, contract, or provide insights..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="flex-grow"
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={isLoading || !inputValue.trim()}
                  className="bg-[#002148] hover:bg-[#2B4665]"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </form>
            </div>
          </CardFooter>
        </TabsContent>

        <TabsContent value="history" className="flex-grow p-0 m-0">
          <CardContent className="p-4">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Your recent document history will appear here.
              </p>
              <div className="space-y-2">
                {messages
                  .filter((m) => m.sender === "ai" && m.documentData)
                  .map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-2 border rounded-md hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleViewDocument(doc.documentData)}
                    >
                      <div className="flex items-center gap-2">
                        {doc.type === "invoice" && (
                          <FileText size={16} className="text-[#566B84]" />
                        )}
                        {doc.type === "contract" && (
                          <FileSpreadsheet
                            size={16}
                            className="text-[#566B84]"
                          />
                        )}
                        {doc.type === "insight" && (
                          <TrendingUp size={16} className="text-[#566B84]" />
                        )}
                        <div>
                          <p className="text-sm font-medium">
                            {doc.documentData?.title ||
                              `${doc.type?.charAt(0).toUpperCase()}${doc.type?.slice(1)}`}
                          </p>
                          <p className="text-xs text-gray-500">
                            {doc.timestamp.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </div>
                  ))}
                {messages.filter((m) => m.sender === "ai" && m.documentData)
                  .length === 0 && (
                  <p className="text-sm text-center py-4 text-gray-400">
                    No documents generated yet
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </TabsContent>
      </Tabs>

      <Dialog open={showDocumentPreview} onOpenChange={setShowDocumentPreview}>
        <DialogContent className="max-w-4xl">
          <DocumentPreview
            document={currentDocument}
            onClose={() => setShowDocumentPreview(false)}
          />
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default AIChatPanel;
