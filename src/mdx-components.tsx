import type { MDXComponents } from 'mdx/types';
import Image from 'next/image';
import Link from 'next/link';

// Custom components for MDX content
function CustomLink({
  href,
  children,
  className,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const isInternalLink = href && (href.startsWith('/') || href.startsWith('#'));
  const linkClassName =
    'text-mocha-600 underline decoration-mocha-300 underline-offset-2 transition-colors hover:text-mocha-700 hover:decoration-mocha-500 dark:text-mocha-400 dark:decoration-mocha-600 dark:hover:text-mocha-300';

  if (isInternalLink) {
    return (
      <Link href={href} className={`${linkClassName} ${className || ''}`}>
        {children}
      </Link>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${linkClassName} ${className || ''}`}
      {...props}
    >
      {children}
    </a>
  );
}

function CustomImage({ src, alt }: { src?: string; alt?: string }) {
  if (!src || typeof src !== 'string') return null;

  return (
    <span className="my-8 block overflow-hidden rounded-xl">
      <Image
        src={src}
        alt={alt || 'Blog post image'}
        width={800}
        height={450}
        className="w-full"
      />
    </span>
  );
}

function Callout({
  children,
  type = 'info',
}: {
  children: React.ReactNode;
  type?: 'info' | 'warning' | 'error' | 'success';
}) {
  const styles = {
    info: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-200',
    warning:
      'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-200',
    error:
      'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200',
    success:
      'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200',
  };

  return (
    <div className={`my-6 rounded-lg border-l-4 p-4 ${styles[type]}`}>
      {children}
    </div>
  );
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Headings
    h1: ({ children, ...props }) => (
      <h1
        className="mb-6 mt-12 text-4xl font-bold tracking-tight text-gray-900 first:mt-0 dark:text-white"
        {...props}
      >
        {children}
      </h1>
    ),
    h2: ({ children, ...props }) => (
      <h2
        className="mb-4 mt-10 text-3xl font-bold tracking-tight text-gray-900 dark:text-white"
        {...props}
      >
        {children}
      </h2>
    ),
    h3: ({ children, ...props }) => (
      <h3
        className="mb-3 mt-8 text-2xl font-semibold text-gray-900 dark:text-white"
        {...props}
      >
        {children}
      </h3>
    ),
    h4: ({ children, ...props }) => (
      <h4
        className="mb-2 mt-6 text-xl font-semibold text-gray-900 dark:text-white"
        {...props}
      >
        {children}
      </h4>
    ),

    // Paragraphs and text
    p: ({ children, ...props }) => (
      <p className="my-4 leading-7 text-gray-700 dark:text-gray-300" {...props}>
        {children}
      </p>
    ),
    strong: ({ children, ...props }) => (
      <strong
        className="font-semibold text-gray-900 dark:text-white"
        {...props}
      >
        {children}
      </strong>
    ),
    em: ({ children, ...props }) => (
      <em className="italic" {...props}>
        {children}
      </em>
    ),

    // Links and images
    a: CustomLink,
    img: CustomImage,

    // Lists
    ul: ({ children, ...props }) => (
      <ul
        className="my-4 ml-6 list-disc space-y-2 text-gray-700 dark:text-gray-300"
        {...props}
      >
        {children}
      </ul>
    ),
    ol: ({ children, ...props }) => (
      <ol
        className="my-4 ml-6 list-decimal space-y-2 text-gray-700 dark:text-gray-300"
        {...props}
      >
        {children}
      </ol>
    ),
    li: ({ children, ...props }) => (
      <li className="leading-7" {...props}>
        {children}
      </li>
    ),

    // Code blocks
    pre: ({ children, ...props }) => (
      <pre
        className="my-6 overflow-x-auto rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm dark:border-gray-700 dark:bg-gray-900"
        {...props}
      >
        {children}
      </pre>
    ),
    code: ({ children, ...props }) => {
      // Check if this is an inline code or a code block
      const isInline = typeof children === 'string';
      if (isInline) {
        return (
          <code
            className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-sm text-mocha-700 dark:bg-gray-800 dark:text-mocha-300"
            {...props}
          >
            {children}
          </code>
        );
      }
      return <code {...props}>{children}</code>;
    },

    // Blockquotes
    blockquote: ({ children, ...props }) => (
      <blockquote
        className="my-6 border-l-4 border-mocha-300 pl-4 italic text-gray-700 dark:border-mocha-600 dark:text-gray-300"
        {...props}
      >
        {children}
      </blockquote>
    ),

    // Horizontal rule
    hr: props => (
      <hr
        className="my-8 border-t border-gray-200 dark:border-gray-700"
        {...props}
      />
    ),

    // Tables
    table: ({ children, ...props }) => (
      <div className="my-6 overflow-x-auto">
        <table
          className="min-w-full divide-y divide-gray-200 dark:divide-gray-700"
          {...props}
        >
          {children}
        </table>
      </div>
    ),
    thead: ({ children, ...props }) => (
      <thead className="bg-gray-50 dark:bg-gray-800" {...props}>
        {children}
      </thead>
    ),
    tbody: ({ children, ...props }) => (
      <tbody
        className="divide-y divide-gray-200 dark:divide-gray-700"
        {...props}
      >
        {children}
      </tbody>
    ),
    tr: ({ children, ...props }) => <tr {...props}>{children}</tr>,
    th: ({ children, ...props }) => (
      <th
        className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white"
        {...props}
      >
        {children}
      </th>
    ),
    td: ({ children, ...props }) => (
      <td
        className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300"
        {...props}
      >
        {children}
      </td>
    ),

    // Custom components
    Callout,

    ...components,
  };
}
