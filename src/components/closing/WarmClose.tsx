interface WarmCloseProps {
  doneCount: number;
  isComplete: boolean;
}

/** The always-present closing line — standard, zero-done, and the 100%-day celebration addition (the app's only "!"). */
export function WarmClose({ doneCount, isComplete }: WarmCloseProps) {
  return (
    <>
      <div className="ss-warmline">
        {doneCount === 0 ? (
          <>
            Rest is part of the rhythm.
            <br />
            Tomorrow is ready when you are.
          </>
        ) : (
          <>
            That's real.
            <br />
            Tomorrow is ready when you are.
          </>
        )}
      </div>
      {isComplete && (
        <div className="ss-celebline">
          Wow!
          <br />
          What a day.
        </div>
      )}
    </>
  );
}
