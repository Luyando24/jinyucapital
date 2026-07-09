"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Target, Award, Users } from 'lucide-react';

export default function AboutPage() {
  const values = [{
    icon: Target,
    title: 'Precision',
    description: 'We maintain strict tolerances and rigorous quality control in every stage of our manufacturing process.'
  }, {
    icon: Award,
    title: 'Innovation',
    description: 'We continuously invest in R&D to develop energy-efficient lighting and smarter, more durable appliances.'
  }, {
    icon: Users,
    title: 'Partnership',
    description: 'We build lasting relationships with our global distributors through transparency and consistent delivery.'
  }];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="py-20 bg-secondary text-secondary-foreground">
        <div className="section-container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6" style={{ letterSpacing: '-0.02em', textWrap: 'balance' }}>
              Engineering Innovation Industrial Reliability
            </h1>
            <p className="text-lg leading-relaxed opacity-90">
              Jinyu specializes in the design, manufacturing, and supply of explosion-proof lighting and industrial electrical solutions for global markets
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24 bg-background">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <h2 className="text-3xl md:text-4xl font-semibold mb-6" style={{ textWrap: 'balance' }}>
                Our story
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Driven by innovation and quality, Jinyu has developed a complete manufacturing ecosystem covering mold development, die-casting, production, assembly, and OEM/ODM customization.
                </p>
                <p>
                  Annual production exceeds 2.4 million units, supported by advanced facilities, experienced engineering teams, and strict quality control systems.
                </p>
                <p>
                  Backed by 80+ patents and international certifications including ISO, CCC, EX, and ATEX, we deliver reliable solutions for industrial and hazardous environments worldwide.
                </p>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
              <div className="relative aspect-video rounded-2xl overflow-hidden shadow-lg">
                <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80" alt="Jinyu Manufacturing Facility" className="object-cover w-full h-full" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-24 bg-muted">
        <div className="section-container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold mb-4" style={{ textWrap: 'balance' }}>Our Core Values</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">The principles that guide our manufacturing processes and client relationships.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }} className="bg-card text-card-foreground p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
                <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                  <value.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
