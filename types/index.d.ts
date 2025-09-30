import { User } from "@prisma/client";
import type { Icon } from "lucide-react";

import { Icons } from "@/components/shared/icons";

export type SiteConfig = {
  name: string;
  description: string;
  url: string;
  ogImage: string;
  mailSupport: string;
  links: {
    twitter: string;
    github: string;
  };
};

export type NavItem = {
  title: string;
  href: string;
  badge?: number;
  disabled?: boolean;
  external?: boolean;
  authorizeOnly?: UserRole;
  icon?: keyof typeof Icons;
};

export type MainNavItem = NavItem;

export type MarketingConfig = {
  mainNav: MainNavItem[];
};

export type SidebarNavItem = {
  title: string;
  items: NavItem[];
  authorizeOnly?: UserRole;
  icon?: keyof typeof Icons;
};

export type DocsConfig = {
  mainNav: MainNavItem[];
  sidebarNav: SidebarNavItem[];
};

// subcriptions
export type SubscriptionPlan = {
  title: string;
  description: string;
  benefits: string[];
  limitations: string[];
  prices: {
    monthly: number;
    yearly: number;
  };
  mercadoPagoPrices: {
    monthly: number;
    yearly: number;
  };
  mercadoPagoIds: {
    monthly: string | null;
    yearly: string | null;
  };
};

export type UserSubscriptionPlan = SubscriptionPlan &
  Pick<User, "mercadoPagoCustomerId" | "mercadoPagoSubscriptionId" | "mercadoPagoPlanId"> & {
    mercadoPagoCurrentPeriodEnd: number;
    isPaid: boolean;
    interval: "month" | "year" | null;
    isCanceled?: boolean;
  };

// compare plans
export type ColumnType = string | boolean | null;
export type PlansRow = { feature: string; tooltip?: string } & {
  [key in (typeof plansColumns)[number]]: ColumnType;
};

