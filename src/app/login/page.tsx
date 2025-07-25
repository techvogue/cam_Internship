"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);
        router.push("/dashboard");
      }
    } catch {
      // Error handling
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-[#101112] flex items-center justify-center">
      <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="text-white font-bold text-2xl tracking-widest flex items-center justify-center gap-2 mb-2">
            <span className="bg-white/60 rounded p-1 backdrop-blur-sm">
              <span className="text-black">M</span>
            </span>
            MANDLACX
          </div>
          <h2 className="text-xl text-white mb-2">Welcome Back</h2>
          <p className="text-gray-200">Sign in to SecureSight Dashboard</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-white/20 border border-white/30 focus:bg-white/40 backdrop-blur-sm rounded-lg text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 placeholder:text-gray-300"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-white/20 border border-white/30 focus:bg-white/40 backdrop-blur-sm rounded-lg text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 placeholder:text-gray-300"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-600 hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition duration-200 shadow-lg"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-gray-300 text-sm">
            Use your organization credentials to access the dashboard
          </p>
        </div>
      </div>
    </div>
  );
}
