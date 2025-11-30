/**
 * Type-safe polymorphic component utilities
 *
 * These types enable creating components that can render as different HTML elements
 * while maintaining proper type safety for props. This is useful for building
 * flexible UI primitives that can adapt to semantic HTML requirements.
 *
 * ## When to Use Polymorphic Components
 *
 * - Building design system primitives (Box, Stack, Text, Container)
 * - Components that need semantic flexibility (a Card could be an article, section, or div)
 * - Wrapper components that shouldn't impose element constraints
 *
 * ## Usage Patterns
 *
 * ### Basic Usage
 * ```tsx
 * import type { PolymorphicComponentProps } from '@/lib/polymorphic';
 *
 * type BoxProps<C extends React.ElementType = 'div'> = PolymorphicComponentProps<
 *   C,
 *   { padding?: 'sm' | 'md' | 'lg' }
 * >;
 *
 * function Box<C extends React.ElementType = 'div'>({
 *   as,
 *   padding = 'md',
 *   children,
 *   ...props
 * }: BoxProps<C>) {
 *   const Component = as || 'div';
 *   return <Component {...props}>{children}</Component>;
 * }
 *
 * // Usage - the `as` prop allows rendering as different elements:
 * <Box as="section" padding="md">Content</Box>
 * <Box as="article">Article content</Box>
 * <Box as="a" href="/about">Link styled as box</Box>
 * ```
 *
 * ### With Ref Forwarding
 * ```tsx
 * import type { PolymorphicComponentPropsWithRef, PolymorphicRef } from '@/lib/polymorphic';
 *
 * type TextProps<C extends React.ElementType = 'span'> = PolymorphicComponentPropsWithRef<
 *   C,
 *   { variant?: 'body' | 'heading' }
 * >;
 *
 * const Text = React.forwardRef(function Text<C extends React.ElementType = 'span'>(
 *   { as, variant = 'body', ...props }: TextProps<C>,
 *   ref: PolymorphicRef<C>
 * ) {
 *   const Component = as || 'span';
 *   return <Component ref={ref} {...props} />;
 * });
 * ```
 *
 * ## TypeScript Limitations
 *
 * Due to TypeScript limitations with generic inference and strict settings
 * (particularly `exactOptionalPropertyTypes`), polymorphic components may
 * require explicit type assertions in some cases. These types provide a
 * foundation for type safety while allowing flexibility in implementation.
 *
 * @see {@link https://www.benmvp.com/blog/polymorphic-react-components-typescript/}
 */

import type * as React from 'react';

/**
 * Props for specifying the element type to render as
 */
type AsProp<C extends React.ElementType> = {
  /** The element type to render as */
  as?: C;
};

/**
 * Props to exclude when computing final component props
 */
type PropsToOmit<C extends React.ElementType, P> = keyof (AsProp<C> & P);

/**
 * Polymorphic component props that combine:
 * - The `as` prop for specifying the element type
 * - Custom props specific to the component
 * - Native props of the element type (excluding overlapping custom props)
 *
 * @template C - The element type (defaults to 'div')
 * @template Props - Custom props for the component
 */
export type PolymorphicComponentProps<
  C extends React.ElementType,
  Props = object,
> = React.PropsWithChildren<Props & AsProp<C>> &
  Omit<React.ComponentPropsWithoutRef<C>, PropsToOmit<C, Props>>;

/**
 * Polymorphic component props with ref support
 *
 * @template C - The element type
 * @template Props - Custom props for the component
 */
export type PolymorphicComponentPropsWithRef<
  C extends React.ElementType,
  Props = object,
> = PolymorphicComponentProps<C, Props> & { ref?: PolymorphicRef<C> };

/**
 * Extract the ref type for a given element type
 *
 * @template C - The element type
 */
export type PolymorphicRef<C extends React.ElementType> =
  React.ComponentPropsWithRef<C>['ref'];

/**
 * Common HTML elements that can be used with polymorphic components
 */
export type PolymorphicElements =
  | 'div'
  | 'span'
  | 'section'
  | 'article'
  | 'main'
  | 'aside'
  | 'header'
  | 'footer'
  | 'nav'
  | 'p'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'a'
  | 'button'
  | 'ul'
  | 'ol'
  | 'li';
