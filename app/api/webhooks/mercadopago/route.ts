"use server";
import { headers } from "next/headers";

export async function POST(req: Request) {
  console.log("=== MercadoPago Webhook Received ===");
  const body = await req.text();
  const signature = headers().get("x-signature") as string;

  console.log("Headers:", Object.fromEntries(headers().entries()));
  console.log("Body:", body);

  // Verify webhook signature
  if (!signature) {
    console.log("Missing signature");
    return new Response("Missing signature", { status: 400 });
  }

  let event: any;

  try {
    event = JSON.parse(body);
    console.log("Parsed event:", event);
  } catch (error) {
    console.log("JSON parse error:", error);
    return new Response(`Invalid JSON: ${error.message}`, { status: 400 });
  }

  // Log the event type/topic for debugging
  if (event.topic) {
    console.log(`Event topic: ${event.topic}`);
  } else if (event.type) {
    console.log(`Event type: ${event.type}`);
  } else {
    console.log("Unknown event format:", event);
  }

  console.log("=== Webhook processed successfully ===");
  return new Response("OK", { status: 200 });
}