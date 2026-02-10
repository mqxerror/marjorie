'use client';

import { useCallback, useEffect, useState } from 'react';
import { type SortingState, type PaginationState, type RowSelectionState } from '@tanstack/react-table';
import { Download } from 'lucide-react';
import { adminFetch } from '@/lib/admin-api';
import { ApplicationsTable } from '@/components/admin/ApplicationsTable';
import { FilterBar } from '@/components/admin/FilterBar';
import { BulkActionBar } from '@/components/admin/BulkActionBar';

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000') + '/api';
const API_KEY = process.env.NEXT_PUBLIC_ADMIN_API_KEY || '';

interface Application {
  id: string;
  fullName: string;
  email: string;
  mobileNumber: string;
  status: string;
  tags: string[];
  attendanceMode: string;
  selectedSession: string;
  createdAt: string;
}

interface ApiResponse {
  data: Application[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function ApplicationsPage() {
  const [data, setData] = useState<Application[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Table state
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  });
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'createdAt', desc: true },
  ]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  // Filter state
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [attendanceMode, setAttendanceMode] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [tag, setTag] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');

    const params = new URLSearchParams();
    params.set('page', String(pagination.pageIndex + 1));
    params.set('limit', String(pagination.pageSize));

    if (sorting.length > 0) {
      const sortMap: Record<string, string> = {
        fullName: 'fullName',
        status: 'status',
        createdAt: 'createdAt',
      };
      const sortId = sorting[0].id;
      if (sortMap[sortId]) {
        params.set('sortBy', sortMap[sortId]);
        params.set('sortOrder', sorting[0].desc ? 'desc' : 'asc');
      }
    }

    if (search) params.set('search', search);
    if (status) params.set('status', status);
    if (attendanceMode) params.set('attendanceMode', attendanceMode);
    if (dateFrom) params.set('dateFrom', dateFrom);
    if (dateTo) params.set('dateTo', dateTo);
    if (tag) params.set('tag', tag);

    try {
      const result: ApiResponse = await adminFetch(`/applications?${params.toString()}`);
      setData(result.data);
      setTotal(result.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load applications');
    } finally {
      setLoading(false);
    }
  }, [pagination.pageIndex, pagination.pageSize, sorting, search, status, attendanceMode, dateFrom, dateTo, tag]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Reset to first page when filters change
  const handleSearchChange = useCallback((val: string) => {
    setSearch(val);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, []);

  const handleStatusChange = useCallback((val: string) => {
    setStatus(val);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, []);

  const handleAttendanceModeChange = useCallback((val: string) => {
    setAttendanceMode(val);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, []);

  const handleDateFromChange = useCallback((val: string) => {
    setDateFrom(val);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, []);

  const handleDateToChange = useCallback((val: string) => {
    setDateTo(val);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, []);

  const handleTagChange = useCallback((val: string) => {
    setTag(val);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, []);

  const selectedIds = Object.keys(rowSelection);

  const handleBulkStatusChange = async (newStatus: string) => {
    try {
      await adminFetch('/applications/bulk-status', {
        method: 'PATCH',
        body: JSON.stringify({ ids: selectedIds, status: newStatus }),
      });
      setRowSelection({});
      fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bulk update failed');
    }
  };

  const handleDeleteOne = async (id: string) => {
    try {
      await adminFetch(`/applications/${id}`, { method: 'DELETE' });
      fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed');
    }
  };

  const handleBulkDelete = async () => {
    try {
      await adminFetch('/applications/bulk-delete', {
        method: 'POST',
        body: JSON.stringify({ ids: selectedIds }),
      });
      setRowSelection({});
      fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bulk delete failed');
    }
  };

  const handleInlineStatusChange = async (id: string, newStatus: string) => {
    try {
      await adminFetch(`/applications/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus }),
      });
      fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Status update failed');
    }
  };

  const exportUrl = (format: string) => {
    const params = new URLSearchParams();
    params.set('format', format);
    if (status) params.set('status', status);
    if (search) params.set('search', search);
    if (attendanceMode) params.set('attendanceMode', attendanceMode);
    if (dateFrom) params.set('dateFrom', dateFrom);
    if (dateTo) params.set('dateTo', dateTo);
    if (tag) params.set('tag', tag);
    return `${API_BASE}/applications/export?${params.toString()}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Applications</h1>
          <p className="text-sm text-gray-500 mt-1">{total} total</p>
        </div>
        <div className="flex gap-2">
          <a
            href={exportUrl('csv')}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              e.preventDefault();
              const link = document.createElement('a');
              link.href = exportUrl('csv');
              const headers = new Headers();
              headers.set('x-api-key', API_KEY);
              fetch(exportUrl('csv'), { headers })
                .then(r => r.blob())
                .then(blob => {
                  const url = URL.createObjectURL(blob);
                  link.href = url;
                  link.download = `applications-${new Date().toISOString().split('T')[0]}.csv`;
                  link.click();
                  URL.revokeObjectURL(url);
                });
            }}
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <Download className="h-4 w-4" />
            CSV
          </a>
          <a
            href={exportUrl('xlsx')}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              e.preventDefault();
              const headers = new Headers();
              headers.set('x-api-key', API_KEY);
              fetch(exportUrl('xlsx'), { headers })
                .then(r => r.blob())
                .then(blob => {
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = `applications-${new Date().toISOString().split('T')[0]}.xlsx`;
                  link.click();
                  URL.revokeObjectURL(url);
                });
            }}
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <Download className="h-4 w-4" />
            Excel
          </a>
        </div>
      </div>

      <FilterBar
        search={search}
        status={status}
        attendanceMode={attendanceMode}
        dateFrom={dateFrom}
        dateTo={dateTo}
        tag={tag}
        onSearchChange={handleSearchChange}
        onStatusChange={handleStatusChange}
        onAttendanceModeChange={handleAttendanceModeChange}
        onDateFromChange={handleDateFromChange}
        onDateToChange={handleDateToChange}
        onTagChange={handleTagChange}
      />

      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading && data.length === 0 ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
        </div>
      ) : (
        <ApplicationsTable
          data={data}
          total={total}
          pagination={pagination}
          sorting={sorting}
          rowSelection={rowSelection}
          onPaginationChange={setPagination}
          onSortingChange={setSorting}
          onRowSelectionChange={setRowSelection}
          onDeleteOne={handleDeleteOne}
          onStatusChange={handleInlineStatusChange}
        />
      )}

      <BulkActionBar
        selectedCount={selectedIds.length}
        onBulkStatusChange={handleBulkStatusChange}
        onBulkDelete={handleBulkDelete}
        onClearSelection={() => setRowSelection({})}
      />
    </div>
  );
}
