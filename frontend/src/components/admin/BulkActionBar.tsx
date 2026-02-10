'use client';

import { useState } from 'react';

const APPLICATION_STATUSES = [
  'Qualified – Invite',
  'Contacted',
  'Confirmed',
  'Attended',
  'No Show',
  'Rejected',
  'Declined',
  'No Response',
  'Cancelled',
  'Waitlisted',
];

interface BulkActionBarProps {
  selectedCount: number;
  onBulkStatusChange: (status: string) => void;
  onBulkDelete: () => void;
  onClearSelection: () => void;
}

export function BulkActionBar({
  selectedCount,
  onBulkStatusChange,
  onBulkDelete,
  onClearSelection,
}: BulkActionBarProps) {
  const [status, setStatus] = useState('');

  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 rounded-lg bg-slate-900 px-4 py-3 shadow-lg text-white">
      <span className="text-sm font-medium">
        {selectedCount} selected
      </span>
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="rounded border border-slate-600 bg-slate-800 px-2 py-1 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
      >
        <option value="">Change status to...</option>
        {APPLICATION_STATUSES.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
      <button
        onClick={() => {
          if (status) {
            onBulkStatusChange(status);
            setStatus('');
          }
        }}
        disabled={!status}
        className="rounded bg-blue-600 px-3 py-1 text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Apply
      </button>
      <button
        onClick={() => {
          if (confirm(`Delete ${selectedCount} selected application(s)?`)) {
            onBulkDelete();
          }
        }}
        className="rounded bg-red-600 px-3 py-1 text-sm font-medium hover:bg-red-700"
      >
        Delete Selected
      </button>
      <button
        onClick={onClearSelection}
        className="rounded bg-slate-700 px-3 py-1 text-sm hover:bg-slate-600"
      >
        Cancel
      </button>
    </div>
  );
}
