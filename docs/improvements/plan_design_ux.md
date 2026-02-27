# Implementation Plan: Design & UX Improvements

This document outlines the step-by-step implementation for the 5 Design & UX improvements identified in the analysis.

## 1. Global Command Menu (Cmd+K)

**Description:** Implement a spotlight-style search using `cmdk` for instantaneous navigation, theme toggling, and actions without using the mouse.

**Steps:**

1. Install dependencies: `npm install cmdk`
2. Create `src/components/ui/CommandMenu.tsx` file.
3. Define the data structure for the menu items (Pages, Projects, Blog, Actions, Theme).
4. Implement the `CommandMenu` component using the `cmdk` library primitives.
5. Create a `useCommandMenu` store (Zustand) or a Context to manage the open/close state globally.
6. Integrate keyboard event listeners (`Cmd+K` / `Ctrl+K`) in a root layout or a high-level provider to trigger the menu.
7. Style the menu to match the existing design system (using Tailwind CSS `border-border`, `bg-background`, `text-primary`, etc.). Add a blurred backdrop.
8. Add a subtle trigger icon (e.g., a search icon or `⌘K` badge) in the `Navigation` header for discoverability.
9. Link the actions (e.g., router pushes for navigation, store updates for theme changes).

## 2. Page Transition Animations

**Description:** Use Framer Motion's `AnimatePresence` in `app/template.tsx` to create smooth cross-fades or slide animations between route changes.

**Steps:**

1. Create `src/app/template.tsx` (if it doesn't exist, otherwise modify it).
2. Wrap the `children` prop with `<motion.div>`.
3. Define standard animation variants (e.g., `initial={{ opacity: 0, y: 20 }}`, `animate={{ opacity: 1, y: 0 }}`, `exit={{ opacity: 0, y: -20 }}`).
4. Add `<AnimatePresence mode="wait">` to handle exit animations before the new page mounts.
5. _Crucial:_ Ensure the `key` prop on the `motion.div` is tied to the current route path (e.g., `usePathname()`) so Framer Motion knows when the component has changed.

## 3. Advanced Micro-Interactions (Magnetic Hover)

**Description:** Add "magnetic" hover effects to primary buttons, project cards, and social links to give a tactile, premium feel.

**Steps:**

1. Create a custom hook `useMagneticHover` in `src/hooks/useMagneticHover.ts`.
2. The hook should accept a `ref` and calculate the mouse position relative to the element's center during the `onMouseMove` event.
3. Calculate the distance and apply a translation (x, y) using Framer Motion's `useMotionValue` and `useSpring` for smooth deceleration.
4. On `onMouseLeave`, reset the translation to `x: 0, y: 0`.
5. Create a wrapper component `src/components/ui/MagneticEffect.tsx` or integrate the hook directly into existing components like `Button.tsx`, `ProjectCard.tsx`, and `SocialLinks.tsx`.

## 4. Dynamic Color Theming

**Description:** Expand `useThemeStore.ts` to allow users to select an accent color that overrides the `--primary` CSS variables dynamically.

**Steps:**

1. Define a set of available themes/accent colors in a configuration object (e.g., Blue, Emerald, Rose, Violet, Amber). Each theme should define its specific `--primary`, `--primary-foreground`, etc., values (likely HSL values).
2. Update `src/stores/useThemeStore.ts` to include a `themeAccent` state and a `setThemeAccent` action.
3. Ensure the store persists this state (likely already handled if using Zustand's `persist` middleware).
4. Create a mechanism to apply these CSS variables to the document root (e.g., an effect in a `ThemeProvider` component that updates `document.documentElement.style.setProperty`).
5. Build a UI component (e.g., a "Theme Selector" dropdown or a section in the Command Menu) to allow the user to choose their preferred accent color.

## 5. Interactive WebGL Elements

**Description:** Integrate a 3D particle system or abstract geometry into the `HeroBackground` using `@react-three/fiber` and `@react-three/drei`.

**Steps:**

1. Ensure `@react-three/fiber`, `@react-three/drei`, and `three` are installed.
2. Refactor `src/components/sections/HeroBackground.tsx` to include a `<Canvas>` element.
3. Create a new component (e.g., `src/components/three/ParticleSystem.tsx` or `AbstractGeometry.tsx`).
4. Implement the WebGL logic:
   - For particles: Use `<Points>`, `<PointMaterial>`, and a Float32Array for positions. Update positions in the `useFrame` hook based on time or mouse position.
   - For geometry: Use a `<mesh>` with a standard or custom shader material, animating its rotation or vertex positions in `useFrame`.
5. Connect the component to the global mouse position (already tracked in `page.tsx`) or scroll position to drive interactivity.
6. Ensure a sensible fallback (and lazy loading) for performance on lower-end devices or when WebGL is unavailable. Use `Suspense`.
