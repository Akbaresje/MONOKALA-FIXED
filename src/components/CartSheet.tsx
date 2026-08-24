import { useState } from "react";
import { rupiah } from "../data/menu";
import { useStore } from "../store/store";
import type { CartLine } from "../types";

type Props = {
  lines: CartLine[];
  table: string;
  onClose: () => void;
  onQty: (key: string, delta: number) => void;
  onPay: (name: string, method: string) => void;
  breakdown: (subtotal: number) => { service: number; tax: number; total: number };
};

export default function CartSheet({ lines, table, onClose, onQty, onPay, breakdown }: Props) {
  const { settings } = useStore();
  const methods = settings.payments.filter((p) => p.enabled);

  const [step, setStep] = useState<"cart" | "pay">("cart");
  const [name, setName] = useState("");
  const [method, setMethod] = useState(methods[0]?.id ?? "qris");

  const subtotal = lines.reduce((s, l) => s + l.unitPrice * l.qty, 0);
  const { service, tax, total } = breakdown(subtotal);

  const lineSubtitle = (l: CartLine) => {
    const parts = [
      Object.values(l.choices).join(" · "),
      (l.addons ?? []).join(", "),
    ].filter(Boolean).join(" · ");
    return parts || l.item.origin;
  };

  return (
    <div className="absolute inset-0 z-50 flex items-end justify-center">
      <div className="fade-in absolute inset-0 bg-ink/40 backdrop-blur-[2px]" onClick={onClose} />
      <div className="sheet-up relative flex max-h-[92vh] w-full max-w-[430px] flex-col overflow-y-auto rounded-t-[20px] bg-linen">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-linen px-6 pt-6 pb-4">
          <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-sand" />
          <div className="flex items-center justify-between">
            <h2 className="font-display text-[22px] text-ink">
              {step === "cart" ? "Keranjang" : "Pembayaran"}
            </h2>
            <button onClick={onClose} className="smallcaps text-[10px] text-muted">
              tutup
            </button>
          </div>
          <div className="smallcaps mt-1 text-[9px] text-muted">
            table {table} · dine in
          </div>
        </div>

        {/* Cart step */}
        {step === "cart" && (
          <div className="px-6">
            {lines.length === 0 && (
              <p className="py-20 text-center text-[13px] font-light text-muted">
                Keranjang masih kosong.
              </p>
            )}
            {lines.map((l) => (
              <div key={l.key} className="flex gap-4 border-b border-sand py-5 last:border-0">
                <img
                  src={l.item.image}
                  alt={l.item.name}
                  className="h-16 w-16 shrink-0 rounded-[8px] object-cover"
                />
                <div className="flex-1">
                  <div className="flex justify-between gap-3">
                    <span className="font-display text-[15px] text-ink">{l.item.name}</span>
                    <span className="text-[13px] font-medium text-forest">
                      {rupiah(l.unitPrice * l.qty)}
                    </span>
                  </div>
                  <div className="mt-0.5 text-[11px] font-light text-muted">
                    {lineSubtitle(l)}
                    {l.note && <span className="italic"> · "{l.note}"</span>}
                  </div>
                  <div className="mt-3 flex items-center gap-4">
                    <button
                      onClick={() => onQty(l.key, -1)}
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-sand text-ink/70"
                    >
                      −
                    </button>
                    <span className="text-[13px] text-ink">{l.qty}</span>
                    <button
                      onClick={() => onQty(l.key, 1)}
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-sand text-ink/70"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pay step */}
        {step === "pay" && (
          <div className="px-6">
            <div className="smallcaps text-[9px] text-muted">nama pemesan</div>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nama Anda"
              className="mt-2 w-full border-b border-sand bg-transparent pb-2 font-display text-[18px] text-ink placeholder:font-sans placeholder:text-[14px] placeholder:text-muted/70 focus:border-forest focus:outline-none"
            />

            <div className="smallcaps mt-8 text-[9px] text-muted">metode pembayaran</div>
            <div className="mt-3 space-y-2.5">
              {methods.map((m) => {
                const on = method === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => setMethod(m.id)}
                    className={`flex w-full items-center justify-between rounded-[8px] border px-4 py-4 text-left transition ${
                      on ? "border-forest bg-linen-2" : "border-sand bg-linen-2/50"
                    }`}
                  >
                    <div>
                      <div className="text-[13.5px] text-ink">{m.label}</div>
                      <div className="mt-0.5 text-[11px] font-light text-muted">{m.note}</div>
                    </div>
                    <span
                      className={`flex h-4 w-4 items-center justify-center rounded-full border ${
                        on ? "border-forest" : "border-sand"
                      }`}
                    >
                      {on && <span className="h-2 w-2 rounded-full bg-forest" />}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Summary + CTA */}
        {lines.length > 0 && (
          <>
            <div className="mt-6 px-6">
              <div className="rounded-[8px] bg-linen-2 px-5 py-4">
                {[
                  ["Subtotal", subtotal],
                  [`Service ${(settings.serviceRate * 100).toFixed(0)}%`, service],
                  [`PB1 ${(settings.taxRate * 100).toFixed(0)}%`, tax],
                ].map(([label, val]) => (
                  <div
                    key={label as string}
                    className="flex justify-between py-1 text-[12.5px] font-light text-muted"
                  >
                    <span>{label}</span>
                    <span>{rupiah(val as number)}</span>
                  </div>
                ))}
                <div className="mt-2 flex items-baseline justify-between border-t border-sand pt-3">
                  <span className="smallcaps text-[10px] text-ink">total</span>
                  <span className="font-display text-xl text-forest">{rupiah(total)}</span>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 mt-5 bg-linen px-6 pb-7 pt-3">
              {step === "cart" ? (
                <button
                  onClick={() => setStep("pay")}
                  className="w-full rounded-full bg-forest py-4 text-[13px] tracking-[0.18em] text-linen uppercase active:scale-[0.99]"
                >
                  Lanjut ke Pembayaran
                </button>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={() => setStep("cart")}
                    className="rounded-full border border-sand px-6 text-[12px] tracking-[0.14em] text-ink/70 uppercase"
                  >
                    Kembali
                  </button>
                  <button
                    onClick={() => onPay(name.trim() || "Tamu", method)}
                    className="flex-1 rounded-full bg-forest py-4 text-[13px] tracking-[0.18em] text-linen uppercase active:scale-[0.99]"
                  >
                    Bayar {rupiah(total)}
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
