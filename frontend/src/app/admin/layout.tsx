import type { Metadata } from 'next';
import { auth } from '@/lib/auth';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

export const metadata: Metadata = {
  title: 'Admin | EB-3 Caregivers',
  robots: { index: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    return (
      <div className="min-h-screen bg-gray-100">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminSidebar />
      <main className="ml-64 p-8">
        {children}
      </main>
    </div>
  );
}
