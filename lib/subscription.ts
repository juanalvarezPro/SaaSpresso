import { getPricingData } from "@/config/subscriptions";
import { prisma } from "@/lib/db";
import { UserSubscriptionPlan } from "types";
import { SubscriptionStatus } from "@prisma/client";

export async function getUserSubscriptionPlan(
  userId: string
): Promise<UserSubscriptionPlan> {
  if(!userId) throw new Error("Missing parameters");

  // Buscar la suscripción activa del usuario con la relación al plan
  const activeSubscription = await prisma.subscription.findFirst({
    where: {
      userId: userId,
      status: SubscriptionStatus.ACTIVE,
      nextBillingDate: {
        gte: new Date() // Que no haya expirado
      }
    },
    include: {
      plan: true // Incluir la información del plan
    },
    orderBy: { createdAt: 'desc' }
  });

  // Check if user is on a paid plan
  const isPaid = !!activeSubscription;

  // Obtener datos de planes desde la base de datos
  const pricingData = await getPricingData();
  
  // Find the pricing data corresponding to the user's plan
  const userPlan = isPaid && activeSubscription?.plan
    ? pricingData.find((plan) => plan.id === activeSubscription.planId)
    : null;

  const plan = isPaid && userPlan ? userPlan : pricingData[0];

  // Determinar el intervalo basado en la frecuencia
  const interval = isPaid && activeSubscription
    ? activeSubscription.frequency === 12 ? "year" : "month"
    : null;

  // Check if subscription is cancelled
  const isCanceled = activeSubscription?.status === SubscriptionStatus.CANCELLED;

  return {
    ...plan,
    mercadoPagoCurrentPeriodEnd: activeSubscription?.nextBillingDate?.getTime() || 0,
    isPaid,
    interval,
    isCanceled,
    activeSubscription: activeSubscription ? {
      id: activeSubscription.id,
      mercadoPagoId: activeSubscription.mercadoPagoId,
      planId: activeSubscription.planId,
      planName: activeSubscription.plan?.name || "Plan desconocido",
      status: activeSubscription.status,
      nextBillingDate: activeSubscription.nextBillingDate
    } : undefined
  }
}
