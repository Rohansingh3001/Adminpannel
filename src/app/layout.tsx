import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthGuard } from '../components/auth/AuthGuard';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Product Admin Dashboard',
  description: 'Manage your products catalog efficiently.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gradient-to-br from-slate-50 to-slate-100 text-slate-900 selection:bg-indigo-500/30 min-h-screen`}>
        <AuthGuard>
          {children}
        </AuthGuard>
      </body>
    </html>
  );
}
