# Architecture Decision Records (ADRs)

This directory contains Architecture Decision Records (ADRs) documenting significant architectural decisions made for the portfolio website.

## What is an ADR?

An ADR is a document that captures an important architectural decision made along with its context and consequences. ADRs help maintain a historical record of why certain decisions were made.

## ADR Index

| ADR      | Title                                                          | Status   | Date       |
| -------- | -------------------------------------------------------------- | -------- | ---------- |
| ADR-0000 | [Template](./0000-template.md)                                 | Template | -          |
| ADR-0001 | [Next.js App Router](./0001-nextjs-app-router.md)              | Accepted | 2024-01-15 |
| ADR-0002 | [Tailwind CSS v4](./0002-tailwind-css-v4.md)                   | Accepted | 2024-01-15 |
| ADR-0003 | [Zustand State Management](./0003-zustand-state-management.md) | Accepted | 2024-10-15 |
| ADR-0004 | [Supabase Backend](./0004-supabase-backend.md)                 | Accepted | 2024-11-01 |
| ADR-0005 | [Framer Motion Animations](./0005-framer-motion-animations.md) | Accepted | 2024-01-15 |
| ADR-0006 | [Testing Strategy](./0006-testing-strategy.md)                 | Accepted | 2024-09-01 |
| ADR-0007 | [PWA with Serwist](./0007-pwa-with-serwist.md)                 | Accepted | 2024-11-15 |

## Creating a New ADR

1. Copy `0000-template.md` to a new file with the next sequential number
2. Fill in all sections of the template
3. Update this README with the new ADR
4. Submit for review

## ADR Status Values

- **Proposed**: Under discussion, not yet decided
- **Accepted**: Decision has been made and implemented
- **Deprecated**: Decision is no longer valid but kept for historical reference
- **Superseded**: Replaced by a newer ADR (link to replacement)

## Format

Each ADR follows this structure:

1. **Title**: Short descriptive title
2. **Date**: When the decision was made
3. **Status**: Current state of the decision
4. **Deciders**: Who made or approved the decision
5. **Context**: The issue and forces at play
6. **Decision**: What was decided
7. **Consequences**: Positive, negative, and neutral outcomes
8. **Alternatives Considered**: Other options evaluated
9. **References**: Links to relevant resources

## References

- [ADR GitHub Organization](https://adr.github.io/)
- [Michael Nygard's ADR Article](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions)
