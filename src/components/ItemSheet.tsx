import { useState } from "react";
import { rupiah, type MenuItem } from "../data/menu";

type Props = {
  item: MenuItem;
  onClose: () => void;
  onAdd: (
    qty: number,
    choices: Record<string, string>,
    addons: string[],
    note: string,
    unitPrice: number,
  ) => void;
};

export default function ItemSheet({ item, onClose, onAdd }: Props) {
  const [qty, setQty] = useState(1);
  const [note, setNote] = useState("");
  const [choices, setChoices] = useState<Record<string, string>>(() =>
    Object.fromEntries((item.options ?? []).map((o) => [o.label, o.choices[0].name])),
  );
  const [checkedAddons, setCheckedAddons] = useState<string[]>([]);

  const toggleAddon = (name: string) =>
    setCheckedAddons((prev) =>
      prev.includes(name) ? prev.filter((a) => a !== name) : [...prev, name],
    );

  // radio option extras
  const optionExtra = (item.options ?? []).reduce((sum, o) => {
    const c = o.choices.find((x) => x.name === choices[o.label]);
    return sum + (c?.extra ?? 0);
  }, 0);

  // checkbox addon extras
  const addonExtra = (item.addons ?? [])
    .filter((a) => checkedAddons.includes(a.name))
    .reduce((sum, a) => sum + a.extra, 0);

  const unit = item.price + optionExtra + addonExtra;

  return (
    <div className="absolute inset-0 z-50 flex items-end justify-center">
      <div className="fade-in absolute inset-0 bg-ink/40 backdrop-blur-[2px]" onClick={onClose} />
      <div className="sheet-up relative flex max-h-[92vh] w-full max-w-[430px] flex-col overflow-y-auto rounded-t-[20px] bg-linen">
        {/* Hero image */}
        <div className="relative shrink-0">
          <div className="aspect-[4/3] w-full overflow-hidden">
            <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
          </div>
          <button
            onClick={onClose}
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-linen/90 text-ink shadow-sm"
            aria-label="Tutup"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="px-6 pt-6">
          <div className="smallcaps text-[9px] text-muted">{item.origin}</div>
          <h2 className="mt-1 font-display text-[26px] leading-tight text-ink">{item.name}</h2>
          <p className="mt-2 text-[13px] font-light leading-relaxed text-muted">{item.desc}</p>
          <div className="mt-4 font-display text-xl text-forest">{rupiah(item.price)}</div>

          {/* Radio options */}
          {(item.options ?? []).map((o) => (
            <div key={o.label} className="mt-7">
              <div className="smallcaps text-[9px] text-muted">{o.label}</div>
              <div className="mt-3 flex flex-wrap gap-2.5">
                {o.choices.map((c) => {
                  const on = choices[o.label] === c.name;
                  return (
                    <button
                      key={c.name}
                      onClick={() => setChoices({ ...choices, [o.label]: c.name })}
                      className={`flex-1 rounded-[8px] border px-3 py-3 text-[12.5px] transition ${
                        on
                          ? "border-forest bg-forest text-linen"
                          : "border-sand bg-linen-2 text-ink/70"
                      }`}
                    >
                      {c.name}
                      {c.extra > 0 && (
                        <span className={`ml-1 text-[10px] ${on ? "text-linen/70" : "text-muted"}`}>
                          +{(c.extra / 1000).toFixed(0)}k
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Checkbox addons */}
          {(item.addons ?? []).length > 0 && (
            <div className="mt-7">
              <div className="smallcaps text-[9px] text-muted">tambahan</div>
              <div className="mt-3 space-y-2.5">
                {(item.addons ?? []).map((a) => {
                  const checked = checkedAddons.includes(a.name);
                  return (
                    <button
                      key={a.name}
                      onClick={() => toggleAddon(a.name)}
                      className={`flex w-full items-center justify-between rounded-[8px] border px-4 py-3 text-left transition ${
                        checked
                          ? "border-forest bg-forest/5"
                          : "border-sand bg-linen-2"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {/* custom checkbox */}
                        <span
                          className={`flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded border transition ${
                            checked ? "border-forest bg-forest" : "border-sand bg-linen"
                          }`}
                        >
                          {checked && (
                            <svg viewBox="0 0 10 8" className="h-2.5 w-2.5" fill="none" stroke="#F7F5F0" strokeWidth="1.5">
                              <path d="M1 4l3 3 5-6" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </span>
                        <span className={`text-[13px] ${checked ? "text-forest" : "text-ink/80"}`}>
                          {a.name}
                        </span>
                      </div>
                      <span className={`text-[12px] ${checked ? "text-forest" : "text-muted"}`}>
                        {a.extra === 0 ? "Gratis" : `+${rupiah(a.extra)}`}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Note */}
          <div className="mt-7">
            <div className="smallcaps text-[9px] text-muted">catatan untuk barista</div>
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Contoh: less sugar, susu oat"
              className="mt-2 w-full border-b border-sand bg-transparent pb-2 text-[13px] text-ink placeholder:text-muted/70 focus:border-forest focus:outline-none"
            />
          </div>

          {/* Qty & subtotal */}
          <div className="mt-8 flex items-center justify-between border-t border-sand pt-6">
            <div className="flex items-center gap-5">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-sand text-ink/70"
              >
                −
              </button>
              <span className="font-display text-lg text-ink">{qty}</span>
              <button
                onClick={() => setQty(qty + 1)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-sand text-ink/70"
              >
                +
              </button>
            </div>
            <span className="smallcaps text-[9px] text-muted">subtotal {rupiah(unit * qty)}</span>
          </div>
        </div>

        {/* CTA */}
        <div className="sticky bottom-0 mt-6 bg-linen px-6 pb-7 pt-3">
          <button
            onClick={() => onAdd(qty, choices, checkedAddons, note, unit)}
            className="w-full rounded-full bg-forest py-4 text-[13px] tracking-[0.18em] text-linen uppercase transition active:scale-[0.99]"
          >
            Tambah ke Keranjang
          </button>
        </div>
      </div>
    </div>
  );
}
