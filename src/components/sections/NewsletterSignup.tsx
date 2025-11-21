'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  Mail,
  Send,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Bell,
  Loader2,
} from 'lucide-react';

export function NewsletterSignup() {
  const [email, setEmail] = React.useState('');
  const [status, setStatus] = React.useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');
  const [error, setError] = React.useState('');

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setError('Email is required');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email');
      return;
    }

    setStatus('loading');
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // In production, send to your newsletter service
      console.log('Newsletter signup:', email);

      setStatus('success');
      setEmail('');

      // Reset after 5 seconds
      setTimeout(() => {
        setStatus('idle');
      }, 5000);
    } catch {
      setStatus('error');
      setError('Something went wrong. Please try again.');
    }
  };

  const benefits = [
    'Weekly insights on React & TypeScript',
    'Exclusive tutorials and code examples',
    'Career advice and industry trends',
    'Early access to new content',
  ];

  return (
    <Card className="bg-gradient-to-br from-mocha-50 to-navy-50 dark:from-mocha-900/20 dark:to-navy-900/20 border-mocha-200 dark:border-mocha-800 overflow-hidden">
      <CardContent className="pt-8 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Content Side */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-mocha-500 to-navy-600 text-white">
                <Bell className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Stay Updated</h3>
                <p className="text-sm text-muted-foreground">
                  Join {Math.floor(Math.random() * 500 + 500)}+ developers
                </p>
              </div>
            </div>

            <p className="text-muted-foreground">
              Get weekly insights on modern web development, best practices, and
              career growth delivered straight to your inbox.
            </p>

            <ul className="space-y-2">
              {benefits.map((benefit, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-2 text-sm"
                >
                  <CheckCircle className="h-4 w-4 text-success-600 shrink-0" />
                  <span>{benefit}</span>
                </motion.li>
              ))}
            </ul>

            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              No spam, unsubscribe anytime
            </p>
          </div>

          {/* Form Side */}
          <div>
            <AnimatePresence mode="wait">
              {status === 'success' ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="text-center py-8"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.2 }}
                  >
                    <CheckCircle className="h-16 w-16 text-success-600 mx-auto mb-4" />
                  </motion.div>
                  <h4 className="text-xl font-semibold mb-2">
                    Welcome aboard! 🎉
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Check your inbox to confirm your subscription.
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={e => {
                          setEmail(e.target.value);
                          setError('');
                        }}
                        className={`pl-10 ${error ? 'border-destructive' : ''}`}
                        disabled={status === 'loading'}
                        inputSize="lg"
                      />
                    </div>
                    {error && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xs text-destructive flex items-center gap-1"
                      >
                        <AlertCircle className="h-3 w-3" />
                        {error}
                      </motion.p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    disabled={status === 'loading'}
                  >
                    {status === 'loading' ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Subscribing...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Subscribe to Newsletter
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    By subscribing, you agree to receive emails from me. Your
                    data is safe and you can unsubscribe anytime.
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
