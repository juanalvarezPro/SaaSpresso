import { SubscriptionVerificationService } from "@/lib/subscription-verification";
import { redirect } from "next/navigation";

/**
 * Middleware para verificar si un usuario tiene acceso activo
 * Úsalo en páginas protegidas que requieren suscripción
 * 
 * NOTA: Este es solo un wrapper del SubscriptionVerificationService
 * La lógica real está en el service (Single Source of Truth)
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
 * Verifica si el usuario tiene acceso y retorna la información
 * Úsalo en componentes que necesitan verificar acceso
 * 
 * NOTA: Este es solo un wrapper del SubscriptionVerificationService
 * La lógica real está en el service (Single Source of Truth)
 */
export async function checkSubscriptionAccess(userId: string) {
  return await SubscriptionVerificationService.checkAccessAndGetSubscription(userId);
}

/**
 * Obtiene información formateada de la suscripción
 * Úsalo en componentes que necesitan datos específicos
 * 
 * NOTA: Este es solo un wrapper del SubscriptionVerificationService
 * La lógica real está en el service (Single Source of Truth)
 */
export async function getSubscriptionInfo(userId: string) {
  return await SubscriptionVerificationService.getFormattedSubscriptionInfo(userId);
}
