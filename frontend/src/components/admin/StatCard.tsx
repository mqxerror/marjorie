'use client';

import { type ReactNode } from 'react';

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: number | string;
  color: string;
}

export function StatCard({ icon, label, value, color }: StatCardProps) {
  return (
    <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
      <div className="flex items-center gap-4">
        <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${color}`}>
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
}
