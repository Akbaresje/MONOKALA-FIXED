import { useRef, useState } from "react";
import { useStore } from "../../store/store";
import { Logo } from "../Logo";

type Props = {
  onSuccess: () => void;
  onCancel: () => void;
};

export default function StaffGate({ onSuccess, onCancel }: Props) {
  const { settings } = useStore();
  const [pw, setPw] = useState("");
  const [shake, setShake] = useState(false);
  const [show, setShow] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const attempt = () => {
    if (pw === settings.staffPassword) {
      onSuccess();
    } else {
      setShake(true);
      setPw("");
      setTimeout(() => setShake(false), 500);
      inputRef.current?.focus();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-linen p-6">
      <div
        className={`rise w-full max-w-sm text-center ${shake ? "animate-shake" : ""}`}
        style={
          shake
            ? { animation: "shake 0.4s cubic-bezier(.36,.07,.19,.97) both" }
            : {}
        }
      >
        {/* Logo */}
        <div className="flex justify-center">
          <Logo size={46} className="max-w-[240px]" />
        </div>

        {/* Label */}
        <div className="mt-8">
          <div className="smallcaps text-[9px] text-muted">akses staf</div>
          <h2 className="mt-2 font-display text-[22px] text-ink">Masukkan password</h2>
        </div>

        {/* Input */}
        <div className="mt-8 flex items-center gap-3 border-b-2 border-sand pb-2 focus-within:border-forest transition-colors">
          <input
            ref={inputRef}
            autoFocus
            type={show ? "text" : "password"}
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && attempt()}
            placeholder="••••••••••"
            className="flex-1 bg-transparent text-center font-display text-[22px] tracking-[0.28em] text-ink placeholder:text-muted/40 placeholder:tracking-widest focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="shrink-0 text-muted/60 hover:text-ink transition-colors"
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

        {shake && (
          <p className="mt-3 text-[12px] text-[#8b3a3a] fade-in">
            Password salah. Coba lagi.
          </p>
        )}

        {/* Actions */}
        <div className="mt-8 flex gap-3">
          <button
            onClick={onCancel}
            className="rounded-full border border-sand px-6 py-3 text-[11px] tracking-[0.16em] text-ink/70 uppercase transition hover:border-ink/30"
          >
            Batal
          </button>
          <button
            onClick={attempt}
            className="flex-1 rounded-full bg-forest py-3 text-[11.5px] tracking-[0.18em] text-linen uppercase transition active:scale-[0.99]"
          >
            Masuk
          </button>
        </div>

        <p className="smallcaps mt-8 text-[9px] text-muted">
          hanya untuk staf monokala
        </p>
      </div>

      <style>{`
        @keyframes shake {
          10%, 90% { transform: translateX(-2px); }
          20%, 80% { transform: translateX(4px); }
          30%, 50%, 70% { transform: translateX(-6px); }
          40%, 60% { transform: translateX(6px); }
        }
      `}</style>
    </div>
  );
}
