'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Command } from 'cmdk';
import { DialogTitle } from '@radix-ui/react-dialog';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/Card';
import {
  FileText,
  Home,
  Briefcase,
  User,
  Mail,
  Moon,
  Sun,
  Monitor,
  Search,
  Palette,
  BookOpen,
} from 'lucide-react';
import { useThemeStore, ThemeAccent } from '@/stores/useThemeStore';
import { useCommandMenuStore } from '@/stores/useCommandMenuStore';
import { useSoundPreference } from '@/stores/useUIPreferencesStore';
import { useAppSounds } from '@/hooks/useAppSounds';
import { useSearch } from '@/hooks/useSearch';
import { Volume2, VolumeX, Wrench, Zap } from 'lucide-react';

const cmdItemClass =
  'relative flex cursor-pointer select-none items-center rounded-sm px-2 py-2 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 transition-colors';

export function CommandMenu() {
  const router = useRouter();
  const { isOpen, close, toggle } = useCommandMenuStore();
  const { mode, setMode, accent, setAccent } = useThemeStore();
  const { soundEnabled, setSoundEnabled } = useSoundPreference();
  const { playPop, playSwoosh } = useAppSounds();
  const { query, setQuery, groupedResults, hasResults } = useSearch({
    limit: 8,
  });

  // Toggle the menu when ⌘K is pressed
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggle();
        if (!isOpen) playSwoosh();
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [toggle, isOpen, playSwoosh]);

  const runCommand = React.useCallback(
    (command: () => unknown) => {
      playPop();
      close();
      command();
    },
    [close, playPop]
  );

  return (
    <Command.Dialog
      open={isOpen}
      onOpenChange={open => {
        if (!open) {
          close();
          setQuery('');
        }
      }}
      label="Global Command Menu"
      className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] sm:pt-[15vh]"
    >
      <DialogTitle className="sr-only">Global Command Menu</DialogTitle>
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
        onClick={close}
        aria-hidden="true"
      />
      <Card
        padding="none"
        className="relative z-50 w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 direction-alternate duration-200 p-2 mx-4 sm:mx-0"
      >
        <Command
          className="flex h-full w-full flex-col overflow-hidden bg-transparent"
          shouldFilter={!query}
        >
          <div className="flex items-center border-b border-border px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <Command.Input
              placeholder="Type a command or search..."
              className="flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
              value={query}
              onValueChange={setQuery}
            />
          </div>
          <Command.List className="max-h-[300px] overflow-y-auto overflow-x-hidden p-2">
            <Command.Empty className="py-6 text-center text-sm">
              No results found.
            </Command.Empty>

            <Command.Group
              heading="Navigation"
              className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground mb-4"
            >
              <Command.Item
                onSelect={() => runCommand(() => router.push('/'))}
                className={cmdItemClass}
                value="Home Page"
              >
                <Home className="mr-2 h-4 w-4" />
                <span>Home</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => router.push('/about'))}
                className={cmdItemClass}
                value="About Me Profile"
              >
                <User className="mr-2 h-4 w-4" />
                <span>About</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => router.push('/experience'))}
                className={cmdItemClass}
                value="Experience and Resume"
              >
                <Briefcase className="mr-2 h-4 w-4" />
                <span>Experience</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => router.push('/projects'))}
                className={cmdItemClass}
                value="Projects and Portfolio"
              >
                <Briefcase className="mr-2 h-4 w-4" />
                <span>Projects</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => router.push('/blog'))}
                className={cmdItemClass}
                value="Blog and Articles"
              >
                <FileText className="mr-2 h-4 w-4" />
                <span>Blog</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => router.push('/guestbook'))}
                className={cmdItemClass}
                value="Guestbook Hall of Fame Messages"
              >
                <BookOpen className="mr-2 h-4 w-4" />
                <span>Guestbook</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => router.push('/skills'))}
                className={cmdItemClass}
                value="Skills Technologies Expertise"
              >
                <Zap className="mr-2 h-4 w-4" />
                <span>Skills</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => router.push('/uses'))}
                className={cmdItemClass}
                value="Uses Developer Setup Stack Tools"
              >
                <Wrench className="mr-2 h-4 w-4" />
                <span>Uses</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => router.push('/contact'))}
                className={cmdItemClass}
                value="Contact Me Let's Talk"
              >
                <Mail className="mr-2 h-4 w-4" />
                <span>Contact</span>
              </Command.Item>
            </Command.Group>

            {query && hasResults && (
              <>
                <Command.Separator className="-mx-1 h-px bg-border my-1" />
                {groupedResults.blog && groupedResults.blog.length > 0 && (
                  <Command.Group
                    heading="Blog Posts"
                    className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground mt-4"
                  >
                    {groupedResults.blog.map(result => (
                      <Command.Item
                        key={result.id}
                        onSelect={() =>
                          runCommand(() => router.push(result.url))
                        }
                        className={cmdItemClass}
                        value={`${result.title} ${result.description}`}
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        <div className="flex flex-col">
                          <span>{result.title}</span>
                          <span className="text-xs text-muted-foreground line-clamp-1">
                            {result.description}
                          </span>
                        </div>
                      </Command.Item>
                    ))}
                  </Command.Group>
                )}
                {groupedResults.project &&
                  groupedResults.project.length > 0 && (
                    <Command.Group
                      heading="Projects"
                      className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground mt-4"
                    >
                      {groupedResults.project.map(result => (
                        <Command.Item
                          key={result.id}
                          onSelect={() =>
                            runCommand(() => router.push(result.url))
                          }
                          className={cmdItemClass}
                          value={`${result.title} ${result.description}`}
                        >
                          <Briefcase className="mr-2 h-4 w-4" />
                          <div className="flex flex-col">
                            <span>{result.title}</span>
                            <span className="text-xs text-muted-foreground line-clamp-1">
                              {result.description}
                            </span>
                          </div>
                        </Command.Item>
                      ))}
                    </Command.Group>
                  )}
              </>
            )}

            <Command.Separator className="-mx-1 h-px bg-border my-1" />

            <Command.Group
              heading="Theme"
              className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground mt-4"
            >
              <Command.Item
                onSelect={() => runCommand(() => setMode('light'))}
                className={cmdItemClass}
                value="Light Theme Mode"
              >
                <Sun className="mr-2 h-4 w-4" />
                <span>Light</span>
                {mode === 'light' && (
                  <span className="ml-auto text-xs text-muted-foreground">
                    Active
                  </span>
                )}
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => setMode('dark'))}
                className={cmdItemClass}
                value="Dark Theme Mode"
              >
                <Moon className="mr-2 h-4 w-4" />
                <span>Dark</span>
                {mode === 'dark' && (
                  <span className="ml-auto text-xs text-muted-foreground">
                    Active
                  </span>
                )}
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => setMode('system'))}
                className={cmdItemClass}
                value="System Theme Mode Auto"
              >
                <Monitor className="mr-2 h-4 w-4" />
                <span>System</span>
                {mode === 'system' && (
                  <span className="ml-auto text-xs text-muted-foreground">
                    Active
                  </span>
                )}
              </Command.Item>
            </Command.Group>

            <Command.Separator className="-mx-1 h-px bg-border my-1" />

            <Command.Group
              heading="Theme Accent"
              className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground mt-4"
            >
              {(
                ['mocha', 'navy', 'emerald', 'rose', 'amber'] as ThemeAccent[]
              ).map(a => (
                <Command.Item
                  key={a}
                  onSelect={() => runCommand(() => setAccent(a))}
                  className={cn(cmdItemClass, 'capitalize')}
                  value={`${a} Accent Color Theme`}
                >
                  <Palette className="mr-2 h-4 w-4" />
                  <span>{a}</span>
                  {accent === a && (
                    <span className="ml-auto text-xs text-muted-foreground">
                      Active
                    </span>
                  )}
                </Command.Item>
              ))}
            </Command.Group>

            <Command.Separator className="-mx-1 h-px bg-border my-1" />

            <Command.Group
              heading="Preferences & Accessibility"
              className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground mt-4"
            >
              <Command.Item
                onSelect={() => {
                  setSoundEnabled(!soundEnabled);
                  if (!soundEnabled) playPop(); // Play sound if we just enabled it
                }}
                className={cmdItemClass}
                value="Toggle UI Sound Effects"
              >
                {soundEnabled ? (
                  <Volume2 className="mr-2 h-4 w-4" />
                ) : (
                  <VolumeX className="mr-2 h-4 w-4" />
                )}
                <span>UI Sound Effects</span>
                <span className="ml-auto text-xs text-muted-foreground">
                  {soundEnabled ? 'On' : 'Off'}
                </span>
              </Command.Item>
            </Command.Group>
          </Command.List>
        </Command>
      </Card>
    </Command.Dialog>
  );
}
