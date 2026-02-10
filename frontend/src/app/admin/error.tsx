'use client';

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center">
      <h2 className="mb-2 text-xl font-bold text-gray-900">Something went wrong</h2>
      <p className="mb-6 text-sm text-gray-500">{error.message || 'An unexpected error occurred'}</p>
      <button
        onClick={reset}
        className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
      >
        Try Again
      </button>
    </div>
  );
}
