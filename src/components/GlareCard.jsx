export default function GlareCard({ children, className = '' }) {
  return <div className={`glare-card ${className}`}>{children}</div>;
}
