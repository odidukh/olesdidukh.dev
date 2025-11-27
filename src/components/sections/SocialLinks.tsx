'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { track } from '@vercel/analytics';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Button } from '@/components/ui/Button';
import {
  RESUME_COMPACT_PATH,
  RESUME_EXTENDED_PATH,
} from '@/components/ui/ResumeDownloadButton';
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
  ChevronDown,
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
    name: 'Portfolio',
    icon: Globe,
    url: 'https://olesdidukh.com',
    username: 'olesdidukh.com',
    color: 'hover:text-purple-600',
    description: 'This website',
  },
];

const resumeVersions = [
  {
    version: 'compact' as const,
    label: 'Compact (1 page)',
    path: RESUME_COMPACT_PATH,
    filename: 'Oles_Didukh_Resume_Compact.pdf',
  },
  {
    version: 'extended' as const,
    label: 'Extended (2+ pages)',
    path: RESUME_EXTENDED_PATH,
    filename: 'Oles_Didukh_Resume_Extended.pdf',
  },
];

function ResumeDropdownItem({ index }: { index: number }) {
  const handleDownload = (version: 'compact' | 'extended') => {
    track('resume_download', {
      version,
      location: window.location.pathname,
    });
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <motion.button
          type="button"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-all duration-200 group text-left"
        >
          <div className="flex items-center gap-3">
            <div className="transition-colors hover:text-green-600">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium">Resume</p>
              <p className="text-xs text-muted-foreground">
                Professional experience
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="hidden sm:inline">Download PDF</span>
            <ChevronDown className="h-3 w-3" />
          </div>
        </motion.button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="z-50 min-w-[180px] rounded-lg border border-border bg-white p-1 shadow-lg dark:bg-gray-900"
          sideOffset={5}
          align="end"
        >
          {resumeVersions.map(({ version, label, path, filename }) => (
            <DropdownMenu.Item key={version} asChild>
              <a
                href={path}
                download={filename}
                onClick={() => handleDownload(version)}
                className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-900 outline-none transition-colors hover:bg-gray-100 focus:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-800 dark:focus:bg-gray-800 data-[highlighted]:!bg-gray-100 data-[highlighted]:!text-gray-900 dark:data-[highlighted]:!bg-gray-800 dark:data-[highlighted]:!text-gray-100"
              >
                <FileText className="h-4 w-4 text-muted-foreground" />
                {label}
              </a>
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

export function SocialLinks() {
  const handleSocialClick = (name: string, url: string) => {
    track('social_link_click', {
      platform: name.toLowerCase(),
      url,
      location: window.location.pathname,
    });
  };

  return (
    <div className="space-y-3">
      {socialLinks.map((link, index) => {
        const Icon = link.icon;
        const isExternal = link.url.startsWith('http');

        return (
          <motion.a
            key={link.name}
            href={link.url}
            target={isExternal ? '_blank' : undefined}
            rel={isExternal ? 'noopener noreferrer' : undefined}
            onClick={() => handleSocialClick(link.name, link.url)}
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

      {/* Resume with dropdown */}
      <ResumeDropdownItem index={socialLinks.length} />

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
              onClick={() =>
                handleSocialClick('YouTube', 'https://youtube.com/@olesdidukh')
              }
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
              onClick={() =>
                handleSocialClick(
                  'Instagram',
                  'https://instagram.com/olesdidukh'
                )
              }
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
              onClick={() =>
                handleSocialClick('Dev.to', 'https://dev.to/olesdidukh')
              }
            >
              <span className="text-xs font-bold">DEV</span>
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
