"use server";

import { auth } from "@/auth";
import { preference, customer } from "@/lib/mercadopago";
import { getUserSubscriptionPlan } from "@/lib/subscription";
import { absoluteUrl } from "@/lib/utils";
import { redirect } from "next/navigation";
import { pricingData } from "@/config/subscriptions";

export type responseAction = {
  status: "success" | "error";
  mercadoPagoUrl?: string;
}

// const billingUrl = absoluteUrl("/dashboard/billing")
const billingUrl = absoluteUrl("/pricing")

export async function generateUserMercadoPago(planId: string): Promise<responseAction> {
  let redirectUrl: string = "";

  try {

    const session = await auth()
    const user = session?.user;

    if (!user || !user.email || !user.id) {
      console.error("Unauthorized: Missing user data", { user: !!user, email: !!user?.email, id: !!user?.id });
      throw new Error("Unauthorized");
    }

    const subscriptionPlan = await getUserSubscriptionPlan(user.id)

    if (subscriptionPlan.isPaid && subscriptionPlan.mercadoPagoCustomerId) {
      // User on Paid Plan - Redirect to Mercado Pago customer portal
      redirectUrl = `https://www.mercadopago.com.ar/subscriptions/portal/${subscriptionPlan.mercadoPagoCustomerId}`
    } else {
      // User on Free Plan - Create a subscription preference

      // Find the plan details from pricingData
      const planDetails = pricingData.find(plan =>
        plan.mercadoPagoIds.monthly === planId || plan.mercadoPagoIds.yearly === planId
      );

      if (!planDetails) {
        throw new Error(`Plan not found for planId: ${planId}`);
      }

      const isYearly = planDetails.mercadoPagoIds.yearly === planId;
      // Use fixed MercadoPago prices in COP
      const planPrice = isYearly ? planDetails.mercadoPagoPrices.yearly : planDetails.mercadoPagoPrices.monthly;
      const planName = `${planDetails.title} ${isYearly ? 'Anual' : 'Mensual'}`;


      const preferenceData = {
        items: [
          {
            id: planId,
            title: planName,
            description: `Suscripción ${isYearly ? 'anual' : 'mensual'} al plan ${planDetails.title}`,
            quantity: 1,
            unit_price: planPrice,
            currency_id: "COP",
          },
        ],
        payer: {
          email: user.email,
        },
        back_urls: {
          success: billingUrl,
          failure: billingUrl,
          pending: billingUrl,
        },
        auto_return: "approved",
        external_reference: user.id, // 🔑 ID del usuario para identificar en el webhook
        metadata: {
          userId: user.id,
          planId: planId,
          planType: planDetails.title.toLowerCase(),
          billingCycle: isYearly ? 'yearly' : 'monthly',
          type: "subscription",
        },
        notification_url: `${absoluteUrl("/api/webhooks/mercadopago")}`,
      };


      const mercadoPagoPreference = await preference.create({ body: preferenceData });

      // Debug: Check if back_urls are properly set
      if (!mercadoPagoPreference.back_urls?.success) {
        console.warn("Warning: back_urls.success is empty, this might cause issues");
        console.log("Original back_urls sent:", preferenceData.back_urls);
        console.log("Received back_urls:", mercadoPagoPreference.back_urls);
      }

      // Use sandbox URL if available, otherwise use production URL
      redirectUrl = mercadoPagoPreference.sandbox_init_point || mercadoPagoPreference.init_point! as string;
      console.log("Redirect URL set:", redirectUrl);
    }
  } catch (error) {
    console.error("Error in generateUserMercadoPago:", error);
    throw new Error(`Failed to generate user Mercado Pago session: ${error.message}`);
  }

  // no revalidatePath because redirect
  redirect(redirectUrl)
}