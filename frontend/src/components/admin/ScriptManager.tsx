'use client';

import { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { adminFetch } from '@/lib/admin-api';

interface TrackingScript {
  id: string;
  name: string;
  enabled: boolean;
  type: 'gtag' | 'pixel' | 'gtm' | 'custom';
  trackingId: string;
}

type ScriptType = TrackingScript['type'];

const TEMPLATES: Record<string, { name: string; type: ScriptType; placeholder: string }> = {
  ga4: { name: 'Google Analytics 4', type: 'gtag', placeholder: 'G-XXXXXXXXXX' },
  fb_pixel: { name: 'Facebook Pixel', type: 'pixel', placeholder: '123456789012345' },
  gtm: { name: 'Google Tag Manager', type: 'gtm', placeholder: 'GTM-XXXXXXX' },
  tiktok: { name: 'TikTok Pixel', type: 'custom', placeholder: 'CXXXXXXXXXXXXXXXXX' },
  custom: { name: 'Custom Script', type: 'custom', placeholder: 'tracking-id' },
};

const SAFE_ID_RE = /^[A-Za-z0-9_-]+$/;

export function ScriptManager() {
  const [scripts, setScripts] = useState<TrackingScript[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);

  // New script form
  const [templateKey, setTemplateKey] = useState('ga4');
  const [newName, setNewName] = useState(TEMPLATES.ga4.name);
  const [newId, setNewId] = useState('');

  useEffect(() => {
    loadScripts();
  }, []);

  async function loadScripts() {
    try {
      const config = await adminFetch('/config/tracking_scripts');
      setScripts(Array.isArray(config?.value) ? config.value : []);
    } catch {
      setScripts([]);
    } finally {
      setLoading(false);
    }
  }

  async function save(updated: TrackingScript[]) {
    setSaving(true);
    setError('');
    try {
      await adminFetch('/config/tracking_scripts', {
        method: 'PUT',
        body: JSON.stringify({ value: updated }),
      });
      setScripts(updated);
    } catch (err: any) {
      setError(err.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  }

  function handleTemplateChange(key: string) {
    setTemplateKey(key);
    const tpl = TEMPLATES[key];
    if (tpl) setNewName(tpl.name);
  }

  function handleAdd() {
    const tpl = TEMPLATES[templateKey];
    if (!newId.trim() || !SAFE_ID_RE.test(newId.trim())) {
      setError('Tracking ID must be alphanumeric (letters, numbers, hyphens, underscores).');
      return;
    }
    const scriptId = `${templateKey}_${Date.now()}`;
    const newScript: TrackingScript = {
      id: scriptId,
      name: newName || tpl.name,
      enabled: true,
      type: tpl.type,
      trackingId: newId.trim(),
    };
    const updated = [...scripts, newScript];
    save(updated);
    setShowForm(false);
    setNewId('');
  }

  function handleToggle(id: string) {
    const updated = scripts.map((s) =>
      s.id === id ? { ...s, enabled: !s.enabled } : s,
    );
    save(updated);
  }

  function handleDelete(id: string) {
    if (!confirm('Remove this tracking script?')) return;
    save(scripts.filter((s) => s.id !== id));
  }

  if (loading) {
    return <div className="text-sm text-slate-500">Loading scripts...</div>;
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>
      )}

      {/* Script list */}
      {scripts.length === 0 && !showForm && (
        <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
          No tracking scripts configured. Add one below.
        </div>
      )}

      {scripts.map((script) => (
        <div
          key={script.id}
          className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4"
        >
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleToggle(script.id)}
              disabled={saving}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors ${
                script.enabled ? 'bg-blue-600' : 'bg-slate-200'
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                  script.enabled ? 'translate-x-5' : 'translate-x-0.5'
                } mt-0.5`}
              />
            </button>
            <div>
              <p className="text-sm font-medium text-slate-900">{script.name}</p>
              <p className="text-xs text-slate-500">
                {script.type.toUpperCase()} &middot; {script.trackingId}
              </p>
            </div>
          </div>
          <button
            onClick={() => handleDelete(script.id)}
            disabled={saving}
            className="rounded p-1.5 text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}

      {/* Add script form */}
      {showForm ? (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-3">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Type</label>
              <select
                value={templateKey}
                onChange={(e) => handleTemplateChange(e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900"
              >
                {Object.entries(TEMPLATES).map(([key, tpl]) => (
                  <option key={key} value={key}>
                    {tpl.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Name</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Tracking ID</label>
              <input
                type="text"
                value={newId}
                onChange={(e) => setNewId(e.target.value)}
                placeholder={TEMPLATES[templateKey]?.placeholder}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900"
              />
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => { setShowForm(false); setError(''); }}
              className="rounded-md px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-200"
            >
              Cancel
            </button>
            <button
              onClick={handleAdd}
              disabled={saving || !newId.trim()}
              className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Add Script'}
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 rounded-md border border-dashed border-slate-300 px-4 py-2 text-sm text-slate-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Script
        </button>
      )}
    </div>
  );
}
