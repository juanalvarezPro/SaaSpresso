import { prisma } from "@/lib/db";

export interface MercadoPagoSubscriptionData {
  userId: string;
  planId: string;
  mercadoPagoPlanId: string;
  paymentId: string;
  merchantOrderId: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  amount: number;
  currency: string;
  billingCycle: 'monthly' | 'yearly';
  planType: 'pro' | 'business';
  startDate: Date;
  endDate: Date;
  mercadoPagoCustomerId?: string;
}

export class MercadoPagoDatabaseManager {
  
  /**
   * Guarda una nueva suscripción en la base de datos
   */
  async saveSubscription(subscriptionData: MercadoPagoSubscriptionData) {
    try {
      console.log(`💾 Saving subscription for user ${subscriptionData.userId}`);
      
      const subscription = await prisma.user.update({
        where: { id: subscriptionData.userId },
        data: {
          mercadoPagoPlanId: subscriptionData.mercadoPagoPlanId,
          mercadoPagoCustomerId: subscriptionData.mercadoPagoCustomerId,
          mercadoPagoSubscriptionId: subscriptionData.paymentId, // Usar paymentId como subscriptionId único
          mercadoPagoCurrentPeriodEnd: subscriptionData.endDate,
        },
      });

      // También podrías crear una tabla separada para el historial de suscripciones
      await this.createSubscriptionHistory(subscriptionData);

      console.log(`✅ Subscription saved successfully for user ${subscriptionData.userId}`);
      return subscription;
    } catch (error) {
      console.error('Error saving subscription:', error);
      throw error;
    }
  }

  /**
   * Crea un registro en el historial de suscripciones
   */
  private async createSubscriptionHistory(subscriptionData: MercadoPagoSubscriptionData) {
    try {
      // Si tienes una tabla de historial de suscripciones, úsala aquí
      // Por ejemplo:
      /*
      await prisma.subscriptionHistory.create({
        data: {
          userId: subscriptionData.userId,
          planId: subscriptionData.planId,
          mercadoPagoPlanId: subscriptionData.mercadoPagoPlanId,
          paymentId: subscriptionData.paymentId,
          merchantOrderId: subscriptionData.merchantOrderId,
          status: subscriptionData.status,
          amount: subscriptionData.amount,
          currency: subscriptionData.currency,
          billingCycle: subscriptionData.billingCycle,
          planType: subscriptionData.planType,
          startDate: subscriptionData.startDate,
          endDate: subscriptionData.endDate,
          createdAt: new Date(),
        },
      });
      */
      
      console.log(`📝 Subscription history created for user ${subscriptionData.userId}`);
    } catch (error) {
      console.error('Error creating subscription history:', error);
      // No lanzar error aquí para no interrumpir el flujo principal
    }
  }

  /**
   * Actualiza el estado de una suscripción
   */
  async updateSubscriptionStatus(
    userId: string, 
    status: 'pending' | 'approved' | 'rejected' | 'cancelled'
  ) {
    try {
      console.log(`🔄 Updating subscription status for user ${userId} to ${status}`);
      
      const user = await prisma.user.update({
        where: { id: userId },
        data: {
          // Actualizar campos según el estado
          ...(status === 'cancelled' && {
            mercadoPagoPlanId: null,
            mercadoPagoCurrentPeriodEnd: null,
          }),
        },
      });

      console.log(`✅ Subscription status updated for user ${userId}`);
      return user;
    } catch (error) {
      console.error('Error updating subscription status:', error);
      throw error;
    }
  }

  /**
   * Obtiene la información de suscripción de un usuario
   */
  async getUserSubscription(userId: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          mercadoPagoPlanId: true,
          mercadoPagoCustomerId: true,
          mercadoPagoCurrentPeriodEnd: true,
        },
      });

      if (!user) {
        throw new Error(`User ${userId} not found`);
      }

      return {
        userId: user.id,
        email: user.email,
        planId: user.mercadoPagoPlanId,
        customerId: user.mercadoPagoCustomerId,
        currentPeriodEnd: user.mercadoPagoCurrentPeriodEnd,
        isActive: user.mercadoPagoCurrentPeriodEnd 
          ? new Date() < user.mercadoPagoCurrentPeriodEnd 
          : false,
      };
    } catch (error) {
      console.error('Error getting user subscription:', error);
      throw error;
    }
  }

  /**
   * Verifica si un usuario tiene una suscripción activa
   */
  async isUserSubscriptionActive(userId: string): Promise<boolean> {
    try {
      const subscription = await this.getUserSubscription(userId);
      return subscription.isActive;
    } catch (error) {
      console.error('Error checking subscription status:', error);
      return false;
    }
  }

  /**
   * Cancela una suscripción
   */
  async cancelSubscription(userId: string) {
    try {
      console.log(`❌ Cancelling subscription for user ${userId}`);
      
      const user = await prisma.user.update({
        where: { id: userId },
        data: {
          mercadoPagoPlanId: null,
          mercadoPagoCurrentPeriodEnd: null,
          mercadoPagoCustomerId: null,
        },
      });

      console.log(`✅ Subscription cancelled for user ${userId}`);
      return user;
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      throw error;
    }
  }

  /**
   * Obtiene todas las suscripciones activas
   */
  async getActiveSubscriptions() {
    try {
      const activeSubscriptions = await prisma.user.findMany({
        where: {
          mercadoPagoPlanId: { not: null },
          mercadoPagoCurrentPeriodEnd: { gt: new Date() },
        },
        select: {
          id: true,
          email: true,
          mercadoPagoPlanId: true,
          mercadoPagoCustomerId: true,
          mercadoPagoCurrentPeriodEnd: true,
        },
      });

      return activeSubscriptions.map(user => ({
        userId: user.id,
        email: user.email,
        planId: user.mercadoPagoPlanId,
        customerId: user.mercadoPagoCustomerId,
        currentPeriodEnd: user.mercadoPagoCurrentPeriodEnd,
      }));
    } catch (error) {
      console.error('Error getting active subscriptions:', error);
      throw error;
    }
  }

  /**
   * Obtiene suscripciones que están por expirar
   */
  async getExpiringSubscriptions(daysBeforeExpiration: number = 7) {
    try {
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + daysBeforeExpiration);

      const expiringSubscriptions = await prisma.user.findMany({
        where: {
          mercadoPagoPlanId: { not: null },
          mercadoPagoCurrentPeriodEnd: {
            gte: new Date(),
            lte: expirationDate,
          },
        },
        select: {
          id: true,
          email: true,
          mercadoPagoPlanId: true,
          mercadoPagoCurrentPeriodEnd: true,
        },
      });

      return expiringSubscriptions;
    } catch (error) {
      console.error('Error getting expiring subscriptions:', error);
      throw error;
    }
  }
}

// Función helper para crear una instancia
export function createMercadoPagoDatabaseManager(): MercadoPagoDatabaseManager {
  return new MercadoPagoDatabaseManager();
}
