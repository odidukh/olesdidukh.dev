'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAnalytics } from '@/hooks';
import { Button } from '@/components/ui/Button';
import {
  RESUME_PATH,
  RESUME_FILENAME,
} from '@/components/ui/ResumeDownloadButton';
import { decodeEmail, ENCODED_EMAIL } from '@/lib/obfuscate';
import {
  Github,
  Linkedin,
  AtSign,
  Mail,
  FileText,
  Globe,
  Youtube,
  Instagram,
  ExternalLink,
  Download,
  type LucideIcon,
} from 'lucide-react';

interface SocialLink {
  name: string;
  icon: LucideIcon;
  url: string;
  username: string;
  color: string;
  description: string;
}

// Static social links (email is handled separately for obfuscation)
const staticSocialLinks: SocialLink[] = [
  {
    name: 'GitHub',
    icon: Github,
    url: 'https://github.com/odidukh',
    username: '@odidukh',
    color: 'hover:text-gray-900 dark:hover:text-gray-100',
    description: 'Code repositories & projects',
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
    name: 'Threads',
    icon: AtSign,
    url: 'https://www.threads.com/@oles.o.didukh',
    username: '@oles.o.didukh',
    color: 'hover:text-gray-900 dark:hover:text-gray-100',
    description: 'Tech thoughts & updates',
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

function ResumeLinkItem({ index }: { index: number }) {
  const { trackDownload } = useAnalytics();
  const handleDownload = () => {
    trackDownload('resume_single', 'pdf', {
      version: 'single',
    });
  };

  return (
    <motion.a
      href={RESUME_PATH}
      download={RESUME_FILENAME}
      onClick={handleDownload}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ x: 5 }}
      className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-all duration-200 group"
    >
      <div className="flex items-center gap-3">
        <div className="transition-colors group-hover:text-green-600">
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
        <Download className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </motion.a>
  );
}

export function SocialLinks() {
  const { trackSocialClick } = useAnalytics();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    // Decode email only on client side
    setEmail(decodeEmail(ENCODED_EMAIL));
  }, []);

  const handleSocialClick = (name: string, url: string) => {
    trackSocialClick(name.toLowerCase(), url);
  };

  // Build social links with obfuscated email
  const socialLinks: SocialLink[] = [
    ...staticSocialLinks.slice(0, 3), // GitHub, LinkedIn, Threads
    {
      name: 'Email',
      icon: Mail,
      url: email ? `mailto:${email}` : '#',
      username: email || 'Loading...',
      color: 'hover:text-red-600',
      description: 'Direct contact',
    },
    ...staticSocialLinks.slice(3), // Portfolio
  ];

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

      {/* Resume Link */}
      <ResumeLinkItem index={socialLinks.length} />

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
