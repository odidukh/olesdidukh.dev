// src/components/ColorShowcase.tsx
'use client';

import React from 'react';

const ColorShowcase: React.FC = () => {
  return (
    <div className="min-h-screen bg-white p-4 sm:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Elite Developer Portfolio
          </h1>
          <h2 className="text-2xl sm:text-3xl font-semibold text-mocha-600 mb-4">
            Mocha Mousse 2025 Color System
          </h2>
          <p className="text-lg text-gray-600 mb-2">
            Professional Color Palette with Tailwind CSS v4
          </p>
          <p className="text-sm text-gray-500">
            Testing custom design tokens and color system integration
          </p>
        </div>

        {/* Mocha Mousse Palette */}
        <section className="mb-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">
            🎨 Mocha Mousse 2025 - Primary Brand Palette
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-10 gap-3">
            <div className="bg-mocha-50 rounded-lg p-4 text-center shadow-sm border">
              <div className="h-16 rounded mb-2 bg-mocha-50"></div>
              <div className="text-xs font-semibold text-mocha-900">50</div>
              <div className="text-xs text-mocha-700">#faf9f7</div>
            </div>
            <div className="bg-mocha-100 rounded-lg p-4 text-center shadow-sm border">
              <div className="h-16 rounded mb-2 bg-mocha-100"></div>
              <div className="text-xs font-semibold text-mocha-900">100</div>
              <div className="text-xs text-mocha-700">#f3f0eb</div>
            </div>
            <div className="bg-mocha-200 rounded-lg p-4 text-center shadow-sm border">
              <div className="h-16 rounded mb-2 bg-mocha-200"></div>
              <div className="text-xs font-semibold text-mocha-900">200</div>
              <div className="text-xs text-mocha-700">#e7ddd2</div>
            </div>
            <div className="bg-mocha-300 rounded-lg p-4 text-center shadow-sm border">
              <div className="h-16 rounded mb-2 bg-mocha-300"></div>
              <div className="text-xs font-semibold text-mocha-900">300</div>
              <div className="text-xs text-mocha-700">#d4c4b0</div>
            </div>
            <div className="bg-mocha-400 rounded-lg p-4 text-center shadow-sm border">
              <div className="h-16 rounded mb-2 bg-mocha-400"></div>
              <div className="text-xs font-semibold text-white">400</div>
              <div className="text-xs text-white">#bfa58a</div>
            </div>
            <div className="bg-mocha-500 rounded-lg p-4 text-center shadow-sm border">
              <div className="h-16 rounded mb-2 bg-mocha-500"></div>
              <div className="text-xs font-semibold text-white">500 ⭐</div>
              <div className="text-xs text-white">#a47864</div>
            </div>
            <div className="bg-mocha-600 rounded-lg p-4 text-center shadow-sm border">
              <div className="h-16 rounded mb-2 bg-mocha-600"></div>
              <div className="text-xs font-semibold text-white">600</div>
              <div className="text-xs text-white">#8f6451</div>
            </div>
            <div className="bg-mocha-700 rounded-lg p-4 text-center shadow-sm border">
              <div className="h-16 rounded mb-2 bg-mocha-700"></div>
              <div className="text-xs font-semibold text-white">700</div>
              <div className="text-xs text-white">#755143</div>
            </div>
            <div className="bg-mocha-800 rounded-lg p-4 text-center shadow-sm border">
              <div className="h-16 rounded mb-2 bg-mocha-800"></div>
              <div className="text-xs font-semibold text-white">800</div>
              <div className="text-xs text-white">#614439</div>
            </div>
            <div className="bg-mocha-900 rounded-lg p-4 text-center shadow-sm border">
              <div className="h-16 rounded mb-2 bg-mocha-900"></div>
              <div className="text-xs font-semibold text-white">900</div>
              <div className="text-xs text-white">#523a32</div>
            </div>
          </div>
        </section>

        {/* Navy Professional Palette */}
        <section className="mb-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">
            ⚓ Navy Professional Palette
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-3">
            <div className="bg-navy-50 rounded-lg p-4 text-center shadow-sm border">
              <div className="h-16 rounded mb-2 bg-navy-50"></div>
              <div className="text-xs font-semibold text-navy-900">50</div>
              <div className="text-xs text-navy-700">#f0f4f8</div>
            </div>
            <div className="bg-navy-100 rounded-lg p-4 text-center shadow-sm border">
              <div className="h-16 rounded mb-2 bg-navy-100"></div>
              <div className="text-xs font-semibold text-navy-900">100</div>
              <div className="text-xs text-navy-700">#d9e2ec</div>
            </div>
            <div className="bg-navy-300 rounded-lg p-4 text-center shadow-sm border">
              <div className="h-16 rounded mb-2 bg-navy-300"></div>
              <div className="text-xs font-semibold text-navy-900">300</div>
              <div className="text-xs text-navy-800">#9fb3c8</div>
            </div>
            <div className="bg-navy-500 rounded-lg p-4 text-center shadow-sm border">
              <div className="h-16 rounded mb-2 bg-navy-500"></div>
              <div className="text-xs font-semibold text-white">500 ⭐</div>
              <div className="text-xs text-white">#627d98</div>
            </div>
            <div className="bg-navy-600 rounded-lg p-4 text-center shadow-sm border">
              <div className="h-16 rounded mb-2 bg-navy-600"></div>
              <div className="text-xs font-semibold text-white">600</div>
              <div className="text-xs text-white">#486581</div>
            </div>
            <div className="bg-navy-700 rounded-lg p-4 text-center shadow-sm border">
              <div className="h-16 rounded mb-2 bg-navy-700"></div>
              <div className="text-xs font-semibold text-white">700</div>
              <div className="text-xs text-white">#334e68</div>
            </div>
            <div className="bg-navy-800 rounded-lg p-4 text-center shadow-sm border">
              <div className="h-16 rounded mb-2 bg-navy-800"></div>
              <div className="text-xs font-semibold text-white">800</div>
              <div className="text-xs text-white">#243b53</div>
            </div>
            <div className="bg-navy-900 rounded-lg p-4 text-center shadow-sm border">
              <div className="h-16 rounded mb-2 bg-navy-900"></div>
              <div className="text-xs font-semibold text-white">900</div>
              <div className="text-xs text-white">#102a43</div>
            </div>
            <div className="bg-navy-950 rounded-lg p-4 text-center shadow-sm border">
              <div className="h-16 rounded mb-2 bg-navy-950"></div>
              <div className="text-xs font-semibold text-white">950</div>
              <div className="text-xs text-white">#0a192f</div>
            </div>
          </div>
        </section>

        {/* Semantic Colors */}
        <section className="mb-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">
            🎯 Semantic Color System
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Success Colors */}
            <div className="space-y-3">
              <h4 className="font-semibold text-success-700 text-lg">
                ✅ Success
              </h4>
              <div className="bg-success-50 border border-success-200 rounded-lg p-3 text-center">
                <div className="text-xs font-semibold text-success-800">
                  success-50
                </div>
                <div className="text-xs text-success-600">#ecfdf5</div>
              </div>
              <div className="bg-success-500 rounded-lg p-3 text-center text-white">
                <div className="text-xs font-semibold">success-500 ⭐</div>
                <div className="text-xs">#10b981</div>
              </div>
              <div className="bg-success-700 rounded-lg p-3 text-center text-white">
                <div className="text-xs font-semibold">success-700</div>
                <div className="text-xs">#047857</div>
              </div>
            </div>

            {/* Warning Colors */}
            <div className="space-y-3">
              <h4 className="font-semibold text-warning-700 text-lg">
                ⚠️ Warning
              </h4>
              <div className="bg-warning-50 border border-warning-200 rounded-lg p-3 text-center">
                <div className="text-xs font-semibold text-warning-800">
                  warning-50
                </div>
                <div className="text-xs text-warning-600">#fffbeb</div>
              </div>
              <div className="bg-warning-500 rounded-lg p-3 text-center text-white">
                <div className="text-xs font-semibold">warning-500 ⭐</div>
                <div className="text-xs">#f59e0b</div>
              </div>
              <div className="bg-warning-700 rounded-lg p-3 text-center text-white">
                <div className="text-xs font-semibold">warning-700</div>
                <div className="text-xs">#b45309</div>
              </div>
            </div>

            {/* Error Colors */}
            <div className="space-y-3">
              <h4 className="font-semibold text-error-700 text-lg">❌ Error</h4>
              <div className="bg-error-50 border border-error-200 rounded-lg p-3 text-center">
                <div className="text-xs font-semibold text-error-800">
                  error-50
                </div>
                <div className="text-xs text-error-600">#fef2f2</div>
              </div>
              <div className="bg-error-500 rounded-lg p-3 text-center text-white">
                <div className="text-xs font-semibold">error-500 ⭐</div>
                <div className="text-xs">#ef4444</div>
              </div>
              <div className="bg-error-700 rounded-lg p-3 text-center text-white">
                <div className="text-xs font-semibold">error-700</div>
                <div className="text-xs">#b91c1c</div>
              </div>
            </div>

            {/* Info Colors */}
            <div className="space-y-3">
              <h4 className="font-semibold text-info-700 text-lg">ℹ️ Info</h4>
              <div className="bg-info-50 border border-info-200 rounded-lg p-3 text-center">
                <div className="text-xs font-semibold text-info-800">
                  info-50
                </div>
                <div className="text-xs text-info-600">#eff6ff</div>
              </div>
              <div className="bg-info-500 rounded-lg p-3 text-center text-white">
                <div className="text-xs font-semibold">info-500 ⭐</div>
                <div className="text-xs">#3b82f6</div>
              </div>
              <div className="bg-info-700 rounded-lg p-3 text-center text-white">
                <div className="text-xs font-semibold">info-700</div>
                <div className="text-xs">#1d4ed8</div>
              </div>
            </div>
          </div>
        </section>

        {/* Gradient Examples */}
        <section className="mb-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">
            🌈 Gradient Combinations
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              className="rounded-lg p-6 text-white shadow-lg text-center"
              style={{
                background: 'linear-gradient(135deg, #a47864 0%, #486581 100%)',
              }}
            >
              <h4 className="font-semibold text-lg mb-2">Primary Gradient</h4>
              <p className="text-sm opacity-90">Mocha 500 → Navy 600</p>
            </div>
            <div
              className="rounded-lg p-6 text-white shadow-lg text-center"
              style={{
                background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',
              }}
            >
              <h4 className="font-semibold text-lg mb-2">Success → Info</h4>
              <p className="text-sm opacity-90">Fresh & Professional</p>
            </div>
            <div
              className="rounded-lg p-6 text-white shadow-lg text-center"
              style={{
                background: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
              }}
            >
              <h4 className="font-semibold text-lg mb-2">Warm Gradient</h4>
              <p className="text-sm opacity-90">Warning → Error</p>
            </div>
          </div>
        </section>

        {/* Interactive Elements */}
        <section className="mb-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">
            🎯 Interactive Elements
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="bg-mocha-500 hover:bg-mocha-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-mocha-500 focus:ring-offset-2">
              Primary Button
            </button>
            <button className="bg-navy-500 hover:bg-navy-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-navy-500 focus:ring-offset-2">
              Secondary Button
            </button>
            <button className="border-2 border-mocha-500 text-mocha-600 hover:bg-mocha-50 px-6 py-3 rounded-lg font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-mocha-500 focus:ring-offset-2">
              Outline Button
            </button>
            <button className="bg-success-500 hover:bg-success-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-success-500 focus:ring-offset-2">
              Success Button
            </button>
          </div>
        </section>

        {/* Status Indicator */}
        <section className="text-center">
          <div className="inline-block bg-success-50 border-2 border-success-200 rounded-xl p-6">
            <div className="flex items-center justify-center space-x-3 mb-3">
              <div className="w-4 h-4 bg-success-500 rounded-full animate-pulse"></div>
              <span className="text-success-700 font-bold text-lg">
                ✅ Color System Successfully Loaded!
              </span>
            </div>
            <p className="text-success-600 text-sm">
              All Mocha Mousse 2025 colors are working perfectly with Tailwind
              CSS v4
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ColorShowcase;
