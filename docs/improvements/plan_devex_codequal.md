# Implementation Plan: Developer Experience & Code Quality

This document outlines the step-by-step implementation for the 2 Developer Experience & Code Quality improvements identified in the analysis.

## 14. Visual Regression Testing

**Description:** Integrate Playwright or Chromatic visual comparisons to catch unintended UI changes across the 50+ UI components.

**Steps:**

1. A Playwright setup already exists (`playwright.config.ts`, `e2e/`). We will leverage this for visual regression testing.
2. In `playwright.config.ts`, ensure `expect.toHaveScreenshot()` is configured correctly (optionally adjusting the `maxDiffPixels` or `threshold` if animations cause flakiness).
3. Create a new test suite file: `e2e/visual.spec.ts`.
4. Write tests that navigate to key pages (Homepage, `/projects`, `/blog`, `/experience`) and capture full-page screenshots: `await expect(page).toHaveScreenshot('homepage.png', { fullPage: true });`.
5. For UI components, since Storybook is configured (`.storybook/`), the best approach is to test the stories themselves or use a tool like Chromatic (which integrates natively with Storybook).
   - _Alternative A (Playwright on Storybook):_ Run Storybook locally, use Playwright to navigate to each component's iframe URL, and take a screenshot.
   - _Alternative B (Chromatic - Recommended):_ Install `chromatic`: `npm install --save-dev chromatic`. Add a script `"chromatic": "npx chromatic --project-token=<TOKEN>"`. This handles component-level visual regression perfectly.
6. Run the tests locally once to generate the baseline images.
7. Integrate the chosen command (`playwright test e2e/visual.spec.ts` or `npm run chromatic`) into the CI pipeline (e.g., GitHub Actions).

## 15. Type-Safe MDX with Velite

**Description:** Replace `next-mdx-remote` and `gray-matter` with Velite to enforce strict, build-time type checking on markdown frontmatter.

**Steps:**

1. Install Velite: `npm install velite`.
2. Create a `velite.config.ts` file in the project root.
3. Define collections for `posts` and `projects`.
   - For `posts`: Define a schema using Velite's `s` (Zod-like) builder. Include strings for title, description, date (transforming to ISO), an array of tags, and the raw MDX content.
   - Path pattern: `data/blog/**/*.mdx`.
4. Update `package.json` scripts:
   - Prepend Velite to the dev and build scripts: `"dev": "velite && next dev --turbopack"`, `"build": "velite && next build --webpack"`.
   - Add `.velite` to `.gitignore`.
5. Run the dev server so Velite generates the `.velite/index.ts` output containing the typed collections.
6. Refactor `src/lib/mdx.ts`. Remove parsing logic for `gray-matter` and `fs.readFile`. Instead, import the typed arrays directly from `.velite` (e.g., `import { posts } from '#site/content'`).
7. Update `src/app/blog/[slug]/page.tsx` and `src/app/projects/[slug]/page.tsx` to use the Velite collections for `generateStaticParams` and page rendering.
8. Verify that all components currently accepting MDX source or frontmatter objects are updated to use the new generated Typescript interfaces.
