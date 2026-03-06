import { ExternalLink, Settings, Database, Globe } from 'lucide-react';

export const metadata = {
  title: 'Settings | Admin Dashboard',
};

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Site configuration and external links
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Site Info */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Globe className="w-5 h-5 text-primary" />
            Site Information
          </h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Site Name</span>
              <span className="text-foreground font-medium">Oles Didukh</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Domain</span>
              <span className="text-foreground font-medium">
                olesdidukh.dev
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Framework</span>
              <span className="text-foreground font-medium">Next.js 16</span>
            </div>
          </div>
        </div>

        {/* External Links */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <ExternalLink className="w-5 h-5 text-primary" />
            Quick Links
          </h2>
          <div className="space-y-3">
            <a
              href="https://supabase.com/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
            >
              <Database className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm font-medium text-foreground">
                  Supabase Dashboard
                </p>
                <p className="text-xs text-muted-foreground">
                  Manage database & auth
                </p>
              </div>
              <ExternalLink className="w-4 h-4 ml-auto text-muted-foreground" />
            </a>
            <a
              href="https://vercel.com/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
            >
              <Settings className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm font-medium text-foreground">
                  Vercel Dashboard
                </p>
                <p className="text-xs text-muted-foreground">
                  Deployments & analytics
                </p>
              </div>
              <ExternalLink className="w-4 h-4 ml-auto text-muted-foreground" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
