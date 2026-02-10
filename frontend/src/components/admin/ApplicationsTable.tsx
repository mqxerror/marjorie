'use client';

import { useMemo, useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
  type RowSelectionState,
  type PaginationState,
} from '@tanstack/react-table';
import { MessageCircle, ChevronUp, ChevronDown, ChevronsUpDown, MoreHorizontal, Eye, Copy, Phone, Trash2 } from 'lucide-react';
import { StatusBadge } from './StatusBadge';

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

interface ApplicationsTableProps {
  data: Application[];
  total: number;
  pagination: PaginationState;
  sorting: SortingState;
  rowSelection: RowSelectionState;
  onPaginationChange: (updater: PaginationState | ((prev: PaginationState) => PaginationState)) => void;
  onSortingChange: (updater: SortingState | ((prev: SortingState) => SortingState)) => void;
  onRowSelectionChange: (updater: RowSelectionState | ((prev: RowSelectionState) => RowSelectionState)) => void;
  onDeleteOne: (id: string) => void;
  onStatusChange: (id: string, status: string) => void;
}

const columnHelper = createColumnHelper<Application>();

function stripPhoneForWhatsApp(phone: string): string {
  return phone.replace(/[^0-9]/g, '');
}

function ActionsDropdown({
  application,
  onDeleteOne,
}: {
  application: Application;
  onDeleteOne: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="rounded p-1 hover:bg-gray-100"
      >
        <MoreHorizontal className="h-4 w-4 text-gray-500" />
      </button>
      {open && (
        <div className="absolute right-0 z-20 mt-1 w-44 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
          <button
            onClick={() => { router.push(`/admin/applications/${application.id}`); setOpen(false); }}
            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            <Eye className="h-3.5 w-3.5" /> View Details
          </button>
          <button
            onClick={() => { navigator.clipboard.writeText(application.email); setOpen(false); }}
            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            <Copy className="h-3.5 w-3.5" /> Copy Email
          </button>
          <button
            onClick={() => { navigator.clipboard.writeText(application.mobileNumber); setOpen(false); }}
            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            <Phone className="h-3.5 w-3.5" /> Copy Phone
          </button>
          <button
            onClick={() => { window.open(`https://wa.me/${stripPhoneForWhatsApp(application.mobileNumber)}`, '_blank'); setOpen(false); }}
            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
          </button>
          <div className="my-1 border-t border-gray-100" />
          <button
            onClick={() => {
              setOpen(false);
              if (confirm(`Delete application from ${application.fullName}?`)) {
                onDeleteOne(application.id);
              }
            }}
            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            <Trash2 className="h-3.5 w-3.5" /> Delete
          </button>
        </div>
      )}
    </div>
  );
}

function InlineStatusSelect({
  currentStatus,
  onStatusChange,
}: {
  currentStatus: string;
  onStatusChange: (status: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(!open)} className="cursor-pointer">
        <StatusBadge status={currentStatus} />
      </button>
      {open && (
        <div className="absolute left-0 z-20 mt-1 max-h-60 w-56 overflow-y-auto rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
          {APPLICATION_STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => {
                if (s !== currentStatus) onStatusChange(s);
                setOpen(false);
              }}
              className={`flex w-full items-center px-3 py-1.5 text-sm hover:bg-gray-50 ${
                s === currentStatus ? 'font-medium text-blue-700 bg-blue-50' : 'text-gray-700'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function ApplicationsTable({
  data,
  total,
  pagination,
  sorting,
  rowSelection,
  onPaginationChange,
  onSortingChange,
  onRowSelectionChange,
  onDeleteOne,
  onStatusChange,
}: ApplicationsTableProps) {
  const columns = useMemo(
    () => [
      columnHelper.display({
        id: 'select',
        header: ({ table }) => (
          <input
            type="checkbox"
            checked={table.getIsAllPageRowsSelected()}
            onChange={table.getToggleAllPageRowsSelectedHandler()}
            className="rounded border-gray-300"
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            checked={row.getIsSelected()}
            onChange={row.getToggleSelectedHandler()}
            className="rounded border-gray-300"
          />
        ),
        size: 40,
      }),
      columnHelper.accessor('fullName', {
        header: 'Name',
        cell: ({ row }) => (
          <Link
            href={`/admin/applications/${row.original.id}`}
            className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
          >
            {row.original.fullName}
          </Link>
        ),
      }),
      columnHelper.accessor('email', {
        header: 'Email',
        cell: ({ getValue }) => (
          <span className="text-slate-700">{getValue()}</span>
        ),
      }),
      columnHelper.accessor('mobileNumber', {
        header: 'Mobile',
        enableSorting: false,
        cell: ({ getValue }) => (
          <div className="flex items-center gap-1">
            <span className="text-slate-700">{getValue()}</span>
            <a
              href={`https://wa.me/${stripPhoneForWhatsApp(getValue())}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 hover:text-green-800"
              title="Open WhatsApp"
            >
              <MessageCircle className="h-4 w-4" />
            </a>
          </div>
        ),
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: ({ row }) => (
          <InlineStatusSelect
            currentStatus={row.original.status}
            onStatusChange={(newStatus) => onStatusChange(row.original.id, newStatus)}
          />
        ),
      }),
      columnHelper.accessor('tags', {
        header: 'Tags',
        enableSorting: false,
        cell: ({ getValue }) => {
          const tags = (getValue() || []).filter((t: string) => !t.startsWith('Attendance'));
          if (tags.length === 0) return null;
          return (
            <div className="flex flex-wrap gap-1">
              {tags.map((tag: string) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-medium text-red-700"
                  title={tag}
                >
                  {tag.replace('Not Suitable – ', '')}
                </span>
              ))}
            </div>
          );
        },
      }),
      columnHelper.accessor('attendanceMode', {
        header: 'Mode',
        enableSorting: false,
        cell: ({ getValue }) => (
          <span className="text-slate-700">
            {getValue() === 'IN_PERSON' ? 'In Person' : 'Online'}
          </span>
        ),
      }),
      columnHelper.accessor('selectedSession', {
        header: 'Session',
        enableSorting: false,
        cell: ({ getValue }) => (
          <span className="text-slate-700 truncate max-w-[150px] block">{getValue()}</span>
        ),
      }),
      columnHelper.accessor('createdAt', {
        header: 'Applied',
        cell: ({ getValue }) => (
          <span className="text-slate-600 text-xs">
            {new Date(getValue()).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </span>
        ),
      }),
      columnHelper.display({
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <ActionsDropdown
            application={row.original}
            onDeleteOne={onDeleteOne}
          />
        ),
        size: 50,
      }),
    ],
    [onDeleteOne, onStatusChange],
  );

  const pageCount = Math.ceil(total / pagination.pageSize);

  const table = useReactTable({
    data,
    columns,
    pageCount,
    state: {
      pagination,
      sorting,
      rowSelection,
    },
    onPaginationChange: onPaginationChange as never,
    onSortingChange: onSortingChange as never,
    onRowSelectionChange: onRowSelectionChange as never,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    enableRowSelection: true,
    getRowId: (row) => row.id,
  });

  return (
    <div>
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                    style={{ width: header.getSize() !== 150 ? header.getSize() : undefined }}
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        className={`flex items-center gap-1 ${
                          header.column.getCanSort() ? 'cursor-pointer select-none' : ''
                        }`}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getCanSort() && (
                          <span className="text-slate-500">
                            {header.column.getIsSorted() === 'asc' ? (
                              <ChevronUp className="h-3 w-3" />
                            ) : header.column.getIsSorted() === 'desc' ? (
                              <ChevronDown className="h-3 w-3" />
                            ) : (
                              <ChevronsUpDown className="h-3 w-3" />
                            )}
                          </span>
                        )}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-12 text-center text-sm text-gray-500"
                >
                  No applications found
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3 text-sm whitespace-nowrap">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between pt-4">
        <p className="text-sm text-gray-500">
          Showing {pagination.pageIndex * pagination.pageSize + 1} to{' '}
          {Math.min((pagination.pageIndex + 1) * pagination.pageSize, total)} of {total}
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
