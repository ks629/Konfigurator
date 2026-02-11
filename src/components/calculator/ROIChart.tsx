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
      <h3 className="font-heading text-lg">Wykres zwrotu inwestycji</h3>

      <div className="h-[300px] md:h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPositive" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00A651" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#00A651" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorNegative" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#DC3545" stopOpacity={0.1} />
                <stop offset="95%" stopColor="#DC3545" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="yearNum"
              tick={{ fontSize: 12, fill: '#666' }}
              tickFormatter={(val) => `${val}`}
            />
            <YAxis
              tick={{ fontSize: 12, fill: '#666' }}
              tickFormatter={(val) => `${Math.round(val / 1000)}k`}
            />
            <Tooltip
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              formatter={(value: any) => [formatCurrency(Number(value) || 0), 'Skumulowane']}
              labelFormatter={(label) => `Rok ${label}`}
              contentStyle={{
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              }}
            />
            <ReferenceLine y={0} stroke="#999" strokeDasharray="5 5" strokeWidth={2} />
            {roiYear && (
              <ReferenceLine
                x={roiYear}
                stroke="#00A651"
                strokeDasharray="5 5"
                strokeWidth={2}
                label={{
                  value: `ROI: ${roiYear} lat`,
                  position: 'top',
                  fill: '#00A651',
                  fontSize: 12,
                  fontWeight: 700,
                }}
              />
            )}
            <Area
              type="monotone"
              dataKey="cumulative"
              stroke="#00A651"
              strokeWidth={3}
              fill="url(#colorPositive)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <p className="text-xs text-muted-foreground text-center">
        Projekcja uwzglednia 4% roczny wzrost cen energii, degradacje paneli PV (1%/rok) i magazynu (2%/rok)
      </p>
    </div>
  );
}
