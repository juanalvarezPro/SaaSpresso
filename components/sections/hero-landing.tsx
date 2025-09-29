import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Icons } from "@/components/shared/icons";

export default function HeroLanding() {

  return (
    <section className="space-y-6 py-12 sm:py-20 lg:py-20">
      <div className="container flex max-w-5xl flex-col items-center gap-5 text-center">
        <Link
          href="https://github.com/juanalvarezpro"
          className={cn(
            buttonVariants({ variant: "outline", size: "sm", rounded: "full" }),
            "px-4",
          )}
          target="_blank"
        >
          <span className="mr-3">☕</span>
          <span className="hidden md:flex">Hecho en Colombia&nbsp;</span> 
          <span className="md:hidden">🇨🇴&nbsp;</span>
          con amor por <Icons.gitHub className="ml-2 size-3.5" />
        </Link>

        <h1 className="text-balance font-urban text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-[66px]">
          Desarrolla tu SaaS con el{" "}
          <span className="text-gradient_indigo-green font-extrabold">
            aroma del éxito
          </span>
        </h1>

        <p
          className="max-w-2xl text-balance leading-normal text-muted-foreground sm:text-xl sm:leading-8"
          style={{ animationDelay: "0.35s", animationFillMode: "forwards" }}
        >
          El boilerplate perfecto para proyectos SaaS en Colombia. Inspirado en el aroma del espresso y potenciado con MercadoPago, Next.js 14, Prisma, Neon, Cloudflare R2 y más tecnologías de vanguardia.
        </p>

        <div
          className="flex justify-center space-x-2 md:space-x-4"
          style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}
        >
          <Link
            href="/pricing"
            prefetch={true}
            className={cn(
              buttonVariants({ size: "lg", rounded: "full" }),
              "gap-2",
            )}
          >
            <span>Ver Precios</span>
            <Icons.arrowRight className="size-4" />
          </Link>

        </div>
      </div>
    </section>
  );
}
