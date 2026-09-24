'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';
import { Package, LogOut, Menu, X, PlusCircle } from 'lucide-react';
import { useState } from 'react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: 'Products', href: '/products', icon: Package },
    { name: 'Add Product', href: '/products/new', icon: PlusCircle },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between bg-white border-b border-slate-200 p-4">
        <div className="flex items-center space-x-2 font-bold text-xl text-indigo-600">
          <Package className="h-6 w-6" />
          <span>Admin</span>
        </div>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 -mr-2">
          {sidebarOpen ? <X className="h-6 w-6 text-slate-600" /> : <Menu className="h-6 w-6 text-slate-600" />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`
        ${sidebarOpen ? 'block' : 'hidden'} 
        md:block w-full md:w-64 bg-white/70 backdrop-blur-xl border-r border-slate-200 md:h-screen md:sticky md:top-0
        flex-shrink-0 z-20 transition-all duration-300
      `}>
        <div className="hidden md:flex items-center space-x-2 font-bold text-xl text-indigo-600 p-6 border-b border-slate-100">
          <Package className="h-8 w-8" />
          <span>Product Admin</span>
        </div>

        <div className="p-4 flex flex-col h-[calc(100vh-100px)] justify-between">
          <nav className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href || (pathname.startsWith('/products/') && item.href === '/products' && pathname !== '/products/new');
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200
                    ${isActive 
                      ? 'bg-indigo-50 text-indigo-700 font-medium' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
                  `}
                >
                  <Icon className={`h-5 w-5 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-slate-100 pt-4 mt-auto">
            <div className="flex items-center px-4 py-3 mb-2">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold border border-indigo-200">
                {user?.firstName?.[0] || 'A'}
              </div>
              <div className="ml-3 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">{user?.firstName} {user?.lastName}</p>
                <p className="text-xs text-slate-500 truncate">@{user?.username}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all duration-200 font-medium"
            >
              <LogOut className="h-5 w-5 text-red-500" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 w-full max-w-full overflow-x-hidden min-h-screen flex flex-col">
        {children}
      </main>
    </div>
  );
}
