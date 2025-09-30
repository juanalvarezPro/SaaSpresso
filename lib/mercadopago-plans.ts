import https from 'https';

export interface MercadoPagoPlan {
  id?: string;
  reason: string;
  auto_recurring: {
    frequency: number;
    frequency_type: 'days' | 'months';
    repetitions: number | null;
    billing_day: number;
    billing_day_proportional: boolean;
    transaction_amount: number;
    currency_id: 'USD' | 'COP' | 'ARS' | 'BRL' | 'MXN';
  };
  payment_methods_allowed: {
    payment_types: Array<Record<string, any>>;
    payment_methods: Array<Record<string, any>>;
  };
  back_url: string;
  status?: 'active' | 'paused' | 'cancelled';
  date_created?: string;
  last_modified?: string;
}

export interface PlanResponse {
  status: number;
  data: MercadoPagoPlan;
  error?: string;
}

export class MercadoPagoPlansManager {
  private accessToken: string;
  private baseUrl = 'api.mercadopago.com';

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  /**
   * Realiza una petición HTTP a la API de MercadoPago
   */
  private makeRequest(path: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE', data?: any): Promise<PlanResponse> {
    return new Promise((resolve, reject) => {
      const postData = data ? JSON.stringify(data) : '';
      
      const options = {
        hostname: this.baseUrl,
        port: 443,
        path: path,
        method: method,
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        }
      };

      const req = https.request(options, (res) => {
        let responseData = '';
        
        res.on('data', (chunk) => {
          responseData += chunk;
        });
        
        res.on('end', () => {
          try {
            const parsedData = JSON.parse(responseData);
            resolve({ 
              status: res.statusCode || 500, 
              data: parsedData,
              error: res.statusCode && res.statusCode >= 400 ? parsedData.message : undefined
            });
          } catch (error) {
            reject(error);
          }
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      if (postData) {
        req.write(postData);
      }
      req.end();
    });
  }

  /**
   * Crea un nuevo plan de suscripción
   */
  async createPlan(planData: Omit<MercadoPagoPlan, 'id' | 'status' | 'date_created' | 'last_modified'>): Promise<PlanResponse> {
    try {
      console.log(`Creating plan: ${planData.reason}`);
      const response = await this.makeRequest('/preapproval_plan', 'POST', planData);
      
      if (response.status === 201) {
        console.log(`✅ Plan created successfully! ID: ${response.data.id}`);
      } else {
        console.error(`❌ Error creating plan: ${response.error}`);
      }
      
      return response;
    } catch (error) {
      console.error('Error creating plan:', error);
      throw error;
    }
  }

  /**
   * Obtiene un plan por su ID
   */
  async getPlan(planId: string): Promise<PlanResponse> {
    try {
      const response = await this.makeRequest(`/preapproval_plan/${planId}`, 'GET');
      return response;
    } catch (error) {
      console.error('Error getting plan:', error);
      throw error;
    }
  }

  /**
   * Actualiza un plan existente
   */
  async updatePlan(planId: string, planData: Partial<MercadoPagoPlan>): Promise<PlanResponse> {
    try {
      console.log(`Updating plan: ${planId}`);
      const response = await this.makeRequest(`/preapproval_plan/${planId}`, 'PUT', planData);
      
      if (response.status === 200) {
        console.log(`✅ Plan updated successfully!`);
      } else {
        console.error(`❌ Error updating plan: ${response.error}`);
      }
      
      return response;
    } catch (error) {
      console.error('Error updating plan:', error);
      throw error;
    }
  }

  /**
   * Pausa un plan (no se pueden crear nuevas suscripciones)
   */
  async pausePlan(planId: string): Promise<PlanResponse> {
    return this.updatePlan(planId, { status: 'paused' });
  }

  /**
   * Activa un plan pausado
   */
  async activatePlan(planId: string): Promise<PlanResponse> {
    return this.updatePlan(planId, { status: 'active' });
  }

  /**
   * Cancela un plan
   */
  async cancelPlan(planId: string): Promise<PlanResponse> {
    return this.updatePlan(planId, { status: 'cancelled' });
  }

  /**
   * Lista todos los planes (requiere implementación de paginación)
   */
  async listPlans(limit: number = 10, offset: number = 0): Promise<PlanResponse> {
    try {
      const response = await this.makeRequest(`/preapproval_plan?limit=${limit}&offset=${offset}`, 'GET');
      return response;
    } catch (error) {
      console.error('Error listing plans:', error);
      throw error;
    }
  }

  /**
   * Crea múltiples planes de una vez
   */
  async createMultiplePlans(plans: Array<Omit<MercadoPagoPlan, 'id' | 'status' | 'date_created' | 'last_modified'>>): Promise<PlanResponse[]> {
    const results: PlanResponse[] = [];
    
    for (const plan of plans) {
      try {
        const result = await this.createPlan(plan);
        results.push(result);
        
        // Pequeña pausa entre requests para evitar rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`Error creating plan ${plan.reason}:`, error);
        results.push({
          status: 500,
          data: {} as MercadoPagoPlan,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
    
    return results;
  }

  /**
   * Obtiene información detallada de un plan
   */
  async getPlanDetails(planId: string): Promise<void> {
    try {
      const response = await this.getPlan(planId);
      
      if (response.status === 200) {
        const plan = response.data;
        console.log(`\n📋 Plan Details - ${plan.reason}`);
        console.log(`   ID: ${plan.id}`);
        console.log(`   Status: ${plan.status}`);
        console.log(`   Frequency: ${plan.auto_recurring.frequency} ${plan.auto_recurring.frequency_type}`);
        console.log(`   Repetitions: ${plan.auto_recurring.repetitions || 'Unlimited'}`);
        console.log(`   Amount: $${plan.auto_recurring.transaction_amount} ${plan.auto_recurring.currency_id}`);
        console.log(`   Billing Day: ${plan.auto_recurring.billing_day}`);
        console.log(`   Created: ${plan.date_created}`);
        console.log(`   Modified: ${plan.last_modified}`);
      } else {
        console.error(`❌ Error getting plan details: ${response.error}`);
      }
    } catch (error) {
      console.error('Error getting plan details:', error);
    }
  }

  /**
   * Crea planes estándar para una aplicación SaaS
   */
  async createStandardSaaSPlans(currency: 'USD' | 'COP' = 'USD'): Promise<PlanResponse[]> {
    const standardPlans = [
      {
        reason: "Plan Pro Mensual",
        auto_recurring: {
          frequency: 1,
          frequency_type: "months" as const,
          repetitions: null,
          billing_day: 1,
          billing_day_proportional: false,
          transaction_amount: currency === 'USD' ? 15 : 60000,
          currency_id: currency
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
          transaction_amount: currency === 'USD' ? 144 : 600000,
          currency_id: currency
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
          transaction_amount: currency === 'USD' ? 30 : 120000,
          currency_id: currency
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
          transaction_amount: currency === 'USD' ? 300 : 1200000,
          currency_id: currency
        },
        payment_methods_allowed: {
          payment_types: [{}],
          payment_methods: [{}]
        },
        back_url: "https://your-site.com"
      }
    ];

    return this.createMultiplePlans(standardPlans);
  }
}

// Función helper para crear una instancia con el token del .env
export function createMercadoPagoPlansManager(): MercadoPagoPlansManager {
  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
  
  if (!accessToken) {
    throw new Error('MERCADOPAGO_ACCESS_TOKEN environment variable is required');
  }
  
  return new MercadoPagoPlansManager(accessToken);
}
