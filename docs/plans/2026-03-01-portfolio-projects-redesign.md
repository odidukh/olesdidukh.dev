# Portfolio Projects Redesign - Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace 5 company-mapped projects with 7 distinct, technically compelling portfolio projects that showcase range and depth.

**Architecture:** Content-driven via Velite MDX files in `src/content/projects/`. Each `.mdx` file has YAML frontmatter (id, title, description, category, technologies, image, images, featured, year, duration, role, team, client, challenges, solutions, results, testimonial) and a body paragraph. Velite compiles these to `.velite/projects.json` which is consumed by `src/data/projects.ts`. Tests in `src/data/projects.test.ts` reference project IDs and must be updated.

**Tech Stack:** Velite (MDX content), Vitest (tests)

---

### Task 1: Delete old project MDX files

**Files:**

- Delete: `src/content/projects/safebooks-financial-dashboard.mdx`
- Delete: `src/content/projects/emerline-enterprise-platform.mdx`
- Delete: `src/content/projects/inango-isp-platform.mdx`

**Step 1: Delete the three old MDX files**

```bash
rm src/content/projects/safebooks-financial-dashboard.mdx
rm src/content/projects/emerline-enterprise-platform.mdx
rm src/content/projects/inango-isp-platform.mdx
```

**Step 2: Verify only personal-portfolio.mdx and helios-client-applications.mdx remain**

```bash
ls src/content/projects/
```

Expected: `helios-client-applications.mdx` and `personal-portfolio.mdx`

---

### Task 2: Create Safebooks Revenue Platform MDX

**Files:**

- Create: `src/content/projects/safebooks-revenue-platform.mdx`

**Step 1: Create the MDX file**

```mdx
---
id: 'safebooks-revenue-platform'
title: 'Safebooks AI - Revenue Intelligence Platform'
description: 'Architected the front-end for an AI-powered revenue integrity platform that validates financial data across 15+ enterprise systems, serving 9 clients with sub-200ms render performance.'
category: 'FinTech'
technologies:
  - 'Next.js'
  - 'React'
  - 'TypeScript'
  - 'Zustand'
  - 'Material-UI'
  - 'D3.js'
  - 'Jest'
  - 'Webpack'
image: '/images/projects/safebooks.png'
images:
  - '/images/projects/safebooks.png'
  - '/images/projects/safebooks.png'
  - '/images/projects/safebooks.png'
liveUrl: 'https://safebooks.ai'
featured: true
year: 2024
duration: '15 months'
role: 'Senior Front-End Engineer'
team: '10+ developers'
client: 'Safebooks AI'
challenges:
  - 'Rendering 50,000+ real-time financial data points with interactive drill-downs without frame drops'
  - 'Building type-safe data pipelines across complex, nested financial entity models'
  - 'Maintaining 95+ Lighthouse scores while loading heavy charting libraries'
solutions:
  - 'Engineered virtualized rendering pipeline with canvas-based fallback for dense datasets, achieving sub-200ms paint times'
  - 'Designed advanced TypeScript generics system for financial data models, eliminating 95% of runtime type errors'
  - 'Implemented code-splitting and lazy-loaded chart modules, cutting initial bundle by 50%'
results:
  - metric: 'Render Performance'
    value: '<200ms'
  - metric: 'Runtime Errors Reduced'
    value: '95%'
  - metric: 'Lighthouse Score'
    value: '95+'
  - metric: 'Enterprise Clients'
    value: '9'
testimonial:
  text: 'Outstanding technical leadership and attention to performance optimization. The dashboard delivers exceptional user experience for our enterprise clients.'
  author: 'Engineering Manager'
  role: 'Safebooks AI'
---

Architected the front-end of Safebooks AI's revenue intelligence platform — an AI-powered system that monitors and reconciles financial data across Salesforce, NetSuite, Stripe, and 12+ other enterprise integrations. Built real-time anomaly detection dashboards visualizing 50,000+ transaction data points with interactive drill-downs, while maintaining sub-200ms render performance. Designed type-safe data pipelines using advanced TypeScript generics that reduced runtime errors by 95% and saved approximately 15 QA hours per sprint.
```

---

### Task 3: Create Emerline Design System MDX

**Files:**

- Create: `src/content/projects/emerline-design-system.mdx`

**Step 1: Create the MDX file**

```mdx
---
id: 'emerline-design-system'
title: 'White-Label Design System & Component Library'
description: 'Designed and shipped a white-label React component library with 60+ components, adopted by 5 teams across the organization, cutting UI development time by 30%.'
category: 'Design System'
technologies:
  - 'React'
  - 'TypeScript'
  - 'Storybook'
  - 'SASS'
  - 'Webpack'
  - 'Jest'
  - 'Chromatic'
  - 'npm'
image: '/images/projects/ui-library.png'
images:
  - '/images/projects/ui-library.png'
  - '/images/projects/ui-library.png'
  - '/images/projects/ui-library.png'
featured: true
year: 2023
duration: '1.5 years'
role: 'Senior Front-End Developer'
team: '8-12 developers'
client: 'Emerline'
challenges:
  - 'Creating a themeable component API that supports white-labeling for diverse client brands'
  - 'Ensuring consistent behavior across 60+ components with comprehensive visual regression testing'
  - 'Driving adoption across 5 independent teams with varying skill levels'
solutions:
  - 'Built token-based theming architecture with CSS custom properties enabling full brand customization without code changes'
  - 'Integrated Storybook + Chromatic pipeline for automated visual regression testing across all components'
  - 'Created interactive documentation with live examples and migration guides, reducing onboarding time by 50%'
results:
  - metric: 'Components Built'
    value: '60+'
  - metric: 'Teams Adopted'
    value: '5'
  - metric: 'UI Dev Time Reduction'
    value: '30%'
  - metric: 'Onboarding Time Reduction'
    value: '50%'
testimonial:
  text: 'The component library became the foundation for our entire platform. Exceptional ability to translate complex requirements into elegant, maintainable solutions.'
  author: 'Product Lead'
  role: 'Emerline'
---

Designed and shipped a production-grade, white-label React component library adopted across the organization. Built 60+ accessible, themeable components with a token-based architecture that allows full brand customization through CSS custom properties — enabling teams to white-label client applications without touching component code. Integrated Storybook with Chromatic for automated visual regression testing, and created comprehensive documentation that cut developer onboarding time by 50%.
```

---

### Task 4: Create Inango Network Dashboard MDX

**Files:**

- Create: `src/content/projects/inango-network-dashboard.mdx`

**Step 1: Create the MDX file**

```mdx
---
id: 'inango-network-dashboard'
title: 'ISP Network Operations Dashboard'
description: 'Built real-time network monitoring interfaces visualizing 10,000+ ISP infrastructure nodes, improving incident response time by 35% for operators serving 50,000+ customers.'
category: 'Data Visualization'
technologies:
  - 'React'
  - 'Redux'
  - 'JavaScript ES6+'
  - 'WebSocket'
  - 'D3.js'
  - 'HTML5'
  - 'CSS3'
image: '/images/projects/healthcare.png'
images:
  - '/images/projects/healthcare.png'
  - '/images/projects/healthcare.png'
  - '/images/projects/healthcare.png'
featured: true
year: 2020
duration: '2 years'
role: 'Middle Front-End Developer'
team: '6-8 developers'
client: 'Inango Systems'
challenges:
  - 'Visualizing real-time status of 10,000+ distributed network nodes with live updates'
  - 'Migrating a legacy jQuery monolith to React without disrupting 50,000+ active users'
  - 'Integrating front-end with mixed SQL/NoSQL backend systems while minimizing parsing overhead'
solutions:
  - 'Implemented WebSocket-driven real-time topology maps with node clustering for dense network regions'
  - 'Executed phased jQuery-to-React migration strategy maintaining zero downtime, boosting Lighthouse scores to 92'
  - 'Built data normalization layer reducing client-side parsing overhead by 25%'
results:
  - metric: 'Nodes Monitored'
    value: '10,000+'
  - metric: 'Customers Served'
    value: '50,000+'
  - metric: 'Incident Response Improvement'
    value: '35%'
  - metric: 'Lighthouse Score'
    value: '92'
---

Built real-time network operations dashboards for Inango Systems, an ISP infrastructure company whose software runs in millions of homes worldwide. Developed interactive topology maps visualizing 10,000+ network nodes with live status updates via WebSockets, enabling operators to detect and respond to incidents 35% faster. Led the phased migration from a legacy jQuery application to a modern React/Redux architecture — maintaining zero downtime for 50,000+ active customers while achieving a 40% performance boost and Lighthouse scores of 92.
```

---

### Task 5: Create Emerline Client Portals MDX

**Files:**

- Create: `src/content/projects/emerline-client-portals.mdx`

**Step 1: Create the MDX file**

```mdx
---
id: 'emerline-client-portals'
title: 'Enterprise Client Portals'
description: 'Led front-end architecture for 3 major enterprise client portals delivered under budget, improving Core Web Vitals by 35% and increasing client retention by 20%.'
category: 'Enterprise'
technologies:
  - 'React'
  - 'TypeScript'
  - 'Redux'
  - 'JavaScript ES6+'
  - 'SASS'
  - 'Webpack'
  - 'REST APIs'
image: '/images/projects/ecommerce.png'
images:
  - '/images/projects/ecommerce.png'
  - '/images/projects/ecommerce.png'
  - '/images/projects/ecommerce.png'
featured: false
year: 2022
duration: '2+ years'
role: 'Senior Front-End Developer'
team: '8-12 developers'
client: 'Emerline'
challenges:
  - 'Architecting scalable front-ends for three distinct enterprise clients with different requirements'
  - 'Achieving consistent performance standards across varied codebases'
  - 'Mentoring junior developers while meeting aggressive delivery timelines'
solutions:
  - 'Established shared architectural patterns and coding standards that accelerated delivery across all three projects'
  - 'Implemented performance budgets and automated Lighthouse CI checks improving Core Web Vitals by 35%'
  - 'Created structured mentoring program for 2 junior developers, enabling them to contribute independently within 4 weeks'
results:
  - metric: 'Client Apps Delivered'
    value: '3'
  - metric: 'Client Retention Increase'
    value: '20%'
  - metric: 'Core Web Vitals Improvement'
    value: '+35%'
  - metric: 'Junior Devs Mentored'
    value: '2'
---

Led front-end architecture for three major enterprise client applications at Emerline, a global software development company serving Fortune 500 clients. Established shared architectural patterns and coding standards that enabled all three projects to deliver under budget. Drove Core Web Vitals improvements of 35% through performance budgets and automated Lighthouse CI, while mentoring junior developers to contribute independently within 4 weeks.
```

---

### Task 6: Create Inango Mobile App MDX

**Files:**

- Create: `src/content/projects/inango-mobile-app.mdx`

**Step 1: Create the MDX file**

```mdx
---
id: 'inango-mobile-app'
title: 'ISP Customer Self-Service Mobile App'
description: 'Delivered a cross-platform React Native MVP for ISP customer self-service 2 weeks ahead of schedule, enabling 50,000+ subscribers to manage their accounts on mobile.'
category: 'Mobile'
technologies:
  - 'React Native'
  - 'Redux'
  - 'JavaScript'
  - 'REST APIs'
  - 'Push Notifications'
image: '/images/projects/generic.png'
images:
  - '/images/projects/generic.png'
  - '/images/projects/generic.png'
  - '/images/projects/generic.png'
featured: false
year: 2021
duration: '3 months'
role: 'Middle Front-End Developer'
team: '6-8 developers'
client: 'Inango Systems'
challenges:
  - 'Shipping a cross-platform mobile MVP within an aggressive 3-month timeline'
  - 'Reusing business logic from the existing React web application in a mobile context'
  - 'Integrating with legacy backend APIs not originally designed for mobile consumption'
solutions:
  - 'Leveraged shared Redux state architecture between web and mobile, reusing 40% of business logic'
  - 'Built adaptive API layer that normalized legacy backend responses for mobile-optimized consumption'
  - 'Delivered MVP 2 weeks ahead of schedule with core features: account management, usage monitoring, and support tickets'
results:
  - metric: 'Delivery'
    value: '2 weeks early'
  - metric: 'Code Reuse'
    value: '40%'
  - metric: 'Subscribers Served'
    value: '50,000+'
---

Delivered a cross-platform React Native MVP for Inango Systems' ISP customers, enabling 50,000+ subscribers to manage accounts, monitor usage, and submit support tickets from their mobile devices. Leveraged shared Redux architecture to reuse 40% of business logic from the existing web application, and built an adaptive API layer to normalize legacy backend responses for mobile consumption. Shipped 2 weeks ahead of the 3-month timeline.
```

---

### Task 7: Update existing MDX files

**Files:**

- Modify: `src/content/projects/personal-portfolio.mdx` (set `featured: false`, remove self-testimonial)
- Modify: `src/content/projects/helios-client-applications.mdx` (no changes needed)

**Step 1: Update personal-portfolio.mdx**

Change `featured: true` to `featured: false`. Remove the self-testimonial block (testimonial from yourself doesn't carry weight).

---

### Task 8: Update tests to use new project IDs

**Files:**

- Modify: `src/data/projects.test.ts`

**Step 1: Update hardcoded project references**

Replace all occurrences of:

- `'safebooks-financial-dashboard'` -> `'safebooks-revenue-platform'`
- `'Safebooks AI - Financial Dashboard'` -> `'Safebooks AI - Revenue Intelligence Platform'`
- `'emerline-enterprise-platform'` -> `'emerline-design-system'`

Update the `getProjectsByCategory` test to use `'FinTech'` instead of `'Enterprise'` for the Safebooks lookup, or use a category that still has multiple projects. `'Enterprise'` still works since `emerline-client-portals` uses it.

**Step 2: Run tests**

```bash
npm run type-check && npx vitest run src/data/projects.test.ts
```

Expected: All tests pass.

---

### Task 9: Rebuild Velite and verify

**Step 1: Rebuild Velite**

```bash
npm run build
```

Expected: Build succeeds, `.velite/projects.json` contains 7 projects.

**Step 2: Verify project count and IDs**

```bash
node -e "const p = require('./.velite/projects.json'); console.log(p.length, p.map(x => x.id))"
```

Expected: `7` with IDs: `safebooks-revenue-platform`, `emerline-design-system`, `inango-network-dashboard`, `emerline-client-portals`, `inango-mobile-app`, `personal-portfolio`, `helios-client-applications`

**Step 3: Run full quality check**

```bash
npm run check
```

Expected: All checks pass.

**Step 4: Commit**

```bash
git add src/content/projects/ src/data/projects.test.ts
git commit -m "feat: redesign portfolio with 7 distinct technical projects

Split company-level projects into specific deliverables:
- Safebooks: Revenue Intelligence Platform (featured)
- Emerline: Design System + Client Portals (split)
- Inango: Network Dashboard + Mobile App (split)
- Portfolio: deprioritized to non-featured
- Helios: kept as-is"
```
