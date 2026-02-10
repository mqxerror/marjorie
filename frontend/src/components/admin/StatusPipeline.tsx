'use client';

interface StatusCount {
  status: string;
  count: number;
}

const STATUS_COLORS: Record<string, string> = {
  'Qualified – Invite': 'bg-green-500',
  'Contacted': 'bg-blue-500',
  'Confirmed': 'bg-indigo-500',
  'Attended': 'bg-purple-500',
  'No Show': 'bg-orange-500',
  'Rejected': 'bg-red-500',
  'Declined': 'bg-red-400',
  'No Response': 'bg-gray-400',
  'Cancelled': 'bg-gray-300',
  'Waitlisted': 'bg-yellow-500',
};

export function StatusPipeline({ data }: { data: StatusCount[] }) {
  const sorted = [...data].sort((a, b) => b.count - a.count);
  const maxCount = Math.max(...sorted.map((d) => d.count), 1);

  return (
    <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
      <h3 className="text-sm font-semibold text-gray-900 mb-4">Status Breakdown</h3>
      <div className="space-y-3">
        {sorted.map((item) => (
          <div key={item.status} className="flex items-center gap-3">
            <span className="w-48 truncate text-sm text-gray-600 shrink-0">{item.status}</span>
            <div className="flex-1 h-5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${STATUS_COLORS[item.status] || 'bg-gray-400'}`}
                style={{ width: `${(item.count / maxCount) * 100}%` }}
              />
            </div>
            <span className="text-sm font-medium text-gray-900 w-8 text-right">{item.count}</span>
          </div>
        ))}
        {sorted.length === 0 && (
          <p className="text-sm text-gray-500">No data yet</p>
        )}
      </div>
    </div>
  );
}
