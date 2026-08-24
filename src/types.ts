import type { MenuItem } from "./data/menu";

export type CartLine = {
  key: string;
  item: MenuItem;
  qty: number;
  choices: Record<string, string>;
  /** Checked addon names */
  addons: string[];
  note: string;
  unitPrice: number;
};
