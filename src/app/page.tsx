"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to home page
    router.replace('/home');
  }, [router]);

  return (
    <div className="min-h-screen bg-[#101112] text-white flex items-center justify-center">
      <div className="text-xl">Redirecting...</div>
    </div>
  );
}
