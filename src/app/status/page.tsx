'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Navigation } from '@/components/ui/Navigation';
import { Footer } from '@/components/ui/Footer';
import {
  Activity,
  CheckCircle,
  AlertTriangle,
  XCircle,
  RefreshCw,
  Server,
  Globe,
  Zap,
  Clock,
  TrendingUp,
  Shield,
  Database,
} from 'lucide-react';
import {
  getCollectedMetrics,
  getPerformanceSummary,
  type PerformanceMetric,
  type MetricRating,
  formatMetricValue,
  type MetricName,
  PERFORMANCE_THRESHOLDS,
} from '@/lib/performance';

interface ServiceStatus {
  name: string;
  status: 'operational' | 'degraded' | 'down' | 'unknown';
  latency?: number;
  lastChecked: Date;
  description: string;
}

interface HealthCheck {
  service: string;
  endpoint: string;
  status: 'ok' | 'error' | 'pending';
  responseTime?: number;
}

const getRatingColor = (rating: MetricRating): string => {
  switch (rating) {
    case 'good':
      return 'text-success-600 dark:text-success-400';
    case 'needs-improvement':
      return 'text-warning-600 dark:text-warning-400';
    case 'poor':
      return 'text-error-600 dark:text-error-400';
    default:
      return 'text-muted-foreground';
  }
};

const getRatingBg = (rating: MetricRating): string => {
  switch (rating) {
    case 'good':
      return 'bg-success-100 dark:bg-success-900/30';
    case 'needs-improvement':
      return 'bg-warning-100 dark:bg-warning-900/30';
    case 'poor':
      return 'bg-error-100 dark:bg-error-900/30';
    default:
      return 'bg-muted';
  }
};

const getStatusIcon = (status: ServiceStatus['status']) => {
  switch (status) {
    case 'operational':
      return (
        <CheckCircle className="h-5 w-5 text-success-600 dark:text-success-400" />
      );
    case 'degraded':
      return (
        <AlertTriangle className="h-5 w-5 text-warning-600 dark:text-warning-400" />
      );
    case 'down':
      return <XCircle className="h-5 w-5 text-error-600 dark:text-error-400" />;
    default:
      return <Clock className="h-5 w-5 text-muted-foreground" />;
  }
};

const metricDescriptions: Record<MetricName, string> = {
  LCP: 'Largest Contentful Paint - Loading performance',
  FID: 'First Input Delay - Interactivity',
  CLS: 'Cumulative Layout Shift - Visual stability',
  FCP: 'First Contentful Paint - Initial render',
  TTFB: 'Time to First Byte - Server response',
  INP: 'Interaction to Next Paint - Responsiveness',
};

export default function StatusPage() {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [summary, setSummary] = useState<ReturnType<
    typeof getPerformanceSummary
  > | null>(null);
  const [healthChecks, setHealthChecks] = useState<HealthCheck[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const services: ServiceStatus[] = [
    {
      name: 'Website',
      status: 'operational',
      description: 'Main website and all pages',
      lastChecked: new Date(),
    },
    {
      name: 'API',
      status: healthChecks.some(h => h.status === 'error')
        ? 'degraded'
        : 'operational',
      description: 'Contact form and newsletter endpoints',
      lastChecked: new Date(),
    },
    {
      name: 'CDN',
      status: 'operational',
      description: 'Static assets and image optimization',
      lastChecked: new Date(),
    },
    {
      name: 'Database',
      status: 'operational',
      description: 'Supabase PostgreSQL (Admin panel)',
      lastChecked: new Date(),
    },
  ];

  const runHealthChecks = useCallback(async () => {
    setIsRefreshing(true);
    const checks: HealthCheck[] = [];

    // Check API endpoints
    const endpoints = [
      { service: 'OpenAPI Spec', endpoint: '/api/openapi.json' },
    ];

    for (const ep of endpoints) {
      const start = performance.now();
      try {
        const response = await fetch(ep.endpoint, { method: 'HEAD' });
        const responseTime = Math.round(performance.now() - start);
        checks.push({
          ...ep,
          status: response.ok ? 'ok' : 'error',
          responseTime,
        });
      } catch {
        checks.push({
          ...ep,
          status: 'error',
        });
      }
    }

    setHealthChecks(checks);
    setLastUpdated(new Date());
    setIsRefreshing(false);
  }, []);

  const refreshMetrics = useCallback(() => {
    const collectedMetrics = getCollectedMetrics();
    const performanceSummary = getPerformanceSummary();
    setMetrics(collectedMetrics);
    setSummary(performanceSummary);
    runHealthChecks();
  }, [runHealthChecks]);

  useEffect(() => {
    refreshMetrics();

    // Refresh every 30 seconds
    const interval = setInterval(refreshMetrics, 30000);
    return () => clearInterval(interval);
  }, [refreshMetrics]);

  const overallStatus = services.every(s => s.status === 'operational')
    ? 'All Systems Operational'
    : services.some(s => s.status === 'down')
      ? 'Major Outage'
      : 'Partial Outage';

  const overallStatusColor = services.every(s => s.status === 'operational')
    ? 'text-success-600 dark:text-success-400'
    : services.some(s => s.status === 'down')
      ? 'text-error-600 dark:text-error-400'
      : 'text-warning-600 dark:text-warning-400';

  return (
    <>
      <Navigation />
      <main id="main-content" className="min-h-screen pt-24 pb-16">
        <Container size="wide" padding="lg">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <Badge variant="outline" className="mb-4">
                  <Activity className="mr-2 h-3 w-3" />
                  System Status
                </Badge>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  Status{' '}
                  <span className="bg-gradient-to-r from-accent-mocha to-accent-green bg-clip-text text-transparent">
                    Dashboard
                  </span>
                </h1>
                <p className={`text-xl font-semibold ${overallStatusColor}`}>
                  {overallStatus}
                </p>
              </div>
              <Button
                variant="outline"
                onClick={refreshMetrics}
                disabled={isRefreshing}
              >
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`}
                />
                Refresh
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          </motion.div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Service Status */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <Server className="h-5 w-5 text-mocha-600 dark:text-mocha-400" />
                <h2 className="text-xl font-bold">Services</h2>
              </div>
              <div className="space-y-3">
                {services.map(service => (
                  <div
                    key={service.name}
                    className="flex items-center justify-between p-4 rounded-xl border bg-card"
                  >
                    <div className="flex items-center gap-3">
                      {getStatusIcon(service.status)}
                      <div>
                        <p className="font-medium">{service.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {service.description}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant={
                        service.status === 'operational'
                          ? 'success'
                          : service.status === 'degraded'
                            ? 'warning'
                            : 'destructive'
                      }
                    >
                      {service.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* Performance Score */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="h-5 w-5 text-mocha-600 dark:text-mocha-400" />
                <h2 className="text-xl font-bold">Performance Score</h2>
              </div>
              <div className="p-6 rounded-xl border bg-card">
                {summary ? (
                  <div className="text-center">
                    <div
                      className={`text-6xl font-bold mb-2 ${
                        summary.score >= 90
                          ? 'text-success-600 dark:text-success-400'
                          : summary.score >= 50
                            ? 'text-warning-600 dark:text-warning-400'
                            : 'text-error-600 dark:text-error-400'
                      }`}
                    >
                      {summary.score}
                    </div>
                    <p className="text-muted-foreground mb-4">Overall Score</p>
                    <div className="flex justify-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full bg-success-500" />
                        <span>{summary.goodCount} Good</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full bg-warning-500" />
                        <span>{summary.needsImprovementCount} Needs Work</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full bg-error-500" />
                        <span>{summary.poorCount} Poor</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    <Zap className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>
                      Navigate around the site to collect performance metrics
                    </p>
                  </div>
                )}
              </div>
            </motion.section>

            {/* Core Web Vitals */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="lg:col-span-2"
            >
              <div className="flex items-center gap-3 mb-4">
                <Zap className="h-5 w-5 text-mocha-600 dark:text-mocha-400" />
                <h2 className="text-xl font-bold">Core Web Vitals</h2>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {Object.entries(PERFORMANCE_THRESHOLDS).map(
                  ([name, thresholds]) => {
                    const metric = metrics.find(m => m.name === name);
                    const metricName = name as MetricName;
                    return (
                      <div
                        key={name}
                        className={`p-4 rounded-xl border ${
                          metric ? getRatingBg(metric.rating) : 'bg-card'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold">{name}</span>
                          {metric && (
                            <Badge
                              variant={
                                metric.rating === 'good'
                                  ? 'success'
                                  : metric.rating === 'needs-improvement'
                                    ? 'warning'
                                    : 'destructive'
                              }
                              size="sm"
                            >
                              {metric.rating}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {metricDescriptions[metricName]}
                        </p>
                        <div
                          className={`text-2xl font-bold ${
                            metric
                              ? getRatingColor(metric.rating)
                              : 'text-muted-foreground'
                          }`}
                        >
                          {metric
                            ? formatMetricValue(metricName, metric.value)
                            : '—'}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Good:{' '}
                          {name === 'CLS'
                            ? `≤${thresholds.good}`
                            : `≤${thresholds.good}ms`}
                        </p>
                      </div>
                    );
                  }
                )}
              </div>
            </motion.section>

            {/* Health Checks */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <Shield className="h-5 w-5 text-mocha-600 dark:text-mocha-400" />
                <h2 className="text-xl font-bold">API Health</h2>
              </div>
              <div className="space-y-3">
                {healthChecks.length > 0 ? (
                  healthChecks.map(check => (
                    <div
                      key={check.endpoint}
                      className="flex items-center justify-between p-4 rounded-xl border bg-card"
                    >
                      <div className="flex items-center gap-3">
                        {check.status === 'ok' ? (
                          <CheckCircle className="h-5 w-5 text-success-600" />
                        ) : check.status === 'pending' ? (
                          <RefreshCw className="h-5 w-5 text-muted-foreground animate-spin" />
                        ) : (
                          <XCircle className="h-5 w-5 text-error-600" />
                        )}
                        <div>
                          <p className="font-medium">{check.service}</p>
                          <code className="text-xs text-muted-foreground">
                            {check.endpoint}
                          </code>
                        </div>
                      </div>
                      {check.responseTime && (
                        <span className="text-sm text-muted-foreground">
                          {check.responseTime}ms
                        </span>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center text-muted-foreground py-8 rounded-xl border bg-card">
                    <Globe className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Running health checks...</p>
                  </div>
                )}
              </div>
            </motion.section>

            {/* External Services */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <Database className="h-5 w-5 text-mocha-600 dark:text-mocha-400" />
                <h2 className="text-xl font-bold">External Services</h2>
              </div>
              <div className="space-y-3">
                {[
                  {
                    name: 'Vercel',
                    url: 'https://www.vercel-status.com/',
                    description: 'Hosting & Edge Network',
                  },
                  {
                    name: 'Supabase',
                    url: 'https://status.supabase.com/',
                    description: 'Database & Auth',
                  },
                  {
                    name: 'Sentry',
                    url: 'https://status.sentry.io/',
                    description: 'Error Monitoring',
                  },
                  {
                    name: 'Buttondown',
                    url: 'https://buttondown.email/',
                    description: 'Newsletter Service',
                  },
                ].map(service => (
                  <a
                    key={service.name}
                    href={service.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-4 rounded-xl border bg-card hover:bg-muted/50 transition-colors"
                  >
                    <div>
                      <p className="font-medium">{service.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {service.description}
                      </p>
                    </div>
                    <Globe className="h-4 w-4 text-muted-foreground" />
                  </a>
                ))}
              </div>
            </motion.section>
          </div>

          {/* Footer note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-12 p-6 rounded-xl border bg-muted/30 text-center"
          >
            <p className="text-muted-foreground">
              This page shows real-time status of the portfolio website.
              Performance metrics are collected as you browse the site.
            </p>
          </motion.div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
