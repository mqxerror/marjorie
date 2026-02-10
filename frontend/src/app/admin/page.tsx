'use client';

import { useEffect, useState } from 'react';
import { Users, UserCheck, CalendarPlus, CalendarDays } from 'lucide-react';
import { adminFetch } from '@/lib/admin-api';
import { StatCard } from '@/components/admin/StatCard';
import { StatusPipeline } from '@/components/admin/StatusPipeline';
import { SessionBreakdown } from '@/components/admin/SessionBreakdown';

interface Stats {
  total: number;
  todayCount: number;
  weekCount: number;
  byStatus: { status: string; count: number }[];
  bySession: { session: string; count: number }[];
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    adminFetch('/applications/stats')
      .then(setStats)
      .catch((err) => setError(err.message));
  }, []);

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-red-700">
        Failed to load stats: {error}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
      </div>
    );
  }

  const qualifiedCount =
    stats.byStatus.find((s) => s.status === 'Qualified – Invite')?.count ?? 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Application overview</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<Users className="h-6 w-6 text-blue-600" />}
          label="Total Applications"
          value={stats.total}
          color="bg-blue-50"
        />
        <StatCard
          icon={<UserCheck className="h-6 w-6 text-green-600" />}
          label="Qualified"
          value={qualifiedCount}
          color="bg-green-50"
        />
        <StatCard
          icon={<CalendarPlus className="h-6 w-6 text-purple-600" />}
          label="Today"
          value={stats.todayCount}
          color="bg-purple-50"
        />
        <StatCard
          icon={<CalendarDays className="h-6 w-6 text-orange-600" />}
          label="This Week"
          value={stats.weekCount}
          color="bg-orange-50"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <StatusPipeline data={stats.byStatus} />
        <SessionBreakdown data={stats.bySession} />
      </div>
    </div>
  );
}
