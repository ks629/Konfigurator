import * as XLSX from 'xlsx';
import path from 'path';
import fs from 'fs';

// Na Vercel serverless jedynym zapisywalnym katalogiem jest /tmp
// Lokalnie uzywamy ./data
const isVercel = process.env.VERCEL === '1';
const LEADS_DIR = isVercel ? '/tmp' : path.join(process.cwd(), 'data');
const LEADS_FILE = path.join(LEADS_DIR, 'NEXBE_Leads.xlsx');

// Kolumny arkusza zgodne ze specyfikacja
const HEADERS = [
  'Timestamp',
  'Lead ID',
  'Imie',
  'Nazwisko',
  'E-mail',
  'Telefon',
  'Kod pocztowy',
  'Typ instalacji',
  'Moc PV [kWp]',
  'Marka falownika',
  'Model falownika',
  'Rok instalacji PV',
  'Zuzycie roczne [kWh]',
  'System rozliczen',
  'Pompa ciepla',
  'Auto elektryczne',
  'Backup',
  'Rekomendowany magazyn',
  'Pojemnosc [kWh]',
  'Cena brutto',
  'Cena po dotacjach',
  'ROI [lat]',
  'Oszczednosc roczna',
  'Oszczednosc 20 lat',
  'PDF pobrany',
  'Audyt umowiony',
  'Data audytu',
  'UTM Source',
  'UTM Medium',
  'UTM Campaign',
  'User Agent',
  'Status',
];

export interface LeadRow {
  timestamp: string;
  leadId: string;
  name: string;
  email: string;
  phone: string;
  postalCode: string;
  installationType: string;
  pvPowerKwp: number;
  inverterBrand: string;
  inverterModel: string;
  installationYear: number;
  annualConsumptionKwh: number;
  billingSystem: string;
  hasHeatPump: boolean;
  hasEV: boolean;
  backupPreference: string;
  productName: string;
  capacityKwh: number;
  priceGross: number;
  priceAfterSubsidies: number;
  roiYears: number | null;
  annualSavings: number;
  totalSavings20y: number;
  pdfDownloaded: boolean;
  auditBooked: boolean;
  auditDate: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  userAgent: string;
  status: string;
}

function ensureDirectory(): void {
  try {
    if (!fs.existsSync(LEADS_DIR)) {
      fs.mkdirSync(LEADS_DIR, { recursive: true });
    }
  } catch {
    // Na serverless /tmp juz istnieje
  }
}

function getOrCreateWorkbook(): XLSX.WorkBook {
  ensureDirectory();

  if (fs.existsSync(LEADS_FILE)) {
    const fileBuffer = fs.readFileSync(LEADS_FILE);
    return XLSX.read(fileBuffer, { type: 'buffer' });
  }

  // Nowy workbook z naglowkami
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet([HEADERS]);

  ws['!cols'] = HEADERS.map((h) => ({
    wch: Math.max(h.length + 2, 14),
  }));

  XLSX.utils.book_append_sheet(wb, ws, 'Leady');
  return wb;
}

function leadToRow(lead: LeadRow): (string | number)[] {
  const [firstName, ...lastNameParts] = lead.name.split(' ');
  const lastName = lastNameParts.join(' ');

  return [
    lead.timestamp,
    lead.leadId,
    firstName || '',
    lastName || '',
    lead.email,
    lead.phone,
    lead.postalCode || '',
    lead.installationType || '',
    lead.pvPowerKwp || 0,
    lead.inverterBrand || '',
    lead.inverterModel || '',
    lead.installationYear || 0,
    lead.annualConsumptionKwh || 0,
    lead.billingSystem || '',
    lead.hasHeatPump ? 'tak' : 'nie',
    lead.hasEV ? 'tak' : 'nie',
    lead.backupPreference || 'nie',
    lead.productName || '',
    lead.capacityKwh || 0,
    lead.priceGross || 0,
    lead.priceAfterSubsidies || 0,
    lead.roiYears ?? '-',
    lead.annualSavings || 0,
    lead.totalSavings20y || 0,
    lead.pdfDownloaded ? 'tak' : 'nie',
    lead.auditBooked ? 'tak' : 'nie',
    lead.auditDate || '',
    lead.utmSource || '',
    lead.utmMedium || '',
    lead.utmCampaign || '',
    lead.userAgent || '',
    lead.status || 'nowy',
  ];
}

/**
 * Zapisuje leada do pliku XLSX.
 * Jesli plik nie istnieje - tworzy go z naglowkami.
 * Jesli istnieje - dodaje nowy wiersz.
 *
 * UWAGA: Na Vercel serverless plik jest w /tmp i moze byc
 * usuniety miedzy wywolaniami. Dla trwalego przechowywania
 * nalezy dodac integracje z zewnetrzna baza (Google Sheets, DB).
 */
export function saveLead(lead: LeadRow): { success: boolean; filePath: string } {
  try {
    const wb = getOrCreateWorkbook();
    const ws = wb.Sheets['Leady'];

    if (!ws) {
      throw new Error('Brak arkusza "Leady" w pliku');
    }

    const existingData = XLSX.utils.sheet_to_json<(string | number)[]>(ws, {
      header: 1,
    });

    const newRow = leadToRow(lead);
    existingData.push(newRow);

    const newWs = XLSX.utils.aoa_to_sheet(existingData);
    newWs['!cols'] = HEADERS.map((h) => ({
      wch: Math.max(h.length + 2, 14),
    }));

    wb.Sheets['Leady'] = newWs;

    ensureDirectory();
    XLSX.writeFile(wb, LEADS_FILE);

    return { success: true, filePath: LEADS_FILE };
  } catch (error) {
    console.error('Blad zapisu leada do XLSX:', error);
    throw error;
  }
}

/**
 * Zwraca XLSX jako Buffer z pojedynczym leadem (do natychmiastowego pobrania).
 * Nie wymaga persystentnego storage.
 */
export function leadToXlsxBuffer(lead: LeadRow): Uint8Array {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet([HEADERS, leadToRow(lead)]);
  ws['!cols'] = HEADERS.map((h) => ({ wch: Math.max(h.length + 2, 14) }));
  XLSX.utils.book_append_sheet(wb, ws, 'Leady');
  return XLSX.write(wb, { type: 'array', bookType: 'xlsx' }) as Uint8Array;
}

/**
 * Odczytuje wszystkie leady z pliku XLSX.
 */
export function readLeads(): LeadRow[] {
  if (!fs.existsSync(LEADS_FILE)) {
    return [];
  }

  const fileBuffer = fs.readFileSync(LEADS_FILE);
  const wb = XLSX.read(fileBuffer, { type: 'buffer' });
  const ws = wb.Sheets['Leady'];

  if (!ws) return [];

  const rows = XLSX.utils.sheet_to_json<Record<string, string | number>>(ws);

  return rows.map((row) => ({
    timestamp: String(row['Timestamp'] || ''),
    leadId: String(row['Lead ID'] || ''),
    name: `${row['Imie'] || ''} ${row['Nazwisko'] || ''}`.trim(),
    email: String(row['E-mail'] || ''),
    phone: String(row['Telefon'] || ''),
    postalCode: String(row['Kod pocztowy'] || ''),
    installationType: String(row['Typ instalacji'] || ''),
    pvPowerKwp: Number(row['Moc PV [kWp]']) || 0,
    inverterBrand: String(row['Marka falownika'] || ''),
    inverterModel: String(row['Model falownika'] || ''),
    installationYear: Number(row['Rok instalacji PV']) || 0,
    annualConsumptionKwh: Number(row['Zuzycie roczne [kWh]']) || 0,
    billingSystem: String(row['System rozliczen'] || ''),
    hasHeatPump: row['Pompa ciepla'] === 'tak',
    hasEV: row['Auto elektryczne'] === 'tak',
    backupPreference: String(row['Backup'] || 'nie'),
    productName: String(row['Rekomendowany magazyn'] || ''),
    capacityKwh: Number(row['Pojemnosc [kWh]']) || 0,
    priceGross: Number(row['Cena brutto']) || 0,
    priceAfterSubsidies: Number(row['Cena po dotacjach']) || 0,
    roiYears: row['ROI [lat]'] === '-' ? null : Number(row['ROI [lat]']) || null,
    annualSavings: Number(row['Oszczednosc roczna']) || 0,
    totalSavings20y: Number(row['Oszczednosc 20 lat']) || 0,
    pdfDownloaded: row['PDF pobrany'] === 'tak',
    auditBooked: row['Audyt umowiony'] === 'tak',
    auditDate: String(row['Data audytu'] || ''),
    utmSource: String(row['UTM Source'] || ''),
    utmMedium: String(row['UTM Medium'] || ''),
    utmCampaign: String(row['UTM Campaign'] || ''),
    userAgent: String(row['User Agent'] || ''),
    status: String(row['Status'] || 'nowy'),
  }));
}

/**
 * Zwraca plik XLSX jako Buffer (do pobrania).
 */
export function getLeadsFileBuffer(): Buffer | null {
  if (!fs.existsSync(LEADS_FILE)) {
    return null;
  }
  return fs.readFileSync(LEADS_FILE);
}

/**
 * Zwraca sciezke do pliku XLSX.
 */
export function getLeadsFilePath(): string {
  return LEADS_FILE;
}
