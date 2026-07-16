import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Request a Quote (RFQ)',
  description: 'Submit a Request for Quote (RFQ) to Jinyu Capital for bulk orders, custom specifications, or OEM/ODM projects. Get professional pricing for your lighting projects.',
};

export default function RequestQuoteLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
