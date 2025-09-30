#!/usr/bin/env tsx


import { STANDARD_PLANS_CONFIG } from '../lib/mercadopago-plans-constants';
import { MercadoPagoPlansManager } from "@/lib/mercadopago-plans";
import { config } from "dotenv";

config();

async function createStandardPlans() {
  console.log('🚀 Creando planes estándar de SaaS...\n');
  
  try {
    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
    if (!accessToken) {
      throw new Error("MERCADOPAGO_ACCESS_TOKEN environment variable is required");
    }
    const plansManager = new MercadoPagoPlansManager(accessToken);
    
    console.log(`📋 Configuración:`);
    console.log(`   Moneda: ${STANDARD_PLANS_CONFIG.currency}`);
    console.log(`   Cantidad de planes: ${STANDARD_PLANS_CONFIG.plans.length}\n`);
    
    // Mostrar los planes que se van a crear
    STANDARD_PLANS_CONFIG.plans.forEach((plan, index) => {
      console.log(`📋 Plan ${index + 1}: ${plan.reason}`);
      console.log(`   Frecuencia: ${plan.auto_recurring.frequency} ${plan.auto_recurring.frequency_type}`);
      console.log(`   Repeticiones: ${plan.auto_recurring.repetitions || 'Ilimitadas'}`);
      console.log(`   Monto: $${plan.auto_recurring.transaction_amount} ${plan.auto_recurring.currency_id}`);
      console.log(`   Día de facturación: ${plan.auto_recurring.billing_day}`);
      console.log('   ---');
    });
    
    console.log('\n⏳ Creando planes...\n');
    
    const results = await plansManager.createMultiplePlans(STANDARD_PLANS_CONFIG.plans);
    
    console.log('\n📊 Resultados:\n');
    
    let successCount = 0;
    let errorCount = 0;
    
    results.forEach((result, index) => {
      const plan = STANDARD_PLANS_CONFIG.plans[index];
      
      if (result.status === 201) {
        console.log(`✅ ${plan.reason}:`);
        console.log(`   ID: ${result.data.id}`);
        console.log(`   Estado: ${result.data.status}`);
        successCount++;
      } else {
        console.log(`❌ ${plan.reason}:`);
        console.log(`   Error: ${result.error}`);
        errorCount++;
      }
      console.log('   ---');
    });
    
    console.log(`\n📈 Resumen:`);
    console.log(`   ✅ Exitosos: ${successCount}`);
    console.log(`   ❌ Errores: ${errorCount}`);
    console.log(`   📋 Total: ${results.length}`);
    
    if (successCount > 0) {
      console.log('\n💡 Tip: Ejecuta "npm run plans:list" para ver todos los planes');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

async function createCustomPlan() {
  const planName = process.argv[2];
  const amount = parseFloat(process.argv[3]);
  const currency = process.argv[4] || 'USD';
  const frequency = parseInt(process.argv[5]) || 1;
  const frequencyType = process.argv[6] || 'months';
  const repetitions = process.argv[7] ? parseInt(process.argv[7]) : null;
  
  if (!planName || !amount) {
    console.log(`
📋 Crear Plan Personalizado

Uso: npm run plans:create <nombre> <monto> [moneda] [frecuencia] [tipo_frecuencia] [repeticiones]

Ejemplos:
  npm run plans:create "Plan Premium" 50 USD 1 months 12
  npm run plans:create "Plan Básico" 10 USD 1 months
  npm run plans:create "Plan Diario" 5 USD 7 days

Parámetros:
  nombre           - Nombre del plan (requerido)
  monto           - Monto del plan (requerido)
  moneda          - Moneda (USD, COP, ARS, etc.) - default: USD
  frecuencia      - Cada cuántos períodos - default: 1
  tipo_frecuencia - days, months - default: months
  repeticiones    - Número de repeticiones (null = ilimitado) - default: null
`);
    return;
  }
  
  console.log(`🚀 Creando plan personalizado: ${planName}\n`);
  
  try {
    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
    if (!accessToken) {
      throw new Error("MERCADOPAGO_ACCESS_TOKEN environment variable is required");
    }
    const plansManager = (new MercadoPagoPlansManager(accessToken));
    

    const planData = {
      reason: planName,
      auto_recurring: {
        frequency,
        frequency_type: frequencyType as 'days' | 'months',
        repetitions,
        billing_day: 1,
        billing_day_proportional: false,
        transaction_amount: amount,
        currency_id: currency as 'USD' | 'COP' | 'ARS' | 'BRL' | 'MXN'
      },
      payment_methods_allowed: {
        payment_types: [{}],
        payment_methods: [{}]
      },
      back_url: "https://your-site.com"
    };
    
    console.log(`📋 Configuración del plan:`);
    console.log(`   Nombre: ${planData.reason}`);
    console.log(`   Frecuencia: ${planData.auto_recurring.frequency} ${planData.auto_recurring.frequency_type}`);
    console.log(`   Repeticiones: ${planData.auto_recurring.repetitions || 'Ilimitadas'}`);
    console.log(`   Monto: $${planData.auto_recurring.transaction_amount} ${planData.auto_recurring.currency_id}`);
    console.log(`   Día de facturación: ${planData.auto_recurring.billing_day}\n`);
    
    const response = await plansManager.createPlan(planData);
    
    if (response.status === 201) {
      console.log(`✅ Plan creado exitosamente!`);
      console.log(`   ID: ${response.data.id}`);
      console.log(`   Estado: ${response.data.status}`);
      console.log(`\n💡 Tip: Ejecuta "npm run plans:list" para ver todos los planes`);
    } 
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

async function main() {
  const mode = process.argv[2];
  
  if (mode === 'standard') {
    await createStandardPlans();
  } else {
    await createCustomPlan();
  }
}

main().catch(console.error);
