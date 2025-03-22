import React from 'react';
import { LogOut, Settings, User } from 'lucide-react';
import Link from 'next/link';
import { signOut } from 'next-auth/react';

export function UserAccountNav() {
  return (
    <div className="relative group">
      <button className="flex items-center space-x-1">
        <User className="h-6 w-6" />
      </button>

      <div className="absolute right-0 mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
        <Link
          href="/dashboard"
          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          <User className="mr-3 h-4 w-4" />
          Dashboard
        </Link>
        <button
          onClick={() => signOut()}
          className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          <LogOut className="mr-3 h-4 w-4" />
          Sign out
        </button>
      </div>
    </div>
  );
} 