#!/usr/bin/env tsx
import { MercadoPagoPlansManager } from "@/lib/mercadopago-plans";
import { config } from "dotenv";

config();

//esto es solo para testeo, no se debe usar en producción
async function listAllPlans() {
  console.log("🔍 Buscando planes existentes en MercadoPago...\n");

  try {
    // Usar variable de entorno
    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;

    if (!accessToken) {
      throw new Error("MERCADOPAGO_ACCESS_TOKEN environment variable is required");
    }

    const client = new MercadoPagoPlansManager(accessToken);


    const response = await client.listPlans();

    if (response.results && Array.isArray(response.results)) {
      const plans = response.results;

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
        console.log(`   URL de pago: ${plan.init_point}`);
        console.log(`   Creado: ${plan.date_created}`);
        console.log(`   Modificado: ${plan.last_modified}`);
        console.log('   ---');
      });


      // IDs para usar en variables de entorno
      console.log('\n📋 IDs para variables de entorno (.env):');
      plans.forEach((plan: any) => {
        const planKey = plan.reason
          .toLowerCase()
          .replace(/[^a-z0-9\s]/g, '')
          .replace(/\s+/g, '_')
          .replace(/plan_/g, '');
        console.log(`NEXT_PUBLIC_MERCADOPAGO_${planKey.toUpperCase()}_PLAN_ID="${plan.id}"`);
      });

    } else {
      console.log('❌ No se encontraron planes');
    }

  } catch (error) {
    console.error("❌ Error al buscar planes:", error);
  }
}

// Ejecutar el script
listAllPlans().catch(console.error);
