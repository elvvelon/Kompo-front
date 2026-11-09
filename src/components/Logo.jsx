/** Kompo brand mark — eight rounded rays, echoing the reference logo style. */
export default function Logo({ className = 'brand__mark' }) {
  const rays = [0, 45, 90, 135, 180, 225, 270, 315];
  return (
    <svg className={className} viewBox="0 0 32 32" aria-hidden="true">
      <g stroke="currentColor" strokeWidth="3.4" strokeLinecap="round">
        {rays.map((angle, i) => (
          <line
            key={angle}
            x1="16"
            y1={i % 2 === 0 ? 3.5 : 5.5}
            x2="16"
            y2="11"
            transform={`rotate(${angle} 16 16)`}
          />
        ))}
      </g>
    </svg>
  );
}
