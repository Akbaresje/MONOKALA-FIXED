import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { menu as seedMenu, type MenuItem } from "../data/menu";
import type { CartLine } from "../types";

export type OrderStatus = "new" | "preparing" | "ready" | "done" | "cancelled";

export type Order = {
  id: string;
  code: string;
  name: string;
  table: string;
  method: string;
  lines: CartLine[];
  subtotal: number;
  service: number;
  tax: number;
  total: number;
  placedAt: number;
  status: OrderStatus;
  paid: boolean;
};

export type PaymentMethod = {
  id: string;
  label: string;
  note: string;
  enabled: boolean;
  /** cash = settle at cashier, others are prepaid */
  prepaid: boolean;
};

export type Settings = {
  cafeName: string;
  serviceRate: number; // 0.05 = 5%
  taxRate: number; // 0.11 = 11%
  tables: number;
  acceptingOrders: boolean;
  prepMinutes: number;
  payments: PaymentMethod[];
  staffPassword: string;
};

const defaultSettings: Settings = {
  cafeName: "MONOKALA",
  serviceRate: 0.05,
  taxRate: 0.11,
  tables: 24,
  acceptingOrders: true,
  prepMinutes: 12,
  payments: [
    { id: "qris", label: "QRIS", note: "Semua e-wallet & bank", enabled: true, prepaid: true },
    { id: "card", label: "Kartu Debit / Kredit", note: "Visa · Mastercard", enabled: true, prepaid: true },
    { id: "cash", label: "Bayar di Kasir", note: "Tunai saat pengambilan", enabled: true, prepaid: false },
  ],
  staffPassword: "monokala2024",
};

type StoreValue = {
  menu: MenuItem[];
  settings: Settings;
  orders: Order[];
  // menu actions
  upsertItem: (item: MenuItem) => void;
  removeItem: (id: string) => void;
  toggleAvailability: (id: string) => void;
  resetMenu: () => void;
  // settings
  updateSettings: (patch: Partial<Settings>) => void;
  updatePayment: (id: string, patch: Partial<PaymentMethod>) => void;
  // orders
  createOrder: (input: {
    name: string;
    table: string;
    method: string;
    lines: CartLine[];
  }) => Order;
  setOrderStatus: (id: string, status: OrderStatus) => void;
  markPaid: (id: string) => void;
  clearFinished: () => void;
  priceBreakdown: (subtotal: number) => { service: number; tax: number; total: number };
};

const StoreCtx = createContext<StoreValue | null>(null);

const LS_KEY = "monokala:v1";

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(`${LS_KEY}:${key}`);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function save(key: string, value: unknown) {
  try {
    localStorage.setItem(`${LS_KEY}:${key}`, JSON.stringify(value));
  } catch {
    /* storage full or unavailable — non fatal */
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [menu, setMenu] = useState<MenuItem[]>(() => load("menu", seedMenu));
  const [settings, setSettings] = useState<Settings>(() => ({
    ...defaultSettings,
    ...load("settings", defaultSettings),
  }));
  const [orders, setOrders] = useState<Order[]>(() => load("orders", [] as Order[]));

  useEffect(() => save("menu", menu), [menu]);
  useEffect(() => save("settings", settings), [settings]);
  useEffect(() => save("orders", orders), [orders]);

  const value = useMemo<StoreValue>(() => {
    const priceBreakdown = (subtotal: number) => {
      const service = Math.round(subtotal * settings.serviceRate);
      const tax = Math.round((subtotal + service) * settings.taxRate);
      return { service, tax, total: subtotal + service + tax };
    };

    return {
      menu,
      settings,
      orders,
      priceBreakdown,

      upsertItem: (item) =>
        setMenu((prev) => {
          const i = prev.findIndex((m) => m.id === item.id);
          if (i === -1) return [...prev, item];
          const next = [...prev];
          next[i] = item;
          return next;
        }),

      removeItem: (id) => setMenu((prev) => prev.filter((m) => m.id !== id)),

      toggleAvailability: (id) =>
        setMenu((prev) =>
          prev.map((m) => (m.id === id ? { ...m, soldOut: !m.soldOut } : m)),
        ),

      resetMenu: () => setMenu(seedMenu),

      updateSettings: (patch) => setSettings((s) => ({ ...s, ...patch })),

      updatePayment: (id, patch) =>
        setSettings((s) => ({
          ...s,
          payments: s.payments.map((p) => (p.id === id ? { ...p, ...patch } : p)),
        })),

      createOrder: ({ name, table, method, lines }) => {
        const subtotal = lines.reduce((sum, l) => sum + l.unitPrice * l.qty, 0);
        const { service, tax, total } = priceBreakdown(subtotal);
        const seq = orders.length + 10;
        const order: Order = {
          id: `${Date.now()}`,
          code: "A" + String(seq).padStart(2, "0"),
          name,
          table,
          method,
          lines,
          subtotal,
          service,
          tax,
          total,
          placedAt: Date.now(),
          status: "new",
          paid: settings.payments.find((p) => p.id === method)?.prepaid ?? false,
        };
        setOrders((prev) => [order, ...prev]);
        return order;
      },

      setOrderStatus: (id, status) =>
        setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o))),

      markPaid: (id) => setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, paid: true } : o))),

      clearFinished: () =>
        setOrders((prev) => prev.filter((o) => o.status !== "done" && o.status !== "cancelled")),
    };
  }, [menu, settings, orders]);

  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreCtx);
  if (!ctx) throw new Error("useStore must be used inside <StoreProvider>");
  return ctx;
}
