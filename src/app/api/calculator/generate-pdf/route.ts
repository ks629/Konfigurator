import { NextRequest, NextResponse } from 'next/server';
import { generateOfferPdfBuffer, type PdfOfferData } from '@/lib/pdf-generator';

export async function POST(req: NextRequest) {
  try {
    const body: PdfOfferData = await req.json();

    if (!body.product || !body.calculation) {
      return NextResponse.json(
        { error: 'Brak danych produktu lub kalkulacji' },
        { status: 400 }
      );
    }

    const pdfBuffer = generateOfferPdfBuffer(body);

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Oferta-Nexbe-${body.product.capacity_kwh}kWh.pdf"`,
      },
    });
  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json(
      { error: 'Błąd generowania PDF' },
      { status: 500 }
    );
  }
}
