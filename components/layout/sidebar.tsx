'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  BarChart3,
  Dumbbell,
  Target,
  TrendingUp,
  Calendar,
  User,
  Settings,
  Menu,
  X,
  Home,
  Camera,
  Trophy,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Workouts', href: '/workouts', icon: Dumbbell },
  { name: 'Programs', href: '/programs', icon: Calendar },
  { name: 'Progress', href: '/progress', icon: TrendingUp },
  { name: 'Goals', href: '/goals', icon: Target },
  { name: 'Records', href: '/records', icon: Trophy },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Photos', href: '/photos', icon: Camera },
  { name: 'Profile', href: '/profile', icon: User },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

  const toggleCollapsed = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleMobile = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleMobile}
          className="h-10 w-10"
        >
          {isMobileOpen ? (
            <X className="h-4 w-4" />
          ) : (
            <Menu className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={toggleMobile}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          'fixed left-0 top-0 z-40 h-screen bg-background border-r border-border transition-all duration-300 ease-in-out',
          // Desktop sizing
          'hidden lg:flex',
          isCollapsed ? 'w-16' : 'w-64',
          // Mobile sizing
          'lg:translate-x-0',
          isMobileOpen ? 'flex w-64 translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-full w-full flex-col">
          {/* Header */}
          <div className="flex h-16 items-center justify-between px-4 border-b border-border">
            {!isCollapsed && (
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                  <Dumbbell className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="font-semibold text-lg">FitTracker</span>
              </div>
            )}
            
            {/* Desktop toggle button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleCollapsed}
              className={cn(
                'h-8 w-8 hidden lg:flex',
                isCollapsed && 'mx-auto'
              )}
            >
              <Menu className="h-4 w-4" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={cn(
                    'group flex items-center rounded-md px-2 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                    isCollapsed && 'justify-center px-2'
                  )}
                >
                  <item.icon
                    className={cn(
                      'h-5 w-5 flex-shrink-0',
                      isCollapsed ? 'mx-auto' : 'mr-3'
                    )}
                  />
                  {!isCollapsed && (
                    <span className="truncate">{item.name}</span>
                  )}
                  
                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <div className="absolute left-16 bg-popover text-popover-foreground px-2 py-1 rounded-md text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 border border-border shadow-md">
                      {item.name}
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="border-t border-border p-4">
            {!isCollapsed && (
              <div className="text-xs text-muted-foreground text-center">
                <p>FitTracker v1.0</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
