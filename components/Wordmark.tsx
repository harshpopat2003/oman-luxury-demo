/**
 * The house sets its name as one word, wide-tracked, all caps — the
 * way it's embossed into the base of every bottle. Rendered as type
 * rather than an image so it stays crisp and selectable.
 */
export default function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-baseline font-[family-name:var(--font-body)] leading-none ${className}`}
      style={{ letterSpacing: "0.3em" }}
      aria-label="OMANLUXURY"
    >
      <span className="font-normal">OMAN</span>
      <span className="font-light opacity-70">LUXURY</span>
    </span>
  );
}
