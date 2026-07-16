import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Become a Global Distributor',
  description: 'Join the Jinyu Capital global distributor network. Partner with a premier industrial lighting manufacturer and distribute ISO/ATEX-certified LED and explosion-proof solutions.',
};

export default function DistributorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
