interface AppWordmarkProps {
  size?: 'small' | 'large';
}

export function AppWordmark({ size = 'small' }: AppWordmarkProps) {
  return <div className={`ss-wordmark ss-wordmark--${size}`}>Soft Start</div>;
}
