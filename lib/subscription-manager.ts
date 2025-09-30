import { prisma } from "@/lib/db";

export interface SubscriptionData {
  userId: string;
  planId: string;
  planType: 'pro' | 'business';
  billingCycle: 'monthly' | 'yearly';
  amount: number;
  mercadoPagoOrderId?: string;
}

export async function activateSubscription(data: SubscriptionData) {
  try {
    const currentDate = new Date();
    const expirationDate = new Date();
    
    // Set expiration date based on billing cycle
    if (data.billingCycle === 'monthly') {
      expirationDate.setMonth(currentDate.getMonth() + 1);
    } else {
      expirationDate.setFullYear(currentDate.getFullYear() + 1);
    }

    // Update user subscription
    await prisma.user.update({
      where: { id: data.userId },
      data: {
        mercadoPagoPlanId: data.planId,
        mercadoPagoCurrentPeriodEnd: expirationDate,
        // For testing, we'll use a fake customer ID
        mercadoPagoCustomerId: `test_customer_${data.userId}`,
      },
    });

    console.log(`Subscription activated for user ${data.userId}:`, {
      plan: data.planType,
      cycle: data.billingCycle,
      expires: expirationDate,
    });

    // For monthly plans, you could set up a cron job or reminder system
    if (data.billingCycle === 'monthly') {
      console.log(`Monthly subscription - reminder needed in 30 days for user ${data.userId}`);
      // TODO: Set up reminder system (email, cron job, etc.)
    }

    return { success: true, expirationDate };
  } catch (error) {
    console.error("Error activating subscription:", error);
    throw error;
  }
}

export async function checkExpiredSubscriptions() {
  try {
    const expiredUsers = await prisma.user.findMany({
      where: {
        mercadoPagoCurrentPeriodEnd: {
          lt: new Date(), // Less than current date
        },
        mercadoPagoPlanId: {
          not: null,
        },
      },
    });

    console.log(`Found ${expiredUsers.length} expired subscriptions`);

    // Deactivate expired subscriptions
    for (const user of expiredUsers) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          mercadoPagoPlanId: null,
          mercadoPagoCurrentPeriodEnd: null,
          mercadoPagoCustomerId: null,
        },
      });

      console.log(`Deactivated subscription for user ${user.id}`);
    }

    return expiredUsers;
  } catch (error) {
    console.error("Error checking expired subscriptions:", error);
    throw error;
  }
}
