'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Battery,
  LayoutDashboard,
  Package,
  Users,
  Settings,
  Search,
  Download,
  Eye,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

// Sample data for demo
const sampleLeads = [
  {
    id: 'NEXBE-001',
    timestamp: '2025-01-15 10:30',
    name: 'Jan Kowalski',
    email: 'jan@example.com',
    phone: '+48 600 100 200',
    installationType: 'retrofit',
    pvPower: 6.0,
    product: 'Dyness EP11',
    capacity: 10.2,
    priceNet: 15760,
    roi: 7,
    status: 'nowy' as const,
  },
  {
    id: 'NEXBE-002',
    timestamp: '2025-01-15 11:45',
    name: 'Anna Nowak',
    email: 'anna@example.com',
    phone: '+48 601 200 300',
    installationType: 'hybrid',
    pvPower: 8.0,
    product: 'Huawei LUNA2000-10-E0',
    capacity: 10.0,
    priceNet: 22400,
    roi: 9,
    status: 'w_trakcie' as const,
  },
  {
    id: 'NEXBE-003',
    timestamp: '2025-01-14 09:20',
    name: 'Piotr Wisniewski',
    email: 'piotr@example.com',
    phone: '+48 602 300 400',
    installationType: 'retrofit',
    pvPower: 10.0,
    product: 'Dyness EP12',
    capacity: 12.0,
    priceNet: 18200,
    roi: 6,
    status: 'zamkniety' as const,
  },
];

const statusMap = {
  nowy: { label: 'Nowy', variant: 'default' as const },
  w_trakcie: { label: 'W trakcie', variant: 'secondary' as const },
  zamkniety: { label: 'Zamkniety', variant: 'outline' as const },
};

export default function LeadyPage() {
  const [search, setSearch] = useState('');
  const [selectedLead, setSelectedLead] = useState<(typeof sampleLeads)[0] | null>(null);

  const menuItems = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Cennik produktow', href: '/admin/cennik', icon: Package },
    { label: 'Lista leadow', href: '/admin/leady', icon: Users, active: true },
    { label: 'Ustawienia', href: '/admin/ustawienia', icon: Settings },
  ];

  const filtered = sampleLeads.filter(
    (l) =>
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.email.toLowerCase().includes(search.toLowerCase()) ||
      l.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-muted/20">
      <header className="bg-secondary text-secondary-foreground border-b">
        <div className="container mx-auto px-4 flex items-center justify-between h-14">
          <div className="flex items-center gap-2">
            <Battery className="h-6 w-6 text-primary" />
            <span className="font-heading text-lg text-primary">NEXBE</span>
            <span className="text-xs text-gray-400 ml-2">Admin</span>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap gap-2 mb-8">
          {menuItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button variant={item.active ? 'default' : 'outline'} size="sm" className="gap-2">
                <item.icon className="h-4 w-4" />
                {item.label}
              </Button>
            </Link>
          ))}
        </div>

        <div className="bg-card rounded-xl border overflow-hidden">
          <div className="p-4 border-b flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <h2 className="font-heading text-lg">Lista leadow ({filtered.length})</h2>
            <div className="flex gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Szukaj..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 h-9"
                />
              </div>
              <Button variant="outline" size="sm" className="gap-1">
                <Download className="h-3.5 w-3.5" />
                CSV
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50">
                  <th className="text-left p-3 font-medium">ID</th>
                  <th className="text-left p-3 font-medium">Data</th>
                  <th className="text-left p-3 font-medium">Klient</th>
                  <th className="text-left p-3 font-medium hidden md:table-cell">Produkt</th>
                  <th className="text-right p-3 font-medium hidden md:table-cell">ROI</th>
                  <th className="text-center p-3 font-medium">Status</th>
                  <th className="text-right p-3 font-medium">Akcje</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((lead) => (
                  <tr key={lead.id} className="border-t hover:bg-muted/30">
                    <td className="p-3 font-mono text-xs">{lead.id}</td>
                    <td className="p-3 text-xs text-muted-foreground">{lead.timestamp}</td>
                    <td className="p-3">
                      <p className="font-medium">{lead.name}</p>
                      <p className="text-xs text-muted-foreground">{lead.email}</p>
                    </td>
                    <td className="p-3 hidden md:table-cell">
                      <p>{lead.product}</p>
                      <p className="text-xs text-muted-foreground">{lead.capacity} kWh</p>
                    </td>
                    <td className="p-3 text-right hidden md:table-cell">{lead.roi} lat</td>
                    <td className="p-3 text-center">
                      <Badge variant={statusMap[lead.status].variant}>
                        {statusMap[lead.status].label}
                      </Badge>
                    </td>
                    <td className="p-3 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedLead(lead)}
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Lead Detail Dialog */}
      <Dialog open={!!selectedLead} onOpenChange={() => setSelectedLead(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-heading">
              Szczegoly leada: {selectedLead?.id}
            </DialogTitle>
          </DialogHeader>
          {selectedLead && (
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-muted-foreground">Imie i nazwisko</p>
                  <p className="font-medium">{selectedLead.name}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">E-mail</p>
                  <p className="font-medium">{selectedLead.email}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Telefon</p>
                  <p className="font-medium">{selectedLead.phone}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Typ instalacji</p>
                  <p className="font-medium">{selectedLead.installationType}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Moc PV</p>
                  <p className="font-medium">{selectedLead.pvPower} kWp</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Produkt</p>
                  <p className="font-medium">{selectedLead.product}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Cena netto</p>
                  <p className="font-medium">{selectedLead.priceNet} zl</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Zwrot inwestycji</p>
                  <p className="font-medium">{selectedLead.roi} lat</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
