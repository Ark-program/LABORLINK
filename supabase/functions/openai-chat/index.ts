import { corsHeaders } from "@shared/cors.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const openaiApiKey = Deno.env.get("OPENAI_API_KEY")!;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { message, userId, conversationId } = await req.json();

    if (!message || !userId) {
      throw new Error("Missing required parameters");
    }

    // Check user credits
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("credits, subscription_status")
      .eq("id", userId)
      .single();

    if (userError || !user) {
      throw new Error("User not found");
    }

    if (user.credits <= 0) {
      throw new Error(
        "Insufficient credits. Please purchase more credits or upgrade your subscription.",
      );
    }

    // Get conversation history if conversationId provided
    let conversationHistory = [];
    if (conversationId) {
      const { data: conversation } = await supabase
        .from("ai_conversations")
        .select("messages")
        .eq("id", conversationId)
        .eq("user_id", userId)
        .single();

      if (conversation) {
        conversationHistory = conversation.messages || [];
      }
    }

    // Prepare messages for OpenAI
    const messages = [
      {
        role: "system",
        content: `You are a financial assistant for trade businesses (electricians, plumbers, contractors, etc.). You help with:
        1. Creating professional invoices
        2. Drafting service contracts
        3. Providing financial insights and analysis
        4. Expense tracking and categorization
        5. Business financial advice
        
        Always be professional, helpful, and specific to trade business needs. When creating invoices or contracts, ask for necessary details like client information, services provided, rates, etc.`,
      },
      ...conversationHistory,
      {
        role: "user",
        content: message,
      },
    ];

    // Call OpenAI API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openaiApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: messages,
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    // Deduct credit
    await supabase
      .from("users")
      .update({ credits: user.credits - 1 })
      .eq("id", userId);

    // Save or update conversation
    const newMessages = [
      ...conversationHistory,
      { role: "user", content: message, timestamp: new Date().toISOString() },
      {
        role: "assistant",
        content: aiResponse,
        timestamp: new Date().toISOString(),
      },
    ];

    let finalConversationId = conversationId;

    if (conversationId) {
      // Update existing conversation
      await supabase
        .from("ai_conversations")
        .update({
          messages: newMessages,
          credits_used: conversationHistory.length / 2 + 1,
          updated_at: new Date().toISOString(),
        })
        .eq("id", conversationId)
        .eq("user_id", userId);
    } else {
      // Create new conversation
      const { data: newConversation } = await supabase
        .from("ai_conversations")
        .insert({
          user_id: userId,
          title: message.substring(0, 50) + (message.length > 50 ? "..." : ""),
          messages: newMessages,
          credits_used: 1,
        })
        .select("id")
        .single();

      if (newConversation) {
        finalConversationId = newConversation.id;
      }
    }

    // Detect if response contains structured data (invoice, contract, etc.)
    let documentData = null;
    let documentType = null;

    const lowerResponse = aiResponse.toLowerCase();
    if (
      lowerResponse.includes("invoice") &&
      (lowerResponse.includes("client") || lowerResponse.includes("service"))
    ) {
      documentType = "invoice";
      documentData = {
        type: "invoice",
        title: "Generated Invoice",
        content: aiResponse,
        generated_at: new Date().toISOString(),
      };
    } else if (
      lowerResponse.includes("contract") &&
      lowerResponse.includes("terms")
    ) {
      documentType = "contract";
      documentData = {
        type: "contract",
        title: "Generated Contract",
        content: aiResponse,
        generated_at: new Date().toISOString(),
      };
    }

    // Save document if detected
    if (documentData && finalConversationId) {
      await supabase.from("generated_documents").insert({
        user_id: userId,
        conversation_id: finalConversationId,
        document_type: documentType,
        title: documentData.title,
        content: documentData,
      });
    }

    return new Response(
      JSON.stringify({
        response: aiResponse,
        conversationId: finalConversationId,
        creditsRemaining: user.credits - 1,
        documentGenerated: !!documentData,
        documentType: documentType,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      },
    );
  } catch (error) {
    console.error("Error in OpenAI chat:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
