# ADR-0001: Use Next.js App Router

**Date**: 2024-01-15
**Status**: Accepted
**Deciders**: Oles Didukh

## Context

The portfolio website needed a modern React framework that provides:

- Server-side rendering for SEO
- Static site generation for performance
- Built-in routing and code splitting
- TypeScript support
- Image optimization
- API routes

At the time of decision, Next.js was available with both the Pages Router (stable) and the new App Router (production-ready in Next.js 13.4+).

## Decision

Use Next.js with the App Router architecture, leveraging:

- React Server Components for improved performance
- File-based routing with `app/` directory
- Built-in layouts and templates
- Streaming and Suspense support
- Turbopack for faster development builds

## Consequences

### Positive

- Better SEO with server-side rendering by default
- Improved performance with React Server Components
- Cleaner routing structure with nested layouts
- Built-in streaming for improved perceived performance
- Future-proof architecture aligned with React's direction

### Negative

- Learning curve for Server Components paradigm
- Some third-party libraries need adaptation
- More complex mental model for data fetching
- Turbopack still maturing (some features require webpack)

### Neutral

- Need to explicitly mark client components with `'use client'`
- Different caching behavior than Pages Router

## Alternatives Considered

### Option A: Next.js Pages Router

Traditional Next.js routing system.

**Pros**: More stable, extensive documentation, wider community support
**Cons**: Less performant, not aligned with React's future direction

### Option B: Remix

Full-stack React framework with nested routing.

**Pros**: Excellent data loading patterns, good error boundaries
**Cons**: Smaller ecosystem, less Vercel integration

### Option C: Gatsby

Static site generator with GraphQL data layer.

**Pros**: Excellent for static content, rich plugin ecosystem
**Cons**: GraphQL complexity for simple use cases, slower builds

## References

- [Next.js App Router Documentation](https://nextjs.org/docs/app)
- [React Server Components RFC](https://github.com/reactjs/rfcs/blob/main/text/0188-server-components.md)
