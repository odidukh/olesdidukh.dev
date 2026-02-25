'use client';

import * as React from 'react';
import { useAnalytics } from '@/hooks';
import { trackResumeDownloadConversion } from '@/lib/conversions';
import { Button, type ButtonProps } from './Button';
import { Download, FileText } from 'lucide-react';

export const RESUME_PATH = '/Oles_Didukh_SENIOR_FE_ENGINEER.pdf';
export const RESUME_FILENAME = 'Oles_Didukh_SENIOR_FE_ENGINEER.pdf';

interface ResumeDownloadButtonProps extends Omit<
  ButtonProps,
  'asChild' | 'onClick'
> {
  showIcon?: boolean;
  children?: React.ReactNode;
}

export function ResumeDownloadButton({
  showIcon = true,
  children,
  className,
  ...props
}: ResumeDownloadButtonProps) {
  const { trackDownload } = useAnalytics();

  const handleDownload = () => {
    trackDownload('resume_single', 'pdf', { version: 'single' });
    trackResumeDownloadConversion('single');
  };

  return (
    <Button className={className} asChild {...props}>
      <a href={RESUME_PATH} download={RESUME_FILENAME} onClick={handleDownload}>
        {showIcon && <Download className="mr-2 h-4 w-4" />}
        {children ?? 'Download Resume'}
      </a>
    </Button>
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
  const { trackDownload } = useAnalytics();

  const handleDownload = () => {
    trackDownload('resume_single', 'pdf', { version: 'single' });
    trackResumeDownloadConversion('single');
  };

  return (
    <a
      href={RESUME_PATH}
      download={RESUME_FILENAME}
      onClick={handleDownload}
      className={`inline-flex items-center hover:text-primary transition-colors ${className ?? ''}`}
    >
      <FileText className="mr-2 h-4 w-4" />
      {children ?? 'Download Resume'}
    </a>
  );
}

// Export paths for consistency with older modules if still referenced
export const RESUME_COMPACT_PATH = RESUME_PATH;
export const RESUME_EXTENDED_PATH = RESUME_PATH;
