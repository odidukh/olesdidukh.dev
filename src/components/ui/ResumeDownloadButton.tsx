'use client';

import * as React from 'react';
import { track } from '@vercel/analytics';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Button, type ButtonProps } from './Button';
import { Download, FileText, ChevronDown } from 'lucide-react';

// Resume versions
const RESUME_COMPACT_PATH = '/Oles_Didukh_Resume_Compact.pdf';
const RESUME_EXTENDED_PATH = '/Oles_Didukh_Resume_Extended.pdf';

type ResumeVersion = 'compact' | 'extended';

const resumeVersions: {
  version: ResumeVersion;
  label: string;
  description: string;
  path: string;
  filename: string;
}[] = [
  {
    version: 'compact',
    label: 'Compact (1 page)',
    description: 'Concise overview of skills and experience',
    path: RESUME_COMPACT_PATH,
    filename: 'Oles_Didukh_Resume_Compact.pdf',
  },
  {
    version: 'extended',
    label: 'Extended (2+ pages)',
    description: 'Detailed background with all projects',
    path: RESUME_EXTENDED_PATH,
    filename: 'Oles_Didukh_Resume_Extended.pdf',
  },
];

function trackDownload(version: ResumeVersion) {
  track('resume_download', {
    version,
    location: window.location.pathname,
  });
}

interface ResumeDownloadButtonProps
  extends Omit<ButtonProps, 'asChild' | 'onClick'> {
  showIcon?: boolean;
  children?: React.ReactNode;
}

export function ResumeDownloadButton({
  showIcon = true,
  children,
  className,
  ...props
}: ResumeDownloadButtonProps) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button className={className} {...props}>
          {showIcon && <Download className="mr-2 h-4 w-4" />}
          {children ?? 'Download Resume'}
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="z-50 min-w-[220px] rounded-lg border border-border bg-white p-1 shadow-lg dark:bg-gray-900"
          sideOffset={5}
          align="center"
        >
          {resumeVersions.map(
            ({ version, label, description, path, filename }) => (
              <DropdownMenu.Item key={version} asChild>
                <a
                  href={path}
                  download={filename}
                  onClick={() => trackDownload(version)}
                  className="flex cursor-pointer items-start gap-3 rounded-md px-3 py-2 text-sm text-gray-900 outline-none transition-colors hover:bg-gray-100 focus:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-800 dark:focus:bg-gray-800 data-[highlighted]:!bg-gray-100 data-[highlighted]:!text-gray-900 dark:data-[highlighted]:!bg-gray-800 dark:data-[highlighted]:!text-gray-100"
                >
                  <FileText className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  <div>
                    <div className="font-medium">{label}</div>
                    <div className="text-xs text-muted-foreground">
                      {description}
                    </div>
                  </div>
                </a>
              </DropdownMenu.Item>
            )
          )}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

// Simple dropdown link version for footer/text contexts
interface ResumeDownloadLinkProps {
  className?: string;
  children?: React.ReactNode;
}

export function ResumeDownloadLink({
  className,
  children,
}: ResumeDownloadLinkProps) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className={`inline-flex items-center ${className ?? ''}`}
          type="button"
        >
          {children ?? 'Download Resume'}
          <ChevronDown className="ml-1 h-3 w-3" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="z-50 min-w-[200px] rounded-lg border border-border bg-white p-1 shadow-lg dark:bg-gray-900"
          sideOffset={5}
          align="start"
        >
          {resumeVersions.map(({ version, label, path, filename }) => (
            <DropdownMenu.Item key={version} asChild>
              <a
                href={path}
                download={filename}
                onClick={() => trackDownload(version)}
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

// Export paths for consistency
export { RESUME_COMPACT_PATH, RESUME_EXTENDED_PATH };
