'use client';

import { useEffect } from 'react';

/**
 * Content protection component that prevents basic scraping techniques.
 *
 * Features:
 * - Disables right-click context menu on protected elements
 * - Adds watermark to copied content
 * - Disables view-source keyboard shortcuts
 *
 * Note: These are deterrents, not foolproof protections.
 * Determined scrapers can still access content.
 */
export function ContentProtection() {
  useEffect(() => {
    // Disable right-click context menu on protected elements
    const handleContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('[data-protected]')) {
        e.preventDefault();
      }
    };

    // Add watermark to copied content from protected areas
    const handleCopy = (e: ClipboardEvent) => {
      const selection = window.getSelection()?.toString() || '';
      const isProtectedSelection = document.querySelector(
        '[data-protected]:hover'
      );

      if (selection && isProtectedSelection) {
        const watermark = '\n\n---\nSource: olesdidukh.dev';
        e.clipboardData?.setData('text/plain', selection + watermark);
        e.preventDefault();
      }
    };

    // Disable view-source shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const modKey = isMac ? e.metaKey : e.ctrlKey;

      // Ctrl/Cmd + U (view source)
      if (modKey && e.key.toLowerCase() === 'u') {
        e.preventDefault();
      }
      // Ctrl/Cmd + S (save page)
      if (modKey && e.key.toLowerCase() === 's') {
        e.preventDefault();
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return null;
}
