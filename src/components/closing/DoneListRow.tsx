interface DoneListRowProps {
  title: string;
  slim?: boolean;
}

/** Quiet white row: sage check disc + grayed title — the evening state's whole list. */
export function DoneListRow({ title, slim = false }: DoneListRowProps) {
  return (
    <div className={`ss-donecard ${slim ? 'ss-donecard--slim' : ''}`.trim()}>
      <span className="ss-donecard-check">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 13l4 4L19 7" />
        </svg>
      </span>
      <span className="ss-donecard-title">{title}</span>
    </div>
  );
}
