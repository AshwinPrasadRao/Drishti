'use client';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { useUIStore } from '@/store/ui-store';

export function AppShell({ children }: { children: React.ReactNode }) {
  const { sidebarOpen } = useUIStore();

  return (
    <div className="flex h-full min-h-screen bg-[var(--bg-base)]">
      <Sidebar />
      <div
        className="flex flex-col flex-1 overflow-hidden transition-all duration-200"
        style={{ marginLeft: sidebarOpen ? '240px' : '64px' }}
      >
        <TopBar />
        <main className="flex-1 overflow-auto p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
