'use client';

import { useState } from 'react';
import { YearProjection } from '@/lib/types';
import { formatCurrency, formatNumber } from '@/lib/calculations';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ProjectionTableProps {
  projection: YearProjection[];
  horizonYears?: number;
}

export function ProjectionTable({ projection, horizonYears }: ProjectionTableProps) {
  const horizon = horizonYears ?? projection.length;
  const [expanded, setExpanded] = useState(false);
  const keyYears = [1, 2, 3, 5, 7, 10, 15, horizon].filter((y) => y <= horizon);
  const displayData = expanded ? projection : projection.filter((p) =>
    keyYears.includes(p.year)
  );

  return (
    <div className="rounded-xl border bg-card overflow-hidden text-card-foreground">
      <div className="p-4 border-b flex items-center justify-between">
        <h3 className="font-heading text-lg text-white">Tabela projekcji {horizon}-letniej</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setExpanded(!expanded)}
          className="text-xs"
        >
          {expanded ? (
            <>Pokaż skróconą <ChevronUp className="h-3 w-3 ml-1" /></>
          ) : (
            <>Pokaż pełną <ChevronDown className="h-3 w-3 ml-1" /></>
          )}
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-white/5">
              <th className="text-left p-3 font-medium text-white/80">Rok</th>
              <th className="text-right p-3 font-medium text-white/80">Produkcja PV</th>
              <th className="text-right p-3 font-medium text-white/80 hidden md:table-cell">Autokonsumpcja</th>
              <th className="text-right p-3 font-medium text-white/80 hidden md:table-cell">Sprzedaż</th>
              <th className="text-right p-3 font-medium text-white/80">Oszczędność</th>
              <th className="text-right p-3 font-medium text-white/80">Suma</th>
            </tr>
          </thead>
          <tbody>
            {displayData.map((p) => (
              <tr
                key={p.year}
                className={cn(
                  'border-t border-white/5 hover:bg-white/5 transition-colors',
                  p.cumulative >= 0 && 'bg-green-50/50'
                )}
              >
                <td className="p-3 font-medium text-white">{p.year}</td>
                <td className="p-3 text-right text-white/80">{formatNumber(p.production)} kWh</td>
                <td className="p-3 text-right text-white/80 hidden md:table-cell">{formatNumber(p.selfConsumption)} kWh</td>
                <td className="p-3 text-right text-white/80 hidden md:table-cell">{formatNumber(p.sold)} kWh</td>
                <td className="p-3 text-right text-green-400 font-medium">
                  {formatCurrency(p.savings)}
                </td>
                <td className={cn(
                  'p-3 text-right font-heading',
                  p.cumulative >= 0 ? 'text-green-400' : 'text-red-400'
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
