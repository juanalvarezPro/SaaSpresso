"use client";

import { useTransition } from "react";
import { openCustomerPortal } from "@/actions/open-customer-portal";

import { Button } from "@/components/ui/button";
import { Icons } from "@/components/shared/icons";

interface CustomerPortalButtonProps {
  userMercadoPagoId: string;
}

export function CustomerPortalButton({
  userMercadoPagoId,
}: CustomerPortalButtonProps) {
  let [isPending, startTransition] = useTransition();
  const generateUserMercadoPagoSession = openCustomerPortal.bind(null, userMercadoPagoId);

  const mercadoPagoSessionAction = () =>
    startTransition(async () => await generateUserMercadoPagoSession());

  return (
    <Button disabled={isPending} onClick={mercadoPagoSessionAction}>
      {isPending ? (
        <Icons.spinner className="mr-2 size-4 animate-spin" />
      ) : null}
      Open Customer Portal
    </Button>
  );
}
