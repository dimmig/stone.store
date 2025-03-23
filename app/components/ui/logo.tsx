import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  textClassName?: string;
  showText?: boolean;
  href?: string;
}

export function Logo({ 
  className, 
  textClassName,
  showText = true,
  href
}: LogoProps) {
  const LogoContent = () => (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="relative flex items-center">
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-black"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M16 2C8.268 2 2 8.268 2 16s6.268 14 14 14 14-6.268 14-14S23.732 2 16 2zM8 13.5a1.5 1.5 0 013 0v5a1.5 1.5 0 01-3 0v-5zm6.5-1.5a1.5 1.5 0 00-1.5 1.5v5a1.5 1.5 0 003 0v-2h2a1.5 1.5 0 000-3h-2v-1.5zm9 1.5a1.5 1.5 0 00-3 0v5a1.5 1.5 0 003 0v-5z"
            fill="currentColor"
          />
        </svg>
      </div>
      {showText && (
        <span className={cn(
          "font-bold tracking-tight text-xl",
          textClassName
        )}>
          STONE.STORE
        </span>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="hover:opacity-90 transition-opacity">
        <LogoContent />
      </Link>
    );
  }

  return <LogoContent />;
} 