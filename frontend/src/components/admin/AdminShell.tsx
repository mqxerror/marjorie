'use client';

import { usePathname } from 'next/navigation';
import { AdminSidebar } from './AdminSidebar';

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

  if (isLoginPage) {
    return <div className="min-h-screen bg-gray-100">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminSidebar />
      <main className="ml-64 p-8">{children}</main>
    </div>
  );
}
