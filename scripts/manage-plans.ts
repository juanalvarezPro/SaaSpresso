#!/usr/bin/env tsx

import { createMercadoPagoPlansManager } from '../lib/mercadopago-plans';
import { EXISTING_PLANS, PLAN_IDS } from '../lib/mercadopago-plans-constants';

const action = process.argv[2];
const planId = process.argv[3];

async function pausePlan(planId: string) {
  console.log(`⏸️  Pausando plan: ${planId}`);
  
  try {
    const plansManager = createMercadoPagoPlansManager();
    const response = await plansManager.pausePlan(planId);
    
    if (response.status === 200) {
      console.log(`✅ Plan pausado exitosamente`);
    } else {
      console.error(`❌ Error pausando plan: ${response.error}`);
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

async function activatePlan(planId: string) {
  console.log(`▶️  Activando plan: ${planId}`);
  
  try {
    const plansManager = createMercadoPagoPlansManager();
    const response = await plansManager.activatePlan(planId);
    
    if (response.status === 200) {
      console.log(`✅ Plan activado exitosamente`);
    } else {
      console.error(`❌ Error activando plan: ${response.error}`);
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

async function cancelPlan(planId: string) {
  console.log(`❌ Cancelando plan: ${planId}`);
  
  try {
    const plansManager = createMercadoPagoPlansManager();
    const response = await plansManager.cancelPlan(planId);
    
    if (response.status === 200) {
      console.log(`✅ Plan cancelado exitosamente`);
    } else {
      console.error(`❌ Error cancelando plan: ${response.error}`);
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

async function getPlanDetails(planId: string) {
  console.log(`🔍 Obteniendo detalles del plan: ${planId}`);
  
  try {
    const plansManager = createMercadoPagoPlansManager();
    await plansManager.getPlanDetails(planId);
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

async function showHelp() {
  console.log(`
📋 Gestión de Planes de MercadoPago

Uso: npm run plans:manage <acción> [plan_id]

Acciones disponibles:
  pause <plan_id>     - Pausar un plan
  activate <plan_id>  - Activar un plan
  cancel <plan_id>    - Cancelar un plan
  details <plan_id>   - Ver detalles de un plan
  help               - Mostrar esta ayuda

Ejemplos:
  npm run plans:manage pause 2c9380848c8c8c8c8c8c8c8c8c8c8c8c
  npm run plans:manage activate pro_monthly
  npm run plans:manage details business_yearly

Planes disponibles (desde constantes):
${Object.entries(PLAN_IDS).map(([key, id]) => `  ${key}: ${id}`).join('\n')}
`);
}

async function main() {
  if (!action || action === 'help') {
    await showHelp();
    return;
  }

  if (!planId) {
    console.error('❌ Error: Se requiere un plan_id');
    await showHelp();
    return;
  }

  // Si el planId es una clave de PLAN_IDS, usar el ID real
  const actualPlanId = PLAN_IDS[planId as keyof typeof PLAN_IDS] || planId;

  switch (action) {
    case 'pause':
      await pausePlan(actualPlanId);
      break;
    case 'activate':
      await activatePlan(actualPlanId);
      break;
    case 'cancel':
      await cancelPlan(actualPlanId);
      break;
    case 'details':
      await getPlanDetails(actualPlanId);
      break;
    default:
      console.error(`❌ Acción desconocida: ${action}`);
      await showHelp();
  }
}

main().catch(console.error);
