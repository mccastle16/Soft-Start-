interface QuoteLineProps {
  quote: string;
}

export function QuoteLine({ quote }: QuoteLineProps) {
  return <div className="ss-quote">{quote}</div>;
}
