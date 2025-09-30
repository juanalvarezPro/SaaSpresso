import { UserSubscriptionPlan } from "@/types";
import { getPricingData } from "@/config/subscriptions";
import { HeaderSection } from "@/components/shared/header-section";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";
import { PricingCards } from "./pricing-cards";

interface PricingCardsServerProps {
  userId?: string;
  subscriptionPlan?: UserSubscriptionPlan;
}

export async function PricingCardsServer({ userId, subscriptionPlan }: PricingCardsServerProps) {
  const pricingData = await getPricingData();

  return (
    <MaxWidthWrapper>
      <section className="flex flex-col items-center text-center">
        <HeaderSection label="Precios" title="Conoce nuestros planes" />
        <PricingCards 
          pricingData={pricingData}
          userId={userId}
          subscriptionPlan={subscriptionPlan}
        />
      </section>
    </MaxWidthWrapper>
  );
}