import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Discover Jinyu Capital, a leading OEM/ODM manufacturer specializing in high-performance industrial, landscape, and explosion-proof lighting fixtures in Guangzhou, China.',
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
