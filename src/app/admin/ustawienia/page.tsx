'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { defaultCalcParams } from '@/data/params';
import { NexbeIcon } from '@nexbe/icons';
import {
  LayoutDashboard,
  Users,
  Settings,
  Save,
} from 'lucide-react';
import { toast } from 'sonner';

export default function UstawieniaPage() {
  const [params, setParams] = useState(defaultCalcParams);

  const menuItems = [
    { label: 'Dashboard', href: '/admin', renderIcon: (cls: string) => <LayoutDashboard className={cls} /> },
    { label: 'Cennik produktów', href: '/admin/cennik', renderIcon: (cls: string) => <NexbeIcon name="system-hybrydowy" size={16} variant="inherit" className={cls} /> },
    { label: 'Lista leadów', href: '/admin/leady', renderIcon: (cls: string) => <Users className={cls} /> },
    { label: 'Ustawienia', href: '/admin/ustawienia', renderIcon: (cls: string) => <Settings className={cls} />, active: true },
  ];

  const handleSave = () => {
    // In production, save to API/database
    toast.success('Parametry zapisane pomyślnie');
  };

  const updateParam = (key: keyof typeof params, value: string) => {
    setParams((prev) => ({
      ...prev,
      [key]: parseFloat(value) || 0,
    }));
  };

  const paramGroups = [
    {
      title: 'Ceny energii',
      fields: [
        { key: 'energy_buy_price' as const, label: 'Cena zakupu energii (zł/kWh)', step: '0.01' },
        { key: 'energy_sell_price_rce' as const, label: 'Cena sprzedaży RCE (zł/kWh)', step: '0.001' },
        { key: 'energy_price_growth' as const, label: 'Roczny wzrost cen (%)', step: '0.01' },
      ],
    },
    {
      title: 'Parametry PV',
      fields: [
        { key: 'pv_production_per_kwp' as const, label: 'Produkcja PV (kWh/kWp/rok)', step: '10' },
        { key: 'pv_degradation_yearly' as const, label: 'Degradacja PV (%/rok)', step: '0.001' },
      ],
    },
    {
      title: 'Autokonsumpcja',
      fields: [
        { key: 'self_consumption_without_battery' as const, label: 'Bez magazynu (%)', step: '0.01' },
        { key: 'self_consumption_with_battery_new' as const, label: 'Z magazynem - nowa inst. (%)', step: '0.01' },
        { key: 'self_consumption_with_battery_retrofit' as const, label: 'Z magazynem - retrofit (%)', step: '0.01' },
      ],
    },
    {
      title: 'Dotacje',
      fields: [
        { key: 'subsidy_pme_netbilling_percent' as const, label: 'Dotacja PME - procent (%)', step: '0.01' },
        { key: 'subsidy_pme_netbilling_per_kwh' as const, label: 'Dotacja PME - za kWh (zł)', step: '100' },
        { key: 'subsidy_pme_netbilling_max' as const, label: 'Dotacja PME - max (zł)', step: '1000' },
        { key: 'subsidy_pme_netmetering_max' as const, label: 'Dotacja PME net-metering max (zł)', step: '1000' },
        { key: 'tax_relief_thermomodernization' as const, label: 'Ulga termomodernizacyjna (%)', step: '0.01' },
      ],
    },
    {
      title: 'Koszty montażu',
      fields: [
        { key: 'installation_cost_base' as const, label: 'Bazowy koszt montażu (zł)', step: '100' },
        { key: 'installation_cost_per_kwh' as const, label: 'Koszt montażu za kWh (zł)', step: '50' },
        { key: 'backup_installation_cost' as const, label: 'Koszt instalacji backup (zł)', step: '100' },
      ],
    },
    {
      title: 'Finansowanie',
      fields: [
        { key: 'financing_rrso' as const, label: 'RRSO (%)', step: '0.001' },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-muted/20">
      <header className="bg-secondary text-secondary-foreground border-b">
        <div className="container mx-auto px-4 flex items-center justify-between h-14">
          <div className="flex items-center gap-2">
            <NexbeIcon name="magazyn-energii" size={24} variant="inherit" className="text-primary" />
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
                {item.renderIcon('h-4 w-4')}
                {item.label}
              </Button>
            </Link>
          ))}
        </div>

        <div className="space-y-6 max-w-3xl">
          {paramGroups.map((group) => (
            <div key={group.title} className="bg-card rounded-xl border overflow-hidden">
              <div className="p-4 border-b">
                <h2 className="font-heading text-base">{group.title}</h2>
              </div>
              <div className="p-4 space-y-4">
                {group.fields.map((field) => (
                  <div key={field.key} className="flex items-center justify-between gap-4">
                    <Label className="text-sm flex-1">{field.label}</Label>
                    <Input
                      type="number"
                      value={params[field.key]}
                      onChange={(e) => updateParam(field.key, e.target.value)}
                      step={field.step}
                      className="w-32 h-9 text-right"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}

          <Button onClick={handleSave} size="lg" className="gap-2">
            <Save className="h-4 w-4" />
            Zapisz parametry
          </Button>
        </div>
      </div>
    </div>
  );
}
