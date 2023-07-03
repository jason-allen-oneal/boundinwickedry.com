import { NextResponse, NextRequest } from 'next/server';
import { useSession } from 'next-auth/react';


export function middleware(request: NextRequest) {
  const { data: session, status } = useSession();
  if (!session) {
    return NextResponse.redirect('/user/login/');
  }
}

export const config = {
  matcher: [
    '/forum/topic/add/:path*',
    '/gallery/gallery/add/:path*',
    '/chat/',
    '/api/chat/',
    '/api/site/vote/',
    '/api/forum/add/comment/',
    '/api/gallery/add/comment/',
  ]
};