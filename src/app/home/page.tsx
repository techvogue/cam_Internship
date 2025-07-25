"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function HomePage() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        // Validate that user data is parseable
        JSON.parse(userData);
        router.replace('/dashboard');
        return;
      } catch {
        // Invalid stored data, clear it
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    
    setIsChecking(false);
  }, [router]);

  if (isChecking) {
    return (
      <div className="min-h-screen bg-[#101112] text-white flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
<div className="min-h-screen bg-gradient-to-br from-[#0a0b0c] via-[#12141a] to-[#0a0b0c] flex flex-col">
  {/* Simple Header */}
  <header className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b border-gray-800/30">
    <div className="max-w-7xl mx-auto px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-lg">M</span>
          </div>
          <span className="text-white font-bold text-xl tracking-wide">MANDLACX</span>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="#home" className="text-gray-300 hover:text-white transition-colors duration-200 font-medium">
            Home
          </a>
          <a href="#features" className="text-gray-300 hover:text-white transition-colors duration-200 font-medium">
            Features
          </a>
          <a href="#about" className="text-gray-300 hover:text-white transition-colors duration-200 font-medium">
            About
          </a>
          <Link
            href="/login"
            className="px-6 py-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg"
          >
            Sign In
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-white">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </div>
  </header>

  {/* Enhanced Classy Hero Section */}
  <div className="flex-1 flex items-center justify-center px-6 py-20 pt-32 relative overflow-hidden">
    {/* Ambient Background Effects */}
    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-red-500/5"></div>
    <div className="absolute top-20 left-10 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
    <div className="absolute bottom-20 right-10 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
    
    <div className="max-w-6xl mx-auto text-center relative z-10">
      {/* Premium Status Badge */}
     

      {/* Sophisticated Title with Enhanced Typography */}
      <div className="mb-12">
        <div className="mb-6">
          <span className="block text-6xl md:text-8xl font-thin text-white/90 mb-2 tracking-tight leading-none">
            Elite
          </span>
          <div className="relative inline-block">
            <span className="block text-7xl md:text-9xl font-black bg-gradient-to-r from-orange-300 via-red-400 to-pink-400 bg-clip-text text-transparent leading-none tracking-tight">
              SecureSight
            </span>
            {/* Subtle glow effect */}
            <div className="absolute inset-0 text-7xl md:text-9xl font-black bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 bg-clip-text text-transparent blur-sm opacity-30 leading-none tracking-tight">
              SecureSight
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
          <span className="text-3xl md:text-4xl font-light text-gray-300 tracking-[0.2em] uppercase">
            Command Center
          </span>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
        </div>
      </div>

      {/* Elegant Description */}
      <div className="mb-16">
        <p className="text-2xl md:text-3xl text-gray-300 max-w-4xl mx-auto leading-relaxed font-light mb-6">
     
         
        </p>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto font-light">
          Powered by advanced AI • Real-time monitoring • Intelligent threat detection
        </p>
      </div>

      {/* Premium CTA Section */}
      <div className="flex flex-col items-center gap-8 mb-20">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <Link
            href="/login"
            className="group relative px-12 py-5 bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 hover:from-orange-500 hover:via-red-500 hover:to-pink-500 text-white font-bold text-lg rounded-2xl transition-all duration-500 transform hover:scale-110 shadow-2xl hover:shadow-orange-500/30 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
            <span className="relative z-10 flex items-center gap-3">
              Enter Dashboard
              <svg className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </Link>
          
          <button className="group px-10 py-5 bg-white/5 hover:bg-white/10 border-2 border-white/20 hover:border-white/40 text-white font-semibold text-lg rounded-2xl transition-all duration-300 backdrop-blur-xl hover:scale-105">
            <span className="flex items-center gap-3">
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.5a2.5 2.5 0 010 5H9m-5 5V4a2 2 0 012-2h4.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V12" />
              </svg>
              Watch Demo
            </span>
          </button>
        </div>

        {/* Elegant Demo Credentials */}
        <div className="relative">
          <div className="bg-gradient-to-br from-black/40 to-gray-900/40 border border-gray-600/30 rounded-3xl p-8 backdrop-blur-2xl shadow-2xl max-w-lg mx-auto">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-red-500/5 rounded-3xl"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                <span className="text-gray-300 font-medium uppercase tracking-widest text-sm">
                  Demo Credentials
                </span>
                <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                  <span className="text-gray-400 font-medium">Username</span>
                  <code className="text-orange-300 bg-orange-400/10 px-4 py-2 rounded-lg font-mono text-sm border border-orange-400/20">
                    admin@mandlacx.com
                  </code>
                </div>
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                  <span className="text-gray-400 font-medium">Password</span>
                  <code className="text-orange-300 bg-orange-400/10 px-4 py-2 rounded-lg font-mono text-sm border border-orange-400/20">
                    admin123
                  </code>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-600/30">
                <p className="text-gray-500 text-xs text-center font-light">
                  Instant access • No registration required • Full features unlocked
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Elegant Trust Indicators */}
      <div className="flex items-center justify-center gap-8 text-gray-500 text-sm">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>Enterprise Security</span>
        </div>
        <div className="w-px h-4 bg-gray-600"></div>
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>24/7 Monitoring</span>
        </div>
        <div className="w-px h-4 bg-gray-600"></div>
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
          </svg>
          <span>AI-Powered</span>
        </div>
      </div>
    </div>
  </div>

  {/* Features Section - Second Screen (Original) */}
  <div className="min-h-screen flex items-center justify-center px-6 py-20 bg-gradient-to-br from-[#12141a] to-[#0a0b0c]">
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Why Choose 
          <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent"> SecureSight</span>
        </h2>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Cutting-edge technology meets intuitive design for comprehensive security management
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {[
          {
            icon: (
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            ),
            title: "Real-Time Monitoring",
            description: "Monitor security incidents across multiple camera feeds with instant alerts and notifications",
            color: "from-red-500 to-pink-500"
          },
          {
            icon: (
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9.5 3A6.5 6.5 0 0 1 16 9.5c0 1.61-.59 3.09-1.56 4.23l.27.27h.79l5 5-1.5 1.5-5-5v-.79l-.27-.27A6.516 6.516 0 0 1 9.5 16 6.5 6.5 0 0 1 3 9.5 6.5 6.5 0 0 1 9.5 3m0 2C7.01 5 5 7.01 5 9.5S7.01 14 9.5 14 14 11.99 14 9.5 11.99 5 9.5 5z"/>
              </svg>
            ),
            title: "AI-Powered Analytics",
            description: "Advanced machine learning algorithms for threat detection and predictive security insights",
            color: "from-blue-500 to-cyan-500"
          },
          {
            icon: (
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            ),
            title: "Smart Management",
            description: "Streamlined incident management with automated workflows and comprehensive audit trails",
            color: "from-green-500 to-emerald-500"
          }
        ].map((feature, index) => (
          <div key={index} className="group relative">
            <div className="bg-[#151618]/60 backdrop-blur-sm border border-gray-700/50 p-8 rounded-2xl hover:border-gray-600/50 transition-all duration-300 hover:transform hover:scale-105">
              <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-6 mx-auto shadow-lg`}>
                <div className="text-white">
                  {feature.icon}
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>

  {/* Footer */}
  <footer className="py-8 text-center border-t border-gray-800/50">
    <p className="text-gray-500 text-sm">
      © 2025 <span className="text-orange-400 font-medium">MANDLACX</span> SecureSight. All rights reserved.
    </p>
  </footer>
</div>

  
  
  );
}
