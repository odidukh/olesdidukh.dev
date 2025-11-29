'use client';

import { useEffect, useRef, useCallback } from 'react';

export interface UseFocusTrapOptions {
  /**
   * Whether the focus trap is active
   */
  enabled?: boolean;
  /**
   * Return focus to the triggering element on deactivation
   */
  returnFocusOnDeactivate?: boolean;
  /**
   * Selector for initial focus element
   */
  initialFocus?: string;
  /**
   * Selector for elements that should be focusable
   */
  focusableSelector?: string;
  /**
   * Callback when escape key is pressed
   */
  onEscape?: () => void;
}

const DEFAULT_FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable]',
].join(', ');

/**
 * Hook for creating an accessible focus trap
 */
export function useFocusTrap<T extends HTMLElement>(
  options: UseFocusTrapOptions = {}
) {
  const {
    enabled = true,
    returnFocusOnDeactivate = true,
    initialFocus,
    focusableSelector = DEFAULT_FOCUSABLE_SELECTOR,
    onEscape,
  } = options;

  const containerRef = useRef<T>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  /**
   * Get all focusable elements within the container
   */
  const getFocusableElements = useCallback((): HTMLElement[] => {
    if (!containerRef.current) return [];
    const elements =
      containerRef.current.querySelectorAll<HTMLElement>(focusableSelector);
    return Array.from(elements).filter(
      el => !el.hasAttribute('disabled') && el.tabIndex !== -1
    );
  }, [focusableSelector]);

  /**
   * Handle keyboard navigation
   */
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled || !containerRef.current) return;

      // Handle Escape key
      if (event.key === 'Escape' && onEscape) {
        event.preventDefault();
        onEscape();
        return;
      }

      // Handle Tab key for focus trapping
      if (event.key === 'Tab') {
        const focusableElements = getFocusableElements();
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        const activeElement = document.activeElement as HTMLElement;

        // Check if we need to handle focus
        if (!containerRef.current.contains(activeElement)) {
          // Focus is outside container, bring it back
          event.preventDefault();
          firstElement?.focus();
          return;
        }

        if (event.shiftKey) {
          // Shift+Tab: move backwards
          if (activeElement === firstElement) {
            event.preventDefault();
            lastElement?.focus();
          }
        } else {
          // Tab: move forwards
          if (activeElement === lastElement) {
            event.preventDefault();
            firstElement?.focus();
          }
        }
      }
    },
    [enabled, getFocusableElements, onEscape]
  );

  /**
   * Set initial focus
   */
  const setInitialFocus = useCallback(() => {
    if (!containerRef.current) return;

    // Try to focus the specified initial focus element
    if (initialFocus) {
      const initialElement =
        containerRef.current.querySelector<HTMLElement>(initialFocus);
      if (initialElement) {
        initialElement.focus();
        return;
      }
    }

    // Otherwise focus the first focusable element
    const focusableElements = getFocusableElements();
    if (focusableElements.length > 0) {
      focusableElements[0]?.focus();
    } else {
      // If no focusable elements, make the container focusable
      containerRef.current.setAttribute('tabindex', '-1');
      containerRef.current.focus();
    }
  }, [initialFocus, getFocusableElements]);

  // Set up focus trap
  useEffect(() => {
    if (!enabled) return;

    // Store the previously focused element
    previousActiveElement.current = document.activeElement as HTMLElement;

    // Set initial focus after a short delay to ensure DOM is ready
    const focusTimeout = setTimeout(setInitialFocus, 10);

    // Add keyboard listener
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(focusTimeout);
      document.removeEventListener('keydown', handleKeyDown);

      // Return focus to the previous element
      if (returnFocusOnDeactivate && previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    };
  }, [enabled, handleKeyDown, setInitialFocus, returnFocusOnDeactivate]);

  // Handle clicks outside the container to prevent focus escape
  useEffect(() => {
    if (!enabled) return;

    const handleFocusIn = (event: FocusEvent) => {
      if (!containerRef.current) return;

      const target = event.target as HTMLElement;
      if (!containerRef.current.contains(target)) {
        // Focus moved outside the container, bring it back
        const focusableElements = getFocusableElements();
        if (focusableElements.length > 0) {
          focusableElements[0]?.focus();
        }
      }
    };

    document.addEventListener('focusin', handleFocusIn);
    return () => document.removeEventListener('focusin', handleFocusIn);
  }, [enabled, getFocusableElements]);

  return {
    containerRef,
    getFocusableElements,
  };
}
