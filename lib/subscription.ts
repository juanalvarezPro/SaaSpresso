// @ts-nocheck
// TODO: Fix this when we turn strict mode on.
import { pricingData } from "@/config/subscriptions";
import { prisma } from "@/lib/db";
import { mercadopago } from "@/lib/mercadopago";
import { UserSubscriptionPlan } from "types";

export async function getUserSubscriptionPlan(
  userId: string
): Promise<UserSubscriptionPlan> {
  if(!userId) throw new Error("Missing parameters");

  const user = await prisma.user.findFirst({
    where: {
      id: userId,
    },
    select: {
      mercadoPagoSubscriptionId: true,
      mercadoPagoCurrentPeriodEnd: true,
      mercadoPagoCustomerId: true,
      mercadoPagoPlanId: true,
    },
  })

  if (!user) {
    throw new Error("User not found")
  }

  // Check if user is on a paid plan.
  const isPaid =
    user.mercadoPagoPlanId &&
    user.mercadoPagoCurrentPeriodEnd?.getTime() + 86_400_000 > Date.now() ? true : false;

  // Find the pricing data corresponding to the user's plan
  const userPlan =
    pricingData.find((plan) => plan.mercadoPagoIds.monthly === user.mercadoPagoPlanId) ||
    pricingData.find((plan) => plan.mercadoPagoIds.yearly === user.mercadoPagoPlanId);

  const plan = isPaid && userPlan ? userPlan : pricingData[0]

  const interval = isPaid
    ? userPlan?.mercadoPagoIds.monthly === user.mercadoPagoPlanId
      ? "month"
      : userPlan?.mercadoPagoIds.yearly === user.mercadoPagoPlanId
      ? "year"
      : null
    : null;

  let isCanceled = false;
  if (isPaid && user.mercadoPagoSubscriptionId) {
    try {
      // For now, we'll assume subscription is not cancelled
      // In a real implementation, you would fetch subscription status from Mercado Pago API
      isCanceled = false
    } catch (error) {
      console.error("Error fetching Mercado Pago subscription:", error)
    }
  }

  return {
    ...plan,
    ...user,
    mercadoPagoCurrentPeriodEnd: user.mercadoPagoCurrentPeriodEnd?.getTime(),
    isPaid,
    interval,
    isCanceled
  }
}
