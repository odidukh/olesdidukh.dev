# Deployment Guide

This document covers deploying the portfolio website to Vercel.

## Vercel Deployment

### Initial Setup

1. **Connect Repository**
   - Go to [vercel.com](https://vercel.com)
   - Import from GitHub: `odidukh/personal-website-v2`
   - Select "Next.js" framework preset

2. **Configure Project**
   - Framework: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

### Environment Variables

Required variables in Vercel Dashboard → Settings → Environment Variables:

```env
# Supabase (Required for CMS)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key

# Email (Contact Form)
RESEND_API_KEY=your_resend_key

# Newsletter
BUTTONDOWN_API_KEY=your_buttondown_key

# Rate Limiting
UPSTASH_REDIS_REST_URL=your_redis_url
UPSTASH_REDIS_REST_TOKEN=your_redis_token

# Error Tracking
SENTRY_DSN=your_sentry_dsn
SENTRY_AUTH_TOKEN=your_auth_token

# Analytics (Optional)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_CLARITY_PROJECT_ID=xxxxxxxxxx
```

### Domain Setup

1. Go to Settings → Domains
2. Add `olesdidukh.dev`
3. Configure DNS:
   - A Record: `76.76.21.21`
   - CNAME: `cname.vercel-dns.com`

## Deployment Checklist

### Pre-Deployment

- [ ] All tests pass locally (`npm run test:run`)
- [ ] Quality checks pass (`npm run check`)
- [ ] No TypeScript errors
- [ ] Environment variables configured
- [ ] Build succeeds locally (`npm run build`)

### Post-Deployment

- [ ] Site loads correctly
- [ ] All pages render
- [ ] Forms submit successfully
- [ ] Dark mode works
- [ ] Mobile responsive
- [ ] Check Core Web Vitals in Vercel Analytics

## Automatic Deployments

- **Production**: Pushes to `main` branch
- **Preview**: Pull requests get preview URLs
- **Branch**: Feature branches deploy to `branch-name.vercel.app`

## Rollback Procedure

If issues occur after deployment:

1. Go to Vercel Dashboard → Deployments
2. Find previous working deployment
3. Click "..." → "Promote to Production"

Or via CLI:

```bash
vercel rollback
```

## Build Optimization

The project uses:

- Turbopack for development
- Automatic code splitting
- Image optimization via `next/image`
- Font optimization via `next/font`

## Monitoring

- **Vercel Analytics**: Performance metrics
- **Vercel Speed Insights**: Core Web Vitals
- **Sentry**: Error tracking

## Troubleshooting

### Build Failures

```bash
# Check build locally
npm run build

# Clear cache and rebuild
npm run clean && npm run build
```

### Environment Issues

- Verify all required env vars are set
- Check variable names match exactly
- Ensure no trailing whitespace

### Performance Issues

```bash
# Analyze bundle
npm run analyze

# Check bundle budget
npm run budget
```

---

For questions, check [Vercel Documentation](https://vercel.com/docs).
