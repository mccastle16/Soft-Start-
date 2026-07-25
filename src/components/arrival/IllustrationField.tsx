type IllustrationVariant = 'full-rose' | 'corner-glow' | 'footer-pool';

interface IllustrationFieldProps {
  variant: IllustrationVariant;
}

/** Soft Focus radial-gradient light fields — decorative only, never carries content. */
export function IllustrationField({ variant }: IllustrationFieldProps) {
  return <div className={`ss-illus ss-illus--${variant}`} aria-hidden="true" />;
}
