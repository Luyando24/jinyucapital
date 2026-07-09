"use client";

import React from 'react';
import { motion } from 'framer-motion';
import DistributorForm from '@/components/DistributorForm';

export default function DistributorPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-grow">
        {/* Page Header */}
        <section className="bg-muted py-16 md:py-24">
          <div className="section-container">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl mx-auto text-center"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
                Become a Global Distributor
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                Partner with Jinyu Capital to bring high-quality, innovative lighting and appliance solutions to your local market. Fill out the application below to start the conversation.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Form Section */}
        <section className="py-16 md:py-24">
          <div className="section-container">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="max-w-3xl mx-auto"
            >
              <DistributorForm />
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
}
