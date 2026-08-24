import { useState } from "react";
import { Logo } from "../Logo";
import { useStore } from "../../store/store";
import KitchenBoard from "./KitchenBoard";
import MenuManager from "./MenuManager";
import SettingsPanel from "./SettingsPanel";
import TableQrManager from "./TableQrManager";

type Tab = "orders" | "menu" | "tables" | "settings";

const tabs: { id: Tab; label: string; sub: string }[] = [
  { id: "orders", label: "Pesanan", sub: "01" },
  { id: "menu", label: "Menu", sub: "02" },
  { id: "tables", label: "QR Meja", sub: "03" },
  { id: "settings", label: "Pengaturan", sub: "04" },
];

export default function AdminApp({ onExit }: { onExit: () => void }) {
  const [tab, setTab] = useState<Tab>("orders");
  const { orders, settings } = useStore();
  const pending = orders.filter((o) => o.status === "new").length;

  return (
    <div className="min-h-screen bg-linen">
      <header className="sticky top-0 z-30 border-b border-sand bg-linen/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-5">
            <Logo size={30} className="max-w-[150px]" />
            <span className="smallcaps hidden text-[9px] text-muted sm:block">
              staff dashboard
            </span>
          </div>

          <nav className="flex items-center gap-7">
            {tabs.map((t) => (
              <button key={t.id} onClick={() => setTab(t.id)} className="relative pb-1">
                <span className="smallcaps mr-1.5 text-[9px] text-muted">{t.sub}</span>
                <span
                  className={`font-display text-[15px] transition-colors ${
                    tab === t.id ? "text-forest" : "text-ink/45"
                  }`}
                >
                  {t.label}
                </span>
                {t.id === "orders" && pending > 0 && (
                  <span className="ml-1.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-forest px-1 text-[9px] text-linen">
                    {pending}
                  </span>
                )}
                <span
                  className={`absolute -bottom-px left-0 h-px bg-forest transition-all duration-300 ${
                    tab === t.id ? "w-full opacity-100" : "w-0 opacity-0"
                  }`}
                />
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <span
              className={`smallcaps hidden rounded-full px-3 py-1 text-[9px] md:block ${
                settings.acceptingOrders
                  ? "bg-forest/10 text-forest"
                  : "bg-[#8b3a3a]/10 text-[#8b3a3a]"
              }`}
            >
              {settings.acceptingOrders ? "buka" : "tutup"}
            </span>
            <button
              onClick={onExit}
              className="rounded-full border border-sand px-4 py-2 text-[10px] tracking-[0.14em] text-ink/70 uppercase transition hover:border-forest hover:text-forest"
            >
              Mode Tamu
            </button>
          </div>
        </div>
      </header>

      <main key={tab} className="section-swap mx-auto max-w-7xl px-6 py-8">
        {tab === "orders" && <KitchenBoard />}
        {tab === "menu" && <MenuManager />}
        {tab === "tables" && <TableQrManager />}
        {tab === "settings" && (
          <div className="flex justify-center">
            <SettingsPanel />
          </div>
        )}
      </main>
    </div>
  );
}
