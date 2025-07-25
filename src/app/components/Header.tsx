"use client";
import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

const navLinks = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/cameras', label: 'Cameras' },
  { href: '/scenes', label: 'Scenes' },
  { href: '/incidents', label: 'Incidents' },
  { href: '/more', label: 'More' },
];

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-[#18191A] border-b border-[#232526]">
      <div className="flex items-center gap-8">
        <div className="text-white font-bold text-xl tracking-widest flex items-center gap-2">
          <span className="bg-white rounded p-1"><span className="text-black">M</span></span> MANDLACX
        </div>
        <nav className="flex gap-6 text-sm text-gray-400">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={
                link.href === '/dashboard'
                  ? 'text-orange-400 font-semibold'
                  : 'hover:text-white'
              }
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="flex items-center gap-3">
        {isAuthenticated ? (
          <>
            <div className="w-8 h-8 rounded-full bg-gray-600" />
            <div className="text-white text-sm">{user?.name || 'User'}</div>
            <div className="text-xs text-gray-400">{user?.email || 'user@example.com'}</div>
            <button
              onClick={handleLogout}
              className="ml-3 px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded transition-colors"
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            href="/login"
            className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm rounded transition-colors"
          >
            Login
          </Link>
        )}
      </div>
    </header>
  );
} 