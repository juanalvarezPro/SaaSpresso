#!/usr/bin/env tsx

import { MercadoPagoPlansManager } from "@/lib/mercadopago-plans";
import { getPlanIds } from '../lib/mercadopago-plans-constants';
import { config } from "dotenv";

config();

const action = process.argv[2];
const planId = process.argv[3];
const newPrice = process.argv[4];
const newName = process.argv[5];

async function pausePlan(planId: string) {
  console.log(`⏸️  Pausando plan: ${planId}`);
  
  try {
    const token = process.env.MERCADOPAGO_ACCESS_TOKEN;
    if (!token) {
      throw new Error("MERCADOPAGO_ACCESS_TOKEN environment variable is required");
    }
    const plansManager = new MercadoPagoPlansManager(token);
    const response = await plansManager.pausePlan(planId as any);
    
    if (response.status === 200) {  
      console.log(`✅ Plan pausado exitosamente`);
    } 
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

async function activatePlan(planId: string) {
  console.log(`▶️  Activando plan: ${planId}`);
  
  try {
    const token = process.env.MERCADOPAGO_ACCESS_TOKEN;
    if (!token) {
      throw new Error("MERCADOPAGO_ACCESS_TOKEN environment variable is required");
    }
    const plansManager = new MercadoPagoPlansManager(token);
    const response = await plansManager.activatePlan(planId);
    
    if (response.status === 200) {
      console.log(`✅ Plan activado exitosamente`);
    } else {
      console.error(`❌ Error activando plan: ${response.error || 'Unknown error'}`);
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

async function cancelPlan(planId: string) {
  console.log(`❌ Cancelando plan: ${planId}`);
  
  try {
    const token = process.env.MERCADOPAGO_ACCESS_TOKEN;
    if (!token) {
      throw new Error("MERCADOPAGO_ACCESS_TOKEN environment variable is required");
    }
    const plansManager = new MercadoPagoPlansManager(token);
    const response = await plansManager.cancelPlan(planId as any);
    
    if (response.status === 200) {
      console.log(`✅ Plan cancelado exitosamente`);
    } else {
      console.error(`❌ Error cancelando plan: ${response.error || 'Unknown error'}`);
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

async function getPlanDetails(planId: string) {
  console.log(`🔍 Obteniendo detalles del plan: ${planId}`);
  
  try {
    const token = process.env.MERCADOPAGO_ACCESS_TOKEN;
    if (!token) {
      throw new Error("MERCADOPAGO_ACCESS_TOKEN environment variable is required");
    }
    const plansManager = new MercadoPagoPlansManager(token);
    await plansManager.getPlanDetails(planId as any);
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

async function updatePlanPrice(planId: string, price: number) {
  console.log(`💰 Actualizando precio del plan: ${planId} a $${price}`);
  
  try {
    const token = process.env.MERCADOPAGO_ACCESS_TOKEN;
    if (!token) {
      throw new Error("MERCADOPAGO_ACCESS_TOKEN environment variable is required");
    }
    const plansManager = new MercadoPagoPlansManager(token);
    const response = await plansManager.updatePlan(planId, {
      auto_recurring: { transaction_amount: price } as any
    });
    
    if (response.status === 200) {
      console.log(`✅ Precio actualizado exitosamente a $${price}`);
    } else {
      console.error(`❌ Error actualizando precio: ${response.error || 'Unknown error'}`);
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

async function updatePlanName(planId: string, name: string) {
  console.log(`📝 Actualizando nombre del plan: ${planId} a "${name}"`);
  
  try {
    const token = process.env.MERCADOPAGO_ACCESS_TOKEN;
    if (!token) {
      throw new Error("MERCADOPAGO_ACCESS_TOKEN environment variable is required");
    }
    const plansManager = new MercadoPagoPlansManager(token);
    const response = await plansManager.updatePlan(planId, {
      reason: name
    });
    
    if (response.status === 200) {
      console.log(`✅ Nombre actualizado exitosamente a "${name}"`);
    } else {
      console.error(`❌ Error actualizando nombre: ${response.error || 'Unknown error'}`);
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

async function updatePlanBoth(planId: string, price: number, name: string) {
  console.log(`🔄 Actualizando plan: ${planId} - Precio: $${price}, Nombre: "${name}"`);
  
  try {
    const token = process.env.MERCADOPAGO_ACCESS_TOKEN;
    if (!token) {
      throw new Error("MERCADOPAGO_ACCESS_TOKEN environment variable is required");
    }
    const plansManager = new MercadoPagoPlansManager(token);
    const response = await plansManager.updatePlan(planId, {
      reason: name,
      auto_recurring: { transaction_amount: price } as any
    });
    
    if (response.status === 200) {
      console.log(`✅ Plan actualizado exitosamente - Precio: $${price}, Nombre: "${name}"`);
    } 
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

async function showHelp() {
  console.log(`
📋 Gestión de Planes de MercadoPago

Uso: npm run plans:manage <acción> [plan_id] [opciones]

Acciones disponibles:
  pause <plan_id>     - Pausar un plan
  activate <plan_id>  - Activar un plan
  cancel <plan_id>    - Cancelar un plan
  details <plan_id>   - Ver detalles de un plan
  price <plan_id> <precio>     - Cambiar solo el precio
  name <plan_id> <nombre>      - Cambiar solo el nombre
  update <plan_id> <precio> <nombre> - Cambiar precio y nombre
  help               - Mostrar esta ayuda

Ejemplos:
  npm run plans:manage pause 2c9380848csdfd8c8c8c8c8c8c8c8c8c8c8c
  npm run plans:manage activate pro_monthly
  npm run plans:manage details business_yearly
  npm run plans:manage price 705de41c4644c48c15141bdfgf297239a 25
  npm run plans:manage name c705d46dfg44c48c15141bf297239a "Plan Pro Premium"
  npm run plans:manage update cd705de41c44c48c15141bf2fsdf239a 25 "Plan Pro Premium"

Planes disponibles (desde variables de entorno):
${Object.entries(getPlanIds()).map(([key, id]) => `  ${key}: ${id || 'No configurado'}`).join('\n')}
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

  // Si el planId es una clave de getPlanIds(), usar el ID real
  const planIds = getPlanIds();
  const actualPlanId = planIds[planId as keyof typeof planIds] || planId;

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
    case 'price':
      if (!newPrice) {
        console.error('❌ Error: Se requiere un precio');
        console.log('Ejemplo: npm run plans:manage price <plan_id> 25');
        return;
      }
      await updatePlanPrice(actualPlanId, parseFloat(newPrice));
      break;
    case 'name':
      if (!newName) {
        console.error('❌ Error: Se requiere un nombre');
        console.log('Ejemplo: npm run plans:manage name <plan_id> "Nuevo Nombre"');
        return;
      }
      await updatePlanName(actualPlanId, newName);
      break;
    case 'update':
      if (!newPrice || !newName) {
        console.error('❌ Error: Se requiere precio y nombre');
        console.log('Ejemplo: npm run plans:manage update <plan_id> 25 "Nuevo Nombre"');
        return;
      }
      await updatePlanBoth(actualPlanId, parseFloat(newPrice), newName);
      break;
    default:
      console.error(`❌ Acción desconocida: ${action}`);
      await showHelp();
  }
}

main().catch(console.error);
