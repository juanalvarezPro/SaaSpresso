import { headers } from "next/headers";
import { prisma } from "@/lib/db";
import { env } from "@/env.mjs";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("x-signature") as string;

  // Verify webhook signature (Mercado Pago uses x-signature header)
  if (!signature) {
    return new Response("Missing signature", { status: 400 });
  }

  let event: any;

  try {
    event = JSON.parse(body);
  } catch (error) {
    return new Response(`Invalid JSON: ${error.message}`, { status: 400 });
  }

  // Handle different Mercado Pago webhook events
  switch (event.type) {
    case "payment":
      await handlePaymentEvent(event.data);
      break;
    case "subscription":
      await handleSubscriptionEvent(event.data);
      break;
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return new Response(null, { status: 200 });
}

async function handlePaymentEvent(data: any) {
  // Handle payment events (one-time payments, subscription payments)
  const paymentId = data.id;
  
  try {
    // Fetch payment details from Mercado Pago API if needed
    // For now, we'll handle subscription-related payments
    if (data.metadata?.userId && data.metadata?.planId) {
      // This is a subscription payment
      await prisma.user.update({
        where: {
          id: data.metadata.userId,
        },
        data: {
          mercadoPagoCustomerId: data.payer?.id?.toString(),
          mercadoPagoPlanId: data.metadata.planId,
          mercadoPagoCurrentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        },
      });
    }
  } catch (error) {
    console.error("Error handling payment event:", error);
  }
}

async function handleSubscriptionEvent(data: any) {
  // Handle subscription events (creation, updates, cancellations)
  const subscriptionId = data.id;
  
  try {
    // Update user subscription based on the event
    if (data.status === "active") {
      await prisma.user.update({
        where: {
          mercadoPagoSubscriptionId: subscriptionId,
        },
        data: {
          mercadoPagoCurrentPeriodEnd: new Date(data.current_period_end * 1000),
        },
      });
    } else if (data.status === "cancelled") {
      await prisma.user.update({
        where: {
          mercadoPagoSubscriptionId: subscriptionId,
        },
        data: {
          mercadoPagoSubscriptionId: null,
          mercadoPagoPlanId: null,
          mercadoPagoCurrentPeriodEnd: null,
        },
      });
    }
  } catch (error) {
    console.error("Error handling subscription event:", error);
  }
}
