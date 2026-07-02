import { z } from 'zod';
import {
  interviewerSchema,
  likelyTopicSchema,
  yourNumberSchema,
  stackMapEntrySchema,
  sessionStatusSchema,
  type Interviewer,
  type LikelyTopic,
  type YourNumber,
  type StackMapEntry,
  type SessionStatus,
} from './schemas.ts';

export const sessionSeedSchema = z.object({
  slug: z
    .string()
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'slug must be URL-friendly'),
  company: z.string().min(1),
  role: z.string().min(1),
  round: z.string().min(1),
  scheduledAt: z.string().nullable(),
  status: sessionStatusSchema,
  product: z.string().nullable(),
  interviewers: z.array(interviewerSchema),
  likelyTopics: z.array(likelyTopicSchema),
  yourNumbers: z.array(yourNumberSchema),
  bottomLine: z.string().nullable(),
  stackMap: z.array(stackMapEntrySchema),
  focusCategorySlugs: z.array(z.string()),
});

export type SessionSeed = z.infer<typeof sessionSeedSchema>;

// Transcribed from src/lib/interview-prep/legacy-content.html (Houston briefing block, lines 160-237).
// Interviewer facts, "your numbers", stack map, and product summary are copied from that HTML;
// extended with all rows present in the source.
export const HOUSTON_SESSION: SessionSeed = {
  slug: 'houston-systems-round-2',
  company: 'Houston Systems',
  role: 'Senior Frontend Engineer',
  round: 'Round 2 · Technical',
  scheduledAt: '2026-07-03T07:00:00Z',
  status: 'upcoming' satisfies SessionStatus,
  product:
    'A financial analytics platform for blue-chip companies. It does regression analysis, peer comparison, and rule-based evaluation, served through a fast, data-dense React app on a Python/FastAPI backend. Analysts use it to make real decisions — so correctness, legibility and trust matter as much as speed.',
  interviewers: [
    {
      name: 'Harry Blakiston Houston',
      role: 'Founder / Director',
      focus:
        'Cambridge engineering-mathematician; ML & scientific-computing background; ex-founder of Phonebox App. Hands-on and technical — expect math-literate depth and a focus on how you think.',
    },
    {
      name: 'Bohdan Lysianskyi',
      role: 'Team (likely)',
      focus:
        "Colleague on the thread, likely engineering. Treat as a peer-level technical conversation; show you'd be easy and rigorous to build alongside.",
    },
  ] satisfies Interviewer[],
  likelyTopics: [
    {
      topic: 'Charting library choice & dropping to canvas/D3',
      whereToDrill: 'Houston · Technical',
    },
    {
      topic: 'State architecture with React Context without re-render storms',
      whereToDrill: 'Houston · Technical',
    },
    {
      topic: 'Profiling before optimising',
      whereToDrill: 'Houston · Technical',
    },
  ] satisfies LikelyTopic[],
  yourNumbers: [
    {
      label: 'Live data points rendered',
      value: '50,000+ sub-200ms (Safebooks anomaly dashboard)',
    },
    { label: 'Lighthouse (Safebooks)', value: '62 → 95+' },
    { label: 'LCP', value: '4.2s → 1.5s' },
    { label: 'INP', value: '450ms → 100ms' },
    { label: 'Fewer runtime errors via TS generics + Zod', value: '~95%' },
    {
      label: 'Daily transactions',
      value: '1M+ (financial governance platform)',
    },
    {
      label: 'Component library adoption',
      value: '60+ components, 5 teams (−30% UI time)',
    },
    {
      label: 'jQuery→React migration load time',
      value: '−74% (Inango), zero downtime',
    },
  ] satisfies YourNumber[],
  bottomLine: `Round 1 (18 June) went well — Harry was "impressed by what you shared." This round goes deeper on the technical side and how you'd approach the work day-to-day.`,
  stackMap: [
    {
      theirTech: 'React 18',
      yourStanding: 'Expert · daily driver at Safebooks & Emerline',
    },
    {
      theirTech: 'React Context (no Redux)',
      yourStanding:
        'Strong · know the re-render pitfalls cold; ready to discuss split contexts + when a selector store beats Context',
    },
    {
      theirTech: 'Chart.js + Recharts',
      yourStanding:
        'Strong · built dense charting; canvas (Chart.js) for density, SVG (Recharts) for interactivity',
    },
    {
      theirTech: 'Axios',
      yourStanding:
        'Strong · centralize with typed wrappers + interceptors for auth/errors',
    },
    {
      theirTech: 'Clerk (auth)',
      yourStanding: `Learn fast · not used Clerk; have shipped hosted auth (Firebase) — same shape. Don't bluff it`,
    },
    {
      theirTech: 'Vercel',
      yourStanding:
        'Comfortable · deployed Next.js there — preview deploys, env, edge/serverless',
    },
    {
      theirTech: 'Next.js / React Router (nice-to-have)',
      yourStanding:
        'Next.js advanced (Safebooks); React Router solid. Their app is likely a Vite SPA',
    },
    {
      theirTech: 'Python / FastAPI (bonus)',
      yourStanding: `Boundary-comfortable · haven't written FastAPI, but worked against Python APIs; would type the edge via OpenAPI → TS`,
    },
    {
      theirTech: 'Financial / statistical knowledge (bonus)',
      yourStanding: `Genuine edge · Physics Master's + Safebooks fintech domain. Speak Harry's language`,
    },
  ] satisfies StackMapEntry[],
  focusCategorySlugs: [
    'houston-technical',
    'houston-day-to-day',
    'houston-ask-them',
  ],
};
