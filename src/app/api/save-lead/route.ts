import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { saveLead, readLeads, getLeadsFileBuffer } from '@/lib/leads-xlsx';

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'Nexbe <onboarding@resend.dev>';
const NEXBE_LEAD_EMAIL = process.env.NEXBE_LEAD_EMAIL || 'kontakt@nexbe.pl';

function buildLeadNotificationEmail(lead: {
  leadId: string;
  name: string;
  email: string;
  phone: string;
  source: string;
  capacity: string;
  hasPV: string;
  timestamp: string;
}): string {
  const sourceLabel = lead.source === 'landing-contact-form'
    ? 'Formularz kontaktowy (landing)'
    : lead.source === 'konfigurator'
      ? 'Konfigurator AI'
      : lead.source || 'Nieznane';

  const pvLabel = lead.hasPV === 'tak' ? 'Tak, ma PV (retrofit)'
    : lead.hasPV === 'planuje' ? 'Planuje instalację PV'
    : lead.hasPV === 'nie' ? 'Nie ma PV'
    : 'Nie określono';

  const date = new Date(lead.timestamp);
  const dateStr = date.toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  return `
<!DOCTYPE html>
<html lang="pl">
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:20px;background:#f4f0f8;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
  <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:12px;padding:24px;box-shadow:0 2px 10px rgba(0,0,0,0.06);">
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:20px;">
      <div style="width:12px;height:12px;border-radius:50%;background:#22c55e;"></div>
      <h2 style="color:#B5005D;margin:0;font-size:20px;">Nowy lead — ${sourceLabel}</h2>
    </div>

    <table style="width:100%;border-collapse:collapse;font-size:14px;">
      <tr><td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;color:#888;width:140px;">Nr</td><td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;font-weight:600;font-family:monospace;font-size:12px;">${lead.leadId}</td></tr>
      <tr><td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;color:#888;">Data</td><td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;">${dateStr}</td></tr>
      <tr style="background:#fdf2f8;"><td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;color:#888;font-weight:600;">Imię</td><td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;font-weight:700;font-size:16px;">${lead.name || '—'}</td></tr>
      <tr style="background:#fdf2f8;"><td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;color:#888;font-weight:600;">Telefon</td><td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;font-weight:700;font-size:16px;"><a href="tel:${lead.phone}" style="color:#B5005D;text-decoration:none;">${lead.phone || '—'}</a></td></tr>
      <tr style="background:#fdf2f8;"><td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;color:#888;font-weight:600;">Email</td><td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;"><a href="mailto:${lead.email}" style="color:#B5005D;text-decoration:none;">${lead.email || '—'}</a></td></tr>
      <tr><td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;color:#888;">Pojemność</td><td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;">${lead.capacity || 'Nie wybrano'}</td></tr>
      <tr><td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;color:#888;">Fotowoltaika</td><td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;">${pvLabel}</td></tr>
      <tr><td style="padding:10px 12px;color:#888;">Źródło</td><td style="padding:10px 12px;">${sourceLabel}</td></tr>
    </table>

    <div style="margin-top:20px;padding:16px;background:#f8f4fc;border-radius:8px;text-align:center;">
      <p style="color:#888;font-size:13px;margin:0 0 8px;">Oddzwoń w ciągu 24h</p>
      <a href="tel:${lead.phone}" style="display:inline-block;background:#B5005D;color:#fff;text-decoration:none;padding:10px 24px;border-radius:8px;font-weight:600;font-size:15px;">${lead.phone || 'Brak numeru'}</a>
    </div>

    <p style="color:#aaa;font-size:11px;margin:20px 0 0;text-align:center;">Wygenerowano automatycznie — konfigurator.nexbe.pl</p>
  </div>
</body>
</html>`;
}

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
      source: body.source || '',
      userAgent: req.headers.get('user-agent') || '',
      status: 'nowy',
    };

    const result = saveLead(leadRow);
    console.log(`Lead ${leadId} zapisany do XLSX: ${result.filePath}`);

    // Wyślij powiadomienie email do zespołu NEXBE
    let emailSent = false;
    if (resend) {
      try {
        const sourceLabel = body.source === 'landing-contact-form'
          ? 'formularz kontaktowy'
          : body.source === 'konfigurator'
            ? 'konfigurator'
            : 'strona www';

        await resend.emails.send({
          from: FROM_EMAIL,
          to: NEXBE_LEAD_EMAIL,
          subject: `Nowy lead (${sourceLabel}): ${body.name || body.email || body.phone || 'Anonimowy'}`,
          html: buildLeadNotificationEmail({
            leadId,
            name: body.name || '',
            email: body.email || '',
            phone: body.phone || '',
            source: body.source || '',
            capacity: body.formData?.capacity || body.product?.name || '',
            hasPV: body.formData?.hasPV || body.config?.installationType || '',
            timestamp,
          }),
        });
        emailSent = true;
        console.log(`Email notification sent for lead ${leadId}`);
      } catch (emailError) {
        console.error('Lead email notification failed:', emailError);
        // Nie blokujemy zapisu leada jeśli email się nie wyśle
      }
    } else {
      console.warn('RESEND_API_KEY not configured — lead email notification not sent');
    }

    // === WEBHOOK → CRM NEXBE (fire-and-forget, nie blokuje zapisu leada) ===
    const crmPayload = {
      name: body.name || '',
      email: body.email || '',
      phone: body.phone || '',
      postalCode: body.postalCode || '',
      source: 'KONFIGURATOR',
      installationType: body.installationType || body.type || '',
      capacity: body.capacity || '',
      hasPV: body.hasPV || '',
      pvPowerKwp: body.pvPowerKwp || null,
      hasHeatPump: body.hasHeatPump || false,
      hasEV: body.hasEV || false,
      selectedProductName: body.selectedProductName || body.productName || '',
      notes: `Konfigurator AI | Typ: ${body.installationType || body.type || 'N/A'} | Pojemność: ${body.capacity || 'N/A'}`,
    };
    const crmUrl = process.env.CRM_WEBHOOK_URL || 'https://nexbe-crm.vercel.app/api/leads/webhook';
    const crmSecret = process.env.CRM_WEBHOOK_SECRET || '';
    const abortCtrl = new AbortController();
    const crmTimeout = setTimeout(() => abortCtrl.abort(), 5000);
    fetch(crmUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Webhook-Secret': crmSecret },
      body: JSON.stringify(crmPayload),
      signal: abortCtrl.signal,
    }).catch(() => {}).finally(() => clearTimeout(crmTimeout));

    return NextResponse.json({
      success: true,
      leadId,
      emailSent,
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
