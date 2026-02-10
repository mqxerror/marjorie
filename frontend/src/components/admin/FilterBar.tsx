'use client';

import { useCallback, useEffect, useState } from 'react';
import { Search, X } from 'lucide-react';

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
  'Not Suitable – Criteria',
  'Not Suitable – Expectations',
  'Not Suitable – Driving Requirement',
  'Not Suitable – Financial Expectations',
];

const ATTENDANCE_MODES = [
  { value: 'IN_PERSON', label: 'In Person' },
  { value: 'ONLINE', label: 'Online' },
];

const TAG_OPTIONS = [
  'Not Suitable – Criteria',
  'Not Suitable – Expectations',
  'Not Suitable – Driving Requirement',
  'Not Suitable – Financial Expectations',
  'Attendance – In Person',
  'Attendance – Online',
];

interface FilterBarProps {
  onSearchChange: (search: string) => void;
  onStatusChange: (status: string) => void;
  onAttendanceModeChange: (mode: string) => void;
  onDateFromChange: (date: string) => void;
  onDateToChange: (date: string) => void;
  onTagChange: (tag: string) => void;
  status: string;
  attendanceMode: string;
  search: string;
  dateFrom: string;
  dateTo: string;
  tag: string;
}

export function FilterBar({
  onSearchChange,
  onStatusChange,
  onAttendanceModeChange,
  onDateFromChange,
  onDateToChange,
  onTagChange,
  status,
  attendanceMode,
  search,
  dateFrom,
  dateTo,
  tag,
}: FilterBarProps) {
  const [localSearch, setLocalSearch] = useState(search);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(localSearch);
    }, 300);
    return () => clearTimeout(timer);
  }, [localSearch, onSearchChange]);

  const clearFilters = useCallback(() => {
    setLocalSearch('');
    onSearchChange('');
    onStatusChange('');
    onAttendanceModeChange('');
    onDateFromChange('');
    onDateToChange('');
    onTagChange('');
  }, [onSearchChange, onStatusChange, onAttendanceModeChange, onDateFromChange, onDateToChange, onTagChange]);

  const hasFilters = search || status || attendanceMode || dateFrom || dateTo || tag;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search name, email, or phone..."
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <select
        value={status}
        onChange={(e) => onStatusChange(e.target.value)}
        className="rounded-lg border border-gray-300 bg-white py-2 px-3 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      >
        <option value="">All Statuses</option>
        {APPLICATION_STATUSES.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      <select
        value={attendanceMode}
        onChange={(e) => onAttendanceModeChange(e.target.value)}
        className="rounded-lg border border-gray-300 bg-white py-2 px-3 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      >
        <option value="">All Modes</option>
        {ATTENDANCE_MODES.map((m) => (
          <option key={m.value} value={m.value}>{m.label}</option>
        ))}
      </select>

      <select
        value={tag}
        onChange={(e) => onTagChange(e.target.value)}
        className="rounded-lg border border-gray-300 bg-white py-2 px-3 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      >
        <option value="">All Tags</option>
        {TAG_OPTIONS.map((t) => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>

      <input
        type="date"
        value={dateFrom}
        onChange={(e) => onDateFromChange(e.target.value)}
        className="rounded-lg border border-gray-300 bg-white py-2 px-3 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        title="From date"
      />
      <input
        type="date"
        value={dateTo}
        onChange={(e) => onDateToChange(e.target.value)}
        className="rounded-lg border border-gray-300 bg-white py-2 px-3 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        title="To date"
      />

      {hasFilters && (
        <button
          onClick={clearFilters}
          className="inline-flex items-center gap-1 rounded-lg border border-gray-300 bg-white py-2 px-3 text-sm text-gray-600 hover:bg-gray-50"
        >
          <X className="h-3 w-3" />
          Clear
        </button>
      )}
    </div>
  );
}
