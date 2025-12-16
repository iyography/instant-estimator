import { NextResponse, type NextRequest } from 'next/server';

// All requests pass through - pure demo mode
export async function middleware(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|api/|widget/|e/).*)',
  ],
};
