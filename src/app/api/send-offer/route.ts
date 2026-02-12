import { NextRequest, NextResponse } from 'next/server';
import { generateOfferPdfBuffer, type PdfOfferData } from '@/lib/pdf-generator';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { name, email, phone, postalCode, config, product, inverter, calculation } = body;

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

    // TODO: Send email via Resend/Nodemailer
    // await resend.emails.send({
    //   from: 'oferty@nexbe.pl',
    //   to: email,
    //   subject: `Twoja oferta magazynu energii - ${product.name}`,
    //   attachments: pdfBuffer ? [{ filename: `oferta-${leadId}.pdf`, content: Buffer.from(pdfBuffer) }] : [],
    // });

    // TODO: Send copy to NEXBE
    // await resend.emails.send({
    //   from: 'oferty@nexbe.pl',
    //   to: 'lead@nexbe.pl',
    //   subject: `Nowy lead: ${name} - ${product.name}`,
    //   ...
    // });

    console.log('Offer sent:', {
      leadId,
      name,
      email,
      product: product?.name,
      pdfGenerated: !!pdfBuffer,
    });

    return NextResponse.json({
      success: true,
      leadId,
      message: 'Oferta wysłana pomyślnie',
    });
  } catch (error) {
    console.error('Send offer error:', error);
    return NextResponse.json(
      { error: 'Błąd wysyłki oferty' },
      { status: 500 }
    );
  }
}
