'use client';

import { useEffect, useState } from 'react';
import { RefreshCw, Send } from 'lucide-react';
import { adminFetch } from '@/lib/admin-api';

interface WebhookConfig {
  url: string;
  secret: string;
  enabled: boolean;
  enabledEvents: string[];
}

const ALL_EVENTS = [
  { key: 'application.created', label: 'Application Created' },
  { key: 'application.status_changed', label: 'Application Status Changed' },
  { key: 'application.reviewed', label: 'Application Reviewed' },
];

const EMPTY_CONFIG: WebhookConfig = {
  url: '',
  secret: '',
  enabled: false,
  enabledEvents: [],
};

function generateSecret() {
  const arr = new Uint8Array(32);
  crypto.getRandomValues(arr);
  return Array.from(arr, (b) => b.toString(16).padStart(2, '0')).join('');
}

export function WebhookManager() {
  const [config, setConfig] = useState<WebhookConfig>(EMPTY_CONFIG);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadConfig();
  }, []);

  async function loadConfig() {
    try {
      const data = await adminFetch('/config/webhook_config');
      if (data?.value) setConfig(data.value as WebhookConfig);
    } catch {
      // No config yet — use empty defaults
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (config.url && !config.url.startsWith('https://')) {
      setError('Webhook URL must use HTTPS.');
      return;
    }
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      await adminFetch('/config/webhook_config', {
        method: 'PUT',
        body: JSON.stringify({ value: config }),
      });
      setSuccess('Webhook configuration saved.');
    } catch (err: any) {
      setError(err.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  }

  async function handleTest() {
    setTesting(true);
    setError('');
    setSuccess('');
    try {
      await adminFetch('/webhooks/test', { method: 'POST' });
      setSuccess('Test webhook fired! Check the logs below.');
    } catch (err: any) {
      setError(err.message || 'Test failed');
    } finally {
      setTesting(false);
    }
  }

  function toggleEvent(eventKey: string) {
    setConfig((prev) => ({
      ...prev,
      enabledEvents: prev.enabledEvents.includes(eventKey)
        ? prev.enabledEvents.filter((e) => e !== eventKey)
        : [...prev.enabledEvents, eventKey],
    }));
  }

  if (loading) {
    return <div className="text-sm text-slate-500">Loading webhook config...</div>;
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">Webhook Configuration</h3>
        <button
          onClick={() =>
            setConfig((prev) => ({ ...prev, enabled: !prev.enabled }))
          }
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors ${
            config.enabled ? 'bg-blue-600' : 'bg-slate-200'
          }`}
        >
          <span
            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
              config.enabled ? 'translate-x-5' : 'translate-x-0.5'
            } mt-0.5`}
          />
        </button>
      </div>

      {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>}
      {success && <div className="rounded-lg bg-green-50 p-3 text-sm text-green-700">{success}</div>}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Webhook URL</label>
          <input
            type="url"
            value={config.url}
            onChange={(e) => setConfig((p) => ({ ...p, url: e.target.value }))}
            placeholder="https://your-n8n-instance.com/webhook/..."
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Secret Key</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={config.secret}
              onChange={(e) => setConfig((p) => ({ ...p, secret: e.target.value }))}
              placeholder="HMAC-SHA256 signing secret"
              className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm font-mono text-slate-900"
            />
            <button
              onClick={() =>
                setConfig((p) => ({ ...p, secret: generateSecret() }))
              }
              className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
              title="Generate random secret"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Enabled Events</label>
          <div className="space-y-2">
            {ALL_EVENTS.map((evt) => (
              <label key={evt.key} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.enabledEvents.includes(evt.key)}
                  onChange={() => toggleEvent(evt.key)}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600"
                />
                <span className="text-sm text-slate-700">{evt.label}</span>
                <span className="text-xs text-slate-400 font-mono">{evt.key}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Configuration'}
        </button>
        <button
          onClick={handleTest}
          disabled={testing || !config.enabled || !config.url}
          className="flex items-center gap-2 rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
          {testing ? 'Sending...' : 'Send Test'}
        </button>
      </div>
    </div>
  );
}
