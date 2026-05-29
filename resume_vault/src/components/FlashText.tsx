import { useEffect, useState, ReactNode } from 'react';

interface FlashTextProps {
  children: ReactNode;
  value: any;
  className?: string;
}

export function FlashText({ children, value, className = '' }: FlashTextProps) {
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    if (value !== undefined && value !== null) {
      setFlash(true);
      const timer = setTimeout(() => setFlash(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [value]);

  return (
    <span
      className={`transition-all duration-700 ease-out rounded px-1 inline-block ${
        flash
          ? 'bg-amber-200/50 dark:bg-amber-800/40 text-amber-950 dark:text-amber-100 scale-[1.01] font-medium'
          : 'bg-transparent'
      } ${className}`}
    >
      {children}
    </span>
  );
}
