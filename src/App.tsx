import { useMemo, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import MenuScreen from "./components/MenuScreen";
import ItemSheet from "./components/ItemSheet";
import CartSheet from "./components/CartSheet";
import QueueScreen from "./components/QueueScreen";
import AdminApp from "./components/admin/AdminApp";
import StaffGate from "./components/admin/StaffGate";
import { Logo } from "./components/Logo";
import { OrderConfirmationCard } from "@/components/ui/order-confirmation-card";
import { rupiah, type MenuItem } from "./data/menu";
import { StoreProvider, useStore, type Order } from "./store/store";
import { getTableFromUrl } from "./lib/table";
import type { CartLine } from "./types";

function formatOrderDate(ts: number) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(ts));
}

function Welcome({
  table,
  onStart,
  onStaff,
}: {
  table: string;
  onStart: () => void;
  onStaff: () => void;
}) {
  const { settings } = useStore();
  return (
    <div className="relative flex min-h-full flex-col items-center justify-center px-9 text-center">
      <div className="rise flex w-full justify-center px-2">
        <Logo size={92} className="max-w-[min(100%,390px)]" />
      </div>
      <div className="rise smallcaps mt-5 text-[10px] text-muted" style={{ animationDelay: "110ms" }}>
        coffee &amp; kitchen · est. 2019
      </div>
      <div className="rise mt-2 font-display text-[13px] italic text-muted/70" style={{ animationDelay: "155ms" }}>
        satu waktu, satu rasa.
      </div>

      <div className="rise mt-12 w-full border-y border-sand py-7" style={{ animationDelay: "200ms" }}>
        <div className="smallcaps text-[9px] text-muted">qr terpindai</div>
        <div className="mt-1 font-display text-[34px] leading-none text-forest">Table {table}</div>
        <div className="smallcaps mt-2 text-[9px] text-muted">indoor · non-smoking</div>
      </div>

      <p className="rise mt-8 text-[12.5px] font-light leading-relaxed text-muted" style={{ animationDelay: "260ms" }}>
        {settings.acceptingOrders
          ? "Pesan langsung dari meja Anda. Kami akan mengabari melalui nomor antrean ketika pesanan siap."
          : "Outlet sedang tidak menerima pesanan. Silakan hubungi staf kami."}
      </p>

      <button
        onClick={onStart}
        disabled={!settings.acceptingOrders}
        className="rise mt-9 w-full rounded-full bg-forest py-4 text-[12.5px] tracking-[0.2em] text-linen uppercase transition active:scale-[0.99] disabled:opacity-40"
        style={{ animationDelay: "320ms" }}
      >
        {settings.acceptingOrders ? "Mulai Memesan" : "Tutup Sementara"}
      </button>

      <button
        onClick={onStaff}
        className="smallcaps mt-8 hidden text-[9px] text-muted underline-offset-4 hover:underline lg:inline-block"
      >
        masuk sebagai staf
      </button>
    </div>
  );
}

function CustomerApp() {
  const { createOrder, orders, priceBreakdown } = useStore();
  const [table] = useState(() => getTableFromUrl());
  const [screen, setScreen] = useState<"welcome" | "menu" | "confirm" | "queue" | "admin">("welcome");
  const [showGate, setShowGate] = useState(false);
  const [selected, setSelected] = useState<MenuItem | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [lines, setLines] = useState<CartLine[]>([]);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [flash, setFlash] = useState<string | null>(null);

  const order: Order | undefined = orders.find((o) => o.id === orderId);
  const count = lines.reduce((s, l) => s + l.qty, 0);
  const subtotal = useMemo(() => lines.reduce((s, l) => s + l.unitPrice * l.qty, 0), [lines]);

  const addLine = (
    item: MenuItem,
    qty: number,
    choices: Record<string, string>,
    addons: string[],
    note: string,
    unitPrice: number,
  ) => {
    const key = item.id + JSON.stringify(choices) + JSON.stringify(addons) + note;
    setLines((prev) => {
      const exist = prev.find((l) => l.key === key);
      if (exist) return prev.map((l) => (l.key === key ? { ...l, qty: l.qty + qty } : l));
      return [...prev, { key, item, qty, choices, addons, note, unitPrice }];
    });
    setSelected(null);
    setFlash(`${item.name} ditambahkan`);
    setTimeout(() => setFlash(null), 1900);
  };

  const changeQty = (key: string, delta: number) =>
    setLines((prev) =>
      prev.map((l) => (l.key === key ? { ...l, qty: l.qty + delta } : l)).filter((l) => l.qty > 0),
    );

  const pay = (name: string, method: string) => {
    const created = createOrder({ name, table, method, lines });
    setOrderId(created.id);
    setLines([]);
    setCartOpen(false);
    setScreen("confirm");
  };

  if (screen === "admin") return <AdminApp onExit={() => setScreen("welcome")} />;

  if (showGate)
    return (
      <StaffGate
        onSuccess={() => { setShowGate(false); setScreen("admin"); }}
        onCancel={() => setShowGate(false)}
      />
    );

  return (
    <div className="flex min-h-screen w-full items-stretch justify-center bg-linen md:items-center md:py-10">
      <aside className="hidden w-[340px] shrink-0 flex-col justify-between self-stretch py-16 pr-14 text-right lg:flex">
        <div>
          <div className="smallcaps text-[10px] text-muted">qr ordering system</div>
          <h1 className="mt-4 font-display text-[40px] leading-[1.15] text-ink">
            Antre tanpa
            <br />
            <span className="italic text-forest">berdiri.</span>
          </h1>
          <p className="mt-3 font-display text-[14px] italic text-muted/70">
            satu waktu, satu rasa.
          </p>
          <p className="mt-5 text-[13px] leading-relaxed font-light text-muted">
            Sistem pemesanan &amp; antrean digital MONOKALA. Dirancang minimalis, elegan, dan
            tenang — seperti kopinya.
          </p>
          <button
            onClick={() => setShowGate(true)}
            className="mt-6 rounded-full border border-sand px-5 py-2.5 text-[10px] tracking-[0.14em] text-ink/70 uppercase transition hover:border-forest hover:text-forest"
          >
            Buka Dashboard Staf
          </button>
        </div>
        <div className="space-y-3 text-[11.5px] font-light text-muted">
          <div className="h-px w-full bg-sand" />
          <p>Scan · Pesan · Bayar · Pantau antrean</p>
          <p className="smallcaps text-[9px]">monokala · jakarta</p>
        </div>
      </aside>

      <div className="relative h-screen w-full max-w-[430px] overflow-hidden bg-linen shadow-[0_30px_80px_-40px_rgba(26,26,26,0.28)] md:h-[860px] md:max-h-[92vh] md:rounded-[28px]">
        <div
          className={`no-scrollbar relative h-full ${
            screen === "menu" ? "overflow-hidden" : "overflow-y-auto"
          }`}
        >
          {screen === "welcome" && (
            <div className="h-full">
              <Welcome table={table} onStart={() => setScreen("menu")} onStaff={() => setShowGate(true)} />
            </div>
          )}

          {screen === "menu" && (
            <div className="h-full">
              <MenuScreen
                table={table}
                onSelect={setSelected}
                hasOrders={!!order}
                onOpenOrders={() => order && setScreen("queue")}
              />
            </div>
          )}

          {screen === "confirm" && order && (
            <div className="flex h-full min-h-full flex-col items-center justify-center bg-linen px-5 py-10">
              <div className="mb-7 flex w-full justify-center">
                <Logo size={54} className="max-w-[280px]" />
              </div>
              <OrderConfirmationCard
                orderId={order.code}
                paymentMethod={order.method.toUpperCase()}
                dateTime={formatOrderDate(order.placedAt)}
                totalAmount={rupiah(order.total)}
                title="Pesanan Anda berhasil dikirim"
                buttonText="Lihat Antrean"
                icon={<CheckCircle2 className="h-12 w-12 text-primary" strokeWidth={1.5} />}
                onGoToAccount={() => setScreen("queue")}
                className="border-sand bg-linen-2"
              />
              <p className="smallcaps mt-6 text-[9px] text-muted">
                table {order.table} · a.n. {order.name}
              </p>
            </div>
          )}

          {screen === "queue" && order && (
            <QueueScreen order={order} onBack={() => setScreen("menu")} />
          )}
        </div>

        {flash && (
          <div className="fade-in pointer-events-none absolute inset-x-0 top-4 z-50 flex justify-center">
            <div className="smallcaps rounded-full bg-ink/90 px-5 py-2 text-[10px] text-linen">
              {flash}
            </div>
          </div>
        )}

        {screen === "menu" && count > 0 && !selected && !cartOpen && (
          <div className="absolute inset-x-0 bottom-0 z-40 px-5 pb-6">
            <button
              onClick={() => setCartOpen(true)}
              className="rise flex w-full items-center justify-between rounded-full bg-forest py-3.5 pl-5 pr-3.5 text-linen shadow-[0_16px_40px_-16px_rgba(30,63,32,0.8)]"
            >
              <span className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-linen/15 font-display text-[13px]">
                  {count}
                </span>
                <span className="text-left">
                  <span className="smallcaps block text-[9px] text-linen/60">keranjang</span>
                  <span className="block text-[13px]">{rupiah(subtotal)}</span>
                </span>
              </span>
              <span className="rounded-full bg-linen px-5 py-2.5 text-[11px] tracking-[0.16em] text-forest uppercase">
                Lanjut
              </span>
            </button>
          </div>
        )}

        {selected && (
          <ItemSheet
            item={selected}
            onClose={() => setSelected(null)}
            onAdd={(qty, choices, addons, note, unit) => addLine(selected, qty, choices, addons, note, unit)}
          />
        )}

        {cartOpen && (
          <CartSheet
            lines={lines}
            table={table}
            onClose={() => setCartOpen(false)}
            onQty={changeQty}
            onPay={pay}
            breakdown={priceBreakdown}
          />
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <CustomerApp />
    </StoreProvider>
  );
}
