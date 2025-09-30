import { SubscriptionVerificationService } from "@/lib/subscription-verification";
import { redirect } from "next/navigation";

/**
 * Middleware para verificar si un usuario tiene acceso activo
 * Úsalo en páginas protegidas que requieren suscripción
 */
export async function requireActiveSubscription(userId: string) {
  const hasAccess = await SubscriptionVerificationService.hasActiveAccess(userId);
  
  if (!hasAccess) {
    // Redirigir a página de suscripción
    redirect("/pricing?message=subscription_required");
  }
  
  return true;
}

/**
 * Obtiene la información de suscripción activa del usuario
 * Úsalo para mostrar información del plan actual
 */
export async function getActiveSubscriptionInfo(userId: string) {
  const subscription = await SubscriptionVerificationService.getActiveSubscription(userId);
  
  if (!subscription) {
    return null;
  }
  
  return {
    id: subscription.id,
    amount: subscription.amount,
    currency: subscription.currency,
    status: subscription.status,
    startDate: subscription.startDate,
    endDate: subscription.endDate,
    nextBillingDate: subscription.nextBillingDate,
    frequency: subscription.frequency,
    frequencyType: subscription.frequencyType,
    lastPayment: subscription.payments[0] // Último pago aprobado
  };
}

/**
 * Verifica si el usuario tiene acceso y retorna la información
 * Úsalo en componentes que necesitan verificar acceso
 */
export async function checkSubscriptionAccess(userId: string) {
  const hasAccess = await SubscriptionVerificationService.hasActiveAccess(userId);
  const subscriptionInfo = hasAccess ? await getActiveSubscriptionInfo(userId) : null;
  
  return {
    hasAccess,
    subscription: subscriptionInfo
  };
}
