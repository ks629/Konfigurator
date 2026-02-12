import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { robotoRegularBase64 } from '@/lib/fonts/roboto-regular';
import { robotoBoldBase64 } from '@/lib/fonts/roboto-bold';
import type {
  Product,
  Inverter,
  CalculationResult,
  ConfiguratorState,
} from '@/lib/types';

// ────────────────────────────────────────────────────────────
// Typy
// ────────────────────────────────────────────────────────────

export interface PdfOfferData {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientPostalCode: string;
  product: Product;
  inverter?: Inverter;
  calculation: CalculationResult;
  config: ConfiguratorState;
  offerDate?: string;
  offerNumber?: string;
}

// ────────────────────────────────────────────────────────────
// Kolory NEXBE
// ────────────────────────────────────────────────────────────

const NEXBE_PRIMARY = '#B5005D';
const NEXBE_PURPLE = '#350066';
const NEXBE_DARK = '#230045';
const NEXBE_LIGHT_BG = '#F8F4FC';
const NEXBE_BORDER = '#E5DAF0';

function hexToRgb(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
}

// ────────────────────────────────────────────────────────────
// Pomocnicze
// ────────────────────────────────────────────────────────────

function formatPLN(amount: number): string {
  return new Intl.NumberFormat('pl-PL', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount) + ' zł';
}

function formatPLNShort(amount: number): string {
  return new Intl.NumberFormat('pl-PL', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount) + ' zł';
}

function getInstallationTypeLabel(type: string): string {
  switch (type) {
    case 'retrofit':
      return 'Retrofit (doposażenie istniejącej instalacji PV)';
    case 'hybrid':
      return 'Nowa instalacja z falownikiem hybrydowym';
    case 'upgrade':
      return 'Rozbudowa istniejącego systemu';
    default:
      return type;
  }
}

function getToday(): string {
  return new Intl.DateTimeFormat('pl-PL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date());
}

// ────────────────────────────────────────────────────────────
// Inicjalizacja czcionek
// ────────────────────────────────────────────────────────────

function setupFonts(doc: jsPDF): void {
  doc.addFileToVFS('Roboto-Regular.ttf', robotoRegularBase64);
  doc.addFont('Roboto-Regular.ttf', 'Roboto', 'normal');

  doc.addFileToVFS('Roboto-Bold.ttf', robotoBoldBase64);
  doc.addFont('Roboto-Bold.ttf', 'Roboto', 'bold');
}

// ────────────────────────────────────────────────────────────
// Stopka i nagłówek
// ────────────────────────────────────────────────────────────

function drawHeader(doc: jsPDF): void {
  const pageWidth = doc.internal.pageSize.getWidth();
  // Linia dekoracyjna na górze
  doc.setFillColor(...hexToRgb(NEXBE_PRIMARY));
  doc.rect(0, 0, pageWidth, 3, 'F');
}

function drawFooter(doc: jsPDF, pageNum: number, totalPages: number): void {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Linia
  doc.setDrawColor(...hexToRgb(NEXBE_BORDER));
  doc.setLineWidth(0.3);
  doc.line(20, pageHeight - 20, pageWidth - 20, pageHeight - 20);

  // Stopka tekst
  doc.setFont('Roboto', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(150, 150, 150);
  doc.text(
    'NEXBE Sp. z o.o. | ul. Przykładowa 1, 00-001 Warszawa | NIP: 1234567890 | kontakt@nexbe.pl',
    pageWidth / 2,
    pageHeight - 14,
    { align: 'center' }
  );
  doc.text(
    `Strona ${pageNum} z ${totalPages}`,
    pageWidth / 2,
    pageHeight - 9,
    { align: 'center' }
  );
}

// ────────────────────────────────────────────────────────────
// Strona 1 — Okładka
// ────────────────────────────────────────────────────────────

function drawCoverPage(doc: jsPDF, data: PdfOfferData): void {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const totalPrice = data.product.price_gross + (data.inverter?.price_gross || 0);

  // Gradient tło (symulacja przez prostokąty)
  doc.setFillColor(...hexToRgb(NEXBE_DARK));
  doc.rect(0, 0, pageWidth, pageHeight * 0.45, 'F');

  doc.setFillColor(...hexToRgb(NEXBE_PURPLE));
  doc.rect(0, pageHeight * 0.35, pageWidth, pageHeight * 0.1, 'F');

  // Logo - tekst
  doc.setFont('Roboto', 'bold');
  doc.setFontSize(36);
  doc.setTextColor(255, 255, 255);
  doc.text('Nexbe', 30, 50);

  doc.setFont('Roboto', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(200, 200, 220);
  doc.text('energia na życie', 30, 62);

  // Tytuł oferty
  doc.setFont('Roboto', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(255, 255, 255);
  doc.text('OFERTA WYKONANIA', 30, 100);

  doc.setFontSize(26);
  doc.setTextColor(...hexToRgb(NEXBE_PRIMARY));
  doc.text(
    `Magazynu Energii ${data.product.capacity_kwh} kWh`,
    30,
    115
  );

  // Typ instalacji
  doc.setFont('Roboto', 'normal');
  doc.setFontSize(12);
  doc.setTextColor(200, 200, 220);
  doc.text(
    getInstallationTypeLabel(data.config.installationType || 'retrofit'),
    30,
    130
  );

  // Linia dekoracyjna
  doc.setDrawColor(...hexToRgb(NEXBE_PRIMARY));
  doc.setLineWidth(1.5);
  doc.line(30, 140, pageWidth - 30, 140);

  // Sekcja danych klienta (biały)
  const clientSectionY = pageHeight * 0.5;

  // Dane klienta
  doc.setFont('Roboto', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(...hexToRgb(NEXBE_PURPLE));
  doc.text('Dane klienta', 30, clientSectionY);

  doc.setFont('Roboto', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(80, 80, 80);
  const clientLines = [
    data.clientName || 'Klient',
    data.clientEmail || '',
    data.clientPhone || '',
    data.clientPostalCode ? `Kod: ${data.clientPostalCode}` : '',
  ].filter(Boolean);
  clientLines.forEach((line, i) => {
    doc.text(line, 30, clientSectionY + 14 + i * 8);
  });

  // Dane oferty (prawa kolumna)
  doc.setFont('Roboto', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(...hexToRgb(NEXBE_PURPLE));
  doc.text('Szczegóły oferty', pageWidth / 2 + 10, clientSectionY);

  doc.setFont('Roboto', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(80, 80, 80);
  const offerLines = [
    `Nr oferty: ${data.offerNumber || 'NEXBE-' + Date.now().toString().slice(-6)}`,
    `Data: ${data.offerDate || getToday()}`,
    `Ważność: 14 dni`,
    `Produkt: ${data.product.brand} ${data.product.name}`,
  ];
  offerLines.forEach((line, i) => {
    doc.text(line, pageWidth / 2 + 10, clientSectionY + 14 + i * 8);
  });

  // Podsumowanie cenowe na dole
  const summaryY = pageHeight * 0.72;

  // Ramka podsumowania
  doc.setFillColor(...hexToRgb(NEXBE_LIGHT_BG));
  doc.roundedRect(25, summaryY - 5, pageWidth - 50, 60, 5, 5, 'F');

  doc.setDrawColor(...hexToRgb(NEXBE_BORDER));
  doc.setLineWidth(0.5);
  doc.roundedRect(25, summaryY - 5, pageWidth - 50, 60, 5, 5, 'S');

  // Cena brutto
  doc.setFont('Roboto', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(100, 100, 100);
  doc.text('Cena brutto:', 35, summaryY + 10);

  doc.setFont('Roboto', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(...hexToRgb(NEXBE_DARK));
  doc.text(formatPLN(totalPrice), 35, summaryY + 22);

  // Po dotacjach
  doc.setFont('Roboto', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(100, 100, 100);
  doc.text('Po dotacjach:', pageWidth / 2, summaryY + 10);

  doc.setFont('Roboto', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(...hexToRgb(NEXBE_PRIMARY));
  doc.text(formatPLN(data.calculation.investment.net_cost), pageWidth / 2, summaryY + 22);

  // Dotacje
  doc.setFont('Roboto', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 150, 100);
  doc.text(
    `Dotacja Mój Prąd: -${formatPLNShort(data.calculation.investment.subsidy_pme)}  |  Ulga termomod.: -${formatPLNShort(data.calculation.investment.tax_relief)}`,
    35,
    summaryY + 42
  );

  // ROI na samym dole
  const roiY = pageHeight * 0.87;
  doc.setFont('Roboto', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(...hexToRgb(NEXBE_PURPLE));

  if (data.calculation.roi_years) {
    doc.text(
      `Zwrot inwestycji: ${data.calculation.roi_years} lat  |  Oszczędności rocznie: ${formatPLNShort(data.calculation.annual_savings)}`,
      30,
      roiY
    );
  } else {
    doc.text(
      `Oszczędności rocznie: ${formatPLNShort(data.calculation.annual_savings)}`,
      30,
      roiY
    );
  }
}

// ────────────────────────────────────────────────────────────
// Strona 2 — Zakres prac
// ────────────────────────────────────────────────────────────

function drawScopePage(doc: jsPDF, data: PdfOfferData): void {
  const pageWidth = doc.internal.pageSize.getWidth();
  drawHeader(doc);

  let y = 20;

  // Tytuł
  doc.setFont('Roboto', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(...hexToRgb(NEXBE_PURPLE));
  doc.text('Zakres prac i wyposażenie', 20, y);
  y += 15;

  // Tabela wyposażenia
  const equipmentRows: string[][] = [];

  equipmentRows.push([
    `Magazyn energii ${data.product.brand} ${data.product.name}`,
    `${data.product.capacity_kwh} kWh`,
    '1 szt.',
    'Wliczone',
  ]);

  if (data.inverter) {
    equipmentRows.push([
      `Falownik hybrydowy ${data.inverter.brand} ${data.inverter.name}`,
      `${data.inverter.power_kw} kW`,
      '1 szt.',
      'Wliczone',
    ]);
  }

  equipmentRows.push([
    'Komplet okablowania i zabezpieczeń AC/DC',
    '',
    '1 kpl.',
    'Wliczone',
  ]);

  equipmentRows.push([
    'Rozdzielnia z zabezpieczeniami',
    '',
    '1 kpl.',
    'Wliczone',
  ]);

  if (data.config.backupPreference === 'yes' && data.product.eps_capable) {
    equipmentRows.push([
      'Instalacja zasilania awaryjnego (EPS/backup)',
      '',
      '1 kpl.',
      'Wliczone',
    ]);
  }

  equipmentRows.push([
    'System monitoringu i aplikacja mobilna',
    '',
    '1 kpl.',
    'Wliczone',
  ]);

  autoTable(doc, {
    startY: y,
    head: [['Element', 'Parametry', 'Ilość', 'Cena']],
    body: equipmentRows,
    theme: 'grid',
    styles: {
      font: 'Roboto',
      fontSize: 9,
      cellPadding: 5,
    },
    headStyles: {
      fillColor: hexToRgb(NEXBE_PURPLE),
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9,
    },
    columnStyles: {
      0: { cellWidth: 85 },
      1: { cellWidth: 30, halign: 'center' },
      2: { cellWidth: 25, halign: 'center' },
      3: { cellWidth: 30, halign: 'center' },
    },
    margin: { left: 20, right: 20 },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  y = (doc as any).lastAutoTable.finalY + 15;

  // Prace montażowe
  doc.setFont('Roboto', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(...hexToRgb(NEXBE_PURPLE));
  doc.text('Prace montażowe (wliczone w cenę)', 20, y);
  y += 10;

  const works = [
    'Montaż magazynu energii w wyznaczonym miejscu',
    'Podłączenie magazynu do istniejącej instalacji elektrycznej',
    data.inverter ? 'Montaż i podłączenie falownika hybrydowego' : null,
    data.config.backupPreference === 'yes' ? 'Instalacja obwodu zasilania awaryjnego (backup)' : null,
    'Konfiguracja systemu zarządzania energią',
    'Uruchomienie i konfiguracja monitoringu online',
    'Przeszkolenie użytkownika z obsługi systemu',
    'Zgłoszenie do operatora sieci dystrybucyjnej (OSD)',
  ].filter(Boolean) as string[];

  doc.setFont('Roboto', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);

  works.forEach((work) => {
    doc.setFillColor(...hexToRgb(NEXBE_PRIMARY));
    doc.circle(25, y - 1.5, 1.5, 'F');
    doc.text(work, 32, y);
    y += 8;
  });

  y += 10;

  // Uwagi
  doc.setFillColor(...hexToRgb(NEXBE_LIGHT_BG));
  doc.roundedRect(20, y, pageWidth - 40, 35, 3, 3, 'F');

  doc.setFont('Roboto', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...hexToRgb(NEXBE_PURPLE));
  doc.text('Uwaga:', 25, y + 10);

  doc.setFont('Roboto', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(80, 80, 80);
  doc.text(
    'Ostateczny zakres prac zostanie potwierdzony po audycie technicznym na miejscu instalacji.',
    25,
    y + 18
  );
  doc.text(
    'Cena zawiera materiały, transport, montaż oraz uruchomienie systemu.',
    25,
    y + 25
  );
}

// ────────────────────────────────────────────────────────────
// Strona 3 — Wycena i specyfikacja
// ────────────────────────────────────────────────────────────

function drawPricingPage(doc: jsPDF, data: PdfOfferData): void {
  const pageWidth = doc.internal.pageSize.getWidth();
  drawHeader(doc);

  let y = 20;

  // Tytuł
  doc.setFont('Roboto', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(...hexToRgb(NEXBE_PURPLE));
  doc.text('Specyfikacja techniczna i wycena', 20, y);
  y += 15;

  // Tabela specyfikacji technicznej
  const specRows: string[][] = [
    ['Producent', data.product.brand],
    ['Model', data.product.name],
    ['Pojemność', `${data.product.capacity_kwh} kWh`],
    ['Moc ciągła', `${data.product.power_continuous_kw} kW`],
    ['Moc szczytowa', `${data.product.power_peak_kw} kW`],
    ['Typ podłączenia', data.product.type === 'AC' ? 'AC (retrofit)' : 'DC (hybrydowy)'],
    ['Zasilanie awaryjne (EPS)', data.product.eps_capable ? 'Tak' : 'Nie'],
    ['Gwarancja', `${data.product.warranty_years} lat`],
  ];

  if (data.inverter) {
    specRows.push(
      ['', ''],
      ['Falownik', `${data.inverter.brand} ${data.inverter.name}`],
      ['Moc falownika', `${data.inverter.power_kw} kW`],
    );
  }

  autoTable(doc, {
    startY: y,
    head: [['Parametr', 'Wartość']],
    body: specRows,
    theme: 'striped',
    styles: {
      font: 'Roboto',
      fontSize: 9,
      cellPadding: 4,
    },
    headStyles: {
      fillColor: hexToRgb(NEXBE_PURPLE),
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    columnStyles: {
      0: { cellWidth: 60, fontStyle: 'bold' },
      1: { cellWidth: 110 },
    },
    margin: { left: 20, right: 20 },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  y = (doc as any).lastAutoTable.finalY + 15;

  // Wycena
  doc.setFont('Roboto', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(...hexToRgb(NEXBE_PURPLE));
  doc.text('Wycena', 20, y);
  y += 10;

  const inv = data.calculation.investment;
  const totalPrice = data.product.price_gross + (data.inverter?.price_gross || 0);

  const priceRows: string[][] = [
    ['Magazyn energii', formatPLN(inv.battery)],
  ];

  if (inv.inverter > 0) {
    priceRows.push(['Falownik hybrydowy', formatPLN(inv.inverter)]);
  }

  priceRows.push(
    ['Montaż i uruchomienie', 'Wliczone'],
  );

  if (inv.backup > 0) {
    priceRows.push(['Instalacja backup', formatPLN(inv.backup)]);
  }

  priceRows.push(
    ['', ''],
    ['RAZEM BRUTTO', formatPLN(totalPrice)],
  );

  if (inv.subsidy_pme > 0) {
    priceRows.push(['Dotacja Mój Prąd 6.0', `- ${formatPLN(inv.subsidy_pme)}`]);
  }

  if (inv.tax_relief > 0) {
    const bracket = inv.thermomodernization_details?.tax_bracket || 12;
    priceRows.push([`Ulga termomodernizacyjna (${bracket}%)`, `- ${formatPLN(inv.tax_relief)}`]);
  }

  priceRows.push(
    ['', ''],
    ['KOSZT PO DOTACJACH', formatPLN(inv.net_cost)],
  );

  autoTable(doc, {
    startY: y,
    body: priceRows,
    theme: 'plain',
    styles: {
      font: 'Roboto',
      fontSize: 10,
      cellPadding: 4,
    },
    columnStyles: {
      0: { cellWidth: 100 },
      1: { cellWidth: 70, halign: 'right' },
    },
    didParseCell: (hookData) => {
      const text = hookData.cell.raw as string;
      if (text === 'RAZEM BRUTTO' || text === 'KOSZT PO DOTACJACH') {
        hookData.cell.styles.fontStyle = 'bold';
        hookData.cell.styles.fontSize = 11;
      }
      if (text === 'KOSZT PO DOTACJACH') {
        hookData.cell.styles.textColor = hexToRgb(NEXBE_PRIMARY);
      }
      // Row with RAZEM BRUTTO or KOSZT PO DOTACJACH — make value bold too
      if (hookData.column.index === 1) {
        const rowData = hookData.row.raw as string[];
        if (rowData && (rowData[0] === 'RAZEM BRUTTO' || rowData[0] === 'KOSZT PO DOTACJACH')) {
          hookData.cell.styles.fontStyle = 'bold';
          hookData.cell.styles.fontSize = 11;
        }
        if (rowData && rowData[0] === 'KOSZT PO DOTACJACH') {
          hookData.cell.styles.textColor = hexToRgb(NEXBE_PRIMARY);
        }
      }
      // Subsidy rows — green
      if (typeof text === 'string' && text.startsWith('- ')) {
        hookData.cell.styles.textColor = [34, 139, 34];
      }
    },
    margin: { left: 20, right: 20 },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  y = (doc as any).lastAutoTable.finalY + 15;

  // Finansowanie
  if (data.calculation.monthly_installment) {
    doc.setFont('Roboto', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(...hexToRgb(NEXBE_PURPLE));
    doc.text('Opcje finansowania (Inbank)', 20, y);
    y += 8;

    doc.setFont('Roboto', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(80, 80, 80);
    doc.text('Oprocentowanie stałe 8,99%, RRSO 11,09%, opłata 10 zł/mies.', 20, y);
    y += 8;

    const periods = [36, 60, 84, 120];
    const finRows: string[][] = periods
      .filter((p) => data.calculation.monthly_installment[p])
      .map((p) => [
        `${p} miesięcy (${Math.round(p / 12)} lat)`,
        formatPLN(data.calculation.monthly_installment[p]),
      ]);

    if (finRows.length > 0) {
      autoTable(doc, {
        startY: y,
        head: [['Okres', 'Rata miesięczna']],
        body: finRows,
        theme: 'grid',
        styles: {
          font: 'Roboto',
          fontSize: 9,
          cellPadding: 4,
        },
        headStyles: {
          fillColor: hexToRgb(NEXBE_PURPLE),
          textColor: [255, 255, 255],
          fontStyle: 'bold',
        },
        columnStyles: {
          0: { cellWidth: 80 },
          1: { cellWidth: 50, halign: 'right' },
        },
        margin: { left: 20, right: 20 },
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      y = (doc as any).lastAutoTable.finalY + 15;
    }
  }

  // Warunki
  doc.setFillColor(...hexToRgb(NEXBE_LIGHT_BG));
  const condHeight = 55;
  doc.roundedRect(20, y, pageWidth - 40, condHeight, 3, 3, 'F');

  doc.setFont('Roboto', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...hexToRgb(NEXBE_PURPLE));
  doc.text('Warunki realizacji', 25, y + 10);

  doc.setFont('Roboto', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(60, 60, 60);

  const conditions = [
    `Gwarancja: ${data.product.warranty_years} lat na magazyn energii`,
    'Termin realizacji: do 4 tygodni od podpisania umowy',
    'Oferta ważna: 14 dni od daty wystawienia',
    'Cena zawiera materiały, montaż, uruchomienie oraz pomoc w uzyskaniu dotacji',
  ];

  conditions.forEach((cond, i) => {
    doc.text(`• ${cond}`, 25, y + 20 + i * 8);
  });
}

// ────────────────────────────────────────────────────────────
// Główna funkcja eksportująca
// ────────────────────────────────────────────────────────────

export function generateOfferPdf(data: PdfOfferData): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  setupFonts(doc);

  // Strona 1 — Okładka
  drawCoverPage(doc, data);

  // Strona 2 — Zakres prac
  doc.addPage();
  drawScopePage(doc, data);

  // Strona 3 — Wycena
  doc.addPage();
  drawPricingPage(doc, data);

  // Dodaj stopki
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    if (i > 1) drawFooter(doc, i, totalPages);
  }

  return doc;
}

/**
 * Generuje PDF i zwraca jako Blob (do pobrania w przeglądarce)
 */
export function generateOfferPdfBlob(data: PdfOfferData): Blob {
  const doc = generateOfferPdf(data);
  return doc.output('blob');
}

/**
 * Generuje PDF i zwraca jako ArrayBuffer (do wysyłki API)
 */
export function generateOfferPdfBuffer(data: PdfOfferData): ArrayBuffer {
  const doc = generateOfferPdf(data);
  return doc.output('arraybuffer');
}
