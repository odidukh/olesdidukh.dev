'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Command } from 'cmdk';
import { DialogTitle } from '@radix-ui/react-dialog';
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
import { Volume2, VolumeX } from 'lucide-react';

export function CommandMenu() {
  const router = useRouter();
  const { isOpen, close, toggle } = useCommandMenuStore();
  const { mode, setMode, accent, setAccent } = useThemeStore();
  const { soundEnabled, setSoundEnabled } = useSoundPreference();
  const { playPop, playSwoosh } = useAppSounds();

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
        if (!open) close();
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
      <div className="relative z-50 w-full max-w-2xl overflow-hidden rounded-xl border border-border bg-card shadow-2xl animate-in fade-in zoom-in-95 direction-alternate duration-200 p-2 mx-4 sm:mx-0">
        <Command
          className="flex h-full w-full flex-col overflow-hidden bg-transparent"
          shouldFilter={true}
        >
          <div className="flex items-center border-b border-border px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <Command.Input
              placeholder="Type a command or search..."
              className="flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
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
                className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-2 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 transition-colors"
                value="Home Page"
              >
                <Home className="mr-2 h-4 w-4" />
                <span>Home</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => router.push('/experience'))}
                className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-2 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 transition-colors"
                value="Experience and Resume"
              >
                <User className="mr-2 h-4 w-4" />
                <span>Experience</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => router.push('/projects'))}
                className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-2 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 transition-colors"
                value="Projects and Portfolio"
              >
                <Briefcase className="mr-2 h-4 w-4" />
                <span>Projects</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => router.push('/blog'))}
                className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-2 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 transition-colors"
                value="Blog and Articles"
              >
                <FileText className="mr-2 h-4 w-4" />
                <span>Blog</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => router.push('/guestbook'))}
                className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-2 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 transition-colors"
                value="Guestbook Hall of Fame Messages"
              >
                <BookOpen className="mr-2 h-4 w-4" />
                <span>Guestbook</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => router.push('/contact'))}
                className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-2 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 transition-colors"
                value="Contact Me Let's Talk"
              >
                <Mail className="mr-2 h-4 w-4" />
                <span>Contact</span>
              </Command.Item>
            </Command.Group>

            <Command.Separator className="-mx-1 h-px bg-border my-1" />

            <Command.Group
              heading="Theme"
              className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground mt-4"
            >
              <Command.Item
                onSelect={() => runCommand(() => setMode('light'))}
                className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-2 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 transition-colors"
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
                className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-2 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 transition-colors"
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
                className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-2 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 transition-colors"
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
                  className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-2 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 transition-colors capitalize"
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
                className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-2 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 transition-colors"
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
      </div>
    </Command.Dialog>
  );
}
