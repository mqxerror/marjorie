'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { ScriptManager } from '@/components/admin/ScriptManager';
import { WebhookManager } from '@/components/admin/WebhookManager';
import { WebhookLogs } from '@/components/admin/WebhookLogs';

const TABS = ['scripts', 'webhooks'] as const;
type Tab = (typeof TABS)[number];

export default function ScriptsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeTab = (searchParams.get('tab') as Tab) || 'scripts';

  function setTab(tab: Tab) {
    router.push(`/admin/scripts?tab=${tab}`);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Scripts &amp; Webhooks</h1>
      <p className="mt-1 text-sm text-slate-500">
        Manage tracking scripts and webhook integrations.
      </p>

      {/* Tabs */}
      <div className="mt-6 border-b border-slate-200">
        <nav className="-mb-px flex gap-6">
          <button
            onClick={() => setTab('scripts')}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'scripts'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Tracking Scripts
          </button>
          <button
            onClick={() => setTab('webhooks')}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'webhooks'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Webhooks
          </button>
        </nav>
      </div>

      {/* Tab content */}
      <div className="mt-6">
        {activeTab === 'scripts' && <ScriptManager />}
        {activeTab === 'webhooks' && (
          <div className="space-y-8">
            <WebhookManager />
            <WebhookLogs />
          </div>
        )}
      </div>
    </div>
  );
}
