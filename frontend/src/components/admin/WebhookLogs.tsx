'use client';

import { useEffect, useState, useCallback } from 'react';
import { ChevronDown, ChevronRight, RefreshCw } from 'lucide-react';
import { adminFetch } from '@/lib/admin-api';

interface WebhookLog {
  id: string;
  event: string;
  payload: unknown;
  status: number;
  response: string | null;
  attempts: number;
  success: boolean;
  createdAt: string;
}

export function WebhookLogs() {
  const [logs, setLogs] = useState<WebhookLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const loadLogs = useCallback(async () => {
    try {
      const data = await adminFetch('/webhooks/logs');
      setLogs(Array.isArray(data) ? data : []);
    } catch {
      // Silent fail — logs are non-critical
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLogs();
    const interval = setInterval(loadLogs, 30000);
    return () => clearInterval(interval);
  }, [loadLogs]);

  function formatTime(iso: string) {
    return new Date(iso).toLocaleString();
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white">
      <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
        <h3 className="text-lg font-semibold text-slate-900">Delivery Logs</h3>
        <button
          onClick={loadLogs}
          className="rounded-md border border-slate-300 p-1.5 text-slate-500 hover:bg-slate-50"
          title="Refresh"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      {loading ? (
        <div className="p-6 text-sm text-slate-500">Loading logs...</div>
      ) : logs.length === 0 ? (
        <div className="p-6 text-center text-sm text-slate-500">
          No webhook logs yet. Logs will appear here after webhooks are fired.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-xs font-medium uppercase text-slate-500">
                <th className="px-6 py-3 w-8" />
                <th className="px-3 py-3">Timestamp</th>
                <th className="px-3 py-3">Event</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-3 py-3">Attempts</th>
                <th className="px-3 py-3">Response</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <>
                  <tr
                    key={log.id}
                    className="border-b border-slate-50 hover:bg-slate-50 cursor-pointer"
                    onClick={() =>
                      setExpandedId(expandedId === log.id ? null : log.id)
                    }
                  >
                    <td className="px-6 py-3">
                      {expandedId === log.id ? (
                        <ChevronDown className="h-4 w-4 text-slate-500" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-slate-500" />
                      )}
                    </td>
                    <td className="px-3 py-3 text-slate-600 whitespace-nowrap">
                      {formatTime(log.createdAt)}
                    </td>
                    <td className="px-3 py-3 font-mono text-xs text-slate-700">{log.event}</td>
                    <td className="px-3 py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                          log.success
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {log.status || 'ERR'}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-slate-600">{log.attempts}</td>
                    <td className="px-3 py-3 text-slate-700 truncate max-w-[200px]">
                      {log.response?.slice(0, 80) || '—'}
                    </td>
                  </tr>
                  {expandedId === log.id && (
                    <tr key={`${log.id}-detail`} className="border-b border-slate-50">
                      <td colSpan={6} className="px-6 py-4 bg-slate-50">
                        <p className="text-xs font-medium text-slate-500 mb-1">Payload</p>
                        <pre className="overflow-x-auto rounded-md bg-slate-900 p-3 text-xs text-slate-200">
                          {JSON.stringify(log.payload, null, 2)}
                        </pre>
                        {log.response && (
                          <>
                            <p className="mt-3 text-xs font-medium text-slate-500 mb-1">Response</p>
                            <pre className="overflow-x-auto rounded-md bg-slate-900 p-3 text-xs text-slate-200">
                              {log.response}
                            </pre>
                          </>
                        )}
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
