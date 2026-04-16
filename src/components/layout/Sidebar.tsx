'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  TrendingUp,
  DollarSign,
  GitCompare,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Target,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUIStore } from '@/store/ui-store';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Inventory', icon: LayoutDashboard },
  { href: '/projections/builder', label: 'Build Projection', icon: Target },
  { href: '/projections', label: 'Gallery', icon: TrendingUp },
  { href: '/budget', label: 'Budget', icon: DollarSign },
  { href: '/compare', label: 'Compare', icon: GitCompare },
  { href: '/about', label: 'About & Sources', icon: BookOpen },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, setSidebarOpen } = useUIStore();

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-full flex flex-col z-40 transition-all duration-200',
        'bg-[var(--bg-surface)] border-r border-[var(--border-subtle)]',
        sidebarOpen ? 'w-60' : 'w-16'
      )}
    >
      {/* Logo */}
      <div className={cn(
        'flex items-center gap-3 border-b border-[var(--border-subtle)]',
        sidebarOpen ? 'px-4 py-4' : 'px-4 py-4 justify-center'
      )}>
        <div className="w-7 h-7 rounded-md bg-[var(--brand)] flex items-center justify-center flex-shrink-0 shadow-lg shadow-orange-500/20">
          <span className="text-white font-bold text-xs tracking-tight">DR</span>
        </div>
        {sidebarOpen && (
          <div className="overflow-hidden min-w-0">
            <p className="text-[var(--text-primary)] font-semibold text-sm leading-tight">Drishti</p>
            <p className="text-[var(--text-tertiary)] text-xs">India Defence 2047</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              title={!sidebarOpen ? label : undefined}
              className={cn(
                'flex items-center gap-3 px-2.5 py-2 rounded-md text-sm transition-colors group',
                sidebarOpen ? '' : 'justify-center',
                active
                  ? 'bg-[var(--brand-muted)] text-[var(--brand)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]'
              )}
            >
              <Icon className={cn('w-4 h-4 flex-shrink-0', active ? 'text-[var(--brand)]' : '')} />
              {sidebarOpen && <span className="truncate">{label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <div className="p-2 border-t border-[var(--border-subtle)]">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={cn(
            'w-full flex items-center p-2 rounded-md transition-colors',
            'text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]',
            sidebarOpen ? 'justify-end gap-2' : 'justify-center'
          )}
          aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {sidebarOpen && <span className="text-xs">Collapse</span>}
          {sidebarOpen ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
        </button>
      </div>
    </aside>
  );
}
