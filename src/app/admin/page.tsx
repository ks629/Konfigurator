'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { NexbeIcon } from '@nexbe/icons';
import {
  LayoutDashboard,
  Users,
  Settings,
  FileText,
  CalendarCheck,
} from 'lucide-react';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple auth - in production use NextAuth
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD || password === 'nexbe2025') {
      setIsAuthenticated(true);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/20">
        <div className="w-full max-w-sm p-8 bg-card rounded-xl border shadow-lg">
          <div className="flex items-center gap-2 mb-6 justify-center">
            <NexbeIcon name="magazyn-energii" size={32} variant="inherit" className="text-primary" />
            <span className="font-heading text-2xl text-primary">NEXBE</span>
          </div>
          <h1 className="font-heading text-lg text-center mb-6">Panel administracyjny</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Hasło</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Wpisz hasło"
                className="h-11"
              />
            </div>
            <Button type="submit" className="w-full" size="lg">
              Zaloguj się
            </Button>
          </form>
        </div>
      </div>
    );
  }

  const stats = [
    { label: 'Leady dziś', value: '12', renderIcon: (cls: string) => <Users className={cls} />, color: 'text-blue-600 bg-blue-50' },
    { label: 'Leady w tygodniu', value: '47', renderIcon: (cls: string) => <NexbeIcon name="roi" size={20} variant="inherit" className={cls} />, color: 'text-green-600 bg-green-50' },
    { label: 'Pobrane PDF', value: '31', renderIcon: (cls: string) => <FileText className={cls} />, color: 'text-purple-600 bg-purple-50' },
    { label: 'Umówione audyty', value: '8', renderIcon: (cls: string) => <CalendarCheck className={cls} />, color: 'text-orange-600 bg-orange-50' },
  ];

  const menuItems = [
    { label: 'Dashboard', href: '/admin', renderIcon: (cls: string) => <LayoutDashboard className={cls} />, active: true },
    { label: 'Cennik produktów', href: '/admin/cennik', renderIcon: (cls: string) => <NexbeIcon name="system-hybrydowy" size={16} variant="inherit" className={cls} /> },
    { label: 'Lista leadów', href: '/admin/leady', renderIcon: (cls: string) => <Users className={cls} /> },
    { label: 'Ustawienia', href: '/admin/ustawienia', renderIcon: (cls: string) => <Settings className={cls} /> },
  ];

  return (
    <div className="min-h-screen bg-muted/20">
      {/* Admin Header */}
      <header className="bg-secondary text-secondary-foreground border-b">
        <div className="container mx-auto px-4 flex items-center justify-between h-14">
          <div className="flex items-center gap-2">
            <NexbeIcon name="magazyn-energii" size={24} variant="inherit" className="text-primary" />
            <span className="font-heading text-lg text-primary">NEXBE</span>
            <span className="text-xs text-gray-400 ml-2">Admin</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsAuthenticated(false)}
            className="text-gray-400 hover:text-white"
          >
            Wyloguj
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Navigation */}
        <div className="flex flex-wrap gap-2 mb-8">
          {menuItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant={item.active ? 'default' : 'outline'}
                size="sm"
                className="gap-2"
              >
                {item.renderIcon('h-4 w-4')}
                {item.label}
              </Button>
            </Link>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-card rounded-xl border p-5">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-lg ${stat.color}`}>
                  {stat.renderIcon('h-5 w-5')}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-heading">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Conversion funnel */}
        <div className="bg-card rounded-xl border p-6">
          <div className="flex items-center gap-2 mb-6">
            <NexbeIcon name="monitoring-247" size={20} variant="inherit" className="text-primary" />
            <h2 className="font-heading text-lg">Lejek konwersji (ostatnie 30 dni)</h2>
          </div>

          <div className="space-y-4">
            {[
              { label: 'Wizyty na stronie', value: 1240, percent: 100 },
              { label: 'Rozpoczęte konfiguracje', value: 380, percent: 30.6 },
              { label: 'Ukończone konfiguracje', value: 185, percent: 14.9 },
              { label: 'Pobrane oferty (leady)', value: 47, percent: 3.8 },
              { label: 'Umówione audyty', value: 8, percent: 0.6 },
            ].map((item) => (
              <div key={item.label} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span>{item.label}</span>
                  <span className="font-medium">
                    {item.value} ({item.percent}%)
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
