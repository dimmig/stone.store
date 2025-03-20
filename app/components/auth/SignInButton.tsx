import React from 'react';
import { User } from 'lucide-react';
import Link from 'next/link';

export function SignInButton() {
  return (
    <Link
      href="/auth/signin"
      className="flex items-center space-x-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
    >
      <User className="h-5 w-5" />
      <span>Sign In</span>
    </Link>
  );
} 