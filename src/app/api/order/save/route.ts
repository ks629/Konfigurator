import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { saveOrder } from '@/lib/orders-xlsx';

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'Nexbe <onboarding@resend.dev>';
const NEXBE_LEAD_EMAIL = process.env.NEXBE_LEAD_EMAIL || 'kontakt@nexbe.pl';

function buildOrderNotificationEmail(data: {
  orderNumber: string;
  customerName: string;
  email: string;
  phone: string;
  product: string;
  totalGross: string;
  afterSubsidies: string;
  paymentMethod: string;
  timestamp: string;
}): string {
  const date = new Date(data.timestamp);
  const dateStr = date.toLocaleDateString('pl-PL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const paymentLabel = data.paymentMethod === 'zaliczka_p24'
    ? 'Zaliczka 30% (BLIK / przelew / karta)'
    : 'Raty';

  return `
<!DOCTYPE html>
<html lang="pl">
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:20px;background:#f4f0f8;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
  <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:12px;padding:24px;box-shadow:0 2px 10px rgba(0,0,0,0.06);">
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:20px;">
      <div style="width:12px;height:12px;border-radius:50%;background:#B5005D;"></div>
      <h2 style="color:#B5005D;margin:0;font-size:20px;">Nowe zamowienie — ${data.orderNumber}</h2>
    </div>

    <table style="width:100%;border-collapse:collapse;font-size:14px;">
      <tr><td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;color:#888;width:160px;">Nr zamowienia</td><td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;font-weight:600;font-family:monospace;font-size:12px;">${data.orderNumber}</td></tr>
      <tr><td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;color:#888;">Data</td><td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;">${dateStr}</td></tr>
      <tr style="background:#fdf2f8;"><td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;color:#888;font-weight:600;">Klient</td><td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;font-weight:700;font-size:16px;">${data.customerName}</td></tr>
      <tr style="background:#fdf2f8;"><td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;color:#888;font-weight:600;">Telefon</td><td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;font-weight:700;font-size:16px;"><a href="tel:${data.phone}" style="color:#B5005D;text-decoration:none;">${data.phone}</a></td></tr>
      <tr style="background:#fdf2f8;"><td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;color:#888;font-weight:600;">Email</td><td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;"><a href="mailto:${data.email}" style="color:#B5005D;text-decoration:none;">${data.email}</a></td></tr>
      <tr><td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;color:#888;">Produkt</td><td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;">${data.product}</td></tr>
      <tr><td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;color:#888;">Kwota brutto</td><td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;font-weight:600;">${data.totalGross}</td></tr>
      <tr><td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;color:#888;">Po dotacjach</td><td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;font-weight:600;color:#22c55e;">${data.afterSubsidies}</td></tr>
      <tr><td style="padding:10px 12px;color:#888;">Platnosc</td><td style="padding:10px 12px;font-weight:600;">${paymentLabel}</td></tr>
    </table>

    <div style="margin-top:20px;padding:16px;background:#f8f4fc;border-radius:8px;text-align:center;">
      <p style="color:#888;font-size:13px;margin:0 0 8px;">Skontaktuj sie z klientem</p>
      <a href="tel:${data.phone}" style="display:inline-block;background:#B5005D;color:#fff;text-decoration:none;padding:10px 24px;border-radius:8px;font-weight:600;font-size:15px;">${data.phone}</a>
    </div>

    <p style="color:#aaa;font-size:11px;margin:20px 0 0;text-align:center;">Wygenerowano automatycznie — konfigurator.nexbe.pl</p>
  </div>
</body>
</html>`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const timestamp = new Date().toISOString();

    const orderRow = {
      timestamp,
      orderId: body.orderId || '',
      orderNumber: body.orderNumber || '',
      status: 'dane_klienta',
      imie: body.customer?.imie || '',
      nazwisko: body.customer?.nazwisko || '',
      email: body.customer?.email || '',
      telefon: body.customer?.telefon || '',
      ulica: body.customer?.ulica || '',
      kod: body.customer?.kod || '',
      miasto: body.customer?.miasto || '',
      wojewodztwo: body.customer?.wojewodztwo || '',
      nip: body.customer?.nip || '',
      paymentMethod: body.paymentMethod || '',
      productName: body.product?.nazwa || '',
      productBrand: body.product?.marka || '',
      capacityKwh: body.product?.pojemnosc_kwh || 0,
      powerKw: body.product?.moc_kw || 0,
      priceGross: body.product?.cena_brutto || 0,
      installationGross: body.product?.montaz_brutto || 0,
      totalGross: body.finances?.razem_brutto || 0,
      subsidyMojPrad: body.finances?.dotacja_moj_prad || 0,
      taxRelief: body.finances?.ulga_termo || 0,
      afterSubsidies: body.finances?.po_dotacjach || 0,
      deposit30: body.finances?.zaliczka_30 || 0,
      remainingAtInstall: body.finances?.reszta_przy_montazu || 0,
      annualSavings: body.finances?.roczna_oszczednosc || 0,
      roiYears: body.finances?.lat_zwrotu ?? null,
      savings20y: body.finances?.oszczednosc_20_lat || 0,
      installationType: body.config?.typ_instalacji || '',
      pvPowerKwp: body.config?.moc_pv_kwp || 0,
      annualConsumptionKwh: body.config?.zuzycie_roczne_kwh || 0,
      marketingConsent: body.customer?.zgoda_marketing || false,
    };

    const result = saveOrder(orderRow);
    console.log(`Order ${body.orderNumber} zapisane do XLSX: ${result.filePath}`);

    // Send notification email
    let emailSent = false;
    if (resend) {
      try {
        const customerName = `${body.customer?.imie || ''} ${body.customer?.nazwisko || ''}`.trim();

        await resend.emails.send({
          from: FROM_EMAIL,
          to: NEXBE_LEAD_EMAIL,
          subject: `Nowe zamowienie ${body.orderNumber}: ${customerName}`,
          html: buildOrderNotificationEmail({
            orderNumber: body.orderNumber || '',
            customerName,
            email: body.customer?.email || '',
            phone: body.customer?.telefon || '',
            product: body.product?.nazwa || '',
            totalGross: `${(body.finances?.razem_brutto || 0).toLocaleString('pl-PL')} zl`,
            afterSubsidies: `${(body.finances?.po_dotacjach || 0).toLocaleString('pl-PL')} zl`,
            paymentMethod: body.paymentMethod || '',
            timestamp,
          }),
        });
        emailSent = true;
        console.log(`Order email notification sent for ${body.orderNumber}`);
      } catch (emailError) {
        console.error('Order email notification failed:', emailError);
      }
    }

    return NextResponse.json({
      success: true,
      orderId: body.orderId,
      emailSent,
      message: 'Zamowienie zapisane pomyslnie',
    });
  } catch (error) {
    console.error('Save order error:', error);
    return NextResponse.json(
      { error: 'Blad zapisu zamowienia' },
      { status: 500 }
    );
  }
}
