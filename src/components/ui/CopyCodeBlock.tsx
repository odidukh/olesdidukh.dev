'use client';

import * as React from 'react';

export function CopyCodeBlock({
  children,
  ...props
}: React.HTMLAttributes<HTMLPreElement>) {
  const [copied, setCopied] = React.useState(false);
  const preRef = React.useRef<HTMLPreElement>(null);

  const handleCopy = async () => {
    const text = preRef.current?.textContent ?? '';
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API not available — silent fail
    }
  };

  return (
    <div className="relative group/codeblock my-6">
      <pre
        ref={preRef}
        className="overflow-x-auto rounded-xl border border-gray-600 bg-[#1e293b] p-5 text-[0.9375rem] leading-7 text-gray-200"
        {...props}
      >
        {children}
      </pre>
      <button
        onClick={handleCopy}
        aria-label={copied ? 'Copied!' : 'Copy code'}
        className={`absolute top-3 right-3 flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs transition-all duration-200 opacity-0 group-hover/codeblock:opacity-100 focus:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 ${
          copied
            ? 'border-green-500/50 bg-green-500/20 text-green-400'
            : 'border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
        }`}
      >
        <span className="sr-only" aria-live="polite">
          {copied ? 'Code copied to clipboard' : ''}
        </span>
        {copied ? (
          <>
            <svg
              className="h-3 w-3"
              viewBox="0 0 16 16"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.75.75 0 0 1 1.06-1.06L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0z" />
            </svg>
            Copied
          </>
        ) : (
          <>
            <svg
              className="h-3 w-3"
              viewBox="0 0 16 16"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z" />
              <path d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z" />
            </svg>
            Copy
          </>
        )}
      </button>
    </div>
  );
}
