'use client';

import { CheckCircle, XCircle, ArrowRight, AlertTriangle, Tag, Info } from 'lucide-react';

const qualificationRules = [
  {
    field: 'Nationality',
    question: 'Is the applicant Filipino?',
    failTag: 'Not Suitable – Criteria',
    check: 'nationality is "filipino" (case-insensitive)',
  },
  {
    field: 'UAE Residency',
    question: 'Is the applicant currently residing in the UAE?',
    failTag: 'Not Suitable – Criteria',
    check: 'uaeResident is true',
  },
  {
    field: 'Willingness to Work',
    question: 'Is the applicant willing to work in caregiving roles?',
    failTag: 'Not Suitable – Criteria',
    check: 'willingToWork is true',
  },
  {
    field: 'Willingness to Drive',
    question: 'Is the applicant willing to drive for caregiving roles?',
    failTag: 'Not Suitable – Driving Requirement',
    check: 'willingToDrive is true',
  },
  {
    field: 'Timeframe Acceptance',
    question: 'Does the applicant accept the 2–3 year EB-3 timeline?',
    failTag: 'Not Suitable – Expectations',
    check: 'acceptsTimeframe is true',
  },
  {
    field: 'Financial Costs',
    question: 'Does the applicant accept the financial expectations?',
    failTag: 'Not Suitable – Financial Expectations',
    check: 'acceptsFinancialCosts is true',
  },
];

const informationalFields = [
  {
    field: 'Caregiving Experience',
    note: 'Stored for review but does not affect qualification status.',
  },
  {
    field: 'Seeks Permanent Relocation',
    note: 'Required field — stored for review, no auto-tagging.',
  },
  {
    field: 'Understands Info Only',
    note: 'Required field — stored for review, no auto-tagging.',
  },
];

export default function QualificationLogicPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Qualification Logic</h1>
      <p className="mt-1 text-sm text-slate-500">
        How the system automatically determines an applicant&apos;s status on submission.
      </p>

      {/* Overview */}
      <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
        <h2 className="text-sm font-semibold text-blue-900">How it works</h2>
        <p className="mt-1 text-sm text-blue-800">
          When an application is submitted, the system checks each qualification rule below
          in order. Every failed check adds a disqualification tag. If{' '}
          <strong>no disqualification tags</strong> are produced, the applicant is marked as{' '}
          <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-800">
            <CheckCircle className="h-3 w-3" /> Qualified – Invite
          </span>
          . Otherwise, the status is set to the <strong>first disqualification tag</strong>.
          An attendance mode tag is always added for operational tracking.
        </p>
      </div>

      {/* Qualification rules table */}
      <h2 className="mt-8 text-lg font-semibold text-slate-900">Qualification Rules</h2>
      <p className="mt-1 text-sm text-slate-500">
        These rules determine whether an applicant qualifies. Checked in order.
      </p>
      <div className="mt-3 overflow-hidden rounded-lg border border-slate-200">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                #
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Field
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Condition Checked
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                If Failed
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {qualificationRules.map((rule, i) => (
              <tr key={rule.field} className="hover:bg-slate-50">
                <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-slate-400">
                  {i + 1}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-slate-900">
                  {rule.field}
                </td>
                <td className="px-4 py-3 text-sm text-slate-600">
                  {rule.question}
                  <span className="mt-1 block text-xs text-slate-400">
                    <code className="rounded bg-slate-100 px-1.5 py-0.5">{rule.check}</code>
                  </span>
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-red-700">
                    <XCircle className="h-3 w-3" />
                    {rule.failTag}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Attendance mode tags */}
      <h2 className="mt-8 text-lg font-semibold text-slate-900">Attendance Mode Tags</h2>
      <p className="mt-1 text-sm text-slate-500">
        Always added for operational tracking. These do not affect qualification status.
      </p>
      <div className="mt-3 overflow-hidden rounded-lg border border-slate-200">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Selection
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Tag Added
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            <tr className="hover:bg-slate-50">
              <td className="px-4 py-3 text-sm text-slate-600">In-person (Dubai or Abu Dhabi)</td>
              <td className="px-4 py-3">
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                  <Tag className="h-3 w-3" />
                  Attendance – In Person
                </span>
              </td>
            </tr>
            <tr className="hover:bg-slate-50">
              <td className="px-4 py-3 text-sm text-slate-600">Online (Live virtual session)</td>
              <td className="px-4 py-3">
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                  <Tag className="h-3 w-3" />
                  Attendance – Online
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Fields that don't affect qualification */}
      <h2 className="mt-8 text-lg font-semibold text-slate-900">Non-Qualifying Fields</h2>
      <p className="mt-1 text-sm text-slate-500">
        These fields are collected and stored but do not trigger any disqualification tags.
      </p>
      <div className="mt-3 overflow-hidden rounded-lg border border-slate-200">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Field
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Note
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {informationalFields.map((f) => (
              <tr key={f.field} className="hover:bg-slate-50">
                <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-slate-900">
                  {f.field}
                </td>
                <td className="px-4 py-3 text-sm text-slate-600">{f.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Flow diagram */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-slate-900">Status Assignment Flow</h2>
        <div className="mt-4 space-y-3">
          <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-600">
              1
            </div>
            <p className="text-sm text-slate-700">
              Run all 6 qualification checks above. Collect a disqualification tag for each
              failed check.
            </p>
          </div>

          <div className="flex justify-center">
            <ArrowRight className="h-5 w-5 rotate-90 text-slate-300" />
          </div>

          <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-600">
              2
            </div>
            <p className="text-sm text-slate-700">
              Add attendance mode tag (
              <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">Attendance – In Person</code>
              {' '}or{' '}
              <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">Attendance – Online</code>
              ).
            </p>
          </div>

          <div className="flex justify-center">
            <ArrowRight className="h-5 w-5 rotate-90 text-slate-300" />
          </div>

          <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-600">
              3
            </div>
            <p className="text-sm text-slate-700">
              Deduplicate disqualification tags (e.g. failing nationality, UAE residency, and
              willingness to work produces one{' '}
              <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">Not Suitable – Criteria</code>{' '}
              tag, not three).
            </p>
          </div>

          <div className="flex justify-center">
            <ArrowRight className="h-5 w-5 rotate-90 text-slate-300" />
          </div>

          <div className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 p-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-700">
              4a
            </div>
            <p className="text-sm text-slate-700">
              <strong>No disqualification tags?</strong> Status ={' '}
              <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-800">
                <CheckCircle className="h-3 w-3" /> Qualified – Invite
              </span>
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100 text-sm font-bold text-amber-700">
              4b
            </div>
            <p className="text-sm text-slate-700">
              <strong>Has disqualification tags?</strong> Status = first disqualification tag.
              All tags (disqualification + attendance) are stored in the{' '}
              <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">tags</code> array on
              the record.
            </p>
          </div>
        </div>
      </div>

      {/* All possible statuses */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-slate-900">All Possible Statuses</h2>
        <div className="mt-3 overflow-hidden rounded-lg border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  How Assigned
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              <tr className="hover:bg-slate-50">
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-semibold text-green-700">
                    <CheckCircle className="h-3 w-3" /> Qualified – Invite
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-slate-600">
                  Automatic — all criteria satisfied
                </td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                    <Info className="h-3 w-3" /> Qualified – Waitlist
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-slate-600">
                  Manual only — set by admin when session is full
                </td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-red-700">
                    <XCircle className="h-3 w-3" /> Not Suitable – Criteria
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-slate-600">
                  Automatic — nationality, UAE residency, or willingness to work failed
                </td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-red-700">
                    <XCircle className="h-3 w-3" /> Not Suitable – Expectations
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-slate-600">
                  Automatic — timeline not accepted
                </td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-red-700">
                    <XCircle className="h-3 w-3" /> Not Suitable – Driving Requirement
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-slate-600">
                  Automatic — cannot drive
                </td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-red-700">
                    <XCircle className="h-3 w-3" /> Not Suitable – Financial Expectations
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-slate-600">
                  Automatic — financial expectations not accepted
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Note */}
      <div className="mt-8 flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
        <div className="text-sm text-amber-800">
          <p className="font-semibold">Important</p>
          <p className="mt-1">
            This logic runs only at submission time. Changing an applicant&apos;s status
            later via the admin panel (manual review or bulk update) overrides the original
            automated status. The original tags remain on the record for reference.
          </p>
        </div>
      </div>
    </div>
  );
}
