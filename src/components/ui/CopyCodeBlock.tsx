'use client';

import * as React from 'react';
import { Check, Copy } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export function CopyCodeBlock({
  children,
  ...props
}: React.HTMLAttributes<HTMLPreElement>) {
  const [copied, setCopied] = React.useState(false);
  const preRef = React.useRef<HTMLPreElement>(null);
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleCopy = async () => {
    const text = preRef.current?.textContent ?? '';
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      timeoutRef.current = setTimeout(() => setCopied(false), 2000);
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
      <Button
        type="button"
        variant="code"
        size="sm"
        onClick={handleCopy}
        aria-label={copied ? 'Copied!' : 'Copy code'}
        className={cn(
          'absolute top-3 right-3 gap-1.5 opacity-0 group-hover/codeblock:opacity-100 focus:opacity-100',
          copied &&
            'border-green-500/50 bg-green-500/20 text-green-400 hover:bg-green-500/20 hover:text-green-400'
        )}
      >
        <span className="sr-only" aria-live="polite">
          {copied ? 'Code copied to clipboard' : ''}
        </span>
        {copied ? (
          <>
            <Check className="h-3 w-3" aria-hidden="true" />
            Copied
          </>
        ) : (
          <>
            <Copy className="h-3 w-3" aria-hidden="true" />
            Copy
          </>
        )}
      </Button>
    </div>
  );
}
