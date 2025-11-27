'use client';

import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import { useMDXComponents } from '@/mdx-components';

interface MDXContentProps {
  source: MDXRemoteSerializeResult;
}

export function MDXContent({ source }: MDXContentProps) {
  const components = useMDXComponents({});

  return (
    <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:scroll-mt-24">
      <MDXRemote {...source} components={components} />
    </div>
  );
}
