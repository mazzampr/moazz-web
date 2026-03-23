'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FolderKanban,
  FileText,
  LogOut,
  Menu,
  X,
  Briefcase,
} from 'lucide-react';
import { useState } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

const sidebarLinks = [
  {
    title: 'Dashboard',
    href: '/admin/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Projects',
    href: '/admin/projects',
    icon: FolderKanban,
  },
  {
    title: 'Articles',
    href: '/admin/articles',
    icon: FileText,
  },
  {
    title: 'Experiences',
    href: '/admin/experiences',
    icon: Briefcase,
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);



  const handleLogout = () => {
    Cookies.remove('ADMIN_SECRET');
    router.push('/moazzloginadmin');
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#1a1a1a] border-b border-[#2a2a2a] z-50 flex items-center justify-between px-4">
        <Link href="/admin/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-blue flex items-center justify-center font-bold text-black text-sm rounded">
            M
          </div>
          <span className="font-bold text-white">Admin</span>
        </Link>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-white hover:bg-[#2a2a2a] rounded-lg transition-colors"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-[#1a1a1a] border-r border-[#2a2a2a] z-40 transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-[#2a2a2a]">
          <Link href="/admin/dashboard" className="flex items-center gap-3">
            <img
              src="/images/moazz-logo.png"
              alt="Moazz Logo"
              className="w-8 h-8 group-hover:animate-spin-slow transition-transform"
            />
            <div>
              <span className="font-bold text-white text-lg">MOAZZ</span>
              <span className="block text-xs text-gray-500">Admin Panel</span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {sidebarLinks.map((link) => {
            const isActive = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive
                  ? 'bg-brand-blue text-black font-medium'
                  : 'text-gray-400 hover:bg-[#2a2a2a] hover:text-white'
                  }`}
              >
                <link.icon size={20} />
                <span>{link.title}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#2a2a2a]">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-gray-400 hover:bg-[#2a2a2a] hover:text-white rounded-lg transition-all"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 w-full text-gray-400 hover:bg-[#2a2a2a] hover:text-white rounded-lg transition-all mt-2"
          >
            <span className="text-sm">← Back to Site</span>
          </Link>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="lg:ml-64 pt-16 lg:pt-0 min-h-screen">
        <div className="p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
