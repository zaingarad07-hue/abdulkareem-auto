type Props = { stock: number; className?: string };

export default function StockBadge({ stock, className = '' }: Props) {
  if (stock === 0) {
    return (
      <span
        className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-mono-label tracking-wider ${className}`}
        style={{
          background: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid rgba(239, 68, 68, 0.4)',
          color: '#fca5a5',
        }}
      >
        OUT OF STOCK · نفد
      </span>
    );
  }
  if (stock <= 3) {
    return (
      <span
        className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-mono-label tracking-wider ${className}`}
        style={{
          background: 'rgba(251, 146, 60, 0.15)',
          border: '1px solid rgba(251, 146, 60, 0.4)',
          color: '#fdba74',
        }}
      >
        ONLY {stock} LEFT · كمية محدودة
      </span>
    );
  }
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-mono-label tracking-wider ${className}`}
      style={{
        background: 'rgba(53, 184, 255, 0.12)',
        border: '1px solid rgba(53, 184, 255, 0.35)',
        color: '#35B8FF',
      }}
    >
      IN STOCK · متوفر
    </span>
  );
}
