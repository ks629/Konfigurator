import { NextRequest, NextResponse } from 'next/server';
import { saveLead, readLeads, getLeadsFileBuffer } from '@/lib/leads-xlsx';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const leadId = `NEXBE-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    const timestamp = new Date().toISOString();

    const leadRow = {
      timestamp,
      leadId,
      name: body.name || '',
      email: body.email || '',
      phone: body.phone || '',
      postalCode: body.postalCode || '',
      installationType: body.config?.installationType || '',
      pvPowerKwp: body.config?.pvPowerKwp || 0,
      inverterBrand: body.config?.inverterBrand || '',
      inverterModel: body.config?.inverterModel || '',
      installationYear: body.config?.installationYear || 0,
      annualConsumptionKwh: body.config?.annualConsumptionKwh || 0,
      billingSystem: body.config?.billingSystem || '',
      hasHeatPump: body.config?.hasHeatPump || false,
      hasEV: body.config?.hasEV || false,
      backupPreference: body.config?.backupPreference || 'nie',
      productName: body.product?.name || '',
      capacityKwh: body.product?.capacity_kwh || 0,
      priceGross: body.calculation?.investment?.total_gross || 0,
      priceAfterSubsidies: body.calculation?.investment?.net_cost || 0,
      roiYears: body.calculation?.roi_years ?? null,
      annualSavings: body.calculation?.annual_savings || 0,
      totalSavings20y: body.calculation?.total_savings_20y || 0,
      pdfDownloaded: body.pdfDownloaded || false,
      auditBooked: body.auditBooked || false,
      auditDate: body.auditDate || '',
      utmSource: body.utmSource || '',
      utmMedium: body.utmMedium || '',
      utmCampaign: body.utmCampaign || '',
      userAgent: req.headers.get('user-agent') || '',
      status: 'nowy',
    };

    const result = saveLead(leadRow);
    console.log(`Lead ${leadId} zapisany do XLSX: ${result.filePath}`);

    return NextResponse.json({
      success: true,
      leadId,
      message: 'Lead zapisany pomyslnie',
    });
  } catch (error) {
    console.error('Save lead error:', error);
    return NextResponse.json(
      { error: 'Blad zapisu leada' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const format = searchParams.get('format');

    if (format === 'xlsx') {
      const buffer = getLeadsFileBuffer();
      if (!buffer) {
        return NextResponse.json({ error: 'Brak pliku z leadami' }, { status: 404 });
      }
      return new NextResponse(new Uint8Array(buffer), {
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': `attachment; filename="NEXBE_Leads_${new Date().toISOString().split('T')[0]}.xlsx"`,
        },
      });
    }

    const leads = readLeads();
    return NextResponse.json({ success: true, count: leads.length, leads });
  } catch (error) {
    console.error('Read leads error:', error);
    return NextResponse.json({ error: 'Blad odczytu leadow' }, { status: 500 });
  }
}
