'use client';

const STATUS_COLORS: Record<string, string> = {
  'Qualified – Invite': 'bg-green-100 text-green-800',
  'Contacted': 'bg-blue-100 text-blue-800',
  'Confirmed': 'bg-indigo-100 text-indigo-800',
  'Attended': 'bg-purple-100 text-purple-800',
  'No Show': 'bg-orange-100 text-orange-800',
  'Rejected': 'bg-red-100 text-red-800',
  'Declined': 'bg-red-100 text-red-800',
  'No Response': 'bg-gray-100 text-gray-800',
  'Cancelled': 'bg-gray-100 text-gray-600',
  'Waitlisted': 'bg-yellow-100 text-yellow-800',
  'Not Suitable – Criteria': 'bg-red-50 text-red-700',
  'Not Suitable – Expectations': 'bg-red-50 text-red-700',
  'Not Suitable – Driving Requirement': 'bg-red-50 text-red-700',
  'Not Suitable – Financial Expectations': 'bg-red-50 text-red-700',
};

export function StatusBadge({ status }: { status: string }) {
  const colors = STATUS_COLORS[status] || 'bg-gray-100 text-gray-800';
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colors}`}>
      {status}
    </span>
  );
}
