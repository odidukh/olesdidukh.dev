'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useAnalytics } from '@/hooks';
import { trackContactFormConversion } from '@/lib/conversions';
import { Button } from '@/components/ui/Button';
import { FormInput, FormTextarea } from '@/components/ui/FormField';
import { Badge } from '@/components/ui/Badge';
import {
  User,
  Mail,
  Phone,
  Building,
  Send,
  Loader2,
  CheckCircle,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

interface FormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  projectType: string;
  budget: string;
  timeline: string;
  message: string;
  // Honeypot field - should remain empty (bots will fill it)
  website: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
}

const projectTypes = [
  'Web Application',
  'E-Commerce Site',
  'SaaS Platform',
  'Mobile App',
  'UI/UX Design',
  'Consulting',
  'Other',
];

const budgetRanges = [
  'Under $5k',
  '$5k - $10k',
  '$10k - $25k',
  '$25k - $50k',
  '$50k+',
  'Not Sure',
];

const timelines = [
  'ASAP',
  '1-2 weeks',
  '1 month',
  '2-3 months',
  '3-6 months',
  'Flexible',
];

export function ContactForm() {
  const { trackFormSubmission } = useAnalytics();
  const [formData, setFormData] = React.useState<FormData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    projectType: '',
    budget: '',
    timeline: '',
    message: '',
    website: '', // Honeypot field
  });

  const [errors, setErrors] = React.useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitStatus, setSubmitStatus] = React.useState<
    'idle' | 'success' | 'error'
  >('idle');

  // Validation functions
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    if (!phone) return true; // Phone is optional
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.phone && !validatePhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear error for this field when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }

    // Real-time validation for email
    if (field === 'email' && value && !validateEmail(value)) {
      setErrors(prev => ({ ...prev, email: 'Please enter a valid email' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Honeypot check - if filled, it's likely a bot
    if (formData.website) {
      // Silently "succeed" to not alert bots
      setSubmitStatus('success');
      toast.success('Message sent successfully!');
      return;
    }

    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      setSubmitStatus('success');
      toast.success('Message sent successfully!', {
        description: "I'll get back to you within 24 hours.",
      });

      // Track successful form submission
      trackFormSubmission('contact_form', 'success', {
        projectType: formData.projectType || 'not_specified',
        budget: formData.budget || 'not_specified',
        timeline: formData.timeline || 'not_specified',
        hasCompany: !!formData.company,
        hasPhone: !!formData.phone,
      });

      // Track conversion across all analytics platforms
      trackContactFormConversion({
        projectType: formData.projectType || 'not_specified',
        budget: formData.budget || 'not_specified',
      });

      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          projectType: '',
          budget: '',
          timeline: '',
          message: '',
          website: '',
        });
        setSubmitStatus('idle');
      }, 3000);
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
      toast.error('Failed to send message', {
        description:
          'Please try again or email me directly at oles.didukh@gmail.com',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Honeypot field - hidden from users, bots will fill it */}
      <div className="absolute -left-[9999px] opacity-0" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input
          type="text"
          id="website"
          name="website"
          value={formData.website}
          onChange={e => handleInputChange('website', e.target.value)}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {/* Personal Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label="Full Name"
          required
          placeholder="John Doe"
          leftIcon={<User className="h-4 w-4" />}
          value={formData.name}
          onChange={e => handleInputChange('name', e.target.value)}
          error={errors.name}
          disabled={isSubmitting}
        />

        <FormInput
          label="Email Address"
          type="email"
          required
          placeholder="john@example.com"
          leftIcon={<Mail className="h-4 w-4" />}
          value={formData.email}
          onChange={e => handleInputChange('email', e.target.value)}
          error={errors.email}
          disabled={isSubmitting}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label="Phone Number"
          type="tel"
          optional
          placeholder="+1 (555) 000-0000"
          leftIcon={<Phone className="h-4 w-4" />}
          value={formData.phone}
          onChange={e => handleInputChange('phone', e.target.value)}
          error={errors.phone}
          disabled={isSubmitting}
        />

        <FormInput
          label="Company/Organization"
          optional
          placeholder="Acme Inc."
          leftIcon={<Building className="h-4 w-4" />}
          value={formData.company}
          onChange={e => handleInputChange('company', e.target.value)}
          disabled={isSubmitting}
        />
      </div>

      {/* Project Type */}
      <div>
        <label className="text-sm font-medium mb-3 block">
          Project Type
          <span className="text-muted-foreground ml-1">(optional)</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {projectTypes.map(type => (
            <Badge
              key={type}
              variant={formData.projectType === type ? 'default' : 'outline'}
              className="cursor-pointer transition-all hover:scale-105"
              onClick={() => handleInputChange('projectType', type)}
            >
              {type}
            </Badge>
          ))}
        </div>
      </div>

      {/* Budget & Timeline */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium mb-3 block">
            Budget Range
            <span className="text-muted-foreground ml-1">(optional)</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            {budgetRanges.map(range => (
              <Badge
                key={range}
                variant={formData.budget === range ? 'default' : 'outline'}
                className="cursor-pointer transition-all hover:scale-105 justify-center"
                onClick={() => handleInputChange('budget', range)}
              >
                {range}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mb-3 block">
            Timeline
            <span className="text-muted-foreground ml-1">(optional)</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            {timelines.map(time => (
              <Badge
                key={time}
                variant={formData.timeline === time ? 'default' : 'outline'}
                className="cursor-pointer transition-all hover:scale-105 justify-center"
                onClick={() => handleInputChange('timeline', time)}
              >
                {time}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Message */}
      <div>
        <FormTextarea
          label="Project Details"
          required
          placeholder="Tell me about your project goals, target audience, and any specific requirements..."
          value={formData.message}
          onChange={e => handleInputChange('message', e.target.value)}
          error={errors.message}
          disabled={isSubmitting}
          rows={4}
        />
        <p className="text-xs text-muted-foreground mt-1">
          Please provide as much detail as possible so I can better understand
          your needs.
        </p>
      </div>

      {/* Submit Button & Status */}
      <div className="space-y-4">
        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending Message...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Send Message
            </>
          )}
        </Button>

        {/* Status Messages */}
        <AnimatePresence>
          {submitStatus === 'success' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-2 p-3 bg-success-50 dark:bg-success-900/20 text-success-600 dark:text-success-400 rounded-lg"
            >
              <CheckCircle className="h-5 w-5" />
              <span className="text-sm font-medium">
                Message sent successfully! I&apos;ll get back to you within 24
                hours.
              </span>
            </motion.div>
          )}

          {submitStatus === 'error' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-2 p-3 bg-destructive-50 dark:bg-destructive-900/20 text-destructive-600 dark:text-destructive-400 rounded-lg"
            >
              <AlertCircle className="h-5 w-5" />
              <span className="text-sm font-medium">
                Something went wrong. Please try again or email me directly.
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Privacy Note */}
      <p className="text-xs text-muted-foreground text-center">
        <Sparkles className="inline h-3 w-3 mr-1" />
        Your information is kept confidential and will only be used to respond
        to your inquiry.
      </p>
    </form>
  );
}
