# Oles Didukh - Portfolio Website

A modern, high-performance personal portfolio website showcasing 8+ years of front-end expertise. Built with Next.js 16, React 19, and TypeScript to achieve top-tier Core Web Vitals performance.

**Live Site:** [olesdidukh.dev](https://olesdidukh.dev)

## Tech Stack

| Category      | Technology                              |
| ------------- | --------------------------------------- |
| Framework     | Next.js 16 (App Router) with Turbopack  |
| React         | v19.2.0 with React Compiler             |
| Language      | TypeScript 5 (strict mode)              |
| Styling       | Tailwind CSS v4 + CSS custom properties |
| Animation     | Framer Motion                           |
| UI Primitives | Radix UI                                |
| Forms         | React Hook Form + Zod                   |
| State         | Zustand (persisted stores)              |
| Testing       | Vitest + Playwright                     |
| Analytics     | Vercel Analytics & Speed Insights       |

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
# Clone the repository
git clone https://github.com/odidukh/personal-website-v2.git
cd personal-website-v2

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

### Environment Variables

See [.env.example](.env.example) for all available configuration options. Required variables:

- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key

## Development

### Commands

```bash
npm run dev          # Development server (Turbopack)
npm run build        # Production build
npm run check        # Full quality check (types + lint + format)
npm run fix          # Auto-fix lint and formatting issues
npm run test         # Run unit tests (watch mode)
npm run test:e2e     # Run E2E tests
npm run storybook    # Component documentation
```

### Quality Checks

Before committing, run:

```bash
npm run check
```

This runs TypeScript type checking, ESLint in strict mode, and Prettier format checking.

### Project Structure

```
src/
├── app/           # Next.js App Router pages
├── components/
│   ├── sections/  # Page-level feature components
│   └── ui/        # Reusable UI primitives
├── data/          # Static content (blog posts, projects)
├── hooks/         # Custom React hooks
├── lib/           # Utilities and configurations
├── stores/        # Zustand state stores
└── styles/        # Design tokens and global styles
```

## Features

- **Dark Mode** - System-aware theme with persistence
- **Blog** - MDX-powered with syntax highlighting
- **Projects** - Filterable portfolio with modal details
- **Contact** - Form with rate limiting and validation
- **Analytics** - Page engagement and CTA tracking
- **PWA** - Installable progressive web app
- **A11y** - Keyboard navigation and screen reader support

## Performance Targets

| Metric                 | Target  |
| ---------------------- | ------- |
| Lighthouse Performance | > 95    |
| LCP                    | < 1.5s  |
| INP                    | < 100ms |
| CLS                    | < 0.05  |

## Architecture

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for a comprehensive overview of the system design — rendering model, data flow, state management, security layers, and performance strategies.

For individual technology decisions, see the [Architecture Decision Records](docs/adr/README.md).

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines, component patterns, and PR requirements.

## License

This project is private and not open for external contributions.
