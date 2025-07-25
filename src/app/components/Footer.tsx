import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-[#18191A] border-t border-[#232526] py-6 mt-8 text-center text-gray-400">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 px-4">
        <div className="flex items-center gap-2 text-sm">
          <span>&copy; {new Date().getFullYear()} SecureSight by MandlaCX</span>
          <span className="hidden md:inline">|</span>
          <a href="/privacy" className="hover:text-yellow-400 transition-colors">Privacy Policy</a>
          <span className="hidden md:inline">|</span>
          <a href="/terms" className="hover:text-yellow-400 transition-colors">Terms of Service</a>
        </div>
        <div className="text-xs text-gray-500 mt-2 md:mt-0">
          Empowering real-time security monitoring and incident management.
        </div>
      </div>
    </footer>
  );
} 