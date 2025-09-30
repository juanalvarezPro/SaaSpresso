import { PrismaClient } from "@prisma/client";

// Cliente de Prisma para scripts
const prisma = new PrismaClient();

// Configuración completa de planes con beneficios y limitaciones
const plansData = [
  {
    name: "Basico",
    description: "Para principiantes",
    priceMonthly: 0,
    priceYearly: 0,
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
  },
  {
    name: "Pro",
    description: "Desbloquea caracteristicas avanzadas",
    priceMonthly: 50000, // $50,000 COP
    priceYearly: 576000, // $576,000 COP (20% descuento)
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
  },
  {
    name: "Business",
    description: "Para usuarios avanzados",
    priceMonthly: 120000, // $120,000 COP
    priceYearly: 1152000, // $1,152,000 COP (20% descuento)
    benefits: [
      "Sin limite de posts",
      "Analiticas y reportes en tiempo real",
      "Acceso a todos los templates, incluyendo branding personalizado",
      "Soporte 24/7",
      "Personalized onboarding y gestion de cuenta.",
    ],
    limitations: [],
  },
];

async function seedPlans() {
  console.log("🌱 Seeding plans...");

  try {
    // Limpiar planes existentes (solo en desarrollo)
    if (process.env.NODE_ENV === 'development') {
      await prisma.plan.deleteMany({});
      console.log("🗑️ Cleared existing plans");
    }

    // Crear planes desde la configuración
    for (const planData of plansData) {
      const plan = await prisma.plan.upsert({
        where: { name: planData.name },
        update: {
          description: planData.description,
          priceMonthly: planData.priceMonthly,
          priceYearly: planData.priceYearly,
          benefits: planData.benefits,
          limitations: planData.limitations,
          isActive: true,
          updatedAt: new Date()
        },
        create: {
          name: planData.name,
          description: planData.description,
          priceMonthly: planData.priceMonthly,
          priceYearly: planData.priceYearly,
          benefits: planData.benefits,
          limitations: planData.limitations,
          isActive: true
        }
      });

      console.log(`✅ Plan "${plan.name}" created/updated with ID: ${plan.id}`);
    }

    console.log("🎉 Plans seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding plans:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  seedPlans();
}

export { seedPlans };
