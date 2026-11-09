/**
 * Decorative orbit / globe illustration — a pastel take on the reference's
 * wireframe globe with glowing nodes.
 */
const CX = 200;
const CY = 200;
const RX = 178;
const RY = 62;
const ORBITS = [0, 32, 64, 96, 128, 160];

function pointOnOrbit(angleDeg, t) {
  const a = (angleDeg * Math.PI) / 180;
  const x = RX * Math.cos(t);
  const y = RY * Math.sin(t);
  return [CX + x * Math.cos(a) - y * Math.sin(a), CY + x * Math.sin(a) + y * Math.cos(a)];
}

const NODES = [
  [0, 0.6],
  [32, 3.6],
  [64, 1.9],
  [96, 5.1],
  [128, 2.6],
  [160, 4.4],
].map(([angle, t], i) => ({ id: i, point: pointOnOrbit(angle, t) }));

const SMALL_DOTS = [
  [0, 2.4],
  [32, 0.9],
  [64, 4.3],
  [96, 2.2],
  [128, 5.6],
  [160, 1.2],
  [0, 4.9],
  [64, 0.2],
].map(([angle, t], i) => ({ id: i, point: pointOnOrbit(angle, t) }));

export default function OrbitGraphic() {
  return (
    <svg className="orbit" viewBox="0 0 400 400" role="img" aria-label="Network of hardware brands">
      <defs>
        <radialGradient id="orbit-globe" cx="38%" cy="32%" r="75%">
          <stop offset="0%" stopColor="#fffdf9" />
          <stop offset="55%" stopColor="#ddd0f2" />
          <stop offset="100%" stopColor="#a98fdb" />
        </radialGradient>
        <pattern id="orbit-dots" width="7" height="7" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.1" fill="#5c4594" opacity="0.28" />
        </pattern>
        <clipPath id="orbit-clip">
          <circle cx={CX} cy={CY} r="118" />
        </clipPath>
      </defs>

      <circle cx={CX} cy={CY} r="118" fill="url(#orbit-globe)" />
      <g clipPath="url(#orbit-clip)">
        <rect x="0" y="0" width="400" height="400" fill="url(#orbit-dots)" />
        {[-60, -30, 0, 30, 60].map((lat) => (
          <ellipse
            key={lat}
            cx={CX}
            cy={CY + lat * 1.6}
            rx={118 * Math.cos((lat * Math.PI) / 180)}
            ry="14"
            fill="none"
            stroke="#5c4594"
            strokeOpacity="0.18"
          />
        ))}
      </g>

      <g className="orbit__rings">
        {ORBITS.map((angle) => (
          <ellipse
            key={angle}
            cx={CX}
            cy={CY}
            rx={RX}
            ry={RY}
            transform={`rotate(${angle} ${CX} ${CY})`}
            fill="none"
            stroke="#2d2541"
            strokeOpacity="0.38"
            strokeWidth="1"
          />
        ))}

        {SMALL_DOTS.map(({ id, point: [x, y] }) => (
          <circle key={id} cx={x} cy={y} r="4" fill="#3b3253" />
        ))}

        {NODES.map(({ id, point: [x, y] }) => (
          <g key={id} className="orbit__node" style={{ animationDelay: `${id * 0.4}s` }}>
            <circle cx={x} cy={y} r="13" fill="#fffdf9" fillOpacity="0.55" />
            <circle cx={x} cy={y} r="8" fill="#fffdf9" stroke="#c7b4e8" />
            <circle cx={x} cy={y} r="4.5" fill="#8f72cc" />
          </g>
        ))}
      </g>
    </svg>
  );
}
