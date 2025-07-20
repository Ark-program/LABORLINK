"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Download, Save, FileEdit, X } from "lucide-react";

interface DocumentPreviewProps {
  isOpen?: boolean;
  onClose?: () => void;
  documentType?: "invoice" | "contract";
  documentData?: {
    title?: string;
    content?: string;
    recipient?: string;
    amount?: string;
    date?: string;
    dueDate?: string;
    items?: Array<{
      description: string;
      quantity: number;
      rate: number;
      amount: number;
    }>;
    terms?: string;
  };
}

const DocumentPreview = ({
  isOpen = true,
  onClose = () => {},
  documentType = "invoice",
  documentData = {
    title: "Invoice #INV-2023-001",
    recipient: "John's Plumbing",
    amount: "$1,200.00",
    date: new Date().toLocaleDateString(),
    dueDate: new Date(
      Date.now() + 30 * 24 * 60 * 60 * 1000,
    ).toLocaleDateString(),
    items: [
      {
        description: "Water Heater Installation",
        quantity: 1,
        rate: 1000,
        amount: 1000,
      },
      { description: "Materials", quantity: 1, rate: 200, amount: 200 },
    ],
    terms:
      "Payment due within 30 days. Please make checks payable to Your Company Name.",
    content: "This is a sample contract for plumbing services...",
  },
}: DocumentPreviewProps) => {
  const [activeTab, setActiveTab] = useState<string>("preview");
  const [editedData, setEditedData] = useState(documentData);
  const [items, setItems] = useState(documentData.items || []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setEditedData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleItemChange = (
    index: number,
    field: string,
    value: string | number,
  ) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };

    // Recalculate amount if quantity or rate changes
    if (field === "quantity" || field === "rate") {
      const quantity =
        field === "quantity" ? Number(value) : newItems[index].quantity;
      const rate = field === "rate" ? Number(value) : newItems[index].rate;
      newItems[index].amount = quantity * rate;
    }

    setItems(newItems);
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + item.amount, 0);
  };

  const handleSaveTemplate = () => {
    // Logic to save as template would go here
    alert("Template saved successfully!");
  };

  const handleDownload = (format: "pdf" | "word") => {
    // Logic to download document would go here
    alert(`Downloading document as ${format.toUpperCase()}...`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent
        className="bg-white max-w-4xl max-h-[90vh] overflow-y-auto"
        style={{ backgroundColor: "#fff" }}
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[#002148]">
            {documentType === "invoice"
              ? "Invoice Preview"
              : "Contract Preview"}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="edit">Edit</TabsTrigger>
          </TabsList>

          <TabsContent
            value="preview"
            className="bg-white p-6 border rounded-md"
          >
            {documentType === "invoice" ? (
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold text-[#002148]">
                      {editedData.title}
                    </h2>
                    <p className="text-[#566B84]">Date: {editedData.date}</p>
                    <p className="text-[#566B84]">
                      Due Date: {editedData.dueDate}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">Your Company Name</p>
                    <p>123 Business Street</p>
                    <p>City, State ZIP</p>
                    <p>contact@yourcompany.com</p>
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="font-semibold text-[#2B4665]">Bill To:</h3>
                  <p>{editedData.recipient}</p>
                </div>

                <table className="w-full mt-6">
                  <thead className="bg-[#002148] text-white">
                    <tr>
                      <th className="p-2 text-left">Description</th>
                      <th className="p-2 text-right">Quantity</th>
                      <th className="p-2 text-right">Rate</th>
                      <th className="p-2 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-2">{item.description}</td>
                        <td className="p-2 text-right">{item.quantity}</td>
                        <td className="p-2 text-right">
                          ${item.rate.toFixed(2)}
                        </td>
                        <td className="p-2 text-right">
                          ${item.amount.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                    <tr className="font-bold">
                      <td className="p-2" colSpan={3}>
                        Total
                      </td>
                      <td className="p-2 text-right">
                        ${calculateTotal().toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </table>

                <div className="mt-6">
                  <h3 className="font-semibold text-[#2B4665]">
                    Terms & Conditions:
                  </h3>
                  <p>{editedData.terms}</p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold text-[#002148]">
                      {editedData.title || "Service Contract"}
                    </h2>
                    <p className="text-[#566B84]">Date: {editedData.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">Your Company Name</p>
                    <p>123 Business Street</p>
                    <p>City, State ZIP</p>
                  </div>
                </div>

                <div className="mt-4">
                  <h3 className="font-semibold text-[#2B4665]">Client:</h3>
                  <p>{editedData.recipient}</p>
                </div>

                <div className="mt-4">
                  <h3 className="font-semibold text-[#2B4665]">
                    Contract Details:
                  </h3>
                  <div className="whitespace-pre-line">
                    {editedData.content}
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t grid grid-cols-2 gap-8">
                  <div>
                    <p className="font-semibold">Service Provider:</p>
                    <p>Your Company Name</p>
                    <p className="mt-4">Signature: _____________________</p>
                    <p>Date: {editedData.date}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Client:</p>
                    <p>{editedData.recipient}</p>
                    <p className="mt-4">Signature: _____________________</p>
                    <p>Date: _____________________</p>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="edit" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={editedData.title || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="recipient">Recipient/Client</Label>
                <Input
                  id="recipient"
                  name="recipient"
                  value={editedData.recipient || ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  name="date"
                  value={editedData.date || ""}
                  onChange={handleInputChange}
                />
              </div>
              {documentType === "invoice" && (
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    name="dueDate"
                    value={editedData.dueDate || ""}
                    onChange={handleInputChange}
                  />
                </div>
              )}
            </div>

            {documentType === "invoice" && (
              <Card className="p-4">
                <h3 className="font-semibold mb-2">Line Items</h3>
                {items.map((item, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-12 gap-2 mb-2 items-center"
                  >
                    <div className="col-span-6">
                      <Input
                        placeholder="Description"
                        value={item.description}
                        onChange={(e) =>
                          handleItemChange(index, "description", e.target.value)
                        }
                      />
                    </div>
                    <div className="col-span-2">
                      <Input
                        type="number"
                        placeholder="Qty"
                        value={item.quantity}
                        onChange={(e) =>
                          handleItemChange(
                            index,
                            "quantity",
                            Number(e.target.value),
                          )
                        }
                      />
                    </div>
                    <div className="col-span-2">
                      <Input
                        type="number"
                        placeholder="Rate"
                        value={item.rate}
                        onChange={(e) =>
                          handleItemChange(
                            index,
                            "rate",
                            Number(e.target.value),
                          )
                        }
                      />
                    </div>
                    <div className="col-span-1 text-right">
                      ${item.amount.toFixed(2)}
                    </div>
                    <div className="col-span-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setItems(items.filter((_, i) => i !== index))
                        }
                      >
                        <X size={16} />
                      </Button>
                    </div>
                  </div>
                ))}
                <Button
                  variant="outline"
                  className="mt-2"
                  onClick={() =>
                    setItems([
                      ...items,
                      { description: "", quantity: 1, rate: 0, amount: 0 },
                    ])
                  }
                >
                  Add Item
                </Button>
                <div className="text-right mt-2 font-bold">
                  Total: ${calculateTotal().toFixed(2)}
                </div>
              </Card>
            )}

            {documentType === "contract" && (
              <div className="space-y-2">
                <Label htmlFor="content">Contract Content</Label>
                <Textarea
                  id="content"
                  name="content"
                  value={editedData.content || ""}
                  onChange={handleInputChange}
                  rows={10}
                />
              </div>
            )}

            {documentType === "invoice" && (
              <div className="space-y-2">
                <Label htmlFor="terms">Terms & Conditions</Label>
                <Textarea
                  id="terms"
                  name="terms"
                  value={editedData.terms || ""}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex justify-between items-center">
          <div>
            <Button
              variant="outline"
              onClick={handleSaveTemplate}
              className="mr-2"
            >
              <Save className="mr-2 h-4 w-4" /> Save as Template
            </Button>
          </div>
          <div className="space-x-2">
            <Button variant="outline" onClick={() => handleDownload("word")}>
              <Download className="mr-2 h-4 w-4" /> Word
            </Button>
            <Button variant="outline" onClick={() => handleDownload("pdf")}>
              <Download className="mr-2 h-4 w-4" /> PDF
            </Button>
            <Button onClick={() => setActiveTab("edit")} variant="outline">
              <FileEdit className="mr-2 h-4 w-4" /> Edit
            </Button>
            <Button
              onClick={onClose}
              variant="default"
              className="bg-[#002148] hover:bg-[#032349]"
            >
              Done
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentPreview;
