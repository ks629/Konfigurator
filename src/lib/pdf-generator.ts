import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { robotoRegularBase64 } from '@/lib/fonts/roboto-regular';
import { robotoBoldBase64 } from '@/lib/fonts/roboto-bold';
import { logoWhiteBase64 } from '@/lib/fonts/logo-white-base64';
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

/** Marki z wbudowanym EMS */
const BRANDS_WITH_BUILTIN_EMS = ['Huawei', 'Sigenergy'];

function baseBrand(brand: string): string {
  return brand.split('/')[0];
}

/** Nazwa produktu bez powtarzania brand na początku */
function cleanProductName(product: Product): string {
  const brand = baseBrand(product.brand);
  const name = product.name;
  // "Huawei LUNA2000 15 kWh" → "LUNA2000 15 kWh" (brand = "Huawei")
  // "GoodWe + Dyness 14.2 kWh" → "GoodWe + Dyness 14.2 kWh" (brand = "GoodWe")
  if (name.startsWith(brand + ' ')) {
    return name.slice(brand.length + 1);
  }
  return name;
}

function needsEms(brand: string): boolean {
  return !BRANDS_WITH_BUILTIN_EMS.includes(baseBrand(brand));
}

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

function getBackupLabel(product: Product): string {
  return product.eps_capable
    ? 'Zasilanie awaryjne (EPS) — podtrzymanie wybranych obwodów'
    : 'Pełny backup 3F (SZR) — automatyczne przełączanie całego domu';
}

function getBackupShort(product: Product): string {
  return product.eps_capable ? 'EPS (wybrane obwody)' : 'Pełny backup 3F (SZR)';
}

function getToday(): string {
  return new Intl.DateTimeFormat('pl-PL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date());
}

function getExpiryDate(): string {
  const d = new Date();
  d.setDate(d.getDate() + 14);
  return new Intl.DateTimeFormat('pl-PL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(d);
}

// ────────────────────────────────────────────────────────────
// Ładowanie obrazów runtime
// ────────────────────────────────────────────────────────────

async function loadImageAsDataUrl(src: string): Promise<string | null> {
  try {
    const res = await fetch(src);
    const blob = await res.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
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
  doc.setFillColor(...hexToRgb(NEXBE_PRIMARY));
  doc.rect(0, 0, pageWidth, 3, 'F');
}

function drawFooter(doc: jsPDF, pageNum: number, totalPages: number): void {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  doc.setDrawColor(...hexToRgb(NEXBE_BORDER));
  doc.setLineWidth(0.3);
  doc.line(20, pageHeight - 20, pageWidth - 20, pageHeight - 20);

  doc.setFont('Roboto', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(150, 150, 150);
  doc.text(
    'Nexbe Sp. z o.o. | kontakt@nexbe.pl | 732 080 101 | nexbe.pl',
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
// Strona 1 — Okładka (z logo PNG + zdjęcie produktu)
// ────────────────────────────────────────────────────────────

function drawCoverPage(doc: jsPDF, data: PdfOfferData, productImageDataUrl?: string | null): void {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const brand = baseBrand(data.product.brand);
  const inv = data.calculation.investment;

  // ── Ciemne tło — góra 42% strony ──
  doc.setFillColor(...hexToRgb(NEXBE_DARK));
  doc.rect(0, 0, pageWidth, pageHeight * 0.42, 'F');

  // Gradient overlay
  doc.setFillColor(...hexToRgb(NEXBE_PURPLE));
  doc.rect(0, pageHeight * 0.35, pageWidth, pageHeight * 0.07, 'F');

  // ── Logo PNG (lewy górny róg) ──
  try {
    doc.addImage(logoWhiteBase64, 'PNG', 20, 14, 40, 19);
  } catch {
    doc.setFont('Roboto', 'bold');
    doc.setFontSize(28);
    doc.setTextColor(255, 255, 255);
    doc.text('Nexbe', 22, 30);
  }

  // ── Nr oferty + data (prawy górny róg) ──
  doc.setFont('Roboto', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(180, 180, 200);
  const offerNum = data.offerNumber || 'NEXBE-' + Date.now().toString().slice(-6);
  doc.text(`Oferta ${offerNum}`, pageWidth - 20, 20, { align: 'right' });
  doc.text(`${data.offerDate || getToday()}  ·  ważna do ${getExpiryDate()}`, pageWidth - 20, 26, { align: 'right' });

  // ── Tytuł — "INDYWIDUALNA OFERTA" ──
  doc.setFont('Roboto', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(200, 200, 220);
  doc.text('INDYWIDUALNA OFERTA', 20, 52);

  // ── Nazwa produktu — duża ──
  doc.setFont('Roboto', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(255, 255, 255);
  doc.text('Magazyn Energii', 20, 68);

  doc.setFontSize(36);
  doc.setTextColor(...hexToRgb(NEXBE_PRIMARY));
  doc.text(`${data.product.capacity_kwh} kWh`, 20, 84);

  // ── Marka + typ ──
  doc.setFont('Roboto', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(200, 200, 220);
  doc.text(`${brand}  ${cleanProductName(data.product)}`, 20, 96);

  doc.setFontSize(9);
  doc.setTextColor(160, 160, 180);
  doc.text(
    getInstallationTypeLabel(data.config.installationType || 'retrofit'),
    20, 104
  );

  // ── Zdjęcie produktu (prawy obszar ciemnego tła) ──
  if (productImageDataUrl) {
    try {
      // Pozycja: prawy segment ciemnego tła
      const imgW = 55;
      const imgH = 70;
      const imgX = pageWidth - imgW - 15;
      const imgY = 40;
      doc.addImage(productImageDataUrl, 'PNG', imgX, imgY, imgW, imgH);
    } catch {
      // Brak obrazu — OK
    }
  }

  // ── 3 mini-karty KPI pod ciemnym tłem ──
  const kpiY = pageHeight * 0.42 + 5;
  const kpiH = 22;
  const kpiW = (pageWidth - 50) / 3;
  const kpis = [
    { label: 'Pojemność', value: `${data.product.capacity_kwh} kWh` },
    { label: 'Moc ciągła', value: `${data.product.power_continuous_kw} kW` },
    { label: 'Gwarancja', value: `${data.product.warranty_years} lat` },
  ];

  kpis.forEach((kpi, i) => {
    const x = 20 + i * (kpiW + 5);
    doc.setFillColor(...hexToRgb(NEXBE_LIGHT_BG));
    doc.roundedRect(x, kpiY, kpiW, kpiH, 2, 2, 'F');
    doc.setDrawColor(...hexToRgb(NEXBE_BORDER));
    doc.setLineWidth(0.3);
    doc.roundedRect(x, kpiY, kpiW, kpiH, 2, 2, 'S');

    doc.setFont('Roboto', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(120, 120, 120);
    doc.text(kpi.label, x + kpiW / 2, kpiY + 8, { align: 'center' });

    doc.setFont('Roboto', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(...hexToRgb(NEXBE_PURPLE));
    doc.text(kpi.value, x + kpiW / 2, kpiY + 17, { align: 'center' });
  });

  // ── Sekcja cenowa — duże boxy ──
  const priceY = kpiY + kpiH + 8;

  // Box cena brutto
  const priceBoxW = (pageWidth - 50) / 2;
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(20, priceY, priceBoxW, 32, 3, 3, 'F');
  doc.setDrawColor(...hexToRgb(NEXBE_BORDER));
  doc.setLineWidth(0.3);
  doc.roundedRect(20, priceY, priceBoxW, 32, 3, 3, 'S');

  doc.setFont('Roboto', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  doc.text('Cena brutto', 25, priceY + 9);

  doc.setFont('Roboto', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(...hexToRgb(NEXBE_DARK));
  doc.text(formatPLN(inv.total_gross), 25, priceY + 22);

  // Box dotacja
  const dotBoxX = 20 + priceBoxW + 5;
  const dotBoxH = 38;
  doc.setFillColor(...hexToRgb(NEXBE_LIGHT_BG));
  doc.roundedRect(dotBoxX, priceY, priceBoxW + 5, dotBoxH, 3, 3, 'F');
  doc.setDrawColor(...hexToRgb(NEXBE_BORDER));
  doc.roundedRect(dotBoxX, priceY, priceBoxW + 5, dotBoxH, 3, 3, 'S');

  doc.setFont('Roboto', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  doc.text('Dofinansowanie', dotBoxX + 5, priceY + 9);

  doc.setFont('Roboto', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(34, 139, 34);
  const totalSubsidy = inv.subsidy_pme + inv.tax_relief;
  doc.text(`-${formatPLNShort(totalSubsidy)}`, dotBoxX + 5, priceY + 21);

  doc.setFont('Roboto', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(100, 100, 100);
  const subsidyLines: string[] = [];
  if (inv.subsidy_pme > 0) subsidyLines.push(`Mój Prąd: -${formatPLNShort(inv.subsidy_pme)}`);
  if (inv.tax_relief > 0) subsidyLines.push(`Ulga ${inv.thermomodernization_details?.tax_bracket || 12}%: -${formatPLNShort(inv.tax_relief)}`);
  subsidyLines.forEach((line, i) => {
    doc.text(line, dotBoxX + 5, priceY + 28 + i * 4);
  });

  // ── TWOJA CENA — wyróżniony box ──
  const netY = priceY + 38;
  doc.setFillColor(...hexToRgb(NEXBE_PRIMARY));
  doc.roundedRect(20, netY, pageWidth - 40, 18, 3, 3, 'F');

  doc.setFont('Roboto', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(255, 220, 240);
  doc.text('Twoja cena po dotacjach', 30, netY + 7);

  doc.setFont('Roboto', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.text(formatPLN(inv.net_cost), pageWidth - 30, netY + 12, { align: 'right' });

  // ── Rata + ROI minibox ──
  const miniY = netY + 24;
  const miniW = (pageWidth - 50) / 2;

  if (data.calculation.monthly_installment) {
    const lowestRate = data.calculation.monthly_installment[120] || data.calculation.monthly_installment[84] || 0;
    if (lowestRate > 0) {
      doc.setFont('Roboto', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      doc.text(`lub ${Math.round(lowestRate)} zł/mies.`, 25, miniY + 4);

      doc.setFontSize(7);
      doc.setTextColor(140, 140, 140);
      doc.text('raty Inbank · 120 mies.', 25, miniY + 10);
    }
  }

  // ROI
  doc.setFont('Roboto', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...hexToRgb(NEXBE_PURPLE));
  if (data.calculation.roi_years) {
    doc.text(`Zwrot inwestycji`, 20 + miniW + 10, miniY + 4);
    doc.setFontSize(14);
    doc.text(`${data.calculation.roi_years} lat`, 20 + miniW + 10, miniY + 13);
  }

  doc.setFont('Roboto', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...hexToRgb(NEXBE_PRIMARY));
  doc.text('Oszczędności rocznie', pageWidth - 25, miniY + 4, { align: 'right' });
  doc.setFontSize(14);
  doc.text(formatPLNShort(data.calculation.annual_savings), pageWidth - 25, miniY + 13, { align: 'right' });

  // ── Klient + Zestaw (dół strony) ──
  const bottomY = miniY + 24;

  // Przygotowana dla:
  doc.setFont('Roboto', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(140, 140, 140);
  doc.text('Przygotowana dla:', 20, bottomY);

  doc.setFont('Roboto', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...hexToRgb(NEXBE_DARK));
  doc.text(data.clientName || 'Klient indywidualny', 20, bottomY + 7);

  // W cenie zestawu:
  doc.setFont('Roboto', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(140, 140, 140);
  doc.text('W cenie zestawu:', pageWidth / 2 + 5, bottomY);

  doc.setFont('Roboto', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(60, 60, 60);
  const kitItems = [
    `Magazyn ${brand} ${data.product.capacity_kwh} kWh`,
    data.inverter ? `Falownik ${baseBrand(data.inverter.brand)} ${data.inverter.power_kw} kW` : 'Falownik hybrydowy',
    needsEms(data.product.brand) ? 'EMS + Backup / SZR' : 'Backup / SZR',
    'Montaż i uruchomienie',
    'Zgłoszenie OSD',
  ];
  kitItems.forEach((item, i) => {
    doc.text(item, pageWidth / 2 + 5, bottomY + 7 + i * 5);
  });
}

// ────────────────────────────────────────────────────────────
// Strona 2 — Zakres prac
// ────────────────────────────────────────────────────────────

function drawScopePage(doc: jsPDF, data: PdfOfferData): void {
  const pageWidth = doc.internal.pageSize.getWidth();
  const brand = baseBrand(data.product.brand);
  drawHeader(doc);

  let y = 20;

  doc.setFont('Roboto', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(...hexToRgb(NEXBE_PURPLE));
  doc.text('Specyfikacja techniczna', 20, y);
  y += 10;

  // ── Kompaktowa specyfikacja ──
  const specItems = [
    ['Producent / Model', `${brand} ${cleanProductName(data.product)}`],
    ['Pojemność', `${data.product.capacity_kwh} kWh`],
    ['Moc ciągła', `${data.product.power_continuous_kw} kW`],
    ['Technologia', 'LFP (LiFePO4)'],
    ['Typ podłączenia', data.product.type === 'AC' ? 'AC-coupled (retrofit)' : 'DC hybrydowy'],
    ['Zasilanie awaryjne (EPS)', data.product.eps_capable ? 'Tak — automatyczne przełączanie < 20 ms' : 'Pełny SZR 3F — cały dom'],
    ['Żywotność', '> 6 000 cykli (> 15 lat eksploatacji)'],
    ['Głębokość rozładowania (DoD)', '95%'],
    ['Gwarancja producenta', `${data.product.warranty_years} lat`],
    ['Certyfikaty', 'CE, TÜV SÜD, IEC 62619, UN 38.3'],
  ];

  // Compact 2-column spec
  const colW = (pageWidth - 50) / 2;
  specItems.forEach((item, i) => {
    const col = i < 5 ? 0 : 1;
    const row = i < 5 ? i : i - 5;
    const x = 25 + col * (colW + 10);
    const rowY = y + row * 12;

    doc.setFont('Roboto', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(120, 120, 120);
    doc.text(item[0], x, rowY);

    doc.setFont('Roboto', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(40, 40, 40);
    doc.text(item[1], x, rowY + 4.5);
  });

  y += 65;

  // ── Zakres zestawu — tytuł ──
  doc.setFont('Roboto', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(...hexToRgb(NEXBE_PURPLE));
  doc.text('Zakres zestawu', 20, y);
  y += 5;

  doc.setFont('Roboto', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(120, 120, 120);
  doc.text('Kompletny system magazynowania energii z montażem i uruchomieniem', 20, y);
  y += 10;

  // Helper do rysowania sekcji
  const drawSection = (num: string, title: string, subtitle: string, items: string[]) => {
    // Numer sekcji
    doc.setFont('Roboto', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(...hexToRgb(NEXBE_PRIMARY));
    doc.text(num, 22, y + 1);

    // Tytuł + podtytuł
    doc.setFont('Roboto', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(...hexToRgb(NEXBE_DARK));
    doc.text(title, 35, y);

    doc.setFont('Roboto', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(140, 140, 140);
    doc.text(subtitle, 35 + doc.getTextWidth(title) + 3, y);

    y += 7;

    // Pozycje
    items.forEach((item) => {
      doc.setFont('Roboto', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(60, 60, 60);
      doc.text(`•  ${item}`, 38, y);
      y += 6;
    });

    y += 4;
  };

  // 01 — Falownik + Magazyn
  const section1Items = [
    `Magazyn energii ${brand} ${cleanProductName(data.product)} ${data.product.capacity_kwh} kWh · LFP`,
    data.inverter
      ? `Falownik hybrydowy ${data.inverter.name} ${data.inverter.power_kw} kW`
      : 'Falownik hybrydowy dopasowany do magazynu',
    'Okablowanie i zabezpieczenia AC/DC  1 kpl.',
    'Rozdzielnia z zabezpieczeniami  1 kpl.',
  ];
  drawSection('01', 'Falownik + Magazyn Energii', 'Serce systemu', section1Items);

  // 02 — System EMS
  const section2Items = [
    'Inteligentny system zarządzania energią (EMS)  optymalizacja 24/7',
    'Monitoring produkcji PV, zużycia i stanu baterii  w czasie rzeczywistym',
    'Aplikacja mobilna do zdalnego sterowania  iOS / Android',
    'Arbitraż cenowy i optymalizacja net-billingu  max. oszczędności',
  ];
  drawSection('02', 'System EMS', 'Inteligentne zarządzanie', section2Items);

  // 03 — Backup + Montaż
  const section3Items = [
    data.product.eps_capable
      ? 'Zasilanie awaryjne EPS (Emergency Power Supply)  przełączanie < 20 ms'
      : 'Pełny backup trójfazowy (SZR)  automatyczne przełączenie całego domu',
    'Automatyczny przełącznik SZR  1 kpl.',
    'Montaż, uruchomienie i szkolenie użytkownika  certyfikowany instalator',
    'Zgłoszenie przyłączenia do OSD  w imieniu klienta',
  ];
  drawSection('03', 'Rozwiązanie Backupowe + Montaż', 'Bezpieczeństwo i realizacja', section3Items);

  // ── Nota VAT + certyfikaty ──
  doc.setFillColor(...hexToRgb(NEXBE_LIGHT_BG));
  doc.roundedRect(20, y, pageWidth - 40, 20, 2, 2, 'F');
  doc.setFont('Roboto', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(100, 100, 100);
  doc.text('Cena brutto zawiera 8% VAT za usługę montażu (stawka preferencyjna dla budownictwa mieszkaniowego).', 25, y + 7);
  doc.text('Spełnia kryteria programu dofinansowań NFOŚiGW', 25, y + 12);

  // Certyfikaty badge
  doc.setFont('Roboto', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(...hexToRgb(NEXBE_PRIMARY));
  doc.text('Mój Prąd 7.0 · Czyste Powietrze', pageWidth - 25, y + 12, { align: 'right' });
}

// ────────────────────────────────────────────────────────────
// Strona 3 — Specyfikacja techniczna i wycena
// ────────────────────────────────────────────────────────────

function drawPricingPage(doc: jsPDF, data: PdfOfferData): void {
  const pageWidth = doc.internal.pageSize.getWidth();
  const brand = baseBrand(data.product.brand);
  drawHeader(doc);

  let y = 20;

  doc.setFont('Roboto', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(...hexToRgb(NEXBE_PURPLE));
  doc.text('Wycena inwestycji', 20, y);
  y += 5;

  doc.setFont('Roboto', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(120, 120, 120);
  doc.text('Szczegółowy kosztorys z uwzględnieniem dotacji', 20, y);
  y += 10;

  // ── Tabela specyfikacji (kompaktowa) ──
  const specRows: string[][] = [
    ['Producent / Model', `${brand} ${cleanProductName(data.product)}`],
    ['Pojemność', `${data.product.capacity_kwh} kWh`],
    ['Moc ciągła', `${data.product.power_continuous_kw} kW`],
    ['Technologia', 'LFP (LiFePO4)'],
    ['Typ podłączenia', data.product.type === 'AC' ? 'AC-coupled (retrofit)' : 'DC hybrydowy'],
    ['Gwarancja', `${data.product.warranty_years} lat`],
    ['EPS backup', data.product.eps_capable ? 'Tak (< 20 ms)' : 'Pełny SZR 3F'],
    ['Certyfikaty', 'CE, TÜV, IEC 62619'],
  ];

  if (data.inverter) {
    specRows.push(['Falownik', `${data.inverter.name} ${data.inverter.power_kw} kW`]);
  }

  if (needsEms(data.product.brand)) {
    specRows.push(['System EMS', 'Tak — zewnętrzny moduł']);
  }

  autoTable(doc, {
    startY: y,
    body: specRows,
    theme: 'striped',
    styles: {
      font: 'Roboto',
      fontSize: 8,
      cellPadding: 3,
    },
    columnStyles: {
      0: { cellWidth: 50, fontStyle: 'bold' },
      1: { cellWidth: 120 },
    },
    margin: { left: 20, right: 20 },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  y = (doc as any).lastAutoTable.finalY + 12;

  // ── Wycena ──
  const inv = data.calculation.investment;

  const priceRows: string[][] = [
    ['Pozycja', 'Kwota brutto'],
    ['Magazyn energii — kompletny zestaw z montażem', formatPLN(inv.total_gross)],
  ];

  priceRows.push(['', '']);

  // Dofinansowanie header
  priceRows.push(['Dofinansowanie', '']);

  if (inv.subsidy_pme > 0) {
    priceRows.push([' Mój Prąd 7.0', `- ${formatPLN(inv.subsidy_pme)}`]);
  }

  if (inv.tax_relief > 0) {
    const bracket = inv.thermomodernization_details?.tax_bracket || 12;
    priceRows.push([` Ulga termomodernizacyjna (${bracket}%)`, `- ${formatPLN(inv.tax_relief)}`]);
  }

  priceRows.push(['', '']);
  priceRows.push(['TWÓJ KOSZT PO DOTACJACH:', formatPLN(inv.net_cost)]);

  autoTable(doc, {
    startY: y,
    body: priceRows,
    theme: 'plain',
    styles: {
      font: 'Roboto',
      fontSize: 9,
      cellPadding: 3,
    },
    columnStyles: {
      0: { cellWidth: 100 },
      1: { cellWidth: 70, halign: 'right' },
    },
    didParseCell: (hookData) => {
      const text = hookData.cell.raw as string;
      // Header — Pozycja / Kwota brutto
      if (text === 'Pozycja' || text === 'Kwota brutto') {
        hookData.cell.styles.fontStyle = 'bold';
        hookData.cell.styles.fillColor = hexToRgb(NEXBE_PURPLE);
        hookData.cell.styles.textColor = [255, 255, 255];
        hookData.cell.styles.fontSize = 9;
      }
      // Dofinansowanie header
      if (text === 'Dofinansowanie') {
        hookData.cell.styles.fontStyle = 'bold';
        hookData.cell.styles.fontSize = 10;
        hookData.cell.styles.textColor = hexToRgb(NEXBE_PURPLE);
      }
      if (text === 'TWÓJ KOSZT PO DOTACJACH:') {
        hookData.cell.styles.fontStyle = 'bold';
        hookData.cell.styles.fontSize = 11;
        hookData.cell.styles.textColor = hexToRgb(NEXBE_PRIMARY);
      }
      // Wartości — bold dla total
      if (hookData.column.index === 1) {
        const rowData = hookData.row.raw as string[];
        if (rowData && rowData[0] === 'TWÓJ KOSZT PO DOTACJACH:') {
          hookData.cell.styles.fontStyle = 'bold';
          hookData.cell.styles.fontSize = 11;
          hookData.cell.styles.textColor = hexToRgb(NEXBE_PRIMARY);
        }
      }
      // Dotacje — zielony
      if (typeof text === 'string' && text.startsWith('- ')) {
        hookData.cell.styles.textColor = [34, 139, 34];
      }
      // Dotacja opisy — mniejsze, z checkiem
      if (typeof text === 'string' && text.startsWith(' ')) {
        hookData.cell.styles.textColor = [34, 139, 34];
      }
    },
    margin: { left: 20, right: 20 },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  y = (doc as any).lastAutoTable.finalY + 4;

  doc.setFont('Roboto', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(130, 130, 130);
  doc.text('Cena brutto zawiera 8% VAT za usługę montażu (stawka preferencyjna dla budownictwa mieszkaniowego).', 20, y);
  y += 10;

  // ── Finansowanie ratalne — kompaktowe karty ──
  if (data.calculation.monthly_installment) {
    doc.setFont('Roboto', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...hexToRgb(NEXBE_PURPLE));
    doc.text('Finansowanie ratalne', 20, y);
    y += 5;

    doc.setFont('Roboto', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text('Inbank — oprocentowanie 8,99%, RRSO 11,09%', 20, y);
    y += 8;

    const periods = [36, 60, 84, 120];
    const validPeriods = periods.filter((p) => data.calculation.monthly_installment[p]);
    const cardWidth = (pageWidth - 40 - (validPeriods.length - 1) * 5) / validPeriods.length;

    validPeriods.forEach((p, i) => {
      const x = 20 + i * (cardWidth + 5);
      const isLowest = i === validPeriods.length - 1;

      doc.setFillColor(isLowest ? 240 : 248, isLowest ? 248 : 244, isLowest ? 255 : 252);
      doc.roundedRect(x, y, cardWidth, 28, 2, 2, 'F');
      doc.setDrawColor(...hexToRgb(isLowest ? NEXBE_PRIMARY : NEXBE_BORDER));
      doc.setLineWidth(isLowest ? 0.6 : 0.3);
      doc.roundedRect(x, y, cardWidth, 28, 2, 2, 'S');

      doc.setFont('Roboto', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(100, 100, 100);
      doc.text(`${p} mies. (${Math.round(p / 12)} lat)`, x + cardWidth / 2, y + 8, { align: 'center' });

      doc.setFont('Roboto', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(...hexToRgb(isLowest ? NEXBE_PRIMARY : NEXBE_DARK));
      doc.text(`${Math.round(data.calculation.monthly_installment[p])} zł`, x + cardWidth / 2, y + 18, { align: 'center' });

      doc.setFont('Roboto', 'normal');
      doc.setFontSize(6);
      doc.setTextColor(130, 130, 130);
      doc.text('/mies.', x + cardWidth / 2, y + 23, { align: 'center' });

      if (isLowest) {
        doc.setFontSize(6);
        doc.setTextColor(...hexToRgb(NEXBE_PRIMARY));
        doc.text('NAJNIŻSZA RATA', x + cardWidth / 2, y + 32, { align: 'center' });
      }
    });

    y += 38;

    doc.setFont('Roboto', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(140, 140, 140);
    doc.text(
      'Opłata 10 zł/mies. wliczona w ratę. Kalkulacja na podstawie kosztu po dotacjach. Decyzja kredytowa w 15 min.',
      20, y
    );

  }
}

// ────────────────────────────────────────────────────────────
// Strona 4 — Analiza opłacalności (ROI)
// ────────────────────────────────────────────────────────────

function drawROIPage(doc: jsPDF, data: PdfOfferData): void {
  drawHeader(doc);

  let y = 20;

  doc.setFont('Roboto', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(...hexToRgb(NEXBE_PURPLE));
  doc.text('Analiza opłacalności', 20, y);
  y += 8;

  doc.setFont('Roboto', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(120, 120, 120);
  doc.text(`Projekcja oszczędności na ${data.calculation.horizon_years} lat`, 20, y);
  y += 12;

  // ── Kluczowe wskaźniki ──
  const metrics = [
    { label: 'Roczna oszczędność', value: formatPLNShort(data.calculation.annual_savings) },
    { label: 'Zwrot inwestycji', value: data.calculation.roi_years ? `${data.calculation.roi_years} lat` : 'Ponad 15 lat' },
    { label: 'Łączne oszczędności', value: formatPLNShort(data.calculation.total_savings) },
  ];

  const boxWidth = 50;
  const startX = 20;
  metrics.forEach((m, i) => {
    const x = startX + i * (boxWidth + 10);
    doc.setFillColor(...hexToRgb(NEXBE_LIGHT_BG));
    doc.roundedRect(x, y, boxWidth, 22, 3, 3, 'F');

    doc.setFont('Roboto', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(m.label, x + boxWidth / 2, y + 8, { align: 'center' });

    doc.setFont('Roboto', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(...hexToRgb(NEXBE_PRIMARY));
    doc.text(m.value, x + boxWidth / 2, y + 18, { align: 'center' });
  });

  y += 30;

  // ── Tabela projekcji ──
  const projection = data.calculation.projection;
  if (projection && projection.length > 0) {
    const projRows: string[][] = projection.map((row) => [
      `Rok ${row.year}`,
      `${Math.round(row.production).toLocaleString('pl-PL')} kWh`,
      `${Math.round(row.selfConsumption).toLocaleString('pl-PL')} kWh`,
      formatPLNShort(row.savings),
      formatPLNShort(row.cumulative),
    ]);

    autoTable(doc, {
      startY: y,
      head: [['Rok', 'Produkcja PV', 'Autokonsumpcja', 'Oszczędność', 'Kumulatywnie']],
      body: projRows,
      theme: 'striped',
      styles: {
        font: 'Roboto',
        fontSize: 8,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: hexToRgb(NEXBE_PURPLE),
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 8,
      },
      columnStyles: {
        0: { cellWidth: 25 },
        1: { cellWidth: 35, halign: 'right' },
        2: { cellWidth: 35, halign: 'right' },
        3: { cellWidth: 35, halign: 'right' },
        4: { cellWidth: 35, halign: 'right', fontStyle: 'bold' },
      },
      didParseCell: (hookData) => {
        // Podświetl rok ROI
        if (
          data.calculation.roi_years &&
          hookData.section === 'body' &&
          hookData.row.index === data.calculation.roi_years - 1
        ) {
          hookData.cell.styles.fillColor = [240, 255, 240];
        }
        // Negatywne kumulatywnie — czerwone
        if (hookData.column.index === 4 && hookData.section === 'body') {
          const val = hookData.cell.raw as string;
          if (val && val.includes('-')) {
            hookData.cell.styles.textColor = [180, 60, 60];
          } else {
            hookData.cell.styles.textColor = [34, 139, 34];
          }
        }
      },
      margin: { left: 20, right: 20 },
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    y = (doc as any).lastAutoTable.finalY + 8;
  }

  doc.setFont('Roboto', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(140, 140, 140);
  doc.text(
    'Uwzględniono: degradację PV (1%/rok), degradację baterii (2,5%/rok), wzrost cen energii (5%/rok).',
    20,
    y
  );
}

// ────────────────────────────────────────────────────────────
// Strona 5 — Warunki realizacji i kolejne kroki
// ────────────────────────────────────────────────────────────

function drawConditionsPage(doc: jsPDF, data: PdfOfferData): void {
  const pageWidth = doc.internal.pageSize.getWidth();
  drawHeader(doc);

  let y = 20;

  // ══════════════════════════════════════════════════════════
  // Motywujący banner na górze
  // ══════════════════════════════════════════════════════════
  doc.setFillColor(...hexToRgb(NEXBE_DARK));
  doc.roundedRect(20, y, pageWidth - 40, 30, 4, 4, 'F');

  doc.setFont('Roboto', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text('To dobra decyzja.', pageWidth / 2, y + 12, { align: 'center' });

  doc.setFont('Roboto', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(200, 200, 220);
  const roiMsg = data.calculation.roi_years
    ? `Inwestycja zwróci się w ${data.calculation.roi_years} lat, a przez ${data.calculation.horizon_years} lat zaoszczędzisz ${formatPLNShort(data.calculation.total_savings)}.`
    : `Przez ${data.calculation.horizon_years} lat zaoszczędzisz ${formatPLNShort(data.calculation.total_savings)}.`;
  doc.text(roiMsg, pageWidth / 2, y + 22, { align: 'center' });

  y += 38;

  // ══════════════════════════════════════════════════════════
  // Dlaczego NEXBE?
  // ══════════════════════════════════════════════════════════
  doc.setFont('Roboto', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(...hexToRgb(NEXBE_PURPLE));
  doc.text('Dlaczego Nexbe?', 20, y);
  y += 10;

  const nexbePoints = [
    {
      title: 'Dobór AI — najlepsza konfiguracja dla Ciebie',
      desc: 'Nasz konfigurator AI analizuje Twoje zużycie, taryfę, PV i profil, dobierając optymalny magazyn i falownik spośród 6 producentów premium.',
    },
    {
      title: 'Gwarancja zwrotu z inwestycji',
      desc: 'Kalkulacja oparta na rzeczywistych cenach energii i Twoim profilu zużycia. Jeśli oszczędności nie pokryją inwestycji w deklarowanym czasie — zwrócimy różnicę.',
    },
    {
      title: 'Kompleksowa obsługa od A do Z',
      desc: 'Jeden dostawca na wszystko: dobór, montaż, uruchomienie, zgłoszenie OSD, wniosek o dotację. Bez stresu, bez szukania podwykonawców.',
    },
    {
      title: 'Tylko marki premium z pełnym wsparciem',
      desc: 'Huawei, Sigenergy, FoxESS, GoodWe, BYD, Dyness — certyfikowane urządzenia z gwarancją producenta i serwisem pogwarancyjnym Nexbe.',
    },
  ];

  nexbePoints.forEach((pt) => {
    doc.setFillColor(...hexToRgb(NEXBE_PRIMARY));
    doc.circle(25, y - 1, 1.5, 'F');

    doc.setFont('Roboto', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...hexToRgb(NEXBE_DARK));
    doc.text(pt.title, 32, y);

    doc.setFont('Roboto', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(80, 80, 80);
    // Wrap text to max width
    const lines = doc.splitTextToSize(pt.desc, pageWidth - 55);
    doc.text(lines, 32, y + 5);
    y += 5 + lines.length * 4 + 4;
  });

  y += 5;

  // ══════════════════════════════════════════════════════════
  // Warunki i gwarancje (kompaktowe)
  // ══════════════════════════════════════════════════════════
  doc.setFont('Roboto', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(...hexToRgb(NEXBE_PURPLE));
  doc.text('Warunki i gwarancje', 20, y);
  y += 8;

  const conditions = [
    `${data.product.warranty_years} lat gwarancji producenta na magazyn energii`,
    '24 miesiące gwarancji na prace montażowe (Nexbe)',
    `Oferta ważna 14 dni (do ${getExpiryDate()})`,
    'Realizacja: do 4 tygodni od podpisania umowy',
    'Serwis gwarancyjny i pogwarancyjny w cenie',
  ];

  doc.setFont('Roboto', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(60, 60, 60);
  conditions.forEach((c) => {
    doc.text(`•  ${c}`, 25, y);
    y += 6;
  });

  y += 8;

  // ══════════════════════════════════════════════════════════
  // Kolejne kroki — rozbudowane
  // ══════════════════════════════════════════════════════════
  doc.setFont('Roboto', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(...hexToRgb(NEXBE_PURPLE));
  doc.text('Kolejne kroki', 20, y);
  y += 3;
  doc.setFont('Roboto', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  doc.text('Od akceptacji oferty do niezależności energetycznej — 5 prostych kroków', 20, y);
  y += 8;

  const steps = [
    {
      num: '1', title: 'Bezpłatny audyt techniczny',
      desc: 'Certyfikowany technik Nexbe przyjedzie do Ciebie i oceni warunki instalacji — bez kosztów i zobowiązań.',
    },
    {
      num: '2', title: 'Finalna wycena i umowa',
      desc: 'Potwierdzamy zakres i podpisujemy umowę. Decyzja o finansowaniu ratalnym online w 15 minut.',
    },
    {
      num: '3', title: 'Profesjonalny montaż',
      desc: 'Montaż przez certyfikowaną ekipę Nexbe w 1–2 dni roboczych. Pełne szkolenie z obsługi i aplikacji mobilnej.',
    },
    {
      num: '4', title: 'Zgłoszenie do OSD i formalności',
      desc: 'Zajmujemy się całą dokumentacją — zgłoszenie do operatora sieci, protokoły, niezbędne pozwolenia.',
    },
    {
      num: '5', title: 'Wniosek o dotację Mój Prąd 7.0',
      desc: 'Pomagamy przygotować i złożyć wniosek o dofinansowanie. Maksymalizujemy Twoje korzyści finansowe.',
    },
  ];

  steps.forEach((step) => {
    doc.setFillColor(...hexToRgb(NEXBE_PRIMARY));
    doc.circle(26, y - 1.2, 3.5, 'F');
    doc.setFont('Roboto', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.text(step.num, 26, y, { align: 'center' });

    doc.setFont('Roboto', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...hexToRgb(NEXBE_DARK));
    doc.text(step.title, 35, y);

    doc.setFont('Roboto', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 100, 100);
    const descLines = doc.splitTextToSize(step.desc, pageWidth - 60);
    doc.text(descLines, 35, y + 5);
    y += 5 + descLines.length * 3.5 + 4;
  });

  y += 5;

  // ══════════════════════════════════════════════════════════
  // CTA
  // ══════════════════════════════════════════════════════════
  doc.setFillColor(...hexToRgb(NEXBE_PRIMARY));
  doc.roundedRect(20, y, pageWidth - 40, 22, 4, 4, 'F');

  doc.setFont('Roboto', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(255, 255, 255);
  doc.text('Gotowy? Umów bezpłatny audyt — to Cię do niczego nie zobowiązuje.', pageWidth / 2, y + 9, { align: 'center' });

  doc.setFont('Roboto', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(255, 220, 240);
  doc.text('kontakt@nexbe.pl  ·  732 080 101  ·  nexbe.pl', pageWidth / 2, y + 17, { align: 'center' });

}

// ────────────────────────────────────────────────────────────
// Główna funkcja eksportująca
// ────────────────────────────────────────────────────────────

export async function generateOfferPdf(data: PdfOfferData): Promise<jsPDF> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  setupFonts(doc);

  // Załaduj zdjęcie produktu (async)
  const productImageDataUrl = data.product.image
    ? await loadImageAsDataUrl(data.product.image)
    : null;

  // Strona 1 — Okładka
  drawCoverPage(doc, data, productImageDataUrl);

  // Strona 2 — Zakres prac
  doc.addPage();
  drawScopePage(doc, data);

  // Strona 3 — Wycena
  doc.addPage();
  drawPricingPage(doc, data);

  // Strona 4 — Analiza opłacalności
  doc.addPage();
  drawROIPage(doc, data);

  // Strona 5 — Warunki i kolejne kroki
  doc.addPage();
  drawConditionsPage(doc, data);

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
export async function generateOfferPdfBlob(data: PdfOfferData): Promise<Blob> {
  const doc = await generateOfferPdf(data);
  return doc.output('blob');
}

/**
 * Generuje PDF i zwraca jako ArrayBuffer (do wysyłki API)
 */
export async function generateOfferPdfBuffer(data: PdfOfferData): Promise<ArrayBuffer> {
  const doc = await generateOfferPdf(data);
  return doc.output('arraybuffer');
}
