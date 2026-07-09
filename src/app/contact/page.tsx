"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import ContactForm from '@/components/ContactForm';

export default function ContactPage() {
  const contactInfo = [{
    icon: Mail,
    title: 'Email',
    content: 'sales@jinyucapital.com',
    link: 'mailto:sales@jinyucapital.com'
  }, {
    icon: Phone,
    title: 'Phone',
    content: '+86-139-2243-0321',
    link: 'tel:+86-139-2243-0321'
  }, {
    icon: MapPin,
    title: 'Office',
    content: 'No. 119, Building 19, Changfeng International, 96 Li Xin No. 12 Road, Xin Tang Town, Zengcheng District, Guangzhou City',
    link: null
  }, {
    icon: Clock,
    title: 'Support hours',
    content: 'Monday - Friday, 8:00 AM - 6:00 PM EST',
    link: null
  }];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="py-20 bg-secondary text-secondary-foreground">
        <div className="section-container">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6 }} 
            className="max-w-3xl"
          >
            <h1 
              className="text-4xl md:text-5xl font-bold leading-tight mb-6" 
              style={{ letterSpacing: '-0.02em', textWrap: 'balance' }}
            >
              Get in touch
            </h1>
            <p className="text-lg leading-relaxed opacity-90">
              Have questions about our platform or services? Our team is here to help you get started with professional trading.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 bg-background">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl font-semibold mb-6">Send us a message</h2>
              <ContactForm />
            </motion.div>

            {/* Contact Information */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-2xl font-semibold mb-6">Contact information</h2>
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="p-3 bg-primary/10 rounded-xl flex-shrink-0">
                      <info.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">{info.title}</h3>
                      {info.link ? (
                        <a href={info.link} className="text-muted-foreground hover:text-primary transition-colors duration-200">
                          {info.content}
                        </a>
                      ) : (
                        <p className="text-muted-foreground">{info.content}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12 p-6 bg-muted rounded-xl">
                <h3 className="font-semibold mb-3">Need immediate assistance?</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  Our support team is available during business hours to help with account setup, platform questions, and technical issues.
                </p>
                <p className="text-sm text-muted-foreground">
                  For urgent trading-related inquiries, please call our support line directly.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-24 bg-muted">
        <div className="section-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold mb-4" style={{ textWrap: 'balance' }}>
              Visit our office
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Located in the heart of Zengcheng, Guangdong, our office is open for scheduled appointments.
            </p>
          </div>
          <div className="bg-card rounded-2xl overflow-hidden shadow-lg h-96">
            <iframe
              src="https://www.openstreetmap.org/export/embed.html?bbox=113.611934%2C23.144870%2C113.621934%2C23.154870&layer=mapnik&marker=23.149870%2C113.616934"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              title="JINYU Global office location"
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  );
}
