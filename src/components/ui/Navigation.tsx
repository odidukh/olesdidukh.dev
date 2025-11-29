'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useThemeStore } from '@/stores';
import { Button } from './Button';
import { Container } from './Container';
import { Menu, X, Github, Linkedin, Mail, Moon, Sun } from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: 'About', href: '/about' },
  { label: 'Experience', href: '/experience' },
  { label: 'Projects', href: '/projects' },
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
            {/* Social Links */}
            <div className="hidden md:flex items-center space-x-2">
              <Button variant="ghost" size="icon" asChild className="h-9 w-9">
                <a
                  href="https://github.com/odidukh"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                >
                  <Github className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" asChild className="h-9 w-9">
                <a
                  href="https://linkedin.com/in/oles-didukh"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" asChild className="h-9 w-9">
                <a href="mailto:oles.didukh@gmail.com" aria-label="Email">
                  <Mail className="h-4 w-4" />
                </a>
              </Button>
            </div>

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
                <a
                  href="mailto:oles.didukh@gmail.com"
                  className="text-muted-foreground hover:text-primary"
                  aria-label="Email"
                >
                  <Mail className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        )}
      </Container>
    </header>
  );
}
