'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error to console in development
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <AlertTriangle className="h-8 w-8 text-red-600" />
        </div>
        <h2 className="mb-2 text-2xl font-bold text-slate-900">
          Something went wrong
        </h2>
        <p className="mb-6 text-slate-600">
          We apologize for the inconvenience. Please try again.
        </p>
        <div className="flex justify-center gap-4">
          <Button onClick={reset}>Try again</Button>
          <Button variant="outline" onClick={() => (window.location.href = '/')}>
            Go home
          </Button>
        </div>
        {process.env.NODE_ENV === 'development' && error.message && (
          <div className="mt-8 max-w-lg rounded-lg bg-slate-100 p-4 text-left">
            <p className="mb-2 text-sm font-medium text-slate-700">
              Error details (dev only):
            </p>
            <pre className="overflow-auto text-xs text-red-600">
              {error.message}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
