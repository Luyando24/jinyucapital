import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Lighting Industry Blog & Insights',
  description: 'Stay updated with the latest trends, guides, and engineering insights in industrial, explosion-proof, and commercial landscape lighting from Jinyu Capital.',
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
