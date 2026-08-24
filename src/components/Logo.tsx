const logoUrl = "/images/monokala-logo.png";

type LogoProps = {
  /** Approximate height in px. Width scales with the wordmark aspect ratio. */
  size?: number;
  className?: string;
};

/**
 * Official MONOKALA wordmark — the exact letterpress mark from the
 * brand identity. Rendered as a bitmap so all serif detail and the
 * signature K swash stay perfectly faithful to the original artwork.
 */
export function Logo({ size = 44, className = "" }: LogoProps) {
  const height = size;
  // Source image ratio is close to the uploaded reference banner.
  const width = Math.round(size * 3.0);

  return (
    <img
      src={logoUrl}
      alt="MONOKALA"
      width={width}
      height={height}
      draggable={false}
      className={`select-none object-contain object-center ${className}`}
      style={{ height, width: "auto", maxWidth: "100%" }}
    />
  );
}

export function LogoMark({ size = 28, className = "" }: { size?: number; className?: string }) {
  return <Logo size={size} className={className} />;
}

export function Wordmark({ className = "" }: { className?: string }) {
  return <Logo className={className} />;
}
