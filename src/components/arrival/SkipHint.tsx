interface SkipHintProps {
  onField?: boolean;
}

/** Tiny centered caption reassuring that the arrival never has to be watched. */
export function SkipHint({ onField = false }: SkipHintProps) {
  return <div className={`ss-skip-hint ${onField ? 'ss-skip-hint--field' : ''}`.trim()}>tap anywhere to skip</div>;
}
