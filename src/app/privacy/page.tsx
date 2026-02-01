import type { Metadata } from 'next';
import { Navigation } from '@/components/ui/Navigation';
import { Footer } from '@/components/ui/Footer';
import { Container } from '@/components/ui/Container';

export const metadata: Metadata = {
  title: 'Privacy Policy | Oles Didukh',
  description:
    'Privacy policy for olesdidukh.dev - Learn how we collect, use, and protect your personal information.',
  openGraph: {
    title: 'Privacy Policy | Oles Didukh',
    description: 'Privacy policy for olesdidukh.dev',
    url: 'https://olesdidukh.dev/privacy',
    type: 'website',
    images: [
      {
        url: '/api/og?title=Privacy%20Policy&subtitle=olesdidukh.dev',
        width: 1200,
        height: 630,
        alt: 'Privacy Policy',
      },
    ],
  },
  alternates: {
    canonical: 'https://olesdidukh.dev/privacy',
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function PrivacyPolicyPage() {
  const lastUpdated = 'November 30, 2025';

  return (
    <>
      <Navigation />
      <main id="main-content" className="pt-20 pb-16">
        <Container size="md">
          <article className="prose prose-gray dark:prose-invert max-w-none">
            <header className="mb-12 not-prose">
              <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
              <p className="text-muted-foreground">
                Last updated: {lastUpdated}
              </p>
            </header>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
              <p className="text-muted-foreground mb-4">
                Welcome to olesdidukh.dev (&quot;the Website&quot;). I respect
                your privacy and am committed to protecting your personal data.
                This privacy policy explains how I collect, use, and safeguard
                your information when you visit my website.
              </p>
              <p className="text-muted-foreground">
                This website is a personal portfolio showcasing my work as a
                Senior Front-End Engineer. It is not a commercial service, and I
                do not sell any products or services directly through this site.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                Information I Collect
              </h2>

              <h3 className="text-xl font-medium mb-3 mt-6">
                Information You Provide
              </h3>
              <p className="text-muted-foreground mb-4">
                When you use the contact form on this website, I collect:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                <li>Your name</li>
                <li>Your email address</li>
                <li>The content of your message</li>
                <li>Any other information you choose to include</li>
              </ul>

              <h3 className="text-xl font-medium mb-3 mt-6">
                Automatically Collected Information
              </h3>
              <p className="text-muted-foreground mb-4">
                When you visit the Website, certain information is collected
                automatically:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>
                  <strong>Analytics Data:</strong> I use Vercel Analytics, a
                  privacy-focused analytics service that collects anonymized
                  data about page views, referrers, and general usage patterns.
                  This service does not use cookies and does not track
                  individual users across sites.
                </li>
                <li>
                  <strong>Performance Data:</strong> Vercel Speed Insights may
                  collect performance metrics to help improve the website&apos;s
                  loading speed and user experience.
                </li>
                <li>
                  <strong>Error Data:</strong> I use Sentry for error monitoring
                  to identify and fix technical issues. This may include
                  information about errors encountered, browser type, and device
                  information. No personally identifiable information is
                  intentionally collected through error tracking.
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                How I Use Your Information
              </h2>
              <p className="text-muted-foreground mb-4">
                I use the information collected for the following purposes:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>
                  To respond to your inquiries submitted through the contact
                  form
                </li>
                <li>
                  To improve the website&apos;s performance and user experience
                </li>
                <li>To identify and fix technical issues and bugs</li>
                <li>To understand how visitors interact with the website</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                Cookies and Local Storage
              </h2>
              <p className="text-muted-foreground mb-4">
                This website uses minimal cookies and local storage:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>
                  <strong>Theme Preference:</strong> Your light/dark mode
                  preference is stored in local storage to remember your choice
                  across visits.
                </li>
                <li>
                  <strong>Essential Cookies:</strong> Some essential cookies may
                  be set by the hosting provider (Vercel) for security and
                  performance purposes.
                </li>
              </ul>
              <p className="text-muted-foreground mt-4">
                I do not use advertising cookies or tracking cookies from
                third-party advertising networks.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                Third-Party Services
              </h2>
              <p className="text-muted-foreground mb-4">
                This website uses the following third-party services:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>
                  <strong>Vercel:</strong> Hosting, analytics, and speed
                  insights.{' '}
                  <a
                    href="https://vercel.com/legal/privacy-policy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Vercel Privacy Policy
                  </a>
                </li>
                <li>
                  <strong>Sentry:</strong> Error monitoring and performance
                  tracking.{' '}
                  <a
                    href="https://sentry.io/privacy/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Sentry Privacy Policy
                  </a>
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Data Retention</h2>
              <p className="text-muted-foreground mb-4">
                I retain your personal information only for as long as necessary
                to fulfill the purposes outlined in this privacy policy:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>
                  <strong>Contact Form Submissions:</strong> Retained for up to
                  2 years or until you request deletion.
                </li>
                <li>
                  <strong>Analytics Data:</strong> Aggregated and anonymized
                  data is retained according to Vercel&apos;s data retention
                  policies.
                </li>
                <li>
                  <strong>Error Logs:</strong> Retained for up to 90 days for
                  debugging purposes.
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Your Rights</h2>
              <p className="text-muted-foreground mb-4">
                Depending on your location, you may have the following rights
                regarding your personal data:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>
                  <strong>Access:</strong> Request a copy of the personal data I
                  hold about you.
                </li>
                <li>
                  <strong>Correction:</strong> Request correction of inaccurate
                  personal data.
                </li>
                <li>
                  <strong>Deletion:</strong> Request deletion of your personal
                  data.
                </li>
                <li>
                  <strong>Objection:</strong> Object to the processing of your
                  personal data.
                </li>
              </ul>
              <p className="text-muted-foreground mt-4">
                To exercise any of these rights, please contact me using the
                information provided below.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
              <p className="text-muted-foreground">
                I implement appropriate technical and organizational measures to
                protect your personal data against unauthorized access,
                alteration, disclosure, or destruction. The website is served
                over HTTPS, and I regularly review and update security
                practices.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                Children&apos;s Privacy
              </h2>
              <p className="text-muted-foreground">
                This website is not intended for children under the age of 16. I
                do not knowingly collect personal information from children. If
                you believe I have inadvertently collected information from a
                child, please contact me immediately.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                Changes to This Policy
              </h2>
              <p className="text-muted-foreground">
                I may update this privacy policy from time to time. Any changes
                will be posted on this page with an updated &quot;Last
                updated&quot; date. I encourage you to review this policy
                periodically.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Contact Me</h2>
              <p className="text-muted-foreground mb-4">
                If you have any questions about this privacy policy or wish to
                exercise your rights, please contact me:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>
                  Through the{' '}
                  <a href="/contact" className="text-primary hover:underline">
                    contact form
                  </a>{' '}
                  on this website
                </li>
                <li>
                  Email:{' '}
                  <a
                    href="mailto:contact@olesdidukh.dev"
                    className="text-primary hover:underline"
                  >
                    contact@olesdidukh.dev
                  </a>
                </li>
              </ul>
            </section>
          </article>
        </Container>
      </main>
      <Footer />
    </>
  );
}
