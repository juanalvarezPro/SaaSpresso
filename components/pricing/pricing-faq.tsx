import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { HeaderSection } from "../shared/header-section";

const pricingFaqData = [
  {
    id: "item-1",
    question: "¿Cuál es el costo del plan gratuito?",
    answer:
      "Nuestro plan gratuito es completamente gratuito, sin cargos mensuales o anuales. Es una gran manera de empezar y explorar nuestras características básicas.",
  },
  {
    id: "item-2",
    question: "¿Cuánto cuesta el plan Basic Mensual?",
    answer:
      "El plan Basic Mensual cuesta $15 por mes. Proporciona acceso a nuestras características principales y se cobra mensualmente.",
  },
  {
    id: "item-3",
    question: "¿Cuánto cuesta el plan Pro Mensual?",
    answer:
      "El plan Pro Mensual está disponible por $25 por mes. Ofrece características avanzadas y se cobra mensualmente para mayor flexibilidad.",
  },
  {
    id: "item-4",
    question: "¿Ofrecéis algún plan de suscripción anual?",
    answer:
      "Sí, ofrecemos planes de suscripción anual para ahorrar aún más. El plan Basic Anual cuesta $144 por año, y el plan Pro Anual cuesta $300 por año.",
  },
  {
    id: "item-5",
    question: "¿Hay un período de prueba para los planes pagados?",
    answer:
      "Ofrecemos una prueba gratuita de 14 días para ambos planes Pro Mensual y Pro Anual. Es una gran manera de experimentar todas las características antes de comprometerse con una suscripción pagada.",
  },
];

export function PricingFaq() {
  return (
    <section className="container max-w-4xl py-2">
      <HeaderSection
          label="Preguntas Frecuentes"
        title="Preguntas Frecuentes"
        subtitle="Explora nuestra FAQ para encontrar respuestas rápidas a preguntas comunes. Si necesitas más ayuda, no dudes en contactarnos para ayuda personalizada."
      />

      <Accordion type="single" collapsible className="my-12 w-full">
        {pricingFaqData.map((faqItem) => (
          <AccordionItem key={faqItem.id} value={faqItem.id}>
            <AccordionTrigger>{faqItem.question}</AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground sm:text-[15px]">
              {faqItem.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
