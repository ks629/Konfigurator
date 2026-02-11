import { NextRequest, NextResponse } from 'next/server';
import { calculateROI } from '@/lib/calculations';
import { defaultCalcParams } from '@/data/params';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const result = calculateROI(
      {
        pv_power_kwp: body.pv_power_kwp || 6,
        annual_consumption_kwh: body.annual_consumption_kwh || 4000,
        billing_system: body.billing_system || 'net-billing',
        battery_capacity_kwh: body.battery_capacity_kwh || 10,
        battery_price_gross: body.battery_price_gross || 22500,
        installation_type: body.installation_type || 'retrofit',
        needs_inverter_upgrade: body.needs_inverter_upgrade || false,
        inverter_price_gross: body.inverter_price_gross || 0,
        needs_backup: body.needs_backup || false,
      },
      defaultCalcParams
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error('Calculation error:', error);
    return NextResponse.json(
      { error: 'Blad kalkulacji' },
      { status: 500 }
    );
  }
}
