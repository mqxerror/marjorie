'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, MessageCircle, Save } from 'lucide-react';
import { adminFetch } from '@/lib/admin-api';
import { StatusBadge } from '@/components/admin/StatusBadge';

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
  currentCity: string;
  nationality: string;
  uaeResident: boolean;
  caregivingExperience: string[];
  willingToWork: boolean;
  willingToDrive: boolean;
  acceptsTimeframe: boolean;
  seeksPermanentRelocation: boolean;
  understandsInfoOnly: boolean;
  acceptsFinancialCosts: boolean;
  attendanceMode: string;
  selectedSession: string;
  acknowledgedAccuracy: boolean;
  status: string;
  tags: string[];
  reviewNotes: string | null;
  reviewedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

function stripPhoneForWhatsApp(phone: string): string {
  return phone.replace(/[^0-9]/g, '');
}

function BoolBadge({ value }: { value: boolean }) {
  return (
    <span className={`text-sm font-medium ${value ? 'text-green-700' : 'text-red-600'}`}>
      {value ? 'Yes' : 'No'}
    </span>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg bg-white border border-gray-200 shadow-sm">
      <div className="border-b border-gray-200 px-6 py-4">
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="px-6 py-4">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="py-2">
      <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</dt>
      <dd className="mt-1 text-sm text-gray-900">{children}</dd>
    </div>
  );
}

export default function ApplicationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [app, setApp] = useState<Application | null>(null);
  const [error, setError] = useState('');
  const [statusLoading, setStatusLoading] = useState(false);
  const [reviewNotes, setReviewNotes] = useState('');
  const [reviewSaving, setReviewSaving] = useState(false);
  const [reviewSaved, setReviewSaved] = useState(false);

  useEffect(() => {
    adminFetch(`/applications/${id}`)
      .then((data) => {
        setApp(data);
        setReviewNotes(data.reviewNotes || '');
      })
      .catch((err) => setError(err.message));
  }, [id]);

  const handleStatusChange = async (newStatus: string) => {
    if (!app || newStatus === app.status) return;
    setStatusLoading(true);
    try {
      const updated = await adminFetch(`/applications/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus }),
      });
      setApp(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update status');
    } finally {
      setStatusLoading(false);
    }
  };

  const handleSaveReview = async () => {
    setReviewSaving(true);
    setReviewSaved(false);
    try {
      const updated = await adminFetch(`/applications/${id}/review`, {
        method: 'PATCH',
        body: JSON.stringify({ reviewNotes }),
      });
      setApp(updated);
      setReviewSaved(true);
      setTimeout(() => setReviewSaved(false), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save review');
    } finally {
      setReviewSaving(false);
    }
  };

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-red-700">
        {error}
      </div>
    );
  }

  if (!app) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/applications"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{app.fullName}</h1>
          <div className="mt-2 flex items-center gap-3">
            <a
              href={`mailto:${app.email}`}
              className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
            >
              <Mail className="h-4 w-4" />
              {app.email}
            </a>
            <a
              href={`https://wa.me/${stripPhoneForWhatsApp(app.mobileNumber)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-green-600 hover:text-green-800"
            >
              <MessageCircle className="h-4 w-4" />
              {app.mobileNumber}
            </a>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={app.status} />
          <select
            value={app.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            disabled={statusLoading}
            className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
          >
            {APPLICATION_STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-4">
        <Section title="Basic Information">
          <div className="grid grid-cols-2 gap-x-8">
            <Field label="Full Name">{app.fullName}</Field>
            <Field label="Email">{app.email}</Field>
            <Field label="Mobile">{app.mobileNumber}</Field>
            <Field label="Current City">{app.currentCity}</Field>
          </div>
        </Section>

        <Section title="Eligibility & Background">
          <div className="grid grid-cols-2 gap-x-8">
            <Field label="Nationality">{app.nationality}</Field>
            <Field label="UAE Resident"><BoolBadge value={app.uaeResident} /></Field>
            <Field label="Caregiving Experience">
              {Array.isArray(app.caregivingExperience)
                ? app.caregivingExperience.join(', ')
                : '—'}
            </Field>
            <Field label="Willing to Work"><BoolBadge value={app.willingToWork} /></Field>
            <Field label="Willing to Drive"><BoolBadge value={app.willingToDrive} /></Field>
          </div>
        </Section>

        <Section title="Expectations">
          <div className="grid grid-cols-2 gap-x-8">
            <Field label="Accepts Timeframe"><BoolBadge value={app.acceptsTimeframe} /></Field>
            <Field label="Seeks Permanent Relocation"><BoolBadge value={app.seeksPermanentRelocation} /></Field>
            <Field label="Understands Info Only"><BoolBadge value={app.understandsInfoOnly} /></Field>
            <Field label="Accepts Financial Costs"><BoolBadge value={app.acceptsFinancialCosts} /></Field>
          </div>
        </Section>

        <Section title="Session Selection">
          <div className="grid grid-cols-2 gap-x-8">
            <Field label="Attendance Mode">
              {app.attendanceMode === 'IN_PERSON' ? 'In Person' : 'Online'}
            </Field>
            <Field label="Selected Session">{app.selectedSession}</Field>
          </div>
        </Section>

        <Section title="Review">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-x-8">
              <Field label="Status">{app.status}</Field>
              <Field label="Tags">
                {Array.isArray(app.tags) && app.tags.length > 0
                  ? app.tags.join(', ')
                  : '—'}
              </Field>
              <Field label="Reviewed At">
                {app.reviewedAt
                  ? new Date(app.reviewedAt).toLocaleString('en-GB')
                  : '—'}
              </Field>
              <Field label="Applied At">
                {new Date(app.createdAt).toLocaleString('en-GB')}
              </Field>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                Review Notes
              </label>
              <textarea
                value={reviewNotes}
                onChange={(e) => {
                  setReviewNotes(e.target.value);
                  setReviewSaved(false);
                }}
                rows={3}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Add notes about this application..."
              />
              <div className="mt-2 flex items-center gap-2">
                <button
                  onClick={handleSaveReview}
                  disabled={reviewSaving}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
                >
                  <Save className="h-3.5 w-3.5" />
                  {reviewSaving ? 'Saving...' : 'Save Notes'}
                </button>
                {reviewSaved && (
                  <span className="text-sm text-green-600">Saved</span>
                )}
              </div>
            </div>
          </div>
        </Section>
      </div>
    </div>
  );
}
