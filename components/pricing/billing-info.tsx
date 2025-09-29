import Link from "next/link";
import * as React from "react";

import { CustomerPortalButton } from "@/components/forms/customer-portal-button";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn, formatDate } from "@/lib/utils";
import { UserSubscriptionPlan } from "types";

interface BillingInfoProps extends React.HTMLAttributes<HTMLFormElement> {
  userSubscriptionPlan: UserSubscriptionPlan;
}

export function BillingInfo({ userSubscriptionPlan }: BillingInfoProps) {
  const {
    title,
    description,
    mercadoPagoCustomerId,
    isPaid,
    isCanceled,
    mercadoPagoCurrentPeriodEnd,
  } = userSubscriptionPlan;

  return (
    <Card>
      <CardHeader>
        <CardTitle> Plan de Suscripción</CardTitle>
        <CardDescription>
          Actualmente estás en el plan <strong>{title}</strong>.
        </CardDescription>
      </CardHeader>
      <CardContent>{description}</CardContent>
      <CardFooter className="flex flex-col items-center space-y-2 border-t bg-accent py-2 md:flex-row md:justify-between md:space-y-0">
        {isPaid ? (
          <p className="text-sm font-medium text-muted-foreground">
            {isCanceled
              ? "Tu plan será cancelado el "
              : "Tu plan se renovará el "}
            {formatDate(mercadoPagoCurrentPeriodEnd)}.
          </p>
        ) : null}

        {isPaid && mercadoPagoCustomerId ? (
          <CustomerPortalButton userMercadoPagoId={mercadoPagoCustomerId} />
        ) : (
          <Link href="/pricing" className={cn(buttonVariants())}>
            Elegir un plan
          </Link>
        )}
      </CardFooter>
    </Card>
  );
}
