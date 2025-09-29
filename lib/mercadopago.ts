import { MercadoPagoConfig, Preference, Customer } from "mercadopago";
import { env } from "@/env.mjs";

// Initialize Mercado Pago configuration
const client = new MercadoPagoConfig({
  accessToken: env.MERCADOPAGO_ACCESS_TOKEN,
  options: {
    timeout: 5000,
    idempotencyKey: "abc",
  },
});

// Initialize services
export const preference = new Preference(client);
export const customer = new Customer(client);

export { client as mercadopago };
