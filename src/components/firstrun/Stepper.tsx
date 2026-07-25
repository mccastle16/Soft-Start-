interface StepperProps {
  activeCount: number;
  total?: number;
}

/** Rose segment strip showing first-run progress; segments fill left to right, cumulatively. */
export function Stepper({ activeCount, total = 6 }: StepperProps) {
  return (
    <div className="ss-fr-stepper">
      {Array.from({ length: total }, (_, i) => (
        <i key={i} className={`ss-fr-stepper-seg ${i < activeCount ? 'ss-fr-stepper-seg--on' : ''}`.trim()} />
      ))}
    </div>
  );
}
