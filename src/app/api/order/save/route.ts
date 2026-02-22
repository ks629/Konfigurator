import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { saveOrder } from '@/lib/orders-xlsx';

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'Nexbe <onboarding@resend.dev>';
const NEXBE_LEAD_EMAIL = process.env.NEXBE_LEAD_EMAIL || 'kontakt@nexbe.pl';

function formatPLN(amount: number): string {
  return new Intl.NumberFormat('pl-PL', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount) + ' zł';
}

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
      <h2 style="color:#B5005D;margin:0;font-size:20px;">Nowe zamówienie — ${data.orderNumber}</h2>
    </div>

    <table style="width:100%;border-collapse:collapse;font-size:14px;">
      <tr><td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;color:#888;width:160px;">Nr zamówienia</td><td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;font-weight:600;font-family:monospace;font-size:12px;">${data.orderNumber}</td></tr>
      <tr><td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;color:#888;">Data</td><td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;">${dateStr}</td></tr>
      <tr style="background:#fdf2f8;"><td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;color:#888;font-weight:600;">Klient</td><td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;font-weight:700;font-size:16px;">${data.customerName}</td></tr>
      <tr style="background:#fdf2f8;"><td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;color:#888;font-weight:600;">Telefon</td><td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;font-weight:700;font-size:16px;"><a href="tel:${data.phone}" style="color:#B5005D;text-decoration:none;">${data.phone}</a></td></tr>
      <tr style="background:#fdf2f8;"><td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;color:#888;font-weight:600;">Email</td><td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;"><a href="mailto:${data.email}" style="color:#B5005D;text-decoration:none;">${data.email}</a></td></tr>
      <tr><td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;color:#888;">Produkt</td><td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;">${data.product}</td></tr>
      <tr><td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;color:#888;">Kwota brutto</td><td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;font-weight:600;">${data.totalGross}</td></tr>
      <tr><td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;color:#888;">Po dotacjach</td><td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;font-weight:600;color:#22c55e;">${data.afterSubsidies}</td></tr>
      <tr><td style="padding:10px 12px;color:#888;">Płatność</td><td style="padding:10px 12px;font-weight:600;">${paymentLabel}</td></tr>
    </table>

    <div style="margin-top:20px;padding:16px;background:#f8f4fc;border-radius:8px;text-align:center;">
      <p style="color:#888;font-size:13px;margin:0 0 8px;">Skontaktuj się z klientem</p>
      <a href="tel:${data.phone}" style="display:inline-block;background:#B5005D;color:#fff;text-decoration:none;padding:10px 24px;border-radius:8px;font-weight:600;font-size:15px;">${data.phone}</a>
    </div>

    <p style="color:#aaa;font-size:11px;margin:20px 0 0;text-align:center;">Wygenerowano automatycznie — konfigurator.nexbe.pl</p>
  </div>
</body>
</html>`;
}

function buildCustomerConfirmationEmail(data: {
  orderNumber: string;
  customerName: string;
  product: string;
  productBrand: string;
  capacityKwh: number;
  totalGross: number;
  afterSubsidies: number;
  subsidyMojPrad: number;
  ulgaTermo: number;
  deposit30: number;
  remainingAtInstall: number;
  paymentMethod: string;
}): string {
  const paymentLabel = data.paymentMethod === 'zaliczka_p24'
    ? 'Zaliczka 30%'
    : 'Raty';

  const subsidyLines: string[] = [];
  if (data.subsidyMojPrad > 0) subsidyLines.push(`Mój Prąd 7.0: -${formatPLN(data.subsidyMojPrad)}`);
  if (data.ulgaTermo > 0) subsidyLines.push(`Ulga termomodernizacyjna: -${formatPLN(data.ulgaTermo)}`);

  return `
<!DOCTYPE html>
<html lang="pl">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f4f0f8;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
  <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">
    <!-- Header -->
    <div style="background:linear-gradient(135deg,#230045 0%,#350066 50%,#4a0080 100%);padding:32px 24px;text-align:center;">
      <h1 style="color:#ffffff;font-size:28px;margin:0 0 8px;font-weight:700;">Nexbe</h1>
      <p style="color:rgba(255,255,255,0.7);font-size:14px;margin:0;">Potwierdzenie zamówienia</p>
    </div>

    <!-- Content -->
    <div style="padding:32px 24px;">
      <h2 style="color:#230045;font-size:22px;margin:0 0 16px;">Cześć${data.customerName ? ', ' + data.customerName : ''}!</h2>
      <p style="color:#555;font-size:15px;line-height:1.6;margin:0 0 24px;">
        Dziękujemy za złożenie zamówienia. Poniżej znajdziesz podsumowanie. Nasz doradca skontaktuje się z Tobą w ciągu 24h, aby omówić szczegóły i ustalić termin montażu.
      </p>

      <!-- Order number -->
      <div style="background:#f8f4fc;border:1px solid #e5daf0;border-radius:12px;padding:16px;margin:0 0 20px;text-align:center;">
        <p style="color:#888;font-size:12px;margin:0 0 4px;">Numer zamówienia</p>
        <p style="color:#230045;font-size:18px;font-weight:700;margin:0;font-family:monospace;">${data.orderNumber}</p>
      </div>

      <!-- Product -->
      <div style="background:#f8f4fc;border:1px solid #e5daf0;border-radius:12px;padding:20px;margin:0 0 20px;">
        <p style="color:#666;font-size:13px;margin:0 0 8px;">Twój magazyn energii:</p>
        <h3 style="color:#230045;font-size:18px;margin:0 0 4px;">${data.productBrand} ${data.product}</h3>
        <p style="color:#888;font-size:14px;margin:0 0 16px;">Pojemność: ${data.capacityKwh} kWh</p>

        <!-- Pricing -->
        <table style="width:100%;border-collapse:collapse;font-size:14px;">
          <tr>
            <td style="padding:6px 0;color:#555;">Zestaw z montażem (brutto)</td>
            <td style="padding:6px 0;text-align:right;color:#230045;font-weight:600;">${formatPLN(data.totalGross)}</td>
          </tr>
          ${subsidyLines.length > 0 ? `
          <tr>
            <td style="padding:6px 0;color:#228B22;">Dofinansowanie</td>
            <td style="padding:6px 0;text-align:right;color:#228B22;font-weight:600;">-${formatPLN(data.subsidyMojPrad + data.ulgaTermo)}</td>
          </tr>
          ${subsidyLines.map(l => `<tr><td colspan="2" style="padding:2px 0 2px 16px;color:#888;font-size:12px;">${l}</td></tr>`).join('')}
          ` : ''}
          <tr>
            <td colspan="2" style="padding:0;"><div style="border-top:2px solid #B5005D;margin:8px 0;"></div></td>
          </tr>
          <tr>
            <td style="padding:6px 0;color:#B5005D;font-weight:700;font-size:16px;">Twój koszt po dotacjach</td>
            <td style="padding:6px 0;text-align:right;color:#B5005D;font-weight:700;font-size:20px;">${formatPLN(data.afterSubsidies)}</td>
          </tr>
        </table>
      </div>

      <!-- Payment method -->
      <div style="background:#fff;border:1px solid #e5daf0;border-radius:12px;padding:16px;margin:0 0 20px;">
        <p style="color:#888;font-size:12px;margin:0 0 4px;">Wybrana metoda płatności</p>
        <p style="color:#230045;font-size:16px;font-weight:600;margin:0;">${paymentLabel}</p>
        ${data.paymentMethod === 'zaliczka_p24' ? `
        <table style="width:100%;border-collapse:collapse;font-size:13px;margin-top:8px;">
          <tr>
            <td style="padding:4px 0;color:#555;">Zaliczka (30%)</td>
            <td style="padding:4px 0;text-align:right;font-weight:600;color:#230045;">${formatPLN(data.deposit30)}</td>
          </tr>
          <tr>
            <td style="padding:4px 0;color:#555;">Reszta przy montażu (70%)</td>
            <td style="padding:4px 0;text-align:right;color:#230045;">${formatPLN(data.remainingAtInstall)}</td>
          </tr>
        </table>
        ` : `
        <p style="color:#888;font-size:13px;margin:8px 0 0;">Wniosek ratalny zostanie przesłany osobno.</p>
        `}
      </div>

      <!-- What's included -->
      <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:16px;margin:0 0 20px;">
        <p style="color:#166534;font-size:13px;font-weight:600;margin:0 0 8px;">W cenie zamówienia:</p>
        <table style="width:100%;border-collapse:collapse;font-size:13px;">
          <tr><td style="padding:3px 0;color:#166534;">&#10003; Magazyn energii z falownikiem</td></tr>
          <tr><td style="padding:3px 0;color:#166534;">&#10003; Profesjonalny montaż i uruchomienie</td></tr>
          <tr><td style="padding:3px 0;color:#166534;">&#10003; Konfiguracja systemu EMS</td></tr>
          <tr><td style="padding:3px 0;color:#166534;">&#10003; Obsługa dotacji Mój Prąd 7.0 — gratis</td></tr>
          <tr><td style="padding:3px 0;color:#166534;">&#10003; Zgłoszenie do OSD</td></tr>
        </table>
      </div>

      <!-- Next steps -->
      <div style="background:#f8f4fc;border-left:4px solid #B5005D;border-radius:0 8px 8px 0;padding:16px 20px;margin:0 0 24px;">
        <h3 style="color:#230045;font-size:16px;margin:0 0 12px;">Co dalej?</h3>
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="padding:6px 12px 6px 0;vertical-align:top;width:24px;">
              <div style="background:#B5005D;color:#fff;width:22px;height:22px;border-radius:50%;text-align:center;line-height:22px;font-size:12px;font-weight:700;">1</div>
            </td>
            <td style="padding:6px 0;">
              <strong style="color:#230045;font-size:14px;">Kontakt doradcy</strong>
              <p style="color:#888;font-size:12px;margin:2px 0 0;">Odezwiemy się w ciągu 24h, aby potwierdzić szczegóły zamówienia</p>
            </td>
          </tr>
          <tr>
            <td style="padding:6px 12px 6px 0;vertical-align:top;">
              <div style="background:#B5005D;color:#fff;width:22px;height:22px;border-radius:50%;text-align:center;line-height:22px;font-size:12px;font-weight:700;">2</div>
            </td>
            <td style="padding:6px 0;">
              <strong style="color:#230045;font-size:14px;">Audyt techniczny</strong>
              <p style="color:#888;font-size:12px;margin:2px 0 0;">Technik oceni warunki montażu u Ciebie w domu</p>
            </td>
          </tr>
          <tr>
            <td style="padding:6px 12px 6px 0;vertical-align:top;">
              <div style="background:#B5005D;color:#fff;width:22px;height:22px;border-radius:50%;text-align:center;line-height:22px;font-size:12px;font-weight:700;">3</div>
            </td>
            <td style="padding:6px 0;">
              <strong style="color:#230045;font-size:14px;">Montaż i uruchomienie</strong>
              <p style="color:#888;font-size:12px;margin:2px 0 0;">Profesjonalny montaż w 1–2 dni + szkolenie z obsługi</p>
            </td>
          </tr>
        </table>
      </div>

      <!-- Contact -->
      <div style="background:#230045;border-radius:12px;padding:20px;text-align:center;">
        <p style="color:rgba(255,255,255,0.7);font-size:13px;margin:0 0 8px;">Masz pytania? Zadzwoń:</p>
        <p style="margin:0 0 4px;">
          <a href="tel:+48732080101" style="color:#ffffff;text-decoration:none;font-size:18px;font-weight:700;">732 080 101</a>
        </p>
        <p style="margin:0;">
          <a href="mailto:kontakt@nexbe.pl" style="color:rgba(255,255,255,0.7);text-decoration:none;font-size:14px;">kontakt@nexbe.pl</a>
        </p>
      </div>
    </div>

    <!-- Footer -->
    <div style="background:#f4f0f8;padding:20px 24px;text-align:center;border-top:1px solid #e5daf0;">
      <p style="color:#888;font-size:12px;margin:0 0 4px;">Nexbe Sp. z o.o. | ul. Sadowa 19D, 05-850 Jawczyce</p>
      <p style="color:#aaa;font-size:11px;margin:0;">Ta wiadomość została wygenerowana automatycznie.</p>
    </div>
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

    // Send emails
    let emailSent = false;
    if (resend) {
      const customerName = `${body.customer?.imie || ''} ${body.customer?.nazwisko || ''}`.trim();
      const customerEmail = body.customer?.email || '';

      try {
        // 1. Send confirmation to CUSTOMER
        if (customerEmail) {
          await resend.emails.send({
            from: FROM_EMAIL,
            to: customerEmail,
            subject: `Potwierdzenie zamówienia ${body.orderNumber} — Nexbe`,
            html: buildCustomerConfirmationEmail({
              orderNumber: body.orderNumber || '',
              customerName: body.customer?.imie || '',
              product: body.product?.nazwa || '',
              productBrand: body.product?.marka || '',
              capacityKwh: body.product?.pojemnosc_kwh || 0,
              totalGross: body.finances?.razem_brutto || 0,
              afterSubsidies: body.finances?.po_dotacjach || 0,
              subsidyMojPrad: body.finances?.dotacja_moj_prad || 0,
              ulgaTermo: body.finances?.ulga_termo || 0,
              deposit30: body.finances?.zaliczka_30 || 0,
              remainingAtInstall: body.finances?.reszta_przy_montazu || 0,
              paymentMethod: body.paymentMethod || '',
            }),
          });
          console.log(`Customer confirmation email sent to ${customerEmail} for ${body.orderNumber}`);
        }

        // 2. Send notification to NEXBE team
        await resend.emails.send({
          from: FROM_EMAIL,
          to: NEXBE_LEAD_EMAIL,
          subject: `Nowe zamówienie ${body.orderNumber}: ${customerName}`,
          html: buildOrderNotificationEmail({
            orderNumber: body.orderNumber || '',
            customerName,
            email: customerEmail,
            phone: body.customer?.telefon || '',
            product: body.product?.nazwa || '',
            totalGross: formatPLN(body.finances?.razem_brutto || 0),
            afterSubsidies: formatPLN(body.finances?.po_dotacjach || 0),
            paymentMethod: body.paymentMethod || '',
            timestamp,
          }),
        });

        emailSent = true;
        console.log(`Order email notifications sent for ${body.orderNumber}`);
      } catch (emailError) {
        console.error('Order email notification failed:', emailError);
      }
    }

    return NextResponse.json({
      success: true,
      orderId: body.orderId,
      emailSent,
      message: 'Zamówienie zapisane pomyślnie',
    });
  } catch (error) {
    console.error('Save order error:', error);
    return NextResponse.json(
      { error: 'Błąd zapisu zamówienia' },
      { status: 500 }
    );
  }
}
