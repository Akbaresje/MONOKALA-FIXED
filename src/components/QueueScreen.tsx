import { rupiah } from "../data/menu";
import { useStore, type Order, type OrderStatus } from "../store/store";
import { Logo } from "./Logo";

const steps: { id: OrderStatus; label: string; note: string }[] = [
  { id: "new", label: "Pesanan diterima", note: "Kasir mengonfirmasi pesanan Anda" },
  { id: "preparing", label: "Sedang diracik", note: "Barista & dapur menyiapkan pesanan" },
  { id: "ready", label: "Siap diantar", note: "Menuju meja Anda" },
  { id: "done", label: "Selesai", note: "Selamat menikmati" },
];

export default function QueueScreen({ order, onBack }: { order: Order; onBack: () => void }) {
  const { orders, settings } = useStore();

  const stage = Math.max(0, steps.findIndex((s) => s.id === order.status));

  // Real queue position: orders placed before this one that aren't finished.
  const ahead = orders.filter(
    (o) =>
      o.id !== order.id &&
      o.placedAt < order.placedAt &&
      (o.status === "new" || o.status === "preparing"),
  ).length;

  const eta = order.status === "done" ? 0 : Math.max(2, settings.prepMinutes + ahead * 3);

  return (
    <div className="min-h-full pb-16">
      <header className="flex items-center justify-between px-6 pt-7">
        <button onClick={onBack} className="smallcaps text-[10px] text-muted">
          ← menu
        </button>
        <div className="flex justify-center">
          <Logo size={38} className="max-w-[180px]" />
        </div>
        <div className="text-right">
          <div className="smallcaps text-[9px] text-muted">table</div>
          <div className="font-display text-lg leading-none text-forest">{order.table}</div>
        </div>
      </header>

      <div className="rise mt-8 px-6">
        <div className="relative overflow-hidden rounded-[10px] border border-sand bg-linen-2 px-7 py-9 text-center shadow-[0_14px_36px_-24px_rgba(26,26,26,0.24)]">
          <div className="smallcaps text-[9px] text-muted">nomor antrean</div>
          <div className="relative mx-auto mt-3 flex h-28 w-28 items-center justify-center">
            {order.status !== "done" && (
              <span className="pulse-ring absolute inset-0 rounded-full border border-forest/40" />
            )}
            <span className="absolute inset-0 rounded-full border border-sand" />
            <span className="font-display text-[42px] leading-none text-forest">{order.code}</span>
          </div>
          <div className="mt-6 font-display text-[19px] text-ink">{steps[stage].label}</div>
          <p className="mt-1 text-[12px] font-light text-muted">{steps[stage].note}</p>

          <div className="mt-7 flex items-stretch justify-center divide-x divide-sand border-t border-sand pt-6">
            <div className="flex-1 px-3">
              <div className="font-display text-lg text-ink">{ahead}</div>
              <div className="smallcaps text-[9px] text-muted">antrean di depan</div>
            </div>
            <div className="flex-1 px-3">
              <div className="font-display text-lg text-ink">
                {eta === 0 ? "—" : `± ${eta}′`}
              </div>
              <div className="smallcaps text-[9px] text-muted">estimasi</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 px-6">
        <div className="smallcaps text-[9px] text-muted">status</div>
        <div className="mt-4">
          {steps.map((s, i) => {
            const done = i <= stage;
            return (
              <div key={s.id} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <span
                    className={`mt-1 flex h-3.5 w-3.5 items-center justify-center rounded-full border transition-colors duration-500 ${
                      done ? "border-forest bg-forest" : "border-sand bg-linen"
                    }`}
                  />
                  {i < steps.length - 1 && (
                    <span
                      className={`w-px flex-1 transition-colors duration-500 ${
                        i < stage ? "bg-forest/60" : "bg-sand"
                      }`}
                    />
                  )}
                </div>
                <div className="pb-7">
                  <div className={`font-display text-[15px] ${done ? "text-ink" : "text-ink/35"}`}>
                    {s.label}
                  </div>
                  <div className="mt-0.5 text-[11.5px] font-light text-muted">{s.note}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-2 px-6">
        <div className="rounded-[10px] border border-sand bg-linen-2 p-6">
          <div className="flex items-baseline justify-between">
            <span className="font-display text-[16px] text-ink">Rincian</span>
            <span className="smallcaps text-[9px] text-muted">
              {order.paid ? "lunas" : "bayar di kasir"}
            </span>
          </div>
          <div className="smallcaps mt-1 text-[9px] text-muted">a.n. {order.name}</div>
          <div className="mt-5 space-y-3">
            {order.lines.map((l) => (
              <div key={l.key} className="flex justify-between text-[12.5px]">
                <span className="font-light text-ink">
                  <span className="text-muted">{l.qty}×</span> {l.item.name}
                  {Object.values(l.choices).length > 0 && (
                    <span className="block text-[10.5px] text-muted">
                      {Object.values(l.choices).join(" · ")}
                    </span>
                  )}
                </span>
                <span className="text-ink">{rupiah(l.unitPrice * l.qty)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 space-y-1 border-t border-sand pt-4 text-[12px] font-light text-muted">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{rupiah(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Service</span>
              <span>{rupiah(order.service)}</span>
            </div>
            <div className="flex justify-between">
              <span>Pajak</span>
              <span>{rupiah(order.tax)}</span>
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between border-t border-sand pt-4">
            <span className="smallcaps text-[10px] text-ink">total</span>
            <span className="font-display text-lg text-forest">{rupiah(order.total)}</span>
          </div>
        </div>

        <button
          onClick={onBack}
          className="mt-6 w-full rounded-full border border-forest py-4 text-[12.5px] tracking-[0.18em] text-forest uppercase"
        >
          Pesan Lagi
        </button>
        <p className="smallcaps mt-6 text-center text-[9px] text-muted">
          tunjukkan nomor ini bila diminta
        </p>
      </div>
    </div>
  );
}
