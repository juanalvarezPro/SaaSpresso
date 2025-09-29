import { SidebarNavItem, SiteConfig } from "types";
import { env } from "@/env.mjs";

const site_url = env.NEXT_PUBLIC_APP_URL;

export const siteConfig: SiteConfig = {
  name: "SaaSpresso",
  description:
    "El boilerplate perfecto para proyectos SaaS en Colombia. Inspirado en el aroma del espresso y potenciado con MercadoPago, Next.js 14, Prisma, Neon, Cloudflare R2 y más tecnologías de vanguardia.",
  url: site_url,
  ogImage: `${site_url}/_static/og.jpg`,
  links: {
    twitter: "https://twitter.com/juanalvarezpro",
    github: "https://github.com/juanalvarezpro/saaspresso",
  },
  mailSupport: "hola@juanalvarez.pro",
};

export const footerLinks: SidebarNavItem[] = [
  {
    title: "Empresa",
    items: [
      { title: "Inicio", href: "#" },
      { title: "Terminos y Condiciones", href: "/terms" },
      { title: "Privacidad", href: "/privacy" },
    ],
  },

  {
    title: "Docs",
    items: [
      { title: "Introduccion", href: "#" },
      { title: "Soporte", href: "#" },
    ],
  },
];
