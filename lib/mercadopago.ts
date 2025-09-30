import { MercadoPagoConfig, Preference, Customer, MerchantOrder, Payment } from "mercadopago";
import { env } from "@/env.mjs";

// Initialize Mercado Pago configuration
const client = new MercadoPagoConfig({
  accessToken: env.MERCADOPAGO_ACCESS_TOKEN,
  options: {
    timeout: 5000,

  },
});



// Initialize services
export const preference = new Preference(client);
export const customer = new Customer(client);
export const merchantOrder = new MerchantOrder(client);
export const payment = new Payment(client);

export { client as mercadopago };
