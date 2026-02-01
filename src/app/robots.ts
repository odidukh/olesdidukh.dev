import type { MetadataRoute } from 'next';

/**
 * Robots.txt configuration with comprehensive bot blocking.
 *
 * Blocks:
 * - AI training bots (GPTBot, CCBot, Google-Extended, etc.)
 * - Aggressive SEO scrapers (AhrefsBot, SemrushBot, etc.)
 * - Known content scrapers
 *
 * Note: Ethical bots respect robots.txt, but malicious scrapers ignore it.
 * This provides legal protection and reduces unwanted crawling.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Default rules for all bots
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/_next/', '/monitoring'],
      },
      // Block AI training bots
      { userAgent: 'GPTBot', disallow: '/' },
      { userAgent: 'ChatGPT-User', disallow: '/' },
      { userAgent: 'CCBot', disallow: '/' },
      { userAgent: 'Google-Extended', disallow: '/' },
      { userAgent: 'anthropic-ai', disallow: '/' },
      { userAgent: 'ClaudeBot', disallow: '/' },
      { userAgent: 'Claude-Web', disallow: '/' },
      { userAgent: 'Omgilibot', disallow: '/' },
      { userAgent: 'FacebookBot', disallow: '/' },
      { userAgent: 'Diffbot', disallow: '/' },
      { userAgent: 'Bytespider', disallow: '/' },
      { userAgent: 'Amazonbot', disallow: '/' },
      { userAgent: 'cohere-ai', disallow: '/' },
      { userAgent: 'PerplexityBot', disallow: '/' },
      { userAgent: 'YouBot', disallow: '/' },
      // Block aggressive SEO scrapers
      { userAgent: 'PetalBot', disallow: '/' },
      { userAgent: 'SemrushBot', disallow: '/' },
      { userAgent: 'AhrefsBot', disallow: '/' },
      { userAgent: 'MJ12bot', disallow: '/' },
      { userAgent: 'DotBot', disallow: '/' },
      { userAgent: 'BLEXBot', disallow: '/' },
      { userAgent: 'DataForSeoBot', disallow: '/' },
      { userAgent: 'serpstatbot', disallow: '/' },
      { userAgent: 'ZoominfoBot', disallow: '/' },
    ],
    sitemap: 'https://www.olesdidukh.dev/sitemap.xml',
  };
}
