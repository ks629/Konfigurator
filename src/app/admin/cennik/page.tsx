'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { productsAC, productsDC } from '@/data/products';
import { inverters } from '@/data/products';
import { Product, Inverter } from '@/lib/types';
import { formatCurrency } from '@/lib/calculations';
import {
  Battery,
  LayoutDashboard,
  Package,
  Users,
  Settings,
  Pencil,
  Save,
  X,
} from 'lucide-react';

export default function CennikPage() {
  const [acProducts, setAcProducts] = useState<Product[]>(productsAC);
  const [dcProducts, setDcProducts] = useState<Product[]>(productsDC);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState('');

  const menuItems = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Cennik produktow', href: '/admin/cennik', icon: Package, active: true },
    { label: 'Lista leadow', href: '/admin/leady', icon: Users },
    { label: 'Ustawienia', href: '/admin/ustawienia', icon: Settings },
  ];

  const handleEdit = (id: string, currentPrice: number) => {
    setEditingId(id);
    setEditPrice(currentPrice.toString());
  };

  const handleSave = (id: string, type: 'ac' | 'dc') => {
    const newPrice = parseInt(editPrice);
    if (isNaN(newPrice)) return;

    if (type === 'ac') {
      setAcProducts(
        acProducts.map((p) =>
          p.id === id ? { ...p, price_gross: newPrice } : p
        )
      );
    } else {
      setDcProducts(
        dcProducts.map((p) =>
          p.id === id ? { ...p, price_gross: newPrice } : p
        )
      );
    }
    setEditingId(null);
  };

  const renderProductTable = (products: Product[], type: 'ac' | 'dc') => (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-muted/50">
            <th className="text-left p-3 font-medium">Produkt</th>
            <th className="text-right p-3 font-medium">Pojemnosc</th>
            <th className="text-right p-3 font-medium">Moc ciagla</th>
            <th className="text-right p-3 font-medium">Gwarancja</th>
            <th className="text-right p-3 font-medium">Cena brutto</th>
            <th className="text-right p-3 font-medium">Akcje</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="border-t hover:bg-muted/30">
              <td className="p-3">
                <div>
                  <p className="font-medium">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.brand}</p>
                </div>
              </td>
              <td className="p-3 text-right">{p.capacity_kwh} kWh</td>
              <td className="p-3 text-right">{p.power_continuous_kw} kW</td>
              <td className="p-3 text-right">{p.warranty_years} lat</td>
              <td className="p-3 text-right">
                {editingId === p.id ? (
                  <Input
                    type="number"
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                    className="w-28 h-8 text-right ml-auto"
                  />
                ) : (
                  <span className="font-heading">{formatCurrency(p.price_gross)}</span>
                )}
              </td>
              <td className="p-3 text-right">
                {editingId === p.id ? (
                  <div className="flex gap-1 justify-end">
                    <Button size="sm" variant="ghost" onClick={() => handleSave(p.id, type)}>
                      <Save className="h-3.5 w-3.5" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ) : (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEdit(p.id, p.price_gross)}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
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

        <div className="space-y-8">
          {/* AC Products */}
          <div className="bg-card rounded-xl border overflow-hidden">
            <div className="p-4 border-b">
              <h2 className="font-heading text-lg">Magazyny AC (Retrofit)</h2>
              <p className="text-sm text-muted-foreground">Dyness - kompatybilne z kazdym falownikiem stringowym</p>
            </div>
            {renderProductTable(acProducts, 'ac')}
          </div>

          {/* DC Products */}
          <div className="bg-card rounded-xl border overflow-hidden">
            <div className="p-4 border-b">
              <h2 className="font-heading text-lg">Magazyny DC (Hybrid)</h2>
              <p className="text-sm text-muted-foreground">Huawei LUNA - wymagaja falownika hybrydowego</p>
            </div>
            {renderProductTable(dcProducts, 'dc')}
          </div>

          {/* Inverters */}
          <div className="bg-card rounded-xl border overflow-hidden">
            <div className="p-4 border-b">
              <h2 className="font-heading text-lg">Falowniki hybrydowe</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="text-left p-3 font-medium">Model</th>
                    <th className="text-right p-3 font-medium">Moc</th>
                    <th className="text-right p-3 font-medium">Cena brutto</th>
                  </tr>
                </thead>
                <tbody>
                  {inverters.map((inv) => (
                    <tr key={inv.id} className="border-t hover:bg-muted/30">
                      <td className="p-3 font-medium">{inv.name}</td>
                      <td className="p-3 text-right">{inv.power_kw} kW</td>
                      <td className="p-3 text-right font-heading">{formatCurrency(inv.price_gross)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
