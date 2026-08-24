import { useMemo, useRef, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Logo } from "../Logo";
import { useStore } from "../../store/store";
import { buildTableUrl, padTable } from "../../lib/table";

function TableCard({ number }: { number: number }) {
  const label = padTable(number);
  const url = buildTableUrl(label);
  const wrapRef = useRef<HTMLDivElement>(null);

  const download = () => {
    const canvas = wrapRef.current?.querySelector("canvas");
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `monokala-meja-${label}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="print-card flex flex-col items-center rounded-[12px] border border-sand bg-linen p-5 text-center">
      <div className="text-forest opacity-70">
        <Logo size={20} className="max-w-[110px]" />
      </div>
      <div className="smallcaps mt-2 text-[9px] text-muted">table</div>
      <div className="font-display text-[22px] leading-none text-forest">{label}</div>

      <div ref={wrapRef} className="mt-4 rounded-[8px] border border-sand bg-white p-3">
        <QRCodeCanvas value={url} size={128} bgColor="#ffffff" fgColor="#1B3620" level="M" />
      </div>

      <p className="mt-3 line-clamp-1 max-w-[160px] text-[9.5px] font-light text-muted">{url}</p>

      <button
        onClick={download}
        className="print-hide mt-4 rounded-full border border-sand px-4 py-1.5 text-[9.5px] tracking-[0.12em] text-ink/70 uppercase transition hover:border-forest hover:text-forest"
      >
        Unduh PNG
      </button>
    </div>
  );
}

export default function TableQrManager() {
  const { settings, updateSettings } = useStore();
  const [count, setCount] = useState(settings.tables);

  const tables = useMemo(() => Array.from({ length: count }, (_, i) => i + 1), [count]);

  const applyCount = () => {
    const n = Math.max(1, Math.min(200, count));
    setCount(n);
    updateSettings({ tables: n });
  };

  return (
    <div>
      <div className="print-hide mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-[22px] text-ink">QR Code Meja</h2>
          <p className="mt-1 text-[12px] font-light text-muted">
            Setiap meja punya tautan unik. Tempel QR ini di meja masing-masing agar
            nomor meja otomatis terisi saat tamu memindai.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={1}
            max={200}
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="w-20 rounded-full border border-sand bg-linen-2 px-3 py-2 text-center text-[13px] text-ink focus:border-forest focus:outline-none"
          />
          <button
            onClick={applyCount}
            className="rounded-full border border-sand px-4 py-2 text-[10px] tracking-[0.14em] text-ink/70 uppercase transition hover:border-forest hover:text-forest"
          >
            Terapkan
          </button>
          <button
            onClick={() => window.print()}
            className="rounded-full bg-forest px-5 py-2 text-[10px] tracking-[0.14em] text-linen uppercase"
          >
            Cetak Semua
          </button>
        </div>
      </div>

      <div className="print-hide mb-6 rounded-[10px] border border-sand bg-linen-2 px-5 py-4 text-[12px] font-light text-muted">
        <p>
          <strong className="font-medium text-ink">Cara pakai:</strong> klik{" "}
          <em>Cetak Semua</em> untuk mencetak seluruh QR sekaligus, atau unduh satu per
          satu lalu tempel di meja / cetak sebagai tent card. Setiap kode mengarah ke
          halaman pemesanan dengan nomor meja yang sudah otomatis terisi — tamu tidak
          perlu memasukkan nomor meja secara manual.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 print:grid-cols-3">
        {tables.map((n) => (
          <TableCard key={n} number={n} />
        ))}
      </div>

      <style>{`
        @media print {
          body * { visibility: hidden; }
          .print-card, .print-card * { visibility: visible; }
          .print-hide { display: none !important; }
          .print-card {
            break-inside: avoid;
            box-shadow: none !important;
          }
        }
      `}</style>
    </div>
  );
}
