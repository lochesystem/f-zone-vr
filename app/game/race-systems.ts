// Shared simulation and menu rules, independent of rendering and WebXR hardware.
export function menuCardLayout(step: string, count: number) {
  const preview = step === 'ship' || step === 'track';
  const compact = !preview && count > 5;
  return { x: 64, width: preview ? 500 : Math.min(820, count <= 3 ? 760 : 700),
    height: step === 'ship' ? 68 : step === 'track' ? 76 : compact ? 56 : count > 4 ? 70 : 84,
    top: compact ? 230 : 250, gap: compact ? 10 : 14 };
}
export function menuHit(step: string, count: number, x: number, y: number) {
  const box = menuCardLayout(step, count);
  if (x < box.x || x > box.x + box.width) return null;
  for (let i = 0; i < count; i++) {
    const top = box.top + i * (box.height + box.gap);
    if (y >= top && y <= top + box.height) return i;
  }
  return null;
}
type Point = { x: number; y: number; z: number };
export function sweptHit(start: Point, end: Point, target: Point, radius: number) {
  const x = end.x-start.x, y = end.y-start.y, z = end.z-start.z;
  const length = x*x+y*y+z*z;
  const t = length ? Math.max(0,Math.min(1,((target.x-start.x)*x+(target.y-start.y)*y+(target.z-start.z)*z)/length)) : 0;
  return (start.x+x*t-target.x)**2+(start.y+y*t-target.y)**2+(start.z+z*t-target.z)**2 <= radius*radius;
}
export function steerShip(heading: number, lateralVelocity: number, steer: number, speed: number, handling: number, brake: number, airborne: boolean, trackTurn: number, dt: number) {
  // Heading is relative to the circuit tangent; positive means steering right.
  const authority = .58 + handling*.075;
  const counter = steer*heading < 0 ? 1.35 : 1;
  const nextHeading = Math.max(-.48,Math.min(.48,(heading + steer*authority*counter*dt - trackTurn*.45)*Math.exp(-(brake>.12?1.5:2.1)*dt)));
  const desired = Math.sin(nextHeading)*speed;
  const grip = airborne ? 1.4 : brake>.12 ? 3 : 5+handling*.4;
  return { heading: nextHeading, lateralVelocity: lateralVelocity+(desired-lateralVelocity)*(1-Math.exp(-grip*dt)), forwardSpeed: speed*Math.cos(nextHeading) };
}
export function collisionRetention(body: number) { return .76 + Math.max(1,Math.min(5,body))*.025; }
