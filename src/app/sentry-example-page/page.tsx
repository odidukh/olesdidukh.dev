'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import Head from 'next/head';
import { captureMessage } from '@/lib/sentry';

export default function SentryExamplePage() {
  const [sentMessage, setSentMessage] = useState(false);

  return (
    <>
      <Head>
        <title>Sentry Example Page</title>
      </Head>
      <main>
        <h1>Sentry Example Page</h1>
        <p>
          This page demonstrates Sentry error tracking. Click the buttons below
          to trigger different types of errors.
        </p>

        <div className="flex flex-col gap-4 mt-6 max-w-md">
          <Button
            onClick={() => {
              throw new Error('Sentry Example Frontend Error');
            }}
            variant="destructive"
          >
            Throw Client Error
          </Button>

          <Button
            onClick={async () => {
              try {
                const response = await fetch('/api/sentry-example-api');
                if (!response.ok) {
                  throw new Error(`API Error: ${response.status}`);
                }
              } catch (error) {
                console.error('API call failed:', error);
                throw error;
              }
            }}
            variant="destructive"
          >
            Trigger API Error
          </Button>

          <Button
            onClick={() => {
              captureMessage('Test message from Sentry example page', 'info');
              setSentMessage(true);
              setTimeout(() => setSentMessage(false), 3000);
            }}
            variant="outline"
          >
            Send Test Message
          </Button>

          {sentMessage && (
            <p className="text-sm text-success-600">
              Test message sent to Sentry!
            </p>
          )}
        </div>
      </main>
    </>
  );
}
