#!/usr/bin/env tsx

import { createMercadoPagoPlansManager } from '../lib/mercadopago-plans';

async function listAllPlans() {
  console.log('🔍 Buscando planes existentes en MercadoPago...\n');
  
  try {
    const plansManager = createMercadoPagoPlansManager();
    
    // Listar todos los planes
    const response = await plansManager.listPlans(50, 0); // Obtener hasta 50 planes
    
    if (response.status === 200 && response.data) {
      const plans = Array.isArray(response.data) ? response.data : [response.data];
      
      if (plans.length === 0) {
        console.log('❌ No se encontraron planes en tu cuenta de MercadoPago');
        return;
      }
      
      console.log(`✅ Se encontraron ${plans.length} plan(es):\n`);
      
      plans.forEach((plan: any, index: number) => {
        console.log(`📋 Plan ${index + 1}:`);
        console.log(`   ID: ${plan.id}`);
        console.log(`   Nombre: ${plan.reason}`);
        console.log(`   Estado: ${plan.status}`);
        console.log(`   Frecuencia: ${plan.auto_recurring?.frequency} ${plan.auto_recurring?.frequency_type}`);
        console.log(`   Repeticiones: ${plan.auto_recurring?.repetitions || 'Ilimitadas'}`);
        console.log(`   Monto: $${plan.auto_recurring?.transaction_amount} ${plan.auto_recurring?.currency_id}`);
        console.log(`   Día de facturación: ${plan.auto_recurring?.billing_day}`);
        console.log(`   Creado: ${plan.date_created}`);
        console.log(`   Modificado: ${plan.last_modified}`);
        console.log('   ---');
      });
      
      // Generar constantes para el código
      console.log('\n📝 Constantes para tu código:\n');
      console.log('export const EXISTING_PLANS = {');
      
      plans.forEach((plan: any, index: number) => {
        const planKey = plan.reason
          .toLowerCase()
          .replace(/[^a-z0-9\s]/g, '')
          .replace(/\s+/g, '_')
          .replace(/plan_/g, '');
          
        console.log(`  ${planKey}: {`);
        console.log(`    id: "${plan.id}",`);
        console.log(`    name: "${plan.reason}",`);
        console.log(`    status: "${plan.status}",`);
        console.log(`    frequency: ${plan.auto_recurring?.frequency},`);
        console.log(`    frequencyType: "${plan.auto_recurring?.frequency_type}",`);
        console.log(`    repetitions: ${plan.auto_recurring?.repetitions || null},`);
        console.log(`    amount: ${plan.auto_recurring?.transaction_amount},`);
        console.log(`    currency: "${plan.auto_recurring?.currency_id}",`);
        console.log(`    billingDay: ${plan.auto_recurring?.billing_day},`);
        console.log(`    createdAt: "${plan.date_created}",`);
        console.log(`    updatedAt: "${plan.last_modified}"`);
        console.log(`  }${index < plans.length - 1 ? ',' : ''}`);
      });
      
      console.log('};\n');
      
      // Generar IDs para scripts
      console.log('📋 IDs de planes para scripts:');
      plans.forEach((plan: any) => {
        const planKey = plan.reason
          .toLowerCase()
          .replace(/[^a-z0-9\s]/g, '')
          .replace(/\s+/g, '_')
          .replace(/plan_/g, '');
        console.log(`${planKey}: "${plan.id}"`);
      });
      
    } else {
      console.error('❌ Error al obtener planes:', response.error);
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Ejecutar el script
listAllPlans().catch(console.error);
