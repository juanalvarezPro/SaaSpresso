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
    offer.mercadoPagoIds[year ? "yearly" : "monthly"],
  );

  const mercadoPagoSessionAction = () =>
    startTransition(async () => await generateUserMercadoPagoSession());

  const userOffer =
    subscriptionPlan.mercadoPagoPlanId ===
    offer.mercadoPagoIds[year ? "yearly" : "monthly"];

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
        <>{userOffer ? "Manage Subscription" : "Upgrade"}</>
      )}
    </Button>
  );
}
