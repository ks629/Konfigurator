import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { name, email, phone, postalCode, config, product, calculation } = body;

    // Generate lead ID
    const leadId = `NEXBE-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    // TODO: Generate PDF using jsPDF
    // const pdf = generateOfferPDF({ name, product, calculation, leadId });

    // TODO: Send email via Resend/Nodemailer
    // await resend.emails.send({
    //   from: 'oferty@nexbe.pl',
    //   to: email,
    //   subject: `Twoja oferta magazynu energii - ${product.name}`,
    //   attachments: [{ filename: `oferta-${leadId}.pdf`, content: pdf }],
    // });

    // TODO: Send copy to NEXBE
    // await resend.emails.send({
    //   from: 'oferty@nexbe.pl',
    //   to: 'lead@nexbe.pl',
    //   subject: `Nowy lead: ${name} - ${product.name}`,
    //   ...
    // });

    console.log('Offer sent:', { leadId, name, email, product: config?.selectedProductId });

    return NextResponse.json({
      success: true,
      leadId,
      message: 'Oferta wyslana pomyslnie',
    });
  } catch (error) {
    console.error('Send offer error:', error);
    return NextResponse.json(
      { error: 'Blad wysylki oferty' },
      { status: 500 }
    );
  }
}
