"use client";

import React from 'react';
import { useStoreSettings } from '@/components/StoreSettingsContext';
import { resolveImageUrl } from '@/lib/default-images';

interface LogoProps {
  className?: string;
}

function LogoFallback({ className }: { className: string }) {
  return (
    <svg
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <rect width="36" height="36" rx="8" className="fill-primary" />
      <path
        d="M10 24V12h3.2l3.4 7.2L20 12h3.2v12h-2.6v-7.4l-3.2 6.6h-1.8l-3.2-6.6V24H10z"
        className="fill-primary-foreground"
      />
    </svg>
  );
}

const Logo: React.FC<LogoProps> = ({ className = "w-8 h-8" }) => {
  const { settings } = useStoreSettings();
  const logoUrl = resolveImageUrl(settings?.logo_url, '');

  if (!logoUrl) {
    return <LogoFallback className={className} />;
  }

  return (
    <img
      src={logoUrl}
      alt="Jinyu Logo"
      className={className}
    />
  );
};

export default Logo;
