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
      <body className={`${inter.className} bg-gray-50 text-slate-900`}>
        <AuthGuard>
          {children}
        </AuthGuard>
      </body>
    </html>
  );
}
