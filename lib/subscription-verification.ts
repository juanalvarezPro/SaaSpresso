import { prisma } from "@/lib/db";
import { SubscriptionStatus } from "@prisma/client";

export class SubscriptionVerificationService {
  
  /**
   * Verifica si un usuario tiene acceso activo al servicio
   */
  static async hasActiveAccess(userId: string): Promise<boolean> {
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId,
        status: SubscriptionStatus.ACTIVE,
        OR: [
          { endDate: null }, // Suscripción ilimitada
          { endDate: { gt: new Date() } } // Suscripción con fecha futura
        ]
      },
      orderBy: { createdAt: 'desc' }
    });

    return !!subscription;
  }

  /**
   * Obtiene la suscripción activa de un usuario
   */
  static async getActiveSubscription(userId: string) {
    return await prisma.subscription.findFirst({
      where: {
        userId,
        status: SubscriptionStatus.ACTIVE,
        OR: [
          { endDate: null },
          { endDate: { gt: new Date() } }
        ]
      },
      include: {
        plan: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }


  /**
   * Crea o actualiza una suscripción
   */
  static async createOrUpdateSubscription(data: {
    userId: string;
    mercadoPagoId: string;
    planId: string;
    amount: number;
    currency: string;
    frequency: number;
    frequencyType: string;
    status: SubscriptionStatus;
    startDate?: Date;
    endDate?: Date;
    nextBillingDate?: Date;
  }) {
    return await prisma.subscription.upsert({
      where: { mercadoPagoId: data.mercadoPagoId },
      update: {
        status: data.status,
        startDate: data.startDate,
        endDate: data.endDate,
        nextBillingDate: data.nextBillingDate,
        updatedAt: new Date()
      },
      create: {
        userId: data.userId,
        mercadoPagoId: data.mercadoPagoId,
        planId: data.planId,
        amount: data.amount,
        currency: data.currency,
        frequency: data.frequency,
        frequencyType: data.frequencyType,
        status: data.status,
        startDate: data.startDate,
        endDate: data.endDate,
        nextBillingDate: data.nextBillingDate
      }
    });
  }


  /**
   * Actualiza el estado de una suscripción
   */
  static async updateSubscriptionStatus(
    mercadoPagoId: string, 
    status: SubscriptionStatus,
    nextBillingDate?: Date
  ) {
    return await prisma.subscription.update({
      where: { mercadoPagoId },
      data: {
        status,
        nextBillingDate,
        updatedAt: new Date()
      }
    });
  }

  /**
   * Cancela todas las suscripciones activas de un usuario
   */
  static async cancelUserActiveSubscriptions(userId: string) {
    return await prisma.subscription.updateMany({
      where: {
        userId: userId,
        status: SubscriptionStatus.ACTIVE
      },
      data: {
        status: SubscriptionStatus.CANCELLED,
        updatedAt: new Date()
      }
    });
  }

  /**
   * Obtiene estadísticas de suscripciones
   */
  static async getSubscriptionStats() {
    const [total, active, pending, cancelled] = await Promise.all([
      prisma.subscription.count(),
      prisma.subscription.count({ where: { status: SubscriptionStatus.ACTIVE } }),
      prisma.subscription.count({ where: { status: SubscriptionStatus.PENDING } }),
      prisma.subscription.count({ where: { status: SubscriptionStatus.CANCELLED } })
    ]);

    return { total, active, pending, cancelled };
  }

  /**
   * Obtiene suscripciones que están por expirar
   */
  static async getExpiringSubscriptions(daysBeforeExpiration: number = 7) {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + daysBeforeExpiration);

    return await prisma.subscription.findMany({
      where: {
        status: SubscriptionStatus.ACTIVE,
        endDate: {
          gte: new Date(),
          lte: expirationDate
        }
      },
      include: {
        user: {
          select: { id: true, email: true, name: true }
        }
      }
    });
  }

  /**
   * Verifica acceso y retorna información completa de suscripción
   * Único punto de entrada para verificar acceso
   */
  static async checkAccessAndGetSubscription(userId: string) {
    const hasAccess = await this.hasActiveAccess(userId);
    const subscription = hasAccess ? await this.getActiveSubscription(userId) : null;
    
    return {
      hasAccess,
      subscription
    };
  }

  /**
   * Obtiene información formateada de la suscripción activa
   * Para uso en componentes que necesitan datos específicos
   */
  static async getFormattedSubscriptionInfo(userId: string) {
    const subscription = await this.getActiveSubscription(userId);
    
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
      plan: subscription.plan
    };
  }
}
