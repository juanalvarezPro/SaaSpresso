"use server";
import { mercadopago } from "@/lib/mercadopago";
import { PreApproval } from "mercadopago";
import { SubscriptionVerificationService } from "@/lib/subscription-verification";
import { SubscriptionStatus } from "@prisma/client";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  console.log("=== MercadoPago Webhook Received ===");
  
  try {
    const body: { data: { id: string }; type: string } = await req.json();
    console.log("📦 Webhook body:", body);

    if (body.type === "subscription_preapproval") {
      // Obtenemos la suscripción de MercadoPago
      const preapproval = await new PreApproval(mercadopago).get({ id: body.data.id });
      console.log("📦 Preapproval data:", preapproval);

      // El external_reference contiene: userId|planId|billingCycle
      const externalRef = preapproval.external_reference;
      
      if (!externalRef) {
        console.error("❌ No external_reference found in preapproval");
        return new Response("No external_reference", { status: 400 });
      }

      const [userId, planId, billingCycle] = externalRef.split('|');
      
      if (!userId || !planId) {
        console.error("❌ Invalid external_reference format:", externalRef);
        return new Response("Invalid external_reference format", { status: 400 });
      }

      // Verificar si el usuario existe
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, email: true }
      });

      if (!user) {
        console.error(`❌ User ${userId} not found`);
        return new Response("User not found", { status: 404 });
      }

      console.log(`✅ Processing subscription for user: ${userId}`);

      // Si el usuario ya tiene una suscripción activa, cancelarla primero
      const existingActiveSubscription = await prisma.subscription.findFirst({
        where: {
          userId: userId,
          status: SubscriptionStatus.ACTIVE
        }
      });

      if (existingActiveSubscription && existingActiveSubscription.planId !== planId) {
        console.log(`🔄 Cancelling existing subscription ${existingActiveSubscription.id} for plan change`);
        await SubscriptionVerificationService.cancelUserActiveSubscriptions(userId);
      }

      // Determinar el estado de la suscripción
      let subscriptionStatus: SubscriptionStatus;
      switch (preapproval.status) {
        case "authorized":
          subscriptionStatus = SubscriptionStatus.ACTIVE;
          break;
        case "pending":
          subscriptionStatus = SubscriptionStatus.PENDING;
          break;
        case "cancelled":
          subscriptionStatus = SubscriptionStatus.CANCELLED;
          break;
        default:
          subscriptionStatus = SubscriptionStatus.PENDING;
      }

      // Calcular fechas
      const startDate = preapproval.date_created ? new Date(preapproval.date_created) : new Date();
      const nextBillingDate = preapproval.next_payment_date 
        ? new Date(preapproval.next_payment_date)
        : undefined;

      const planName = preapproval.reason || "Suscripción";
      
      console.log("📦 External reference:", externalRef);
      console.log("📦 PlanId being saved:", planId);

      // Verificar que el plan existe en la base de datos
      const plan = await prisma.plan.findUnique({
        where: { id: planId }
      });

      if (!plan) {
        console.error(`❌ Plan ${planId} not found in database`);
        return new Response("Plan not found", { status: 404 });
      }

      // Crear o actualizar la suscripción en nuestra base de datos
      const subscription = await SubscriptionVerificationService.createOrUpdateSubscription({
        userId: userId,
        mercadoPagoId: preapproval.id?.toString() || "",
        planId: planId,
        amount: preapproval.auto_recurring?.transaction_amount || 0,
        currency: preapproval.auto_recurring?.currency_id || "COP",
        frequency: preapproval.auto_recurring?.frequency || 1,
        frequencyType: preapproval.auto_recurring?.frequency_type || "months",
        status: subscriptionStatus,
        startDate: startDate,
        nextBillingDate: nextBillingDate
      });

      console.log(`✅ Subscription ${subscription.id} created/updated for user ${userId}`);

      // Si la suscripción está autorizada, el usuario ya está actualizado
      if (preapproval.status === "authorized") {
        console.log(`✅ Subscription authorized for user ${userId}`);
      }
    }


    // Respondemos con un estado 200 para indicarle que la notificación fue recibida
    return new Response("OK", { status: 200 });

  } catch (error: any) {
    console.error("❌ Error processing webhook:", error);
    return new Response("Error processing webhook", { status: 500 });
  }
}