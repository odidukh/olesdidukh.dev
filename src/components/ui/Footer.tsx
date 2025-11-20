import Link from 'next/link';
import { Container } from './Container';
import { Button } from './Button';
import { Badge } from './Badge';
import {
  Github,
  Linkedin,
  Mail,
  Twitter,
  Heart,
  ExternalLink,
  MapPin,
  Phone,
} from 'lucide-react';

interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

const navigationLinks: FooterLink[] = [
  { label: 'About', href: '/about' },
  { label: 'Experience', href: '/experience' },
  { label: 'Projects', href: '/projects' },
  { label: 'Skills', href: '/skills' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
];

const resourceLinks: FooterLink[] = [
  { label: 'Resume', href: '/resume.pdf', external: true },
  { label: 'Case Studies', href: '/case-studies' },
  { label: 'Testimonials', href: '/testimonials' },
  { label: 'Privacy Policy', href: '/privacy' },
];

const techStack = ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Node.js'];

interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={className}>
      {/* Main Footer */}
      <div className="bg-muted/50 border-t">
        <Container size="wide" padding="lg" paddingY="xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Brand Section */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold mb-2">Oles Didukh</h3>
                <p className="text-sm text-muted-foreground">
                  Senior Front-End Engineer crafting exceptional digital
                  experiences
                </p>
              </div>

              {/* Location & Contact */}
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>Vinnytsia, Ukraine</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <a
                    href="mailto:oles.didukh@gmail.com"
                    className="hover:text-primary transition-colors"
                  >
                    oles.didukh@gmail.com
                  </a>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>+38 067 88 99 570</span>
                </div>
              </div>
            </div>

            {/* Navigation Links */}
            <div>
              <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">
                Navigation
              </h4>
              <ul className="space-y-2">
                {navigationLinks.map(link => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center"
                    >
                      {link.label}
                      {link.external && (
                        <ExternalLink className="ml-1 h-3 w-3" />
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">
                Resources
              </h4>
              <ul className="space-y-2">
                {resourceLinks.map(link => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center"
                      {...(link.external && {
                        target: '_blank',
                        rel: 'noopener noreferrer',
                      })}
                    >
                      {link.label}
                      {link.external && (
                        <ExternalLink className="ml-1 h-3 w-3" />
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tech Stack & Social */}
            <div>
              <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">
                Tech Stack
              </h4>
              <div className="flex flex-wrap gap-2 mb-6">
                {techStack.map(tech => (
                  <Badge
                    key={tech}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                  >
                    {tech}
                  </Badge>
                ))}
              </div>

              <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">
                Connect
              </h4>
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  asChild
                  className="h-9 w-9 hover:text-primary"
                >
                  <a
                    href="https://github.com/odidukh"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub"
                  >
                    <Github className="h-4 w-4" />
                  </a>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  asChild
                  className="h-9 w-9 hover:text-primary"
                >
                  <a
                    href="https://linkedin.com/in/oles-didukh"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  asChild
                  className="h-9 w-9 hover:text-primary"
                >
                  <a
                    href="https://twitter.com/OlesDidukh"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Twitter"
                  >
                    <Twitter className="h-4 w-4" />
                  </a>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  asChild
                  className="h-9 w-9 hover:text-primary"
                >
                  <a href="mailto:oles.didukh@gmail.com" aria-label="Email">
                    <Mail className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Bottom Bar */}
      <div className="bg-background border-t">
        <Container size="wide" padding="md">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <p className="text-sm text-muted-foreground">
              © {currentYear} Oles Didukh. All rights reserved.
            </p>
            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
              <span>Built with</span>
              <Heart className="h-3 w-3 text-red-500 fill-red-500" />
              <span>using Next.js & Tailwind CSS</span>
            </div>
          </div>
        </Container>
      </div>
    </footer>
  );
}
