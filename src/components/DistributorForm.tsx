"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

export default function DistributorForm() {
  const [formData, setFormData] = useState({
    company_name: '',
    contact_person_name: '',
    email: '',
    phone: '',
    country_region: '',
    business_type: '',
    business_experience: '',
    product_categories: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, business_type: value }));
    if (errors.business_type) {
      setErrors(prev => ({ ...prev, business_type: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.company_name.trim()) newErrors.company_name = 'Company name is required';
    if (!formData.contact_person_name.trim()) newErrors.contact_person_name = 'Contact person is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.country_region.trim()) newErrors.country_region = 'Country/Region is required';
    if (!formData.business_type) newErrors.business_type = 'Business type is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fill in all required fields correctly.');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Map form fields to API fields
      const apiData = {
        company_name: formData.company_name,
        country: formData.country_region,
        business_type: formData.business_type,
        contact_name: formData.contact_person_name,
        email: formData.email,
        phone: formData.phone,
        experience: formData.business_experience,
        products: formData.product_categories,
        message: formData.message,
      };

      const response = await fetch('/api/distributor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit application');
      }
      
      toast.success('Application submitted successfully. Our team will review and contact you shortly.');
      
      setFormData({
        company_name: '',
        contact_person_name: '',
        email: '',
        phone: '',
        country_region: '',
        business_type: '',
        business_experience: '',
        product_categories: '',
        message: ''
      });
    } catch (error: any) {
      console.error('Form submission error:', error);
      toast.error(error.message || 'Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-card text-card-foreground p-8 rounded-2xl shadow-sm border">
      <div className="space-y-6">
        <h3 className="text-xl font-semibold border-b pb-2">Company Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="company_name">Company Name *</Label>
            <Input
              id="company_name"
              name="company_name"
              value={formData.company_name}
              onChange={handleChange}
              className="mt-2"
              placeholder="e.g. Global Lighting Corp"
            />
            {errors.company_name && <p className="text-sm text-destructive mt-1">{errors.company_name}</p>}
          </div>

          <div>
            <Label htmlFor="country_region">Country / Region *</Label>
            <Input
              id="country_region"
              name="country_region"
              value={formData.country_region}
              onChange={handleChange}
              className="mt-2"
              placeholder="e.g. United States"
            />
            {errors.country_region && <p className="text-sm text-destructive mt-1">{errors.country_region}</p>}
          </div>

          <div>
            <Label htmlFor="business_type">Business Type *</Label>
            <div className="mt-2">
              <Select value={formData.business_type} onValueChange={handleSelectChange}>
                <SelectTrigger id="business_type" className={errors.business_type ? "border-destructive" : ""}>
                  <SelectValue placeholder="Select business type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Distributor">Distributor</SelectItem>
                  <SelectItem value="Wholesaler">Wholesaler</SelectItem>
                  <SelectItem value="Contractor">Contractor</SelectItem>
                  <SelectItem value="Brand">Brand</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {errors.business_type && <p className="text-sm text-destructive mt-1">{errors.business_type}</p>}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-semibold border-b pb-2">Contact Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="contact_person_name">Contact Person *</Label>
            <Input
              id="contact_person_name"
              name="contact_person_name"
              value={formData.contact_person_name}
              onChange={handleChange}
              className="mt-2"
              placeholder="Full name"
            />
            {errors.contact_person_name && <p className="text-sm text-destructive mt-1">{errors.contact_person_name}</p>}
          </div>

          <div>
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-2"
              placeholder="work@company.com"
            />
            {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}
          </div>

          <div>
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              className="mt-2"
              placeholder="+1 (555) 000-0000"
            />
            {errors.phone && <p className="text-sm text-destructive mt-1">{errors.phone}</p>}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-semibold border-b pb-2">Business Profile</h3>
        
        <div>
          <Label htmlFor="business_experience">Current Business Experience</Label>
          <Textarea
            id="business_experience"
            name="business_experience"
            value={formData.business_experience}
            onChange={handleChange}
            className="mt-2 min-h-[100px]"
            placeholder="Briefly describe your current operations, years in business, and market reach..."
          />
        </div>

        <div>
          <Label htmlFor="product_categories">Product Categories of Interest</Label>
          <Textarea
            id="product_categories"
            name="product_categories"
            value={formData.product_categories}
            onChange={handleChange}
            className="mt-2 min-h-[100px]"
            placeholder="Which Jinyu product lines are you most interested in distributing?"
          />
        </div>

        <div>
          <Label htmlFor="message">Additional Information</Label>
          <Textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            className="mt-2 min-h-[100px]"
            placeholder="Any other details you'd like to share with our team..."
          />
        </div>
      </div>

      <Button 
        type="submit" 
        size="lg"
        className="w-full md:w-auto"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Submitting Application...' : 'Submit Application'}
      </Button>
    </form>
  );
}
