'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Cookies from 'js-cookie';
import { Lock, AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export default function AdminLoginPage() {
  const [secret, setSecret] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/admin/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!secret.trim()) {
      setError('Please enter the admin secret key');
      setLoading(false);
      return;
    }

    try {
      // Authenticate against backend
      const res = await fetch(`${API_URL}/auth/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': secret,
        },
      });

      if (!res.ok) {
        setError('Invalid secret key');
        setLoading(false);
        return;
      }

      // If valid, set cookie and redirect
      Cookies.set('ADMIN_SECRET', secret, { expires: 7 }); // 7 days
      await new Promise((resolve) => setTimeout(resolve, 100)); // Delay to ensure cookie is set
      router.push(redirectTo);
      router.refresh();
    } catch (err) {
      console.error('Auth error:', err);
      setError('An error occurred during authentication');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Back to site</span>
        </Link>

        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-8">
          <div className="flex items-center justify-center mb-8">
            <div className="w-16 h-16 bg-brand-blue flex items-center justify-center font-bold text-black text-3xl rounded-lg">
              M
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">Admin Login</h1>
            <p className="text-gray-400 text-sm">
              Enter your secret key to access the admin panel
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label
                htmlFor="secret"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Secret Key
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-500" />
                </div>
                <input
                  id="secret"
                  type="password"
                  value={secret}
                  onChange={(e) => setSecret(e.target.value)}
                  placeholder="Enter admin secret"
                  className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-brand-blue transition-colors"
                  autoFocus
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-blue text-black font-bold py-3 px-4 rounded-lg hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <span>Access Admin Panel</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
