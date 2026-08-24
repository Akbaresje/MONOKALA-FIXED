import { useState } from "react";
import { categories, rupiah, type Addon, type Category, type MenuItem } from "../../data/menu";
import { useStore } from "../../store/store";

const blank = (): MenuItem => ({
  id: `x${Date.now()}`,
  name: "",
  origin: "",
  desc: "",
  price: 0,
  category: "coffee",
  image: "",
  soldOut: false,
  addons: [],
});

function Editor({ item, onClose }: { item: MenuItem; onClose: () => void }) {
  const { upsertItem, removeItem } = useStore();
  const [draft, setDraft] = useState<MenuItem>({ ...item, addons: item.addons ?? [] });
  const isNew = !item.name;

  const set = <K extends keyof MenuItem>(k: K, v: MenuItem[K]) =>
    setDraft((d) => ({ ...d, [k]: v }));

  /* ── addon helpers ── */
  const addAddon = () =>
    setDraft((d) => ({
      ...d,
      addons: [...(d.addons ?? []), { name: "", extra: 0 }],
    }));

  const setAddon = (i: number, patch: Partial<Addon>) =>
    setDraft((d) => {
      const next = [...(d.addons ?? [])];
      next[i] = { ...next[i], ...patch };
      return { ...d, addons: next };
    });

  const removeAddon = (i: number) =>
    setDraft((d) => ({
      ...d,
      addons: (d.addons ?? []).filter((_, idx) => idx !== i),
    }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fade-in absolute inset-0 bg-ink/40 backdrop-blur-[2px]" onClick={onClose} />
      <div className="rise relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-[12px] border border-sand bg-linen p-6">
        <div className="flex items-start justify-between">
          <h3 className="font-display text-[20px] text-ink">
            {isNew ? "Tambah Menu" : "Ubah Menu"}
          </h3>
          <button onClick={onClose} className="smallcaps text-[10px] text-muted">tutup</button>
        </div>

        <div className="mt-5 space-y-4">
          {/* Preview foto */}
          {draft.image && (
            <img
              src={draft.image}
              alt=""
              className="h-36 w-full rounded-[8px] border border-sand object-cover"
            />
          )}

          {/* Field teks dasar */}
          {[
            { k: "name" as const, label: "Nama menu", ph: "Kala Latte" },
            { k: "origin" as const, label: "Origin / subjudul", ph: "Single Origin · Gayo" },
            { k: "image" as const, label: "URL foto", ph: "https://…" },
          ].map((f) => (
            <label key={f.k} className="block">
              <span className="smallcaps text-[9px] text-muted">{f.label}</span>
              <input
                value={draft[f.k] as string}
                onChange={(e) => set(f.k, e.target.value)}
                placeholder={f.ph}
                className="mt-1 w-full border-b border-sand bg-transparent pb-2 text-[13px] text-ink focus:border-forest focus:outline-none"
              />
            </label>
          ))}

          <label className="block">
            <span className="smallcaps text-[9px] text-muted">Deskripsi</span>
            <textarea
              value={draft.desc}
              onChange={(e) => set("desc", e.target.value)}
              rows={2}
              className="mt-1 w-full resize-none border-b border-sand bg-transparent pb-2 text-[13px] text-ink focus:border-forest focus:outline-none"
            />
          </label>

          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="smallcaps text-[9px] text-muted">Harga (Rp)</span>
              <input
                type="number"
                value={draft.price}
                onChange={(e) => set("price", Number(e.target.value))}
                className="mt-1 w-full border-b border-sand bg-transparent pb-2 font-display text-[16px] text-forest focus:border-forest focus:outline-none"
              />
            </label>
            <label className="block">
              <span className="smallcaps text-[9px] text-muted">Kategori</span>
              <select
                value={draft.category}
                onChange={(e) => set("category", e.target.value as Category)}
                className="mt-1 w-full border-b border-sand bg-transparent pb-2 text-[13px] text-ink focus:border-forest focus:outline-none"
              >
                {categories
                  .filter((c) => c.id !== "all")
                  .map((c) => (
                    <option key={c.id} value={c.id}>{c.label}</option>
                  ))}
              </select>
            </label>
          </div>

          <label className="block">
            <span className="smallcaps text-[9px] text-muted">Label (opsional)</span>
            <input
              value={draft.tag ?? ""}
              onChange={(e) => set("tag", e.target.value || undefined)}
              placeholder="Signature / Favorit"
              className="mt-1 w-full border-b border-sand bg-transparent pb-2 text-[13px] text-ink focus:border-forest focus:outline-none"
            />
          </label>

          {/* ── Addons ── */}
          <div>
            <div className="flex items-center justify-between">
              <span className="smallcaps text-[9px] text-muted">tambahan (checkbox)</span>
              <button
                onClick={addAddon}
                className="smallcaps text-[9px] text-forest underline-offset-2 hover:underline"
              >
                + tambah opsi
              </button>
            </div>

            {(draft.addons ?? []).length === 0 && (
              <p className="mt-2 text-[11.5px] font-light text-muted">
                Belum ada tambahan. Klik "+ tambah opsi" untuk menambahkan.
              </p>
            )}

            <div className="mt-2 space-y-2">
              {(draft.addons ?? []).map((a, i) => (
                <div key={i} className="flex items-center gap-2 rounded-[8px] bg-linen-2 px-3 py-2.5">
                  <input
                    value={a.name}
                    onChange={(e) => setAddon(i, { name: e.target.value })}
                    placeholder="Nama tambahan"
                    className="flex-1 bg-transparent text-[12.5px] text-ink focus:outline-none"
                  />
                  <span className="shrink-0 text-[11px] text-muted">+Rp</span>
                  <input
                    type="number"
                    value={a.extra}
                    min={0}
                    step={1000}
                    onChange={(e) => setAddon(i, { extra: Number(e.target.value) })}
                    className="w-20 bg-transparent text-right text-[12.5px] text-forest focus:outline-none"
                  />
                  <button
                    onClick={() => removeAddon(i)}
                    className="ml-1 shrink-0 text-[14px] text-muted/60 hover:text-[#8b3a3a]"
                    aria-label="Hapus addon"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          <label className="flex items-center justify-between rounded-[8px] bg-linen-2 px-4 py-3">
            <span className="text-[12.5px] text-ink">Habis / disembunyikan</span>
            <input
              type="checkbox"
              checked={!!draft.soldOut}
              onChange={(e) => set("soldOut", e.target.checked)}
              className="h-4 w-4 accent-[#1e3f20]"
            />
          </label>
        </div>

        <div className="mt-7 flex gap-3">
          {!isNew && (
            <button
              onClick={() => { removeItem(draft.id); onClose(); }}
              className="rounded-full border border-[#8b3a3a]/40 px-4 py-3 text-[11px] tracking-[0.14em] text-[#8b3a3a] uppercase"
            >
              Hapus
            </button>
          )}
          <button
            onClick={() => {
              if (!draft.name.trim()) return;
              upsertItem(draft);
              onClose();
            }}
            className="flex-1 rounded-full bg-forest py-3 text-[11.5px] tracking-[0.16em] text-linen uppercase"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MenuManager() {
  const { menu, toggleAvailability, resetMenu } = useStore();
  const [editing, setEditing] = useState<MenuItem | null>(null);
  const [filter, setFilter] = useState<Category | "all">("all");

  const list = menu.filter((m) => filter === "all" || m.category === filter);

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-[22px] text-ink">Manajemen Menu</h2>
          <p className="mt-1 text-[12px] font-light text-muted">
            {menu.length} item · {menu.filter((m) => m.soldOut).length} sedang habis
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={resetMenu}
            className="rounded-full border border-sand px-4 py-2 text-[10px] tracking-[0.14em] text-ink/70 uppercase"
          >
            Reset
          </button>
          <button
            onClick={() => setEditing(blank())}
            className="rounded-full bg-forest px-5 py-2 text-[10px] tracking-[0.14em] text-linen uppercase"
          >
            + Tambah
          </button>
        </div>
      </div>

      <div className="no-scrollbar mb-5 flex gap-6 overflow-x-auto border-b border-sand pb-2">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setFilter(c.id)}
            className={`shrink-0 font-display text-[14px] transition-colors ${
              filter === c.id ? "text-forest" : "text-ink/40"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {list.map((m) => (
          <div
            key={m.id}
            className={`flex gap-3 rounded-[10px] border border-sand bg-linen p-3 ${
              m.soldOut ? "opacity-55" : ""
            }`}
          >
            <img
              src={m.image}
              alt={m.name}
              className="h-16 w-16 shrink-0 rounded-[8px] border border-sand object-cover"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <span className="font-display text-[15px] leading-tight text-ink">{m.name}</span>
                <span className="shrink-0 text-[12.5px] font-medium text-forest">
                  {rupiah(m.price)}
                </span>
              </div>
              <p className="smallcaps mt-0.5 text-[9px] text-muted">{m.origin}</p>
              {(m.addons ?? []).length > 0 && (
                <p className="mt-1 text-[10.5px] font-light text-muted">
                  {(m.addons ?? []).length} tambahan tersedia
                </p>
              )}
              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => setEditing(m)}
                  className="rounded-full border border-sand px-3 py-1 text-[10px] text-ink/70"
                >
                  Ubah
                </button>
                <button
                  onClick={() => toggleAvailability(m.id)}
                  className={`rounded-full px-3 py-1 text-[10px] ${
                    m.soldOut ? "bg-forest text-linen" : "border border-sand text-ink/70"
                  }`}
                >
                  {m.soldOut ? "Aktifkan" : "Tandai Habis"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editing && <Editor item={editing} onClose={() => setEditing(null)} />}
    </div>
  );
}
