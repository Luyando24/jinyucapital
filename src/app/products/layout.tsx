import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Industrial & Landscape Lighting Catalog',
  description: 'Browse our complete range of certified industrial LED fixtures, explosion-proof light systems, street lamps, and custom outdoor illumination solutions.',
};

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
