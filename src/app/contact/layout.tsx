import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with the sales, support, and engineering teams at Jinyu Capital. We are here to assist with your bulk orders, product customization, and OEM/ODM projects.',
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
