import { useState } from "react";
import { rupiah } from "../../data/menu";
import { useStore } from "../../store/store";

function PasswordField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <label className="block">
      <span className="smallcaps text-[9px] text-muted">{label}</span>
      <div className="mt-1 flex items-center gap-2 border-b border-sand pb-2 focus-within:border-forest">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent text-[14px] tracking-wide text-ink placeholder:text-muted/50 focus:outline-none"
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="shrink-0 text-muted/60 transition-colors hover:text-ink"
          aria-label={show ? "Sembunyikan" : "Tampilkan"}
        >
          {show ? (
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
              <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
              <line x1="1" y1="1" x2="23" y2="23" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          )}
        </button>
      </div>
    </label>
  );
}

function PasswordSection() {
  const { settings, updateSettings } = useStore();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const submit = () => {
    if (current !== settings.staffPassword) {
      setMsg({ type: "err", text: "Password saat ini salah." });
      return;
    }
    if (next.trim().length < 4) {
      setMsg({ type: "err", text: "Password baru minimal 4 karakter." });
      return;
    }
    if (next !== confirm) {
      setMsg({ type: "err", text: "Konfirmasi password tidak cocok." });
      return;
    }
    updateSettings({ staffPassword: next });
    setCurrent("");
    setNext("");
    setConfirm("");
    setMsg({ type: "ok", text: "Password staf berhasil diperbarui." });
  };

  return (
    <section className="mt-6 rounded-[10px] border border-sand bg-linen p-6">
      <h3 className="font-display text-[16px] text-ink">Ubah Password Staf</h3>
      <p className="mt-1 text-[11.5px] font-light text-muted">
        Password ini digunakan untuk membuka dashboard staf dari halaman tamu.
      </p>

      <div className="mt-5 space-y-5">
        <PasswordField
          label="Password saat ini"
          value={current}
          onChange={setCurrent}
          placeholder="••••••••"
        />
        <div className="grid gap-5 sm:grid-cols-2">
          <PasswordField
            label="Password baru"
            value={next}
            onChange={setNext}
            placeholder="Minimal 4 karakter"
          />
          <PasswordField
            label="Konfirmasi password baru"
            value={confirm}
            onChange={setConfirm}
            placeholder="Ulangi password baru"
          />
        </div>
      </div>

      {msg && (
        <p
          className={`fade-in mt-4 text-[12px] ${
            msg.type === "ok" ? "text-forest" : "text-[#8b3a3a]"
          }`}
        >
          {msg.text}
        </p>
      )}

      <button
        onClick={submit}
        className="mt-6 rounded-full bg-forest px-6 py-3 text-[11px] tracking-[0.16em] text-linen uppercase transition active:scale-[0.99]"
      >
        Simpan Password
      </button>
    </section>
  );
}

export default function SettingsPanel() {
  const { settings, updateSettings, updatePayment, priceBreakdown, orders } = useStore();
  const sample = 100000;
  const b = priceBreakdown(sample);

  const revenue = orders
    .filter((o) => o.status === "done")
    .reduce((s, o) => s + o.total, 0);

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="text-center sm:text-left">
        <h2 className="font-display text-[22px] text-ink">Pengaturan</h2>
        <p className="mt-1 text-[12px] font-light text-muted">
          Biaya, pembayaran, dan operasional outlet.
        </p>
      </div>

      {/* Ringkasan */}
      <div className="mt-6 grid grid-cols-3 gap-3">
        {[
          { label: "total pesanan", value: orders.length },
          { label: "selesai", value: orders.filter((o) => o.status === "done").length },
          { label: "omzet", value: rupiah(revenue) },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-[10px] border border-sand bg-linen-2 px-4 py-4 text-center sm:text-left"
          >
            <div className="font-display text-[19px] text-forest">{s.value}</div>
            <div className="smallcaps mt-1 text-[9px] text-muted">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Biaya */}
      <section className="mt-8 rounded-[10px] border border-sand bg-linen p-6">
        <h3 className="font-display text-[16px] text-ink">Biaya &amp; Pajak</h3>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <label className="block">
            <span className="smallcaps text-[9px] text-muted">Service charge (%)</span>
            <input
              type="number"
              step="0.5"
              value={(settings.serviceRate * 100).toFixed(1)}
              onChange={(e) => updateSettings({ serviceRate: Number(e.target.value) / 100 })}
              className="mt-1 w-full border-b border-sand bg-transparent pb-2 font-display text-[18px] text-forest focus:border-forest focus:outline-none"
            />
          </label>
          <label className="block">
            <span className="smallcaps text-[9px] text-muted">Pajak PB1 (%)</span>
            <input
              type="number"
              step="0.5"
              value={(settings.taxRate * 100).toFixed(1)}
              onChange={(e) => updateSettings({ taxRate: Number(e.target.value) / 100 })}
              className="mt-1 w-full border-b border-sand bg-transparent pb-2 font-display text-[18px] text-forest focus:border-forest focus:outline-none"
            />
          </label>
        </div>

        <div className="mt-5 rounded-[8px] bg-linen-2 px-5 py-4 text-[12px] font-light text-muted">
          <div className="smallcaps mb-2 text-[9px]">simulasi {rupiah(sample)}</div>
          <div className="flex justify-between py-0.5">
            <span>Service</span>
            <span>{rupiah(b.service)}</span>
          </div>
          <div className="flex justify-between py-0.5">
            <span>Pajak</span>
            <span>{rupiah(b.tax)}</span>
          </div>
          <div className="mt-2 flex justify-between border-t border-sand pt-2 text-ink">
            <span className="smallcaps text-[10px]">total</span>
            <span className="font-display text-[16px] text-forest">{rupiah(b.total)}</span>
          </div>
        </div>
      </section>

      {/* Pembayaran */}
      <section className="mt-6 rounded-[10px] border border-sand bg-linen p-6">
        <h3 className="font-display text-[16px] text-ink">Metode Pembayaran</h3>
        <div className="mt-4 space-y-2.5">
          {settings.payments.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between rounded-[8px] bg-linen-2 px-4 py-3.5"
            >
              <div>
                <div className="text-[13px] text-ink">{p.label}</div>
                <div className="mt-0.5 text-[11px] font-light text-muted">
                  {p.note} · {p.prepaid ? "prabayar" : "bayar di kasir"}
                </div>
              </div>
              <button
                onClick={() => updatePayment(p.id, { enabled: !p.enabled })}
                className={`relative h-6 w-11 rounded-full transition-colors ${
                  p.enabled ? "bg-forest" : "bg-sand"
                }`}
                aria-label={`Toggle ${p.label}`}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-linen transition-all ${
                    p.enabled ? "left-[22px]" : "left-0.5"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Operasional */}
      <section className="mt-6 rounded-[10px] border border-sand bg-linen p-6">
        <h3 className="font-display text-[16px] text-ink">Operasional</h3>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <label className="block">
            <span className="smallcaps text-[9px] text-muted">Jumlah meja</span>
            <input
              type="number"
              value={settings.tables}
              onChange={(e) => updateSettings({ tables: Number(e.target.value) })}
              className="mt-1 w-full border-b border-sand bg-transparent pb-2 font-display text-[18px] text-ink focus:border-forest focus:outline-none"
            />
          </label>
          <label className="block">
            <span className="smallcaps text-[9px] text-muted">Estimasi siap (menit)</span>
            <input
              type="number"
              value={settings.prepMinutes}
              onChange={(e) => updateSettings({ prepMinutes: Number(e.target.value) })}
              className="mt-1 w-full border-b border-sand bg-transparent pb-2 font-display text-[18px] text-ink focus:border-forest focus:outline-none"
            />
          </label>
        </div>

        <div className="mt-5 flex items-center justify-between rounded-[8px] bg-linen-2 px-4 py-3.5">
          <div>
            <div className="text-[13px] text-ink">Menerima pesanan</div>
            <div className="mt-0.5 text-[11px] font-light text-muted">
              Matikan saat outlet tutup atau dapur penuh.
            </div>
          </div>
          <button
            onClick={() => updateSettings({ acceptingOrders: !settings.acceptingOrders })}
            className={`relative h-6 w-11 rounded-full transition-colors ${
              settings.acceptingOrders ? "bg-forest" : "bg-sand"
            }`}
          >
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-linen transition-all ${
                settings.acceptingOrders ? "left-[22px]" : "left-0.5"
              }`}
            />
          </button>
        </div>
      </section>

      {/* Ubah Password */}
      <PasswordSection />

      <div className="h-4" />
    </div>
  );
}
