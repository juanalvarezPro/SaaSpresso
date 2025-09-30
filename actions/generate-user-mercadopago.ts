"use server";

import { auth } from "@/auth";
import { mercadopago } from "@/lib/mercadopago";
import { getUserSubscriptionPlan } from "@/lib/subscription";
import { absoluteUrl } from "@/lib/utils";
import { redirect } from "next/navigation";
import { getPlanById } from "@/config/subscriptions";
import { PreApproval } from "mercadopago";
import { isRedirectError } from "next/dist/client/components/redirect";
import { prisma } from "@/lib/db";

const billingUrl = absoluteUrl("/pricing");

export async function generateUserMercadoPago(planId: string, isYearly: boolean = false) {
  try {
    const session = await auth();
    const user = session?.user;

    // Detectar ambiente
    const isDevelopment = process.env.NODE_ENV === 'development' ||
      process.env.VERCEL_ENV === 'preview' ||
      process.env.NODE_ENV === 'test';

    const userTest = 'test_user_7303766443282348274@testuser.com';

    if (!user?.email || !user?.id) {
      throw new Error("Usuario no autenticado");
    }

    const subscriptionPlan = await getUserSubscriptionPlan(user.id);

    // Si ya tiene suscripción activa, verificar si es el mismo plan
    if (subscriptionPlan.isPaid && subscriptionPlan.activeSubscription?.planId === planId) {
      redirect(`https://www.mercadopago.com.co/subscriptions`);
    }

    // Buscar detalles del plan en la base de datos
    const plan = await prisma.plan.findUnique({
      where: { id: planId }
    });

    if (!plan) {
      throw new Error(`Plan ${planId} no encontrado en la base de datos`);
    }

    // Obtener detalles del plan desde la base de datos
    const planDetails = await getPlanById(plan.id);

    if (!planDetails) {
      throw new Error(`Plan ${plan.name} no encontrado en la configuración`);
    }

    const planPrice = isYearly
      ? planDetails.mercadoPagoPrices.yearly
      : planDetails.mercadoPagoPrices.monthly;

    if (!planPrice || planPrice <= 0) {
      throw new Error(`Precio inválido para el plan ${planId}`);
    }

    const planName = `${planDetails.title} - ${isYearly ? 'Anual' : 'Mensual'}`;
    const payerEmail = isDevelopment ? userTest : user.email;

    console.log("📦 Creating subscription:", {
      planId,
      planName,
      price: planPrice,
      frequency: isYearly ? 12 : 1,
      userId: user.id,
      environment: isDevelopment ? 'DEVELOPMENT' : 'PRODUCTION',
      payerEmail
    });

    const preApproval = new PreApproval(mercadopago);

     // Crear la suscripción
     const subscription = await preApproval.create({
       body: {
         back_url: billingUrl,
         reason: planName,
         external_reference: `${user.id}|${planId}|${isYearly ? 'yearly' : 'monthly'}`,
         payer_email: payerEmail,
         status: "pending",
         auto_recurring: {
           frequency: isYearly ? 12 : 1,
           frequency_type: "months",
           transaction_amount: planPrice,
           currency_id: "COP",
         }
       }
     });

    console.log("✅ Subscription created successfully:", {
      id: subscription.id,
      status: subscription.status,
      init_point: subscription.init_point
    });

    // Verificar que tenemos la URL
    if (!subscription.init_point) {
      throw new Error("MercadoPago no devolvió URL de pago");
    }

    // ✅ Redirigir FUERA del try-catch
    redirect(subscription.init_point);

  } catch (error: any) {
    // ✅ IMPORTANTE: No capturar errores de redirect de Next.js
    if (isRedirectError(error)) {
      throw error; // Re-lanzar para que Next.js maneje la redirección
    }

    console.error("❌ Error en MercadoPago:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });

    // Redirigir a página de error
    redirect(`${billingUrl}?error=${encodeURIComponent(error.message)}`);
  }
}