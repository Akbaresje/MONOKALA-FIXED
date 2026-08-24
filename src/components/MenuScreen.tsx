import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { categories, rupiah, type Category, type MenuItem } from "../data/menu";
import { useStore } from "../store/store";
import { Logo } from "./Logo";

type Props = {
  table: string;
  onSelect: (item: MenuItem) => void;
  onOpenOrders: () => void;
  hasOrders: boolean;
};

export default function MenuScreen({ table, onSelect, onOpenOrders, hasOrders }: Props) {
  const { menu } = useStore();
  const [active, setActive] = useState<Category | "all">("all");
  const [query, setQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);

  // The MenuScreen owns its own scroll container so we can:
  //  (1) collapse the header smoothly once the user starts scrolling
  //  (2) auto-scroll back to the top whenever the category / query changes
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const catBarRef = useRef<HTMLDivElement | null>(null);
  const items = useMemo(
    () =>
      menu.filter(
        (m) =>
          !m.soldOut &&
          (active === "all" || m.category === active) &&
          (query.trim() === "" ||
            (m.name + m.desc + m.origin).toLowerCase().includes(query.toLowerCase())),
      ),
    [menu, active, query],
  );

  const hero = active === "all" && query === "" ? items[0] : undefined;
  const grid = hero ? items.slice(1) : items;

  // Ignore scroll events while we're programmatically resetting to the top,
  // otherwise the listener can re-latch "scrolled" mid-reset.
  const lockScrollSync = useRef(false);
  const firstRun = useRef(true);

  // Scroll listener — set the "scrolled" flag after a small threshold so
  // the header shrinks only after intentional scrolling (avoids jitter).
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let ticking = false;
    const onScroll = () => {
      if (lockScrollSync.current || ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setScrolled(el.scrollTop > 24);
        ticking = false;
      });
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  // Reset to the very top the moment the category/query changes.
  // useLayoutEffect + instant jump runs BEFORE paint, so the new list is
  // always rendered from row one — no half-scrolled state, no race with
  // the list's changing height (which used to break `behavior: "smooth"`).
  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    if (firstRun.current) {
      firstRun.current = false;
      return;
    }

    lockScrollSync.current = true;

    // Cancel any in-flight smooth scrolling, then hard-reset.
    el.style.scrollBehavior = "auto";
    el.scrollTop = 0;
    // Expand the header back immediately so the reset feels intentional.
    setScrolled(false);

    const raf = requestAnimationFrame(() => {
      // Second pass catches late layout shifts (images//fonts settling).
      el.scrollTop = 0;
      el.style.scrollBehavior = "";
      lockScrollSync.current = false;
    });

    return () => cancelAnimationFrame(raf);
  }, [active, query]);

  // Keep the active category chip visible in its horizontal scroll strip.
  useEffect(() => {
    const bar = catBarRef.current;
    if (!bar) return;
    const btn = bar.querySelector<HTMLButtonElement>(`[data-cat="${active}"]`);
    btn?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [active]);

  return (
    <div ref={scrollRef} className="no-scrollbar h-full overflow-y-auto pb-40">
      <header
        className={`sticky top-0 z-30 bg-linen/85 backdrop-blur-xl transition-shadow duration-500 ${
          scrolled ? "shadow-[0_10px_24px_-22px_rgba(26,26,26,0.35)]" : ""
        }`}
      >
        {/* Brand row — collapses on scroll */}
        <div
          className={`grid grid-cols-[48px_1fr_48px] items-start px-6 transition-[padding,transform,opacity] duration-500 ease-out ${
            scrolled ? "pt-3" : "pt-7"
          }`}
        >
          <button
            onClick={onOpenOrders}
            className={`relative flex h-9 w-9 items-center justify-center rounded-full border border-sand text-ink/60 transition-all duration-500 hover:border-forest hover:text-forest ${
              scrolled ? "mt-0 scale-90 opacity-80" : "mt-2 scale-100 opacity-100"
            }`}
            aria-label="Status pesanan"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.4">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 2" strokeLinecap="round" />
            </svg>
            {hasOrders && (
              <span className="absolute right-0 top-0 h-1.5 w-1.5 rounded-full bg-forest" />
            )}
          </button>

          <div className="flex min-w-0 flex-col items-center px-1 pt-1">
            <div
              className="origin-top transition-transform duration-500 ease-out"
              style={{ transform: scrolled ? "scale(0.62)" : "scale(1)" }}
            >
              <Logo size={46} className="max-w-[min(100%,250px)]" />
            </div>
            <div
              className={`smallcaps text-[10px] text-muted transition-all duration-500 ${
                scrolled ? "-mt-4 h-0 opacity-0" : "mt-1.5 h-3 opacity-100"
              }`}
            >
              coffee &amp; kitchen
            </div>
          </div>

          <div
            className={`text-right transition-all duration-500 ${
              scrolled ? "mt-0 scale-90 opacity-90" : "mt-1.5 scale-100 opacity-100"
            }`}
          >
            <div
              className={`smallcaps text-[9px] text-muted transition-all duration-500 ${
                scrolled ? "h-0 opacity-0" : "h-3 opacity-100"
              }`}
            >
              table
            </div>
            <div className="font-display text-2xl leading-none text-forest">{table}</div>
          </div>
        </div>

        {/* Search — hides when the user starts scrolling to save space */}
        <div
          className={`overflow-hidden px-6 transition-all duration-500 ease-out ${
            scrolled ? "max-h-0 pt-0 opacity-0" : "max-h-16 pt-5 opacity-100"
          }`}
        >
          <div className="flex items-center gap-3 border-b border-sand pb-2">
            <svg viewBox="0 0 24 24" className="h-4 w-4 text-muted" fill="none" stroke="currentColor" strokeWidth="1.4">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.2-3.2" strokeLinecap="round" />
            </svg>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari menu, bahan, atau origin"
              className="w-full bg-transparent text-[13px] text-ink placeholder:text-muted/70 focus:outline-none"
            />
          </div>
        </div>

        {/* Category bar — always visible, becomes the primary nav when collapsed */}
        <div
          ref={catBarRef}
          className={`no-scrollbar flex gap-7 overflow-x-auto px-6 transition-all duration-500 ${
            scrolled ? "mt-2 pb-2" : "mt-4 pb-3"
          }`}
        >
          {categories.map((c) => {
            const on = active === c.id;
            return (
              <button
                key={c.id}
                data-cat={c.id}
                onClick={() => setActive(c.id)}
                className="relative shrink-0 pb-1 text-left"
              >
                <span className="smallcaps mr-1.5 text-[9px] text-muted">{c.sub}</span>
                <span
                  className={`font-display text-[15px] transition-colors ${
                    on ? "text-forest" : "text-ink/45"
                  }`}
                >
                  {c.label}
                </span>
                <span
                  className={`absolute bottom-0 left-0 h-px bg-forest transition-all duration-300 ${
                    on ? "w-full opacity-100" : "w-0 opacity-0"
                  }`}
                />
              </button>
            );
          })}
        </div>
        <div className="h-px bg-sand" />
      </header>

      {/* Content region — re-keyed per category so it re-enters gracefully
          after the instant scroll reset. */}
      <div key={`section-${active}`} className="section-swap">

      {/* Editorial intro */}
      {active === "all" && query === "" && (
        <div className="rise px-6 pt-8">
          <p className="font-display text-[26px] leading-[1.25] text-ink">
            Sepiring tenang,
            <br />
            <span className="italic text-forest">secangkir waktu.</span>
          </p>
          <p className="mt-3 max-w-[80%] text-[12.5px] leading-relaxed font-light text-muted">
            Pilih menu, pesan langsung dari meja Anda, lalu pantau nomor antrean tanpa perlu
            beranjak.
          </p>
        </div>
      )}

      {/* Hero card */}
      {hero && (
        <button onClick={() => onSelect(hero)} className="rise mt-7 block w-full px-6 text-left">
          <div className="overflow-hidden rounded-[10px] bg-sand shadow-[0_10px_30px_-18px_rgba(26,26,26,0.45)]">
            <div className="relative aspect-[16/10] w-full overflow-hidden">
              <img src={hero.image} alt={hero.name} className="h-full w-full object-cover" />
              <span className="smallcaps absolute left-4 top-4 rounded-full bg-linen/90 px-3 py-1 text-[9px] text-forest">
                {hero.tag ?? "pilihan barista"}
              </span>
            </div>
            <div className="flex items-end justify-between bg-linen px-5 py-4">
              <div>
                <div className="smallcaps text-[9px] text-muted">{hero.origin}</div>
                <div className="font-display text-xl text-ink">{hero.name}</div>
              </div>
              <div className="font-display text-lg text-forest">{rupiah(hero.price)}</div>
            </div>
          </div>
        </button>
      )}

      {/* Grid */}
      <div className="mt-8 px-6">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="font-display text-[17px] text-ink">
            {categories.find((c) => c.id === active)?.label}
          </h2>
          <span className="smallcaps text-[9px] text-muted">{items.length} item</span>
        </div>

        <div key={`${active}-${query}`} className="grid grid-cols-2 gap-x-4 gap-y-8">
          {grid.map((m, i) => (
            <button
              key={m.id}
              onClick={() => onSelect(m)}
              style={{ animationDelay: `${i * 45}ms` }}
              className="rise group text-left"
            >
              <div className="relative overflow-hidden rounded-[8px] bg-sand shadow-[0_6px_20px_-14px_rgba(26,26,26,0.5)]">
                <div className="aspect-square w-full overflow-hidden">
                  <img
                    src={m.image}
                    alt={m.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-active:scale-105"
                  />
                </div>
                {m.tag && (
                  <span className="smallcaps absolute left-2.5 top-2.5 rounded-full bg-linen/90 px-2.5 py-0.5 text-[8px] text-forest">
                    {m.tag}
                  </span>
                )}
              </div>
              <div className="smallcaps mt-3 text-[9px] text-muted">{m.origin}</div>
              <div className="mt-0.5 font-display text-[15px] leading-snug text-ink">{m.name}</div>
              <p className="mt-1 line-clamp-2 text-[11.5px] font-light leading-relaxed text-muted">
                {m.desc}
              </p>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-[13px] font-medium text-forest">{rupiah(m.price)}</span>
                <span className="flex h-6 w-6 items-center justify-center rounded-full border border-sand text-ink/60">
                  <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                  </svg>
                </span>
              </div>
            </button>
          ))}
        </div>

        {items.length === 0 && (
          <p className="py-16 text-center text-[13px] font-light text-muted">
            Tidak ada menu yang cocok dengan pencarian Anda.
          </p>
        )}

        <div className="mt-14 flex flex-col items-center gap-2 border-t border-sand pt-8 pb-4">
          <div className="opacity-45">
            <Logo size={38} className="max-w-[180px]" />
          </div>
          <p className="smallcaps text-[9px] text-muted">est. 2019 · jakarta</p>
        </div>
      </div>
      </div>
    </div>
  );
}
