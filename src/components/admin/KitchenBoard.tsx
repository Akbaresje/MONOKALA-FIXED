import { useEffect, useState } from "react";
import { rupiah } from "../../data/menu";
import { useStore, type Order, type OrderStatus } from "../../store/store";

const columns: { id: OrderStatus; label: string; hint: string }[] = [
  { id: "new", label: "Masuk", hint: "Menunggu konfirmasi" },
  { id: "preparing", label: "Diracik", hint: "Sedang disiapkan" },
  { id: "ready", label: "Siap", hint: "Antar ke meja" },
  { id: "done", label: "Selesai", hint: "Sudah diterima" },
];

const nextStatus: Partial<Record<OrderStatus, OrderStatus>> = {
  new: "preparing",
  preparing: "ready",
  ready: "done",
};

const nextLabel: Partial<Record<OrderStatus, string>> = {
  new: "Terima & Racik",
  preparing: "Tandai Siap",
  ready: "Selesai",
};

function elapsed(ts: number) {
  const m = Math.floor((Date.now() - ts) / 60000);
  if (m < 1) return "baru saja";
  if (m < 60) return `${m} mnt lalu`;
  return `${Math.floor(m / 60)} jam lalu`;
}

function OrderCard({ order }: { order: Order }) {
  const { setOrderStatus, markPaid } = useStore();
  const late = order.status !== "done" && Date.now() - order.placedAt > 15 * 60000;

  return (
    <div
      className={`rise rounded-[10px] border bg-linen p-4 shadow-[0_8px_22px_-18px_rgba(26,26,26,0.5)] ${
        late ? "border-[#8b3a3a]/40" : "border-sand"
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="font-display text-[22px] leading-none text-forest">{order.code}</div>
          <div className="smallcaps mt-1 text-[9px] text-muted">
            meja {order.table} · {order.name}
          </div>
        </div>
        <div className="text-right">
          <div className={`smallcaps text-[9px] ${late ? "text-[#8b3a3a]" : "text-muted"}`}>
            {elapsed(order.placedAt)}
          </div>
          <span
            className={`smallcaps mt-1 inline-block rounded-full px-2 py-0.5 text-[8px] ${
              order.paid ? "bg-forest/10 text-forest" : "bg-[#8b3a3a]/10 text-[#8b3a3a]"
            }`}
          >
            {order.paid ? "lunas" : "belum bayar"}
          </span>
        </div>
      </div>

      <div className="mt-3 space-y-1.5 border-t border-sand pt-3">
        {order.lines.map((l) => (
          <div key={l.key} className="text-[12px] leading-snug">
            <span className="font-medium text-ink">{l.qty}×</span>{" "}
            <span className="text-ink">{l.item.name}</span>
            {Object.values(l.choices).length > 0 && (
              <span className="block pl-5 text-[10.5px] text-muted">
                {Object.values(l.choices).join(" · ")}
              </span>
            )}
            {l.note && (
              <span className="block pl-5 text-[10.5px] italic text-[#8b3a3a]">“{l.note}”</span>
            )}
          </div>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-sand pt-3">
        <span className="text-[12px] font-medium text-forest">{rupiah(order.total)}</span>
        <div className="flex gap-2">
          {!order.paid && (
            <button
              onClick={() => markPaid(order.id)}
              className="rounded-full border border-sand px-3 py-1.5 text-[10px] tracking-[0.1em] text-ink/70 uppercase"
            >
              Terima Bayar
            </button>
          )}
          {nextStatus[order.status] && (
            <button
              onClick={() => setOrderStatus(order.id, nextStatus[order.status]!)}
              className="rounded-full bg-forest px-3.5 py-1.5 text-[10px] tracking-[0.1em] text-linen uppercase active:scale-[0.98]"
            >
              {nextLabel[order.status]}
            </button>
          )}
          {order.status === "new" && (
            <button
              onClick={() => setOrderStatus(order.id, "cancelled")}
              className="rounded-full border border-sand px-3 py-1.5 text-[10px] text-muted"
              aria-label="Batalkan"
            >
              ✕
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function KitchenBoard() {
  const { orders, clearFinished } = useStore();
  const [, force] = useState(0);

  // refresh relative timestamps every 30s
  useEffect(() => {
    const i = setInterval(() => force((n) => n + 1), 30000);
    return () => clearInterval(i);
  }, []);

  const active = orders.filter((o) => o.status !== "cancelled");

  return (
    <div>
      <div className="mb-5 flex items-end justify-between">
        <div>
          <h2 className="font-display text-[22px] text-ink">Kitchen Display</h2>
          <p className="mt-1 text-[12px] font-light text-muted">
            {active.filter((o) => o.status !== "done").length} pesanan aktif
          </p>
        </div>
        <button
          onClick={clearFinished}
          className="rounded-full border border-sand px-4 py-2 text-[10px] tracking-[0.14em] text-ink/70 uppercase"
        >
          Bersihkan Selesai
        </button>
      </div>

      {active.length === 0 && (
        <div className="rounded-[10px] border border-dashed border-sand py-20 text-center">
          <p className="font-display text-[17px] text-ink">Belum ada pesanan</p>
          <p className="mt-1 text-[12px] font-light text-muted">
            Pesanan dari meja akan muncul di sini secara otomatis.
          </p>
        </div>
      )}

      {active.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {columns.map((col) => {
            const list = active.filter((o) => o.status === col.id);
            return (
              <section key={col.id}>
                <div className="mb-3 flex items-baseline justify-between border-b border-sand pb-2">
                  <div>
                    <h3 className="font-display text-[15px] text-ink">{col.label}</h3>
                    <p className="smallcaps text-[9px] text-muted">{col.hint}</p>
                  </div>
                  <span className="font-display text-[15px] text-forest">{list.length}</span>
                </div>
                <div className="space-y-3">
                  {list.map((o) => (
                    <OrderCard key={o.id} order={o} />
                  ))}
                  {list.length === 0 && (
                    <p className="py-6 text-center text-[11px] font-light text-muted">—</p>
                  )}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
