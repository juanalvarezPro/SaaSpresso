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
  id?: string;
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

export type UserSubscriptionPlan = SubscriptionPlan & {
  mercadoPagoCurrentPeriodEnd: number;
  isPaid: boolean;
  interval: "month" | "year" | null;
  isCanceled?: boolean;
  activeSubscription?: {
    id: string;
    mercadoPagoId: string;
    planId: string;
    planName: string;
    status: string;
    nextBillingDate: Date | null;
  };
};

// compare plans
export type ColumnType = string | boolean | null;
export type PlansRow = { feature: string; tooltip?: string } & {
  [key in (typeof plansColumns)[number]]: ColumnType;
};


export interface MercadoPagoPlan {
  id?: string;
  reason: string;
  auto_recurring: {
    frequency: number;
    frequency_type: 'days' | 'months';
    repetitions: number | null;
    billing_day: number;
    billing_day_proportional: boolean;
    transaction_amount: number;
    currency_id: 'USD' | 'COP' | 'ARS' | 'BRL' | 'MXN';
  };
  payment_methods_allowed: {
    payment_types: Array<Record<string, any>>;
    payment_methods: Array<Record<string, any>>;
  };
  back_url: string;
  status?: 'active' | 'inactive' | 'cancelled';
  date_created?: string;
  last_modified?: string;
}

export interface PlanResponse {
  status: number;
  data: MercadoPagoPlan;
  error?: string;
}