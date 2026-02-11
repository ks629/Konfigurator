'use client';

import { useState } from 'react';
import { YearProjection } from '@/lib/types';
import { formatCurrency, formatNumber } from '@/lib/calculations';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ProjectionTableProps {
  projection: YearProjection[];
}

export function ProjectionTable({ projection }: ProjectionTableProps) {
  const [expanded, setExpanded] = useState(false);
  const displayData = expanded ? projection : projection.filter((p) =>
    [1, 2, 3, 5, 7, 10, 15, 20].includes(p.year)
  );

  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <div className="p-4 border-b flex items-center justify-between">
        <h3 className="font-heading text-lg">Tabela projekcji 20-letniej</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setExpanded(!expanded)}
          className="text-xs"
        >
          {expanded ? (
            <>Pokaz skrocona <ChevronUp className="h-3 w-3 ml-1" /></>
          ) : (
            <>Pokaz pelna <ChevronDown className="h-3 w-3 ml-1" /></>
          )}
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/50">
              <th className="text-left p-3 font-medium">Rok</th>
              <th className="text-right p-3 font-medium">Produkcja PV</th>
              <th className="text-right p-3 font-medium hidden md:table-cell">Autokonsumpcja</th>
              <th className="text-right p-3 font-medium hidden md:table-cell">Sprzedaz</th>
              <th className="text-right p-3 font-medium">Oszczednosc</th>
              <th className="text-right p-3 font-medium">Suma</th>
            </tr>
          </thead>
          <tbody>
            {displayData.map((p) => (
              <tr
                key={p.year}
                className={cn(
                  'border-t hover:bg-muted/30 transition-colors',
                  p.cumulative >= 0 && 'bg-green-50/50'
                )}
              >
                <td className="p-3 font-medium">{p.year}</td>
                <td className="p-3 text-right">{formatNumber(p.production)} kWh</td>
                <td className="p-3 text-right hidden md:table-cell">{formatNumber(p.selfConsumption)} kWh</td>
                <td className="p-3 text-right hidden md:table-cell">{formatNumber(p.sold)} kWh</td>
                <td className="p-3 text-right text-green-700 font-medium">
                  {formatCurrency(p.savings)}
                </td>
                <td className={cn(
                  'p-3 text-right font-heading',
                  p.cumulative >= 0 ? 'text-green-700' : 'text-red-600'
                )}>
                  {formatCurrency(p.cumulative)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
