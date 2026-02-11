'use client';

import { useState } from 'react';
import { CalculationResult } from '@/lib/types';
import { formatCurrency } from '@/lib/calculations';
import { defaultCalcParams } from '@/data/params';
import { cn } from '@/lib/utils';
import { Landmark, Lightbulb } from 'lucide-react';

interface FinancingSimulatorProps {
  result: CalculationResult;
}

export function FinancingSimulator({ result }: FinancingSimulatorProps) {
  const periods = defaultCalcParams.financing_periods;
  const [selectedPeriod, setSelectedPeriod] = useState(36);

  const monthlyPayment = result.monthly_installment[selectedPeriod] || 0;
  const monthlySavings = Math.round(result.annual_savings / 12);

  return (
    <div className="rounded-xl border bg-card p-6 space-y-4">
      <div className="flex items-center gap-2">
        <Landmark className="h-5 w-5 text-primary" />
        <h3 className="font-heading text-lg">Finansowanie na raty</h3>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Kwota do sfinansowania:</span>
          <span className="font-heading">{formatCurrency(result.investment.net_cost)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">RRSO:</span>
          <span className="font-heading">{(defaultCalcParams.financing_rrso * 100).toFixed(1)}%</span>
        </div>
      </div>

      <div className="space-y-2">
        <span className="text-sm font-medium">Wybierz okres:</span>
        <div className="flex flex-wrap gap-2">
          {periods.map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium border-2 transition-all',
                selectedPeriod === period
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border hover:border-primary/30'
              )}
            >
              {period} mies.
            </button>
          ))}
        </div>
      </div>

      <div className="bg-primary/10 rounded-lg p-4 text-center space-y-1">
        <p className="text-sm text-muted-foreground">Rata miesieczna</p>
        <p className="text-3xl font-heading text-primary">
          {formatCurrency(monthlyPayment)}
        </p>
        <p className="text-xs text-muted-foreground">
          dla {selectedPeriod} miesiecy
        </p>
      </div>

      <div className="flex items-start gap-2 p-3 rounded-lg bg-green-50 border border-green-200">
        <Lightbulb className="h-4 w-4 text-green-700 mt-0.5 shrink-0" />
        <div className="text-sm">
          <p className="text-green-800">
            Twoja oszczednosc: <strong>~{formatCurrency(monthlySavings)}/mies.</strong>
          </p>
          {monthlySavings >= monthlyPayment * 0.5 && (
            <p className="text-green-700 mt-1">
              Rata praktycznie &ldquo;splaca sie sama&rdquo;!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
