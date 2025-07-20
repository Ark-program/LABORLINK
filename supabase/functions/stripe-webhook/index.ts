import { corsHeaders } from "@shared/cors.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@14.21.0";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  apiVersion: "2024-06-20",
});

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET")!;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const signature = req.headers.get("stripe-signature");
  const body = await req.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature!, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.user_id;
        const type = session.metadata?.type || "subscription";

        if (!userId) {
          console.error("No user_id in session metadata");
          break;
        }

        if (type === "subscription" && session.subscription) {
          // Handle subscription creation
          const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string,
          );

          await supabase.from("subscriptions").insert({
            user_id: userId,
            stripe_subscription_id: subscription.id,
            stripe_customer_id: subscription.customer as string,
            status: subscription.status,
            price_id: subscription.items.data[0].price.id,
            current_period_start: new Date(
              subscription.current_period_start * 1000,
            ).toISOString(),
            current_period_end: new Date(
              subscription.current_period_end * 1000,
            ).toISOString(),
          });

          // Update user subscription status and add monthly credits
          await supabase
            .from("users")
            .update({
              subscription_status: "active",
              subscription_id: subscription.id,
              credits: 100, // Monthly credits
            })
            .eq("id", userId);
        } else if (type === "credits" && session.payment_intent) {
          // Handle credit purchase
          const paymentIntent = await stripe.paymentIntents.retrieve(
            session.payment_intent as string,
          );

          const creditsAmount = session.amount_total! / 100; // Assuming $1 = 10 credits
          const credits = creditsAmount * 10;

          await supabase.from("credit_purchases").insert({
            user_id: userId,
            stripe_payment_intent_id: paymentIntent.id,
            credits_purchased: credits,
            amount_paid: session.amount_total!,
            status: "completed",
          });

          // Add credits to user account
          const { data: user } = await supabase
            .from("users")
            .select("credits")
            .eq("id", userId)
            .single();

          if (user) {
            await supabase
              .from("users")
              .update({ credits: user.credits + credits })
              .eq("id", userId);
          }
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.user_id;

        if (userId) {
          await supabase
            .from("subscriptions")
            .update({
              status: subscription.status,
              current_period_start: new Date(
                subscription.current_period_start * 1000,
              ).toISOString(),
              current_period_end: new Date(
                subscription.current_period_end * 1000,
              ).toISOString(),
            })
            .eq("stripe_subscription_id", subscription.id);

          // Update user status
          const status =
            subscription.status === "active" ? "active" : "inactive";
          await supabase
            .from("users")
            .update({ subscription_status: status })
            .eq("id", userId);
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.user_id;

        if (userId) {
          await supabase
            .from("subscriptions")
            .update({ status: "canceled" })
            .eq("stripe_subscription_id", subscription.id);

          await supabase
            .from("users")
            .update({ subscription_status: "inactive" })
            .eq("id", userId);
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return new Response(
      JSON.stringify({ error: "Webhook processing failed" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      },
    );
  }
});
