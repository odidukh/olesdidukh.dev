'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useThemeStore } from '@/stores';
import { Button } from './Button';
import { Container } from './Container';
import { SocialIconButton } from './SocialIconButton';
import { ObfuscatedEmailLink } from '@/components/ObfuscatedEmail';
import {
  Menu,
  X,
  Github,
  Linkedin,
  Mail,
  Moon,
  Sun,
  Search,
} from 'lucide-react';
import { useCommandMenuStore } from '@/stores/useCommandMenuStore';

interface NavItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: 'About', href: '/about' },
  { label: 'Experience', href: '/experience' },
  // { label: 'Projects', href: '/projects' },
  { label: 'Skills', href: '/skills' },
  { label: 'Uses', href: '/uses' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
];

interface NavigationProps {
  className?: string;
}

export function Navigation({ className }: NavigationProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);

  // Use global theme store
  const { resolvedTheme, toggleTheme } = useThemeStore();
  const isDark = resolvedTheme === 'dark';

  // Command Menu store
  const { toggle: toggleCommandMenu } = useCommandMenuStore();

  // Handle scroll effect
  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 z-50 w-full transition-all duration-300',
        isScrolled
          ? 'bg-background/80 backdrop-blur-lg shadow-sm'
          : 'bg-transparent',
        className
      )}
    >
      <Container size="wide" padding="md">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="group flex items-center space-x-2 text-xl font-bold"
          >
            <span className="bg-gradient-to-r from-mocha-500 to-accent-green bg-clip-text text-transparent transition-all group-hover:from-mocha-600 group-hover:to-accent-green">
              Oles Didukh
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'relative text-sm font-medium transition-colors hover:text-primary',
                  pathname === item.href
                    ? 'text-primary'
                    : 'text-muted-foreground'
                )}
              >
                {item.label}
                {pathname === item.href && (
                  <span className="absolute -bottom-1 left-0 h-0.5 w-full bg-gradient-to-r from-mocha-500 to-accent-green" />
                )}
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2">
              <SocialIconButton
                icon={Github}
                href="https://github.com/odidukh"
                aria-label="GitHub"
              />
              <SocialIconButton
                icon={Linkedin}
                href="https://linkedin.com/in/oles-didukh"
                aria-label="LinkedIn"
              />
              <SocialIconButton icon={Mail} aria-label="Email" obfuscateEmail />
            </div>

            {/* Command Menu Toggle */}
            <Button
              variant="outline"
              className="hidden md:flex relative h-9 w-full justify-start rounded-[0.5rem] bg-background text-sm font-normal text-muted-foreground shadow-none sm:pr-12 md:w-40 lg:w-56"
              onClick={toggleCommandMenu}
            >
              <span className="hidden lg:inline-flex">Search...</span>
              <span className="inline-flex lg:hidden">
                <Search className="h-4 w-4" />
              </span>
              <kbd className="pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                <span className="text-xs">⌘</span>K
              </kbd>
            </Button>

            {/* Dark Mode Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="h-9 w-9"
              aria-label="Toggle dark mode"
            >
              {isDark ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden h-9 w-9"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </nav>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t">
            <div className="flex flex-col space-y-4 pt-4">
              {navItems.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    'text-sm font-medium transition-colors hover:text-primary px-2 py-1',
                    pathname === item.href
                      ? 'text-primary bg-primary/10 rounded'
                      : 'text-muted-foreground'
                  )}
                >
                  {item.label}
                </Link>
              ))}

              {/* Mobile Social Links */}
              <div className="flex space-x-4 pt-4 border-t">
                <a
                  href="https://github.com/odidukh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary"
                  aria-label="GitHub"
                >
                  <Github className="h-5 w-5" />
                </a>
                <a
                  href="https://linkedin.com/in/oles-didukh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
                <ObfuscatedEmailLink
                  className="text-muted-foreground hover:text-primary"
                  ariaLabel="Email"
                >
                  <Mail className="h-5 w-5" />
                </ObfuscatedEmailLink>
              </div>
            </div>
          </div>
        )}
      </Container>
    </header>
  );
}
