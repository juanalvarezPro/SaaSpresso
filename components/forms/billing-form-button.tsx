"use client";

import { useTransition } from "react";
import { generateUserMercadoPago } from "@/actions/generate-user-mercadopago";
import { SubscriptionPlan, UserSubscriptionPlan } from "@/types";

import { Button } from "@/components/ui/button";
import { Icons } from "@/components/shared/icons";

interface BillingFormButtonProps {
  offer: SubscriptionPlan;
  subscriptionPlan: UserSubscriptionPlan;
  year: boolean;
}

export function BillingFormButton({
  year,
  offer,
  subscriptionPlan,
}: BillingFormButtonProps) {
  let [isPending, startTransition] = useTransition();
  const generateUserMercadoPagoSession = generateUserMercadoPago.bind(
    null,
    offer.id, // Usar el ID del plan de la base de datos
    year, // Pasar si es anual o mensual
  );

  const mercadoPagoSessionAction = () =>
    startTransition(async () => await generateUserMercadoPagoSession());

  // Verificar si el usuario ya tiene este plan activo
  const userOffer = subscriptionPlan.activeSubscription?.planId === offer.id;
  const hasActiveSubscription = subscriptionPlan.isPaid;
  const isUpgrade = hasActiveSubscription && !userOffer;

  return (
    <Button
      variant={userOffer ? "default" : "outline"}
      rounded="full"
      className="w-full"
      disabled={isPending}
      onClick={mercadoPagoSessionAction}
    >
      {isPending ? (
        <>
          <Icons.spinner className="mr-2 size-4 animate-spin" /> Loading...
        </>
      ) : (
        <>{userOffer ? "Gestionar Suscripción" : isUpgrade ? "Cambiar Plan" : "Suscribirse"}</>
      )}
    </Button>
  );
}
