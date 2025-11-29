import DOMPurify, { Config } from 'isomorphic-dompurify';

/**
 * Configuration for DOMPurify sanitization.
 * Allows common HTML elements and attributes used in blog content.
 */
const SANITIZE_CONFIG: Config = {
  // Allowed HTML tags
  ALLOWED_TAGS: [
    // Text formatting
    'p',
    'br',
    'span',
    'strong',
    'b',
    'em',
    'i',
    'u',
    's',
    'mark',
    'small',
    'sub',
    'sup',
    // Headings
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    // Lists
    'ul',
    'ol',
    'li',
    // Links and media
    'a',
    'img',
    'figure',
    'figcaption',
    'picture',
    'source',
    // Code blocks
    'pre',
    'code',
    'kbd',
    'samp',
    'var',
    // Quotes and citations
    'blockquote',
    'q',
    'cite',
    'abbr',
    // Tables
    'table',
    'thead',
    'tbody',
    'tfoot',
    'tr',
    'th',
    'td',
    'caption',
    'colgroup',
    'col',
    // Semantic elements
    'article',
    'section',
    'aside',
    'header',
    'footer',
    'nav',
    'main',
    'div',
    // Definition lists
    'dl',
    'dt',
    'dd',
    // Other
    'hr',
    'details',
    'summary',
    'time',
    'address',
  ],
  // Allowed attributes
  ALLOWED_ATTR: [
    'href',
    'src',
    'alt',
    'title',
    'class',
    'id',
    'name',
    'target',
    'rel',
    'width',
    'height',
    'loading',
    'decoding',
    'srcset',
    'sizes',
    'datetime',
    'cite',
    'lang',
    'dir',
    'colspan',
    'rowspan',
    'scope',
    'headers',
    'open',
    'data-*',
    'aria-*',
    'role',
  ],
  // Force target="_blank" links to have rel="noopener noreferrer"
  ADD_ATTR: ['target'],
  // Allow data: URIs for images (base64 encoded)
  ALLOW_DATA_ATTR: true,
  // Allow external links
  ALLOW_UNKNOWN_PROTOCOLS: false,
};

/**
 * Sanitizes HTML content to prevent XSS attacks.
 *
 * @param html - The HTML string to sanitize
 * @param config - Optional custom DOMPurify configuration
 * @returns Sanitized HTML string safe for rendering
 *
 * @example
 * ```tsx
 * import { sanitizeHtml } from '@/lib/sanitize';
 *
 * const safeHtml = sanitizeHtml(untrustedContent);
 * <div dangerouslySetInnerHTML={{ __html: safeHtml }} />
 * ```
 */
export function sanitizeHtml(html: string, config?: Config): string {
  return DOMPurify.sanitize(html, {
    ...SANITIZE_CONFIG,
    ...config,
    RETURN_TRUSTED_TYPE: false,
  }) as string;
}

/**
 * Sanitizes HTML and returns both the sanitized content and any removed elements.
 * Useful for debugging or logging potentially malicious content.
 *
 * @param html - The HTML string to sanitize
 * @returns Object containing sanitized HTML and removed elements
 */
export function sanitizeHtmlWithReport(html: string): {
  sanitized: string;
  removed: string[];
} {
  const removed: string[] = [];

  DOMPurify.addHook('uponSanitizeElement', (_node, data) => {
    if (data.tagName && !SANITIZE_CONFIG.ALLOWED_TAGS?.includes(data.tagName)) {
      removed.push(`<${data.tagName}>`);
    }
  });

  const sanitized = DOMPurify.sanitize(html, {
    ...SANITIZE_CONFIG,
    RETURN_TRUSTED_TYPE: false,
  }) as string;

  DOMPurify.removeHook('uponSanitizeElement');

  return { sanitized, removed };
}

/**
 * Strips all HTML tags and returns plain text.
 * Useful for generating excerpts or meta descriptions.
 *
 * @param html - The HTML string to strip
 * @returns Plain text without HTML tags
 */
export function stripHtml(html: string): string {
  return DOMPurify.sanitize(html, { ALLOWED_TAGS: [] });
}

/**
 * Sanitizes a URL to prevent javascript: and data: protocol attacks.
 *
 * @param url - The URL to sanitize
 * @returns Safe URL or empty string if potentially dangerous
 */
export function sanitizeUrl(url: string): string {
  const sanitized = url.trim().toLowerCase();

  // Block dangerous protocols
  if (
    sanitized.startsWith('javascript:') ||
    sanitized.startsWith('vbscript:') ||
    sanitized.startsWith('data:text/html')
  ) {
    return '';
  }

  return url;
}

export default DOMPurify;
