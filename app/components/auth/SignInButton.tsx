'use client';

import Link from 'next/link';
import { User } from 'lucide-react';

export function SignInButton() {
  return (
    <div className="flex items-center space-x-4">
      <Link
        href="/auth/signup"
        className="hidden rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50 lg:block"
      >
        Sign up
      </Link>
      <Link
        href="/auth/signin"
        className="flex items-center space-x-2 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:opacity-90"
      >
        <User className="h-4 w-4" />
        <span>Sign in</span>
      </Link>
    </div>
  );
} 