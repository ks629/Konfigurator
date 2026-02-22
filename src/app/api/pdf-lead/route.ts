import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'Nexbe <onboarding@resend.dev>';
const NEXBE_LEAD_EMAIL = process.env.NEXBE_LEAD_EMAIL || 'kontakt@nexbe.pl';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, product, timestamp } = body;

    // Wyślij powiadomienie do NEXBE o nowym leadzie z PDF
    if (resend) {
      try {
        await resend.emails.send({
          from: FROM_EMAIL,
          to: NEXBE_LEAD_EMAIL,
          subject: `📥 Pobranie oferty PDF: ${name || 'Klient'} — ${product || 'brak produktu'}`,
          html: `
<!DOCTYPE html>
<html lang="pl">
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:20px;background:#f4f0f8;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
  <div style="max-width:500px;margin:0 auto;background:#fff;border-radius:12px;padding:24px;box-shadow:0 2px 10px rgba(0,0,0,0.06);">
    <h2 style="color:#B5005D;margin:0 0 16px;">📥 Nowe pobranie oferty PDF</h2>
    <table style="width:100%;border-collapse:collapse;font-size:14px;">
      <tr><td style="padding:8px 12px;border-bottom:1px solid #eee;color:#888;width:120px;">Imię</td><td style="padding:8px 12px;border-bottom:1px solid #eee;font-weight:600;">${name || '-'}</td></tr>
      <tr><td style="padding:8px 12px;border-bottom:1px solid #eee;color:#888;">Email</td><td style="padding:8px 12px;border-bottom:1px solid #eee;"><a href="mailto:${email}">${email || '-'}</a></td></tr>
      <tr><td style="padding:8px 12px;border-bottom:1px solid #eee;color:#888;">Telefon</td><td style="padding:8px 12px;border-bottom:1px solid #eee;"><a href="tel:${phone}">${phone || '-'}</a></td></tr>
      <tr><td style="padding:8px 12px;color:#888;">Produkt</td><td style="padding:8px 12px;font-weight:600;">${product || '-'}</td></tr>
    </table>
    <p style="color:#aaa;font-size:11px;margin:16px 0 0;">Pobranie: ${timestamp || new Date().toISOString()}</p>
  </div>
</body>
</html>`,
        });
      } catch (emailError) {
        console.error('Email notification failed:', emailError);
      }
    }

    console.log('PDF lead captured:', { name, email, phone, product, timestamp });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('PDF lead error:', error);
    return NextResponse.json({ error: 'Błąd zapisu' }, { status: 500 });
  }
}
