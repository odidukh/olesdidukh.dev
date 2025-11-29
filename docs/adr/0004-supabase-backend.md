# ADR-0004: Use Supabase for Backend Services

**Date**: 2024-11-01
**Status**: Accepted
**Deciders**: Oles Didukh

## Context

The portfolio evolved from a static site to require:

- Admin panel for content management
- User authentication for admin access
- Database for storing content (projects, blog, skills, experience)
- Contact form submissions storage

Requirements:

- PostgreSQL database
- Row-level security
- Authentication system
- Real-time capabilities (future)
- Generous free tier for portfolio use

## Decision

Use Supabase as the backend-as-a-service platform providing:

- PostgreSQL database with RLS (Row Level Security)
- Built-in authentication with magic links
- Client and server-side SDKs for Next.js
- Middleware integration for session handling

## Consequences

### Positive

- Full PostgreSQL with advanced features
- Built-in Row Level Security for fine-grained access control
- Excellent Next.js App Router integration
- Real-time subscriptions available if needed
- Generous free tier (500MB database, 1GB storage)
- Self-hostable if needed in future

### Negative

- Vendor lock-in for specific features
- Learning curve for RLS policies
- Need to manage separate services (auth, db, storage)

### Neutral

- SQL-based instead of NoSQL
- Requires environment variables management

## Database Schema

```sql
-- Example RLS policy
create policy "Public read access for published content"
on projects for select
using (published = true);

create policy "Admin write access"
on projects for all
using (auth.jwt() ->> 'email' = 'admin@example.com');
```

## Alternatives Considered

### Option A: PlanetScale

Serverless MySQL database.

**Pros**: Branching, great DX, MySQL compatibility
**Cons**: No built-in auth, separate auth service needed

### Option B: Firebase

Google's BaaS platform.

**Pros**: Real-time by default, excellent mobile support
**Cons**: NoSQL only, vendor lock-in, complex pricing

### Option C: Prisma + Auth.js + PostgreSQL

Self-managed stack.

**Pros**: Full control, ORM benefits
**Cons**: More setup, self-hosted database needed

## References

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth with Next.js](https://supabase.com/docs/guides/auth/server-side/nextjs)
