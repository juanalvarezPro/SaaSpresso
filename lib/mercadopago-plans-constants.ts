// Constantes de planes de MercadoPago
// Ejecuta 'npm run plans:list' para obtener los planes actuales

export const EXISTING_PLANS = {
  // Los planes se generarán automáticamente cuando ejecutes el script
  // Ejemplo de estructura:
  // pro_monthly: {
  //   id: "2c9380848c8c8c8c8c8c8c8c8c8c8c8c",
  //   name: "Plan Pro Mensual",
  //   status: "active",
  //   frequency: 1,
  //   frequencyType: "months",
  //   repetitions: null,
  //   amount: 15,
  //   currency: "USD",
  //   billingDay: 1,
  //   createdAt: "2024-01-15T10:30:00.000-04:00",
  //   updatedAt: "2024-01-15T10:30:00.000-04:00"
  // }
};

// IDs de planes para scripts (se generarán automáticamente)
export const PLAN_IDS = {
  // Ejemplo:
  // pro_monthly: "2c9380848c8c8c8c8c8c8c8c8c8c8c8c"
};

// Configuración de planes estándar para crear nuevos
export const STANDARD_PLANS_CONFIG = {
  currency: 'USD' as const,
  plans: [
    {
      reason: "Plan Pro Mensual",
      auto_recurring: {
        frequency: 1,
        frequency_type: "months" as const,
        repetitions: null,
        billing_day: 1,
        billing_day_proportional: false,
        transaction_amount: 15,
        currency_id: "USD" as const
      },
      payment_methods_allowed: {
        payment_types: [{}],
        payment_methods: [{}]
      },
      back_url: "https://your-site.com"
    },
    {
      reason: "Plan Pro Anual",
      auto_recurring: {
        frequency: 1,
        frequency_type: "months" as const,
        repetitions: 12,
        billing_day: 1,
        billing_day_proportional: false,
        transaction_amount: 144,
        currency_id: "USD" as const
      },
      payment_methods_allowed: {
        payment_types: [{}],
        payment_methods: [{}]
      },
      back_url: "https://your-site.com"
    },
    {
      reason: "Plan Business Mensual",
      auto_recurring: {
        frequency: 1,
        frequency_type: "months" as const,
        repetitions: null,
        billing_day: 1,
        billing_day_proportional: false,
        transaction_amount: 30,
        currency_id: "USD" as const
      },
      payment_methods_allowed: {
        payment_types: [{}],
        payment_methods: [{}]
      },
      back_url: "https://your-site.com"
    },
    {
      reason: "Plan Business Anual",
      auto_recurring: {
        frequency: 1,
        frequency_type: "months" as const,
        repetitions: 12,
        billing_day: 1,
        billing_day_proportional: false,
        transaction_amount: 300,
        currency_id: "USD" as const
      },
      payment_methods_allowed: {
        payment_types: [{}],
        payment_methods: [{}]
      },
      back_url: "https://your-site.com"
    }
  ]
};
