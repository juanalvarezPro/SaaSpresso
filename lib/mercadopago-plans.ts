import { MercadoPagoConfig, PreApprovalPlan } from "mercadopago";
import { MercadoPagoPlan, PlanResponse } from '@/types';
//class to manage mercado pago plans
export class MercadoPagoPlansManager {
  private client: MercadoPagoConfig;
  private preApprovalPlan: PreApprovalPlan;

  constructor(accessToken: string) {
    this.client = new MercadoPagoConfig({
      accessToken,
      options: {
        timeout: 5000,
      },
    });
    this.preApprovalPlan = new PreApprovalPlan(this.client);
  }

  /**
   * Maneja la respuesta del SDK y la convierte al formato esperado
   */
  private handleSDKResponse(response: any): PlanResponse {
    return {
      status: response.status || 200,
      data: response,
      error: response.status >= 400 ? response.message : undefined
    };
  }

  /**
   * Crea un nuevo plan de suscripción
   */
  async createPlan(planData: Omit<MercadoPagoPlan, 'id' | 'status' | 'date_created' | 'last_modified'>): Promise<PlanResponse> {
    try {
      console.log(`Creating plan: ${planData.reason}`);
      const response = await this.preApprovalPlan.create({ body: planData as any });
      
      console.log(`✅ Plan created successfully! ID: ${response.id}`);
      return this.handleSDKResponse(response);
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
      const response = await this.preApprovalPlan.get(planId as any);
      return this.handleSDKResponse(response);
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
      const response = await this.preApprovalPlan.update({ id: planId, updatePreApprovalPlanRequest: planData } as any);
      
      console.log(`✅ Plan updated successfully!`);
      return this.handleSDKResponse(response);
    } catch (error) {
      console.error('Error updating plan:', error);
      throw error;
    }
  }

  /**
   * Pausa un plan (no se pueden crear nuevas suscripciones)
   */
  async pausePlan(planId: string): Promise<PlanResponse> {
    return this.updatePlan(planId, { status: 'inactive' });
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
  async listPlans(limit: number = 10, offset: number = 0): Promise<any> {
    try {
      const response = await this.preApprovalPlan.search({} as any);
      return response as any;
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

