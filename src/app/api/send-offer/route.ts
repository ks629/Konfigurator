import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { generateOfferPdfBuffer, type PdfOfferData } from '@/lib/pdf-generator';

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

// Email nadawczy — domyślnie onboarding Resend, docelowo domena NEXBE
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'Nexbe <onboarding@resend.dev>';
const NEXBE_LEAD_EMAIL = process.env.NEXBE_LEAD_EMAIL || 'kontakt@nexbe.pl';

// CRM Webhook
const CRM_WEBHOOK_URL = process.env.CRM_WEBHOOK_URL;
const CRM_WEBHOOK_SECRET = process.env.CRM_WEBHOOK_SECRET;

function formatPLN(amount: number): string {
  return new Intl.NumberFormat('pl-PL', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount) + ' zł';
}

interface ClientEmailData {
  name: string;
  product: { name: string; brand: string; capacity_kwh: number };
  leadId: string;
  netCost: number;
  totalGross: number;
  subsidyPme: number;
  taxRelief: number;
  annualSavings: number;
  roiYears: number | null;
  lowestInstallment: number;
  installmentPeriod: number;
}

function buildClientEmailHtml(d: ClientEmailData): string {
  const totalSubsidy = d.subsidyPme + d.taxRelief;
  const subsidyLines: string[] = [];
  if (d.subsidyPme > 0) subsidyLines.push(`Mój Prąd 7.0: -${formatPLN(d.subsidyPme)}`);
  if (d.taxRelief > 0) subsidyLines.push(`Ulga termomodernizacyjna: -${formatPLN(d.taxRelief)}`);

  const roiText = d.roiYears ? `${d.roiYears} lat` : 'Ponad 15 lat';

  return `
<!DOCTYPE html>
<html lang="pl">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f4f0f8;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
  <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">
    <!-- Header -->
    <div style="background:linear-gradient(135deg,#230045 0%,#350066 50%,#4a0080 100%);padding:32px 24px;text-align:center;">
      <h1 style="color:#ffffff;font-size:28px;margin:0 0 8px;font-weight:700;">Nexbe</h1>
      <p style="color:rgba(255,255,255,0.7);font-size:14px;margin:0;">Inteligentne magazyny energii</p>
    </div>

    <!-- Content -->
    <div style="padding:32px 24px;">
      <h2 style="color:#230045;font-size:22px;margin:0 0 16px;">Cześć${d.name ? ', ' + d.name : ''}!</h2>
      <p style="color:#555;font-size:15px;line-height:1.6;margin:0 0 20px;">
        Dziękujemy za zainteresowanie magazynem energii. W załączniku znajdziesz szczegółową ofertę z kalkulacją oszczędności, dofinansowaniem i analizą zwrotu inwestycji.
      </p>

      <!-- Product highlight -->
      <div style="background:#f8f4fc;border:1px solid #e5daf0;border-radius:12px;padding:20px;margin:0 0 20px;">
        <p style="color:#666;font-size:13px;margin:0 0 8px;">Twój wybrany magazyn energii:</p>
        <h3 style="color:#230045;font-size:18px;margin:0 0 4px;">${d.product.brand} ${d.product.name}</h3>
        <p style="color:#888;font-size:14px;margin:0 0 16px;">Pojemność: ${d.product.capacity_kwh} kWh</p>

        <!-- Pricing breakdown -->
        <table style="width:100%;border-collapse:collapse;font-size:14px;">
          <tr>
            <td style="padding:6px 0;color:#555;">Cena brutto zestawu z montażem</td>
            <td style="padding:6px 0;text-align:right;color:#230045;font-weight:600;">${formatPLN(d.totalGross)}</td>
          </tr>
          ${totalSubsidy > 0 ? `
          <tr>
            <td style="padding:6px 0;color:#228B22;">Dofinansowanie</td>
            <td style="padding:6px 0;text-align:right;color:#228B22;font-weight:600;">-${formatPLN(totalSubsidy)}</td>
          </tr>
          ${subsidyLines.map(l => `<tr><td style="padding:2px 0 2px 16px;color:#888;font-size:12px;">${l}</td><td></td></tr>`).join('')}
          ` : ''}
          <tr>
            <td colspan="2" style="padding:0;"><div style="border-top:2px solid #B5005D;margin:8px 0;"></div></td>
          </tr>
          <tr>
            <td style="padding:6px 0;color:#B5005D;font-weight:700;font-size:16px;">Twoja cena po dotacjach</td>
            <td style="padding:6px 0;text-align:right;color:#B5005D;font-weight:700;font-size:20px;">${formatPLN(d.netCost)}</td>
          </tr>
        </table>

        ${d.lowestInstallment > 0 ? `
        <p style="color:#888;font-size:13px;margin:12px 0 0;">
          lub <strong style="color:#230045;">${d.lowestInstallment} zł/mies.</strong> (raty ${Math.round(d.installmentPeriod / 12)} lat · Inbank)
        </p>
        ` : ''}
      </div>

      <!-- Key metrics -->
      <table style="width:100%;border-collapse:collapse;margin:0 0 24px;">
        <tr>
          <td style="width:50%;padding:12px;background:#f0fdf4;border-radius:8px 0 0 8px;text-align:center;">
            <p style="color:#888;font-size:12px;margin:0 0 4px;">Roczna oszczędność</p>
            <p style="color:#166534;font-size:20px;font-weight:700;margin:0;">${formatPLN(d.annualSavings)}</p>
          </td>
          <td style="width:50%;padding:12px;background:#faf5ff;border-radius:0 8px 8px 0;text-align:center;">
            <p style="color:#888;font-size:12px;margin:0 0 4px;">Zwrot inwestycji</p>
            <p style="color:#350066;font-size:20px;font-weight:700;margin:0;">${roiText}</p>
          </td>
        </tr>
      </table>

      <!-- Next steps -->
      <div style="background:#f8f4fc;border-left:4px solid #B5005D;border-radius:0 8px 8px 0;padding:16px 20px;margin:0 0 24px;">
        <h3 style="color:#230045;font-size:16px;margin:0 0 12px;">Kolejne kroki</h3>
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="padding:6px 12px 6px 0;vertical-align:top;width:24px;">
              <div style="background:#B5005D;color:#fff;width:22px;height:22px;border-radius:50%;text-align:center;line-height:22px;font-size:12px;font-weight:700;">1</div>
            </td>
            <td style="padding:6px 0;">
              <strong style="color:#230045;font-size:14px;">Bezpłatny audyt techniczny</strong>
              <p style="color:#888;font-size:12px;margin:2px 0 0;">Technik przyjedzie do Ciebie i oceni warunki instalacji — bez zobowiązań</p>
            </td>
          </tr>
          <tr>
            <td style="padding:6px 12px 6px 0;vertical-align:top;">
              <div style="background:#B5005D;color:#fff;width:22px;height:22px;border-radius:50%;text-align:center;line-height:22px;font-size:12px;font-weight:700;">2</div>
            </td>
            <td style="padding:6px 0;">
              <strong style="color:#230045;font-size:14px;">Finalna wycena i umowa</strong>
              <p style="color:#888;font-size:12px;margin:2px 0 0;">Potwierdzamy zakres, podpisujemy umowę, decyzja o ratach online w 15 min</p>
            </td>
          </tr>
          <tr>
            <td style="padding:6px 12px 6px 0;vertical-align:top;">
              <div style="background:#B5005D;color:#fff;width:22px;height:22px;border-radius:50%;text-align:center;line-height:22px;font-size:12px;font-weight:700;">3</div>
            </td>
            <td style="padding:6px 0;">
              <strong style="color:#230045;font-size:14px;">Montaż i uruchomienie</strong>
              <p style="color:#888;font-size:12px;margin:2px 0 0;">Profesjonalny montaż w 1–2 dni + szkolenie + zgłoszenie do OSD + wniosek o dotację</p>
            </td>
          </tr>
        </table>
      </div>

      <!-- Contact / Advisor -->
      <div style="background:#230045;border-radius:12px;padding:20px;text-align:center;margin:0 0 20px;">
        <p style="color:rgba(255,255,255,0.7);font-size:13px;margin:0 0 8px;">Masz pytania? Skontaktuj się z nami:</p>
        <p style="margin:0 0 4px;">
          <a href="tel:+48732080101" style="color:#ffffff;text-decoration:none;font-size:18px;font-weight:700;">732 080 101</a>
        </p>
        <p style="margin:0;">
          <a href="mailto:kontakt@nexbe.pl" style="color:rgba(255,255,255,0.7);text-decoration:none;font-size:14px;">kontakt@nexbe.pl</a>
        </p>
        <p style="color:rgba(255,255,255,0.5);font-size:12px;margin:8px 0 0;">Nasz doradca skontaktuje się z Tobą w ciągu 24h</p>
      </div>

      <!-- CTA -->
      <div style="text-align:center;margin:24px 0;">
        <a href="https://konfigurator.nexbe.pl" style="background:#B5005D;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:10px;font-weight:600;font-size:15px;display:inline-block;">
          Umów bezpłatny audyt
        </a>
      </div>

      <p style="color:#999;font-size:12px;margin:24px 0 0;text-align:center;">
        Nr oferty: ${d.leadId}
      </p>
    </div>

    <!-- Footer -->
    <div style="background:#f4f0f8;padding:20px 24px;text-align:center;border-top:1px solid #e5daf0;">
      <p style="color:#888;font-size:12px;margin:0 0 4px;">Nexbe Sp. z o.o. | kontakt@nexbe.pl | 732 080 101</p>
      <p style="color:#aaa;font-size:11px;margin:0;">Ta wiadomość została wygenerowana automatycznie.</p>
    </div>
  </div>
</body>
</html>`;
}

function buildLeadNotificationHtml(
  name: string,
  email: string,
  phone: string,
  postalCode: string,
  product: { name: string; brand: string; capacity_kwh: number },
  leadId: string,
  totalGross: number,
  netCost: number
): string {
  return `
<!DOCTYPE html>
<html lang="pl">
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:20px;background:#f4f0f8;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
  <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:12px;padding:24px;box-shadow:0 2px 10px rgba(0,0,0,0.06);">
    <h2 style="color:#B5005D;margin:0 0 20px;">🔔 Nowy lead z konfiguratora</h2>

    <table style="width:100%;border-collapse:collapse;font-size:14px;">
      <tr><td style="padding:8px 12px;border-bottom:1px solid #eee;color:#888;width:140px;">Nr oferty</td><td style="padding:8px 12px;border-bottom:1px solid #eee;font-weight:600;">${leadId}</td></tr>
      <tr><td style="padding:8px 12px;border-bottom:1px solid #eee;color:#888;">Imię i nazwisko</td><td style="padding:8px 12px;border-bottom:1px solid #eee;font-weight:600;">${name || '-'}</td></tr>
      <tr><td style="padding:8px 12px;border-bottom:1px solid #eee;color:#888;">Email</td><td style="padding:8px 12px;border-bottom:1px solid #eee;"><a href="mailto:${email}">${email}</a></td></tr>
      <tr><td style="padding:8px 12px;border-bottom:1px solid #eee;color:#888;">Telefon</td><td style="padding:8px 12px;border-bottom:1px solid #eee;"><a href="tel:${phone}">${phone || '-'}</a></td></tr>
      <tr><td style="padding:8px 12px;border-bottom:1px solid #eee;color:#888;">Kod pocztowy</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">${postalCode || '-'}</td></tr>
      <tr><td style="padding:8px 12px;border-bottom:1px solid #eee;color:#888;">Produkt</td><td style="padding:8px 12px;border-bottom:1px solid #eee;font-weight:600;">${product.brand} ${product.name} (${product.capacity_kwh} kWh)</td></tr>
      <tr><td style="padding:8px 12px;border-bottom:1px solid #eee;color:#888;">Cena brutto</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">${formatPLN(totalGross)}</td></tr>
      <tr><td style="padding:8px 12px;color:#888;">Po dotacjach</td><td style="padding:8px 12px;color:#B5005D;font-weight:700;font-size:16px;">${formatPLN(netCost)}</td></tr>
    </table>

    <p style="color:#888;font-size:12px;margin:20px 0 0;">PDF oferty w załączniku.</p>
  </div>
</body>
</html>`;
}

// =============================================================
// WEBHOOK DO CRM NEXBE — fire-and-forget, 5s timeout
// =============================================================
async function sendToCrmWebhook(data: {
  leadId: string;
  name: string;
  email: string;
  phone: string;
  postalCode: string;
  product: { name: string; brand: string; capacity_kwh: number };
  inverter?: { name: string; brand: string } | null;
  calculation?: Record<string, unknown> | null;
  config?: Record<string, unknown> | null;
  source: string;
}) {
  if (!CRM_WEBHOOK_URL) {
    console.warn('[CRM Webhook] CRM_WEBHOOK_URL not configured — skipping');
    return;
  }

  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (CRM_WEBHOOK_SECRET) {
      headers['x-webhook-secret'] = CRM_WEBHOOK_SECRET;
    }

    const payload = {
      source: data.source,
      leadId: data.leadId,
      name: data.name,
      email: data.email,
      phone: data.phone || '',
      postalCode: data.postalCode || '',
      product: data.product,
      inverter: data.inverter || null,
      calculation: data.calculation || null,
      config: data.config || null,
      timestamp: new Date().toISOString(),
    };

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000); // 5s timeout

    const response = await fetch(CRM_WEBHOOK_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (response.ok) {
      console.log(`[CRM Webhook] ✅ Lead sent to CRM: ${data.leadId} → ${response.status}`);
    } else {
      const text = await response.text().catch(() => '');
      console.error(`[CRM Webhook] ❌ CRM returned ${response.status}: ${text}`);
    }
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.error(`[CRM Webhook] ⏱️ Timeout (5s) sending lead ${data.leadId}`);
    } else {
      console.error(`[CRM Webhook] ❌ Failed to send lead ${data.leadId}:`, error);
    }
    // Fire-and-forget — don't throw, don't block the response
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { name, email, phone, postalCode, config, product, inverter, calculation } = body;

    // Validate required fields
    if (!email || !product) {
      return NextResponse.json(
        { error: 'Brakuje wymaganych danych (email, produkt)' },
        { status: 400 }
      );
    }

    // Generate lead ID
    const leadId = `NEXBE-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    // Generuj PDF
    const pdfData: PdfOfferData = {
      clientName: name || '',
      clientEmail: email || '',
      clientPhone: phone || '',
      clientPostalCode: postalCode || '',
      product,
      inverter,
      calculation,
      config,
      offerNumber: leadId,
    };

    let pdfBuffer: ArrayBuffer | null = null;
    try {
      pdfBuffer = await generateOfferPdfBuffer(pdfData);
    } catch (pdfError) {
      console.error('PDF generation failed:', pdfError);
      // Continue without PDF — don't block the offer sending
    }

    const netCost = calculation?.investment?.net_cost || 0;
    const totalGross = calculation?.investment?.total_gross || product.price_gross;

    // Send emails via Resend (if API key configured)
    let emailSent = false;
    if (resend) {
      const attachments = pdfBuffer
        ? [{ filename: `oferta-${leadId}.pdf`, content: Buffer.from(pdfBuffer) }]
        : [];

      try {
        // 1. Send offer to client
        await resend.emails.send({
          from: FROM_EMAIL,
          to: email,
          subject: `Twoja oferta magazynu energii — ${product.brand} ${product.name}`,
          html: buildClientEmailHtml({
            name,
            product,
            leadId,
            netCost,
            totalGross,
            subsidyPme: calculation?.investment?.subsidy_pme || 0,
            taxRelief: calculation?.investment?.tax_relief || 0,
            annualSavings: calculation?.annual_savings || 0,
            roiYears: calculation?.roi_years ?? null,
            lowestInstallment: calculation?.monthly_installment?.[120] || calculation?.monthly_installment?.[84] || 0,
            installmentPeriod: calculation?.monthly_installment?.[120] ? 120 : 84,
          }),
          attachments,
        });

        // 2. Send lead notification to NEXBE team
        await resend.emails.send({
          from: FROM_EMAIL,
          to: NEXBE_LEAD_EMAIL,
          subject: `Nowy lead: ${name || email} — ${product.brand} ${product.name} (${formatPLN(netCost)})`,
          html: buildLeadNotificationHtml(name, email, phone, postalCode, product, leadId, totalGross, netCost),
          attachments,
        });

        emailSent = true;
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
        // Don't fail the entire request if email fails
      }
    } else {
      console.warn('RESEND_API_KEY not configured — emails not sent. Set RESEND_API_KEY env variable.');
    }

    // =====================================================
    // 3. SEND TO CRM — fire-and-forget (nie blokuje response)
    // =====================================================
    await sendToCrmWebhook({
      leadId,
      name: name || '',
      email,
      phone: phone || '',
      postalCode: postalCode || '',
      product,
      inverter,
      calculation,
      config,
      source: 'konfigurator',
    }).catch(() => {}); // errors already logged inside

    console.log('Offer processed:', {
      leadId,
      name,
      email,
      product: product?.name,
      pdfGenerated: !!pdfBuffer,
      emailSent,
    });

    return NextResponse.json({
      success: true,
      leadId,
      emailSent,
      message: emailSent
        ? 'Oferta wysłana pomyślnie na Twój adres email'
        : 'Oferta zapisana (email zostanie wysłany wkrótce)',
    });
  } catch (error) {
    console.error('Send offer error:', error);
    return NextResponse.json(
      { error: 'Błąd wysyłki oferty' },
      { status: 500 }
    );
  }
}
