import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

interface Petal {
  left: string;
  size: number;
  color: string;
  duration: string;
  delay: string;
}

const PETALS: Petal[] = [
  { left: '8%', size: 11, color: '#EFC3CC', duration: '5.2s', delay: '.2s' },
  { left: '19%', size: 8, color: '#F6E3E7', duration: '6s', delay: '1.1s' },
  { left: '31%', size: 10, color: '#C97489', duration: '5.6s', delay: '.6s' },
  { left: '44%', size: 9, color: '#F2E0D2', duration: '6.4s', delay: '1.5s' },
  { left: '57%', size: 12, color: '#EFC3CC', duration: '5s', delay: '.9s' },
  { left: '68%', size: 8, color: '#E2A5B6', duration: '6.2s', delay: '.3s' },
  { left: '79%', size: 10, color: '#F6E3E7', duration: '5.4s', delay: '1.8s' },
  { left: '90%', size: 9, color: '#F2E0D2', duration: '5.8s', delay: '.7s' },
];

/** ~8 rose petals falling once from the top of the evening sheet — the day's one celebration. Never re-fires; absent entirely under reduced motion. */
export function PetalConfetti() {
  const reducedMotion = usePrefersReducedMotion();
  if (reducedMotion) return null;

  return (
    <div className="ss-petal-field" aria-hidden="true">
      {PETALS.map((petal, i) => (
        <div
          key={i}
          className="ss-petal"
          style={{
            left: petal.left,
            width: petal.size,
            height: petal.size,
            background: petal.color,
            animationDuration: petal.duration,
            animationDelay: petal.delay,
          }}
        />
      ))}
    </div>
  );
}
