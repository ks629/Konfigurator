'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { YearProjection } from '@/lib/types';
import { formatCurrency } from '@/lib/calculations';

interface ROIChartProps {
  projection: YearProjection[];
  roiYear: number | null;
}

export function ROIChart({ projection, roiYear }: ROIChartProps) {
  const data = projection.map((p) => ({
    year: `Rok ${p.year}`,
    yearNum: p.year,
    cumulative: p.cumulative,
    savings: p.savings,
  }));

  return (
    <div className="rounded-xl border bg-card p-6 space-y-4">
      <h3 className="font-heading text-lg text-white">Wykres zwrotu inwestycji</h3>

      <div className="h-[300px] md:h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPositive" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#e8478f" stopOpacity={0.35} />
                <stop offset="50%" stopColor="#B5005D" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#B5005D" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorNegative" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#DC3545" stopOpacity={0.1} />
                <stop offset="95%" stopColor="#DC3545" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(200,170,255,0.1)" />
            <XAxis
              dataKey="yearNum"
              tick={{ fontSize: 12, fill: '#b8a8d0' }}
              tickFormatter={(val) => `${val}`}
              axisLine={{ stroke: 'rgba(200,170,255,0.15)' }}
              tickLine={{ stroke: 'rgba(200,170,255,0.15)' }}
            />
            <YAxis
              tick={{ fontSize: 12, fill: '#b8a8d0' }}
              tickFormatter={(val) => `${Math.round(val / 1000)}k`}
              axisLine={{ stroke: 'rgba(200,170,255,0.15)' }}
              tickLine={{ stroke: 'rgba(200,170,255,0.15)' }}
            />
            <Tooltip
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              formatter={(value: any) => [formatCurrency(Number(value) || 0), 'Skumulowane']}
              labelFormatter={(label) => `Rok ${label}`}
              contentStyle={{
                borderRadius: '8px',
                border: '1px solid rgba(200,170,255,0.2)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
                backgroundColor: '#1a0a35',
                color: '#f0eaf5',
              }}
              labelStyle={{ color: '#b8a8d0' }}
            />
            <ReferenceLine y={0} stroke="rgba(255,255,255,0.3)" strokeDasharray="5 5" strokeWidth={2} />
            {roiYear && (
              <ReferenceLine
                x={roiYear}
                stroke="#e8478f"
                strokeDasharray="5 5"
                strokeWidth={2}
                label={{
                  value: `ROI: ${roiYear} lat`,
                  position: 'top',
                  fill: '#e8478f',
                  fontSize: 12,
                  fontWeight: 700,
                }}
              />
            )}
            <Area
              type="monotone"
              dataKey="cumulative"
              stroke="#e8478f"
              strokeWidth={3}
              fill="url(#colorPositive)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <p className="text-xs text-muted-foreground text-center">
        Projekcja uwzględnia 5% roczny wzrost cen energii, degradację paneli PV (1%/rok) i magazynu (2,5%/rok)
      </p>
    </div>
  );
}
