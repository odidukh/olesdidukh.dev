# Implementation Plan: Performance & Architecture

This document outlines the step-by-step implementation for the 4 Performance & Architecture improvements identified in the analysis.

## 6. Edge Caching for API Routes

**Description:** Migrate `/api/contact` and rate-limiting to Vercel's Edge Runtime to reduce global latency.

**Steps:**

1. Open the relevant API route files (e.g., `src/app/api/contact/route.ts`).
2. At the top of the file, export the runtime configuration: `export const runtime = 'edge';`.
3. Verify that all dependencies used in the route are compatible with the Edge Runtime. Specifically, check the email provider SDK (e.g., Resend, SendGrid) and the rate-limiting library (Upstash Redis). Fortunately, Upstash Redis and Resend are generally Edge-compatible.
4. If using `nodemailer` (which relies on Node.js core modules), it will need to be replaced with a REST-based API client (like the standard Resend SDK) since Node core modules are not available on the Edge.
5. Deploy to a preview environment and thoroughly test the contact form to ensure the Edge function handles the request correctly.

## 7. Progressive Image Loading (Blurhash)

**Description:** Integrate `plaiceholder` to generate blur data URLs at build time for instant, aesthetic image placeholders before the full image loads.

**Steps:**

1. Install dependencies: `npm install plaiceholder sharp` (Note: `sharp` may be needed for plaiceholder depending on the Next.js setup).
2. Create a utility function in `src/lib/images.ts` (or similar) that takes an absolute image path, reads the file, and passes it to `getPlaiceholder(buffer)`.
3. The function should return the `base64` string representing the blurred image.
4. Modify the data fetching logic for projects and blog posts to compute these blur URLs at build time (e.g., during the MDX frontmatter parsing). Add a `blurDataURL` property to the project/blog type.
5. Update the `<Image>` components in `ProjectCard` and `BlogPost` to include `placeholder="blur"` and `blurDataURL={project.blurDataURL}`.

## 8. Component-Level CSS Variables for Animations

**Description:** Move dynamic style calculations out of Framer Motion `style={{}}` props and into inline CSS variables to reduce main thread blocking.

**Steps:**

1. Identify scroll-heavy or complex animations that currently use Framer Motion's `style` prop for things like `transform`, `opacity`, or colors (e.g., in `HeroSection.tsx` or `ProjectCard.tsx`).
2. Instead of directly mapping motion values to style properties, use `useMotionTemplate` or manual string formatting to construct CSS variable strings.
3. Apply these variables to the `style` prop: `style={{ "--my-progress": progressValue } as React.CSSProperties}`.
4. In the component's Tailwind classes or a CSS module, use the variable: `className="opacity-[var(--my-progress)]"`.
5. This delegates the interpolation to the browser's CSS engine (often GPU-accelerated) rather than recalculating the React tree on every frame. _Note: Framer Motion optimizes `style` props heavily, so this is primarily beneficial for very high-frequency or complex multi-property interpolations._

## 9. Next.js `Template` Utilization

**Description:** Move localized state resets (like entrance animations) into `template.tsx` instead of `layout.tsx` to ensure animations reliably replay on navigation.

**Steps:**

1. Identify root-level or nested `layout.tsx` files that contain Framer Motion entrance animations (e.g., `<motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }}>`).
2. In Next.js App Router, `layout.tsx` does _not_ unmount and remount when navigating between child routes. Therefore, the entrance animation only plays once on initial load.
3. To replay the animation on every route change within that segment, create a `template.tsx` file alongside the `layout.tsx`.
4. Move the wrapper `<motion.div>` or `<motion.main>` containing the entrance animation logic from `layout.tsx` into `template.tsx`.
5. Keep global providers, headers, and footers in `layout.tsx`. The hierarchy will be `Layout > Template > Page`.
