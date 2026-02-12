'use client';

import { CalculationResult } from '@/lib/types';
import { formatCurrency, formatNumber } from '@/lib/calculations';
import { Wallet, TrendingUp, Target, Banknote, Percent, ArrowDown } from 'lucide-react';

interface SavingsSummaryProps {
  result: CalculationResult;
}

export function SavingsSummary({ result }: SavingsSummaryProps) {
  const { investment, annual_savings, roi_years, total_savings, horizon_years } = result;

  return (
    <div className="space-y-6">
      {/* Koszt inwestycji */}
      <div className="rounded-xl border bg-card p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Wallet className="h-5 w-5 text-primary" />
          <h3 className="font-heading text-lg">Koszt inwestycji</h3>
        </div>

        <div className="space-y-2 text-sm">
          {investment.battery > 0 && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Magazyn energii</span>
              <span className="font-medium">{formatCurrency(investment.battery)}</span>
            </div>
          )}
          {investment.inverter > 0 && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Falownik hybrydowy</span>
              <span className="font-medium">{formatCurrency(investment.inverter)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-muted-foreground">Montaż i uruchomienie</span>
            <span className="font-medium">{formatCurrency(investment.installation)}</span>
          </div>
          {investment.backup > 0 && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Instalacja backup</span>
              <span className="font-medium">{formatCurrency(investment.backup)}</span>
            </div>
          )}

          <div className="border-t pt-2 flex justify-between font-heading text-base">
            <span>RAZEM BRUTTO</span>
            <span>{formatCurrency(investment.total_gross)}</span>
          </div>
        </div>

        {/* Dotacje */}
        <div className="bg-muted/50 rounded-lg p-4 space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Banknote className="h-4 w-4 text-primary" />
            Dotacje i ulgi
          </div>
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between text-green-700">
              <span>Dotacja Mój Prąd (PME)</span>
              <span>- {formatCurrency(investment.subsidy_pme)}</span>
            </div>
            <div className="flex justify-between text-green-700">
              <span>Ulga termomodernizacyjna ({investment.thermomodernization_details?.tax_bracket ?? 12}%)</span>
              <span>- {formatCurrency(investment.tax_relief)}</span>
            </div>
            {investment.thermomodernization_details && (
              <div className="mt-2 pt-2 border-t border-green-200 space-y-1 text-xs text-green-700">
                <div className="flex justify-between">
                  <span>Ulga termomodernizacyjna ({investment.thermomodernization_details.tax_bracket}%)</span>
                  <span>{formatCurrency(investment.thermomodernization_details.deduction)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Wykorzystano {formatCurrency(investment.thermomodernization_details.pool_used)} z puli {formatCurrency(investment.thermomodernization_details.pool_total)}</span>
                  <span>Dostępne: {formatCurrency(investment.thermomodernization_details.pool_available)}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Koszt netto */}
        <div className="bg-primary/10 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ArrowDown className="h-5 w-5 text-primary" />
              <span className="font-heading text-lg">Koszt po dotacjach</span>
            </div>
            <span className="font-heading text-2xl text-primary">
              {formatCurrency(investment.net_cost)}
            </span>
          </div>
        </div>
      </div>

      {/* Oszczednosci */}
      <div className="rounded-xl border bg-card p-6 space-y-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h3 className="font-heading text-lg">Twoje oszczędności</h3>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <p className="text-sm text-muted-foreground mb-1">Roczna oszczędność</p>
            <p className="text-2xl font-heading text-green-700">
              {formatCurrency(annual_savings)}
            </p>
          </div>
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <p className="text-sm text-muted-foreground mb-1">Przez {horizon_years} lat</p>
            <p className="text-2xl font-heading text-green-700">
              {formatCurrency(total_savings)}
            </p>
          </div>
        </div>

        {/* ROI */}
        <div className="bg-primary/10 rounded-lg p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            <span className="font-heading text-lg">Zwrot inwestycji</span>
          </div>

          {roi_years ? (
            <>
              <div className="w-full bg-muted rounded-full h-4 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-green-400 rounded-full transition-all duration-1000"
                  style={{ width: `${Math.min((roi_years / horizon_years) * 100, 100)}%` }}
                />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-heading text-primary">{roi_years}</span>
                <span className="text-lg text-muted-foreground">lat</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Po {roi_years} latach zaczynasz zarabiać!
              </p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              Zwrot inwestycji poza horyzontem {horizon_years}-letnim. Skontaktuj się z nami po indywidualną kalkulację.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
