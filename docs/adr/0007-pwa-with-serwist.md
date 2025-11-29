# ADR-0007: Progressive Web App with Serwist

**Date**: 2024-11-15
**Status**: Accepted
**Deciders**: Oles Didukh

## Context

The portfolio should work offline and provide app-like experience:

- Offline access to static content
- Install prompt for app-like experience
- Smart caching for performance
- Background sync for forms

Requirements:

- Service worker with sensible caching
- Web App Manifest for installability
- Offline fallback page
- Integration with Next.js build

## Decision

Use Serwist (modern successor to next-pwa, built on Workbox) for PWA functionality.

### Caching Strategies

| Resource Type   | Strategy             | Rationale                           |
| --------------- | -------------------- | ----------------------------------- |
| Google Fonts    | CacheFirst           | Rarely change, optimize performance |
| Static Images   | CacheFirst           | Immutable content                   |
| External Images | StaleWhileRevalidate | May update, show cached immediately |
| JS/CSS          | StaleWhileRevalidate | Quick updates, fast initial load    |
| API Routes      | NetworkFirst         | Fresh data priority                 |
| Pages           | NetworkFirst         | Fresh content priority              |

## Consequences

### Positive

- Offline access to portfolio
- App-like installation on mobile/desktop
- Improved repeat visit performance
- Better perceived performance with caching
- Aligns with modern web standards

### Negative

- Build requires webpack (Turbopack not supported)
- Cache invalidation complexity
- Service worker debugging can be tricky

### Neutral

- Need to generate PWA icons
- Manifest configuration required

## Implementation

Files created:

- `/src/app/sw.ts` - Service worker configuration
- `/src/app/offline/page.tsx` - Offline fallback
- `/public/manifest.json` - Web App Manifest
- `/src/components/pwa/PWAInstallPrompt.tsx` - Install prompt UI
- `/src/hooks/usePWAInstall.ts` - Install logic hook

## Alternatives Considered

### Option A: next-pwa

Popular Next.js PWA plugin.

**Pros**: Simple setup, widely used
**Cons**: Unmaintained, compatibility issues with App Router

### Option B: Manual Service Worker

Hand-written service worker.

**Pros**: Full control, no dependencies
**Cons**: Complex, error-prone, no tooling

### Option C: No PWA

Static site without offline support.

**Pros**: Simpler build, no caching issues
**Cons**: No offline access, worse mobile experience

## References

- [Serwist Documentation](https://serwist.pages.dev/)
- [Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
