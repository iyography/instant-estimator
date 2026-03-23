import Link from 'next/link';
import { FileQuestion } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
          <FileQuestion className="h-8 w-8 text-blue-600" />
        </div>
        <h1 className="mb-2 text-2xl font-bold text-slate-900">Page not found</h1>
        <p className="mb-6 text-slate-600">
          Sorry, we couldn&apos;t find the page you&apos;re looking for.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/">
            <Button>Go home</Button>
          </Link>
          <Link href="/login">
            <Button variant="outline">Sign in</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
