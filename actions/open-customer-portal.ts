"use server";

import { redirect } from "next/navigation";
import { auth } from "@/auth";

import { absoluteUrl } from "@/lib/utils";

export type responseAction = {
  status: "success" | "error";
  mercadoPagoUrl?: string;
};

const billingUrl = absoluteUrl("/dashboard/billing");

export async function openCustomerPortal(
  userMercadoPagoId: string,
): Promise<responseAction> {
  let redirectUrl: string = "";

  try {
    const session = await auth();

    if (!session?.user || !session?.user.email) {
      throw new Error("Unauthorized");
    }

    if (userMercadoPagoId) {
      // Redirect to Mercado Pago customer portal
      redirectUrl = `https://www.mercadopago.com.co/subscriptions/details/${userMercadoPagoId}`;
    }
  } catch (error) {
    throw new Error("Failed to generate user Mercado Pago session");
  }

  redirect(redirectUrl);
}
