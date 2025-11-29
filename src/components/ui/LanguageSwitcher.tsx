'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Globe } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { locales, localeNames, localeFlags, type Locale } from '@/i18n';

export function LanguageSwitcher() {
  const t = useTranslations('language');
  const locale = useLocale();
  const router = useRouter();
  const [isPending, setIsPending] = React.useState(false);

  const handleLocaleChange = async (newLocale: Locale) => {
    if (newLocale === locale) return;

    setIsPending(true);

    try {
      const response = await fetch('/api/locale', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ locale: newLocale }),
      });

      if (response.ok) {
        // Refresh the page to apply the new locale
        router.refresh();
      }
    } catch (error) {
      console.error('Failed to change locale:', error);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button
          variant="ghost"
          size="icon"
          disabled={isPending}
          aria-label={t('select')}
        >
          <Globe className="h-5 w-5" />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="z-50 min-w-[120px] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md"
          align="end"
          sideOffset={5}
        >
          {locales.map(loc => (
            <DropdownMenu.Item
              key={loc}
              onClick={() => handleLocaleChange(loc)}
              className={`relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 ${
                locale === loc ? 'bg-accent/50' : ''
              }`}
            >
              <span className="mr-2">{localeFlags[loc]}</span>
              {localeNames[loc]}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
