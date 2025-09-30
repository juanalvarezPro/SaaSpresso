import { PlansRow, SubscriptionPlan } from "types";
import { prisma } from "@/lib/db";

// Función para obtener datos de planes desde la base de datos
export async function getPricingData(): Promise<SubscriptionPlan[]> {
  const plans = await prisma.plan.findMany({
    where: { isActive: true },
    orderBy: { priceMonthly: 'asc' }
  });

  return plans.map(plan => ({
    id: plan.id,
    title: plan.name,
    description: plan.description || "",
    benefits: plan.benefits,
    limitations: plan.limitations,
    prices: {
      monthly: plan.priceMonthly,
      yearly: plan.priceYearly,
    },
    mercadoPagoPrices: {
      monthly: plan.priceMonthly,
      yearly: plan.priceYearly,
    },
    mercadoPagoIds: {
      monthly: plan.id, // Usar el ID del plan como referencia
      yearly: plan.id,  // Usar el ID del plan como referencia
    },
  }));
}

// Función para obtener un plan específico por ID
export async function getPlanById(planId: string): Promise<SubscriptionPlan | null> {
  const plan = await prisma.plan.findUnique({
    where: { id: planId }
  });

  if (!plan) return null;

  return {
    id: plan.id,
    title: plan.name,
    description: plan.description || "",
    benefits: plan.benefits,
    limitations: plan.limitations,
    prices: {
      monthly: plan.priceMonthly,
      yearly: plan.priceYearly,
    },
    mercadoPagoPrices: {
      monthly: plan.priceMonthly,
      yearly: plan.priceYearly,
    },
    mercadoPagoIds: {
      monthly: plan.id,
      yearly: plan.id,
    },
  };
}

export const plansColumns = [
  "starter",
  "pro",
  "business",
  "enterprise",
] as const;

export const comparePlans: PlansRow[] = [
  {
    feature: "Acceso a Analiticas",
    starter: true,
    pro: true,
    business: true,
    enterprise: "Personalizado",
    tooltip: "All plans include basic analytics for tracking performance.",
  },
  {
    feature: "Branding Personalizado",
    starter: null,
    pro: "500/mo",
    business: "1,500/mo",
    enterprise: "Sin limite",
    tooltip: "Custom branding is available from the Pro plan onwards.",
  },
  {
    feature: "Soporte Prioritario",
    starter: null,
    pro: "Email",
    business: "Email & Chat",
    enterprise: "Soporte 24/7",
  },
  {
    feature: "Reportes Avanzados",
    starter: null,
    pro: null,
    business: true,
    enterprise: "Personalizado",
    tooltip:
      "Advanced reporting is available in Business and Enterprise plans.",
  },
  {
    feature: "Gestion de Cuenta Dedicada",
    starter: null,
    pro: null,
    business: null,
    enterprise: true,
    tooltip: "Enterprise plan includes a dedicated account manager.",
  },
  {
    feature: "Acceso a API",
    starter: "Limitado",
    pro: "Standard",
    business: "Aumentado",
    enterprise: "Full",
  },
  {
    feature: "Webinars Mensuales",
    starter: false,
    pro: true,
    business: true,
    enterprise: "Personalizado",
    tooltip: "Pro and higher plans include access to monthly webinars.",
  },
  {
    feature: "Integraciones Personalizadas",
    starter: false,
    pro: false,
    business: "Disponible",
    enterprise: "Available",
    tooltip:
      "Las integraciones personalizadas están disponibles en planes Business y Enterprise.",
  },
  {
    feature: "Roles y Permisos",
    starter: null,
    pro: "Basic",
    business: "Avanzado",
    enterprise: "Avanzado",
    tooltip:
      "La gestión de roles y permisos mejora con planes superiores.",
  },
  {
    feature: "Asistencia de Onboarding",
    starter: false,
    pro: "Autoservicio",
    business: "Asistido",
    enterprise: "Servicio completo", 
    tooltip: "Planes superiores incluyen asistencia de onboarding más completa.",  
  },
  // Add more rows as needed
];

