/// <reference lib="webworker" />

import { defaultCache } from '@serwist/next/worker';
import type {
  PrecacheEntry,
  SerwistGlobalConfig,
  RuntimeCaching,
} from 'serwist';
import {
  Serwist,
  CacheFirst,
  NetworkFirst,
  StaleWhileRevalidate,
} from 'serwist';

// This declares the value of `injectionPoint` to TypeScript.
// `injectionPoint` is the string that will be replaced by the
// temporary Serwist service worker during the build process.
declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

/**
 * Custom caching strategies for different asset types
 *
 * Strategy Overview:
 * - CacheFirst: Best for static assets that rarely change (fonts, icons)
 * - StaleWhileRevalidate: Good for assets that can be slightly stale (images)
 * - NetworkFirst: Best for dynamic content (API calls, pages)
 */
const customRuntimeCaching: RuntimeCaching[] = [
  // Google Fonts stylesheets
  {
    matcher: ({ url }) =>
      url.origin === 'https://fonts.googleapis.com' ||
      url.origin === 'https://fonts.gstatic.com',
    handler: new CacheFirst({
      cacheName: 'google-fonts',
      plugins: [
        {
          cacheWillUpdate: async ({ response }) => {
            // Only cache successful responses
            return response?.status === 200 ? response : null;
          },
        },
      ],
    }),
  },

  // Static images (cache first, long expiration)
  {
    matcher: ({ request, url }) =>
      request.destination === 'image' && url.origin === self.location.origin,
    handler: new CacheFirst({
      cacheName: 'static-images',
      plugins: [
        {
          cacheWillUpdate: async ({ response }) => {
            return response?.status === 200 ? response : null;
          },
        },
      ],
    }),
  },

  // External images (stale-while-revalidate)
  {
    matcher: ({ request, url }) =>
      request.destination === 'image' && url.origin !== self.location.origin,
    handler: new StaleWhileRevalidate({
      cacheName: 'external-images',
      plugins: [
        {
          cacheWillUpdate: async ({ response }) => {
            return response?.status === 200 ? response : null;
          },
        },
      ],
    }),
  },

  // Static JS and CSS (cache first)
  {
    matcher: ({ request }) =>
      request.destination === 'script' || request.destination === 'style',
    handler: new StaleWhileRevalidate({
      cacheName: 'static-resources',
    }),
  },

  // API routes - contact and newsletter should not be cached
  {
    matcher: ({ url }) =>
      url.pathname.startsWith('/api/contact') ||
      url.pathname.startsWith('/api/newsletter'),
    handler: new NetworkFirst({
      cacheName: 'api-no-cache',
      networkTimeoutSeconds: 10,
    }),
  },

  // Other API routes (network first with fallback)
  {
    matcher: ({ url }) => url.pathname.startsWith('/api/'),
    handler: new NetworkFirst({
      cacheName: 'api-cache',
      networkTimeoutSeconds: 10,
    }),
  },

  // Document pages (network first for fresh content)
  {
    matcher: ({ request }) => request.destination === 'document',
    handler: new NetworkFirst({
      cacheName: 'pages-cache',
      networkTimeoutSeconds: 10,
    }),
  },

  // Include default cache strategies from Serwist/Next.js
  ...defaultCache,
];

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST ?? [],
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: customRuntimeCaching,
  fallbacks: {
    entries: [
      {
        url: '/offline',
        matcher({ request }) {
          return request.destination === 'document';
        },
      },
    ],
  },
});

serwist.addEventListeners();

// Log service worker lifecycle events in development
if (process.env.NODE_ENV === 'development') {
  self.addEventListener('install', () => {
    console.log('[SW] Service Worker installed');
  });

  self.addEventListener('activate', () => {
    console.log('[SW] Service Worker activated');
  });
}
