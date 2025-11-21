'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import {
  Github,
  Linkedin,
  Twitter,
  Mail,
  FileText,
  Globe,
  Youtube,
  Instagram,
  ExternalLink,
} from 'lucide-react';

interface SocialLink {
  name: string;
  icon: React.ElementType;
  url: string;
  username: string;
  color: string;
  description: string;
}

const socialLinks: SocialLink[] = [
  {
    name: 'GitHub',
    icon: Github,
    url: 'https://github.com/odidukh',
    username: '@odidukh',
    color: 'hover:text-gray-900 dark:hover:text-gray-100',
    description: 'Open source projects & code',
  },
  {
    name: 'LinkedIn',
    icon: Linkedin,
    url: 'https://linkedin.com/in/oles-didukh',
    username: '/in/oles-didukh',
    color: 'hover:text-blue-600',
    description: 'Professional network',
  },
  {
    name: 'Twitter',
    icon: Twitter,
    url: 'https://twitter.com/OlesDidukh',
    username: '@OlesDidukh',
    color: 'hover:text-sky-500',
    description: 'Tech thoughts & updates',
  },
  {
    name: 'Email',
    icon: Mail,
    url: 'mailto:oles.didukh@gmail.com',
    username: 'oles.didukh@gmail.com',
    color: 'hover:text-red-600',
    description: 'Direct contact',
  },
  {
    name: 'Resume',
    icon: FileText,
    url: '/resume.pdf',
    username: 'Download PDF',
    color: 'hover:text-green-600',
    description: 'Professional experience',
  },
  {
    name: 'Portfolio',
    icon: Globe,
    url: 'https://olesdidukh.com',
    username: 'olesdidukh.com',
    color: 'hover:text-purple-600',
    description: 'This website',
  },
];

export function SocialLinks() {
  return (
    <div className="space-y-3">
      {socialLinks.map((link, index) => {
        const Icon = link.icon;
        const isExternal = link.url.startsWith('http');
        const isDownload = link.name === 'Resume';

        return (
          <motion.a
            key={link.name}
            href={link.url}
            target={isExternal ? '_blank' : undefined}
            rel={isExternal ? 'noopener noreferrer' : undefined}
            download={isDownload ? true : undefined}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ x: 5 }}
            className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-all duration-200 group"
          >
            <div className="flex items-center gap-3">
              <div className={`transition-colors ${link.color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium">{link.name}</p>
                <p className="text-xs text-muted-foreground">
                  {link.description}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="hidden sm:inline">{link.username}</span>
              <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </motion.a>
        );
      })}

      {/* Additional Platforms */}
      <div className="pt-4 border-t">
        <p className="text-xs text-muted-foreground mb-3">Also available on:</p>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" className="h-8 w-8" asChild>
            <a
              href="https://youtube.com/@olesdidukh"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
            >
              <Youtube className="h-4 w-4" />
            </a>
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8" asChild>
            <a
              href="https://instagram.com/olesdidukh"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <Instagram className="h-4 w-4" />
            </a>
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8" asChild>
            <a
              href="https://dev.to/olesdidukh"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Dev.to"
            >
              <span className="text-xs font-bold">DEV</span>
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
