'use client';

import * as React from 'react';
import * as runtime from 'react/jsx-runtime';
import { useMDXComponents } from '@/mdx-components';

interface MDXProps {
  code: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  components?: Record<string, React.FC<any>>;
}

export function MDXContent({ code, components }: MDXProps) {
  const sharedComponents = useMDXComponents({});

  const Component = React.useMemo(() => {
    // Generate a React component from the compiled string code provided by velite
    const fn = new Function(code);
    return fn({ ...runtime }).default;
  }, [code]);

  return <Component components={{ ...sharedComponents, ...components }} />;
}
