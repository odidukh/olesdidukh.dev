'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import Link from 'next/link';

export default function DesignSystemPage() {
  const [isDark, setIsDark] = useState(false);

  // Sync state with actual dark mode on mount
  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  const toggleDarkMode = () => {
    const newDarkState = !isDark;
    setIsDark(newDarkState);
    document.documentElement.classList.toggle('dark', newDarkState);
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-5xl font-bold text-gray-900 dark:text-gray-50 mb-2">
                  Design System
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-400">
                  Mocha Mousse 2025 Professional Palette
                </p>
              </div>
              <Button onClick={toggleDarkMode} variant="outline">
                {isDark ? '☀️ Light Mode' : '🌙 Dark Mode'}
              </Button>
            </div>
            <div className="h-1 bg-gradient-primary rounded-full w-32"></div>
          </div>
          <Container size="wide" padding="lg" className="mb-8">
            <div className="flex gap-4 p-4 bg-muted rounded-lg">
              <Button variant="secondary" size="sm" asChild>
                <Link href="/">Button Components</Link>
              </Button>
              <Button variant="secondary" size="sm" asChild>
                <Link href="/layout-demo">Layout Components</Link>
              </Button>
              <Button variant="secondary" size="sm" asChild>
                <Link href="/design-system">Design System</Link>
              </Button>
            </div>
          </Container>

          {/* Colors Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-50 mb-8">
              Color Palette
            </h2>

            {/* Mocha Mousse Colors */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Mocha Mousse 2025 (Primary Brand)
              </h3>
              <div className="grid grid-cols-5 md:grid-cols-10 gap-3">
                {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map(
                  shade => (
                    <div key={shade} className="text-center">
                      <div
                        className={`h-20 rounded-lg shadow-md mb-2 bg-mocha-${shade} border border-gray-200 dark:border-gray-700`}
                      />
                      <p className="text-xs text-gray-600 dark:text-gray-400 font-mono">
                        {shade}
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Navy Colors */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Navy Accent System
              </h3>
              <div className="grid grid-cols-5 md:grid-cols-10 gap-3">
                {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map(
                  shade => (
                    <div key={shade} className="text-center">
                      <div
                        className={`h-20 rounded-lg shadow-md mb-2 bg-navy-${shade} border border-gray-200 dark:border-gray-700`}
                      />
                      <p className="text-xs text-gray-600 dark:text-gray-400 font-mono">
                        {shade}
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Semantic Colors */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Semantic Colors
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-6 rounded-xl bg-success-50 dark:bg-success-900/20 border border-success-200 dark:border-success-800">
                  <div className="w-12 h-12 rounded-lg bg-success-500 mb-3"></div>
                  <p className="font-semibold text-success-700 dark:text-success-400">
                    Success
                  </p>
                  <p className="text-sm text-success-600 dark:text-success-500 font-mono">
                    #10b981
                  </p>
                </div>
                <div className="p-6 rounded-xl bg-warning-50 dark:bg-warning-900/20 border border-warning-200 dark:border-warning-800">
                  <div className="w-12 h-12 rounded-lg bg-warning-500 mb-3"></div>
                  <p className="font-semibold text-warning-700 dark:text-warning-400">
                    Warning
                  </p>
                  <p className="text-sm text-warning-600 dark:text-warning-500 font-mono">
                    #f59e0b
                  </p>
                </div>
                <div className="p-6 rounded-xl bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800">
                  <div className="w-12 h-12 rounded-lg bg-error-500 mb-3"></div>
                  <p className="font-semibold text-error-700 dark:text-error-400">
                    Error
                  </p>
                  <p className="text-sm text-error-600 dark:text-error-500 font-mono">
                    #ef4444
                  </p>
                </div>
                <div className="p-6 rounded-xl bg-info-50 dark:bg-info-900/20 border border-info-200 dark:border-info-800">
                  <div className="w-12 h-12 rounded-lg bg-info-500 mb-3"></div>
                  <p className="font-semibold text-info-700 dark:text-info-400">
                    Info
                  </p>
                  <p className="text-sm text-info-600 dark:text-info-500 font-mono">
                    #3b82f6
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Typography Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-50 mb-8">
              Typography Scale
            </h2>
            <div className="space-y-4 bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
              <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  7xl
                </p>
                <p className="text-7xl font-bold text-gray-900 dark:text-gray-50">
                  The quick brown fox
                </p>
              </div>
              <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  6xl
                </p>
                <p className="text-6xl font-bold text-gray-900 dark:text-gray-50">
                  The quick brown fox
                </p>
              </div>
              <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  5xl
                </p>
                <p className="text-5xl font-bold text-gray-900 dark:text-gray-50">
                  The quick brown fox
                </p>
              </div>
              <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  4xl
                </p>
                <p className="text-4xl font-bold text-gray-900 dark:text-gray-50">
                  The quick brown fox jumps
                </p>
              </div>
              <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  3xl
                </p>
                <p className="text-3xl font-semibold text-gray-900 dark:text-gray-50">
                  The quick brown fox jumps over
                </p>
              </div>
              <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  2xl
                </p>
                <p className="text-2xl text-gray-900 dark:text-gray-50">
                  The quick brown fox jumps over the lazy dog
                </p>
              </div>
              <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  xl
                </p>
                <p className="text-xl text-gray-900 dark:text-gray-50">
                  The quick brown fox jumps over the lazy dog
                </p>
              </div>
              <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  lg
                </p>
                <p className="text-lg text-gray-900 dark:text-gray-50">
                  The quick brown fox jumps over the lazy dog
                </p>
              </div>
              <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  base
                </p>
                <p className="text-base text-gray-900 dark:text-gray-50">
                  The quick brown fox jumps over the lazy dog
                </p>
              </div>
              <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  sm
                </p>
                <p className="text-sm text-gray-900 dark:text-gray-50">
                  The quick brown fox jumps over the lazy dog
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  xs
                </p>
                <p className="text-xs text-gray-900 dark:text-gray-50">
                  The quick brown fox jumps over the lazy dog
                </p>
              </div>
            </div>
          </section>

          {/* Gradients Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-50 mb-8">
              Gradient System
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="h-40 rounded-2xl bg-gradient-primary shadow-xl flex items-center justify-center">
                <p className="text-white font-semibold text-xl">
                  Primary Gradient
                </p>
              </div>
              <div className="h-40 rounded-2xl bg-gradient-warm shadow-xl flex items-center justify-center">
                <p className="text-white font-semibold text-xl">
                  Warm Gradient
                </p>
              </div>
              <div className="h-40 rounded-2xl bg-gradient-cool shadow-xl flex items-center justify-center">
                <p className="text-white font-semibold text-xl">
                  Cool Gradient
                </p>
              </div>
              <div className="h-40 rounded-2xl bg-gradient-accent shadow-xl flex items-center justify-center">
                <p className="text-white font-semibold text-xl">
                  Accent Gradient
                </p>
              </div>
            </div>
          </section>

          {/* Shadows Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-50 mb-8">
              Elevation System
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {['xs', 'sm', 'base', 'md', 'lg', 'xl', '2xl', 'mocha'].map(
                size => (
                  <div
                    key={size}
                    className={`h-32 rounded-xl bg-white dark:bg-gray-800 shadow-${size} flex items-center justify-center`}
                  >
                    <p className="text-gray-600 dark:text-gray-400 font-mono text-sm">
                      shadow-{size}
                    </p>
                  </div>
                )
              )}
            </div>
          </section>

          {/* Buttons Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-50 mb-8">
              Button Variants (From Day 1)
            </h2>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50 mb-4">
                    Primary Variants
                  </h3>
                  <div className="flex flex-wrap gap-4">
                    <Button variant="default">Default</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="destructive">Destructive</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="ghost">Ghost</Button>
                    <Button variant="link">Link</Button>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50 mb-4">
                    Premium Variants
                  </h3>
                  <div className="flex flex-wrap gap-4">
                    <Button variant="gradient">Gradient</Button>
                    <Button variant="glow">Glow Effect</Button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Spacing Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-50 mb-8">
              Spacing Scale
            </h2>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg space-y-2">
              {[1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24].map(size => (
                <div key={size} className="flex items-center gap-4">
                  <span className="w-12 text-sm font-mono text-gray-600 dark:text-gray-400">
                    {size}
                  </span>
                  <div
                    className={`h-6 bg-mocha-500 rounded`}
                    style={{ width: `${size * 4}px` }}
                  />
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                    {size * 4}px
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Border Radius Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-50 mb-8">
              Border Radius
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                'none',
                'sm',
                'base',
                'md',
                'lg',
                'xl',
                '2xl',
                '3xl',
                'full',
              ].map(size => (
                <div key={size} className="text-center">
                  <div
                    className={`h-24 w-24 mx-auto bg-mocha-500 rounded-${size} mb-2 shadow-md`}
                  />
                  <p className="text-sm font-mono text-gray-600 dark:text-gray-400">
                    rounded-{size}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
