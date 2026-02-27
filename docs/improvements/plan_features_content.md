# Implementation Plan: Features & Content

This document outlines the step-by-step implementation for the 4 Features & Content improvements identified in the analysis.

## 10. Edge View Counters & Reactions

**Description:** Utilize Upstash Redis to add edge-based hit counters and a "claps" system for individual MDX blog posts.

**Steps:**

1. Verify the `@upstash/redis` connection is established using the environment variables (`UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`).
2. **View Counters:**
   - Create an API route `src/app/api/views/[slug]/route.ts`.
   - In a `POST` handler, increment the view count in Redis: `redis.incr(`page_views:${slug}`)`. Return the new count.
   - In a `GET` handler, fetch the current view count.
   - Create a `ViewCounter` client component. It should fire the `POST` request on mount (recording a view) and display the total.
3. **Reactions (Claps):**
   - Create an API route `src/app/api/reactions/[slug]/route.ts`.
   - Implement `GET` to fetch the total claps for a post.
   - Implement `POST` to increment the claps. Use Redis hashes or sets if you want to limit claps per user (using an anonymous session identifier or IP hash).
   - Create a `ReactionButton` client component containing the clapping logic and animations (perhaps a small particle burst when clicked).
4. Integrate both components into the `BlogPostContent.tsx` layout.

## 11. Guestbook / Hall of Fame

**Description:** Add a `/guestbook` route where visitors can authenticate via GitHub (Supabase) and leave short messages.

**Steps:**

1. Set up GitHub OAuth in the Supabase project dashboard and add the credentials.
2. Ensure `@supabase/ssr` or `@supabase/supabase-js` is correctly configured in `src/lib/supabase`.
3. Create a Supabase table named `guestbook_entries` with columns: `id`, `created_at`, `user_id`, `full_name`, `avatar_url`, and `message`.
4. Create the `src/app/guestbook/page.tsx` route.
5. Create an `AuthButton` component using Supabase auth (`supabase.auth.signInWithOAuth({ provider: 'github' })`).
6. Create a `GuestbookForm` component that allows signed-in users to submit a message. On submit, insert the row into the `guestbook_entries` table.
7. Create a `GuestbookList` server component that fetches the entries from Supabase (ordered by `created_at` descending) and displays them in a masonry grid or list format. Use real-time subscriptions (optional) or Next.js cache revalidation for updates.

## 12. Dynamic OG Image Generation

**Description:** Expand `@vercel/og` usage to generate highly customized, dynamic social sharing cards for every project and blog post.

**Steps:**

1. Ensure `@vercel/og` is installed.
2. In the Next.js `app` directory, find or create the `src/app/api/og/route.tsx` file.
3. Expand the API route to accept query parameters like `title`, `type` (e.g., 'blog', 'project'), `description`, `date`, or `readTime`.
4. Construct the JSX structure for the image inside the `ImageResponse`. Use different layouts based on the `type` parameter (e.g., a specific background pattern for blog posts, a different one for projects).
5. Load custom fonts (like your primary Geist font or an explicitly loaded `.ttf` file) into the Edge function to ensure the typography matches your brand.
6. Return the `new ImageResponse(JSX, { width: 1200, height: 630, fonts: [...] })`.
7. Update the `generateMetadata` functions in `src/app/blog/[slug]/page.tsx` and `src/app/projects/[slug]/page.tsx` to dynamically construct the OG image URL with the corresponding parameters and inject it into the `openGraph` metadata.

## 13. Audio Experience / Sound Design

**Description:** Implement `use-sound` for subtle, togglable UI sound effects for a deeper sensory experience.

**Steps:**

1. Install the dependency: `npm install use-sound` (Note: ensure compatibility with React 19, or implement a custom Web Audio API hook if needed).
2. Gather or create 3-4 subtle, high-quality audio files (e.g., `.mp3` or `.wav`). Examples: a soft 'pop' for button clicks, a 'whoosh' for page transitions, a metallic 'click' for theme toggles. Place them in the `public/sounds` directory.
3. Update `src/stores/useUIPreferencesStore.ts` (or create a new store) to include an `isSoundEnabled` boolean state and a toggle function. Persist this setting.
4. Create a custom hook `src/hooks/useAppSounds.ts` that wraps `use-sound`. It should check the global `isSoundEnabled` state before playing any noise.
5. Import and attach the play functions from the hook to specific interactive elements:
   - Primary `<Button>` onClick events.
   - Theme switch toggle.
   - Form submission success.
6. Add a "Sound Effects: On/Off" toggle to the footer, settings modal, or the new Command Menu.
