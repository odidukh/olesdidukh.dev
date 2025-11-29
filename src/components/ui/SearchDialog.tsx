'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import * as Dialog from '@radix-ui/react-dialog';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  X,
  FileText,
  FolderKanban,
  Home,
  ArrowRight,
  Command,
} from 'lucide-react';
import { useSearch } from '@/hooks';
import { cn } from '@/lib/utils';
import type { SearchResult, SearchResultType } from '@/lib/search';

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const typeIcons: Record<SearchResultType, React.ReactNode> = {
  page: <Home className="h-4 w-4" />,
  blog: <FileText className="h-4 w-4" />,
  project: <FolderKanban className="h-4 w-4" />,
};

// Labels for grouped results display (can be used for section headers)
export const typeLabels: Record<SearchResultType, string> = {
  page: 'Pages',
  blog: 'Blog Posts',
  project: 'Projects',
};

function SearchResultItem({
  result,
  isSelected,
  onClick,
}: {
  result: SearchResult;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors',
        isSelected
          ? 'bg-primary text-primary-foreground'
          : 'hover:bg-muted focus:bg-muted'
      )}
    >
      <div
        className={cn(
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-md',
          isSelected ? 'bg-primary-foreground/20' : 'bg-muted'
        )}
      >
        {typeIcons[result.type]}
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate font-medium">{result.title}</div>
        <div
          className={cn(
            'truncate text-xs',
            isSelected ? 'text-primary-foreground/70' : 'text-muted-foreground'
          )}
        >
          {result.description}
        </div>
      </div>
      {result.category && (
        <span
          className={cn(
            'shrink-0 rounded-full px-2 py-0.5 text-xs',
            isSelected
              ? 'bg-primary-foreground/20'
              : 'bg-muted text-muted-foreground'
          )}
        >
          {result.category}
        </span>
      )}
      <ArrowRight
        className={cn('h-4 w-4 shrink-0', isSelected ? '' : 'opacity-0')}
      />
    </button>
  );
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const router = useRouter();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const { query, setQuery, results, isSearching, clearSearch, recentItems } =
    useSearch({ limit: 8 });

  // Display items: search results or recent items
  const displayItems = query ? results : recentItems;

  // Reset selection when results change
  React.useEffect(() => {
    setSelectedIndex(0);
  }, [results]);

  // Focus input when dialog opens
  React.useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 0);
    } else {
      clearSearch();
      setSelectedIndex(0);
    }
  }, [open, clearSearch]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev =>
          prev < displayItems.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev));
        break;
      case 'Enter':
        e.preventDefault();
        if (displayItems[selectedIndex]) {
          navigateTo(displayItems[selectedIndex]);
        }
        break;
      case 'Escape':
        onOpenChange(false);
        break;
    }
  };

  const navigateTo = (result: SearchResult) => {
    router.push(result.url);
    onOpenChange(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
              />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                transition={{ duration: 0.15 }}
                className="fixed left-1/2 top-[15%] z-50 w-full max-w-xl -translate-x-1/2 rounded-xl border bg-background shadow-2xl"
                onKeyDown={handleKeyDown}
              >
                {/* Search Input */}
                <div className="flex items-center gap-3 border-b px-4 py-3">
                  <Search className="h-5 w-5 text-muted-foreground" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="Search pages, projects, blog posts..."
                    className="flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
                  />
                  {query && (
                    <button
                      onClick={clearSearch}
                      className="rounded-md p-1 hover:bg-muted"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                  <Dialog.Close asChild>
                    <button className="rounded-md border px-2 py-1 text-xs text-muted-foreground hover:bg-muted">
                      ESC
                    </button>
                  </Dialog.Close>
                </div>

                {/* Results */}
                <div className="max-h-[60vh] overflow-y-auto p-2">
                  {isSearching ? (
                    <div className="flex items-center justify-center py-8 text-muted-foreground">
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      <span className="ml-2">Searching...</span>
                    </div>
                  ) : displayItems.length > 0 ? (
                    <div className="space-y-1">
                      {!query && (
                        <div className="px-3 py-2 text-xs font-medium text-muted-foreground">
                          Quick Access
                        </div>
                      )}
                      {displayItems.map((result, index) => (
                        <SearchResultItem
                          key={result.id}
                          result={result}
                          isSelected={index === selectedIndex}
                          onClick={() => navigateTo(result)}
                        />
                      ))}
                    </div>
                  ) : query ? (
                    <div className="py-8 text-center text-muted-foreground">
                      <Search className="mx-auto mb-2 h-8 w-8 opacity-50" />
                      <p>No results found for &ldquo;{query}&rdquo;</p>
                      <p className="text-sm">Try a different search term</p>
                    </div>
                  ) : null}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between border-t px-4 py-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <kbd className="rounded border bg-muted px-1.5 py-0.5">
                      ↑
                    </kbd>
                    <kbd className="rounded border bg-muted px-1.5 py-0.5">
                      ↓
                    </kbd>
                    <span>Navigate</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <kbd className="rounded border bg-muted px-1.5 py-0.5">
                      ↵
                    </kbd>
                    <span>Open</span>
                  </div>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}

/**
 * Hook to handle Cmd+K keyboard shortcut
 */
export function useSearchShortcut(onOpen: () => void) {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onOpen();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onOpen]);
}

/**
 * Search trigger button component
 */
export function SearchTrigger({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 rounded-lg border bg-muted/50 px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      aria-label="Search"
    >
      <Search className="h-4 w-4" />
      <span className="hidden sm:inline">Search...</span>
      <kbd className="hidden rounded border bg-background px-1.5 py-0.5 text-xs sm:inline-flex items-center gap-0.5">
        <Command className="h-3 w-3" />K
      </kbd>
    </button>
  );
}
