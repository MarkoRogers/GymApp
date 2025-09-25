import './globals.css';
import { Analytics } from '@vercel/analytics/react';
import { Sidebar } from '@/components/layout/sidebar';

export const metadata = {
  title: 'FitTracker - Your Personal Fitness Companion',
  description: 'Track your workouts, monitor progress, and achieve your fitness goals.'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen w-full">
        <Sidebar />
        <div className="flex-1 lg:ml-64">
          <main className="p-4 lg:p-8">
            {children}
          </main>
        </div>
        <Analytics />
      </body>
    </html>
  );
}
