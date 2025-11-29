'use client';

import { WifiOff, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-navy-950 dark:to-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Offline Icon */}
        <div className="mx-auto w-24 h-24 rounded-full bg-mocha-100 dark:bg-navy-800 flex items-center justify-center">
          <WifiOff className="w-12 h-12 text-mocha-600 dark:text-mocha-400" />
        </div>

        {/* Content */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            You&apos;re Offline
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            It looks like you&apos;ve lost your internet connection. Some
            content may still be available from cache.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-mocha-500 text-white font-medium hover:bg-mocha-600 transition-colors focus:outline-none focus:ring-2 focus:ring-mocha-500 focus:ring-offset-2 dark:focus:ring-offset-navy-950"
          >
            <RefreshCw className="w-5 h-5" />
            Try Again
          </button>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-gray-300 dark:border-navy-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-navy-800 transition-colors focus:outline-none focus:ring-2 focus:ring-mocha-500 focus:ring-offset-2 dark:focus:ring-offset-navy-950"
          >
            <Home className="w-5 h-5" />
            Go Home
          </Link>
        </div>

        {/* Tips */}
        <div className="mt-8 p-4 rounded-lg bg-white dark:bg-navy-900 border border-gray-200 dark:border-navy-800">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Troubleshooting Tips
          </h2>
          <ul className="text-sm text-gray-600 dark:text-gray-400 text-left space-y-1">
            <li>• Check your Wi-Fi or mobile data connection</li>
            <li>• Try moving to a location with better signal</li>
            <li>• Disable airplane mode if enabled</li>
            <li>• Restart your router or device</li>
          </ul>
        </div>

        {/* Branding */}
        <p className="text-sm text-gray-500 dark:text-gray-500">
          Oles Didukh &mdash; Senior Front-End Engineer
        </p>
      </div>
    </div>
  );
}
