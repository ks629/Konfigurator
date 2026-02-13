import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { generateOfferPdfBuffer, type PdfOfferData } from '@/lib/pdf-generator';

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

// Email nadawczy — domyślnie onboarding Resend, docelowo domena NEXBE
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'Nexbe <onboarding@resend.dev>';
const NEXBE_LEAD_EMAIL = process.env.NEXBE_LEAD_EMAIL || 'kontakt@nexbe.pl';

function formatPLN(amount: number): string {
  return new Intl.NumberFormat('pl-PL', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount) + ' zł';
}

function buildClientEmailHtml(name: string, product: { name: string; brand: string; capacity_kwh: number }, leadId: string, netCost: number): string {
  return `
<!DOCTYPE html>
<html lang="pl">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f4f0f8;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
  <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">
    <!-- Header -->
    <div style="background:linear-gradient(135deg,#230045 0%,#350066 50%,#4a0080 100%);padding:32px 24px;text-align:center;">
      <h1 style="color:#ffffff;font-size:28px;margin:0 0 8px;font-weight:700;">Nexbe</h1>
      <p style="color:rgba(255,255,255,0.7);font-size:14px;margin:0;">energia na życie</p>
    </div>

    <!-- Content -->
    <div style="padding:32px 24px;">
      <h2 style="color:#230045;font-size:22px;margin:0 0 16px;">Cześć${name ? ', ' + name : ''}!</h2>
      <p style="color:#555;font-size:15px;line-height:1.6;margin:0 0 20px;">
        Dziękujemy za zainteresowanie magazynem energii. W załączniku znajdziesz indywidualną ofertę przygotowaną na podstawie Twojej konfiguracji.
      </p>

      <!-- Product highlight -->
      <div style="background:#f8f4fc;border:1px solid #e5daf0;border-radius:12px;padding:20px;margin:0 0 20px;">
        <p style="color:#666;font-size:13px;margin:0 0 8px;">Twój wybrany produkt:</p>
        <h3 style="color:#230045;font-size:18px;margin:0 0 4px;">${product.brand} ${product.name}</h3>
        <p style="color:#888;font-size:14px;margin:0 0 12px;">Pojemność: ${product.capacity_kwh} kWh</p>
        <p style="color:#B5005D;font-size:24px;font-weight:700;margin:0;">${formatPLN(netCost)}</p>
        <p style="color:#888;font-size:12px;margin:4px 0 0;">po uwzględnieniu dotacji</p>
      </div>

      <p style="color:#555;font-size:15px;line-height:1.6;margin:0 0 24px;">
        Nasz doradca skontaktuje się z Tobą w ciągu 24h, aby omówić szczegóły i umówić bezpłatny audyt techniczny.
      </p>

      <!-- CTA -->
      <div style="text-align:center;margin:24px 0;">
        <a href="https://nexbe.pl" style="background:#B5005D;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:10px;font-weight:600;font-size:15px;display:inline-block;">
          Sprawdź ofertę online
        </a>
      </div>

      <p style="color:#999;font-size:12px;margin:24px 0 0;text-align:center;">
        Nr oferty: ${leadId}
      </p>
    </div>

    <!-- Footer -->
    <div style="background:#f4f0f8;padding:20px 24px;text-align:center;border-top:1px solid #e5daf0;">
      <p style="color:#888;font-size:12px;margin:0 0 4px;">Nexbe Sp. z o.o. | kontakt@nexbe.pl</p>
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
      pdfBuffer = generateOfferPdfBuffer(pdfData);
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
          html: buildClientEmailHtml(name, product, leadId, netCost),
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
