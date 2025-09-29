import { PlansRow, SubscriptionPlan } from "types";
import { env } from "@/env.mjs";

export const pricingData: SubscriptionPlan[] = [
  {
    title: "Basico",
    description: "Para principiantes",
    benefits: [
      "Hasta 100 posts mensuales",
      "Analiticas y reportes basicos",  
      "Acceso a templates estandar",
    ],
    limitations: [
      "No acceso prioritario a nuevas caracteristicas.",
      "Soporte limitado",
      "No branding personalizado",
      "Acceso limitado a recursos de negocio.",
    ],
    prices: {
      monthly: 0,
      yearly: 0,
    },
    mercadoPagoIds: {
      monthly: null,
      yearly: null,
    },
  },
  {
    title: "Pro",
    description: "Desbloquea caracteristicas avanzadas",
    benefits: [
      "Hasta 500 posts mensuales",
      "Analiticas y reportes avanzados",
      "Acceso a templates de negocio",
      "Soporte prioritario",
      "Webinars y capacitacion exclusiva.",
    ],
    limitations: [
      "No branding personalizado",
      "Acceso limitado a recursos de negocio.",
    ],
    prices: {
      monthly: 15,
      yearly: 144,
    },
    mercadoPagoIds: {
      monthly: env.NEXT_PUBLIC_MERCADOPAGO_PRO_MONTHLY_PLAN_ID,
      yearly: env.NEXT_PUBLIC_MERCADOPAGO_PRO_YEARLY_PLAN_ID,
    },
  },
  {
    title: "Business",
    description: "Para usuarios avanzados",
    benefits: [
      "Sin limite de posts",
      "Analiticas y reportes en tiempo real",
      "Acceso a todos los templates, incluyendo branding personalizado",
      "Soporte 24/7",
      "Personalized onboarding y gestion de cuenta.",
    ],
    limitations: [],
    prices: {
      monthly: 30,
      yearly: 300,
    },
    mercadoPagoIds: {
      monthly: env.NEXT_PUBLIC_MERCADOPAGO_BUSINESS_MONTHLY_PLAN_ID,
      yearly: env.NEXT_PUBLIC_MERCADOPAGO_BUSINESS_YEARLY_PLAN_ID,
    },
  },
];

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
