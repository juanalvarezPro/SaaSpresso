"use server";

import { auth } from "@/auth";
import { preference, customer } from "@/lib/mercadopago";
import { getUserSubscriptionPlan } from "@/lib/subscription";
import { absoluteUrl } from "@/lib/utils";
import { redirect } from "next/navigation";

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
      throw new Error("Unauthorized");
    }

    const subscriptionPlan = await getUserSubscriptionPlan(user.id)

    if (subscriptionPlan.isPaid && subscriptionPlan.mercadoPagoCustomerId) {
      // User on Paid Plan - Redirect to Mercado Pago customer portal
      redirectUrl = `https://www.mercadopago.com.ar/subscriptions/portal/${subscriptionPlan.mercadoPagoCustomerId}`
    } else {
      // User on Free Plan - Create a preference for subscription
      const preferenceData = {
        items: [
          {
            id: planId,
            title: "Subscription Plan",
            quantity: 1,
            unit_price: 15, // This should be dynamic based on plan
          },
        ],
        back_urls: {
          success: billingUrl,
          failure: billingUrl,
          pending: billingUrl,
        },
        auto_return: "approved",
        metadata: {
          userId: user.id,
          planId: planId,
        },
        notification_url: `${absoluteUrl("/api/webhooks/mercadopago")}`,
      };

      const mercadoPagoPreference = await preference.create({ body: preferenceData });
      redirectUrl = mercadoPagoPreference.init_point as string;
    }
  } catch (error) {
    throw new Error("Failed to generate user Mercado Pago session");
  }

  // no revalidatePath because redirect
  redirect(redirectUrl)
}