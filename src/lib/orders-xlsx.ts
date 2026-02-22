import * as XLSX from 'xlsx';
import path from 'path';
import fs from 'fs';

const isVercel = process.env.VERCEL === '1';
const ORDERS_DIR = isVercel ? '/tmp' : path.join(process.cwd(), 'data');
const ORDERS_FILE = path.join(ORDERS_DIR, 'NEXBE_Zamowienia.xlsx');

const HEADERS = [
  'Timestamp',
  'Order ID',
  'Nr zamowienia',
  'Status',
  'Imie',
  'Nazwisko',
  'E-mail',
  'Telefon',
  'Ulica',
  'Kod pocztowy',
  'Miasto',
  'Wojewodztwo',
  'NIP',
  'Metoda platnosci',
  'Produkt',
  'Marka',
  'Pojemnosc [kWh]',
  'Moc [kW]',
  'Cena brutto',
  'Montaz brutto',
  'Razem brutto',
  'Dotacja Moj Prad',
  'Ulga termo',
  'Po dotacjach',
  'Zaliczka 30%',
  'Reszta przy montazu',
  'Oszczednosc roczna',
  'ROI [lat]',
  'Oszczednosc 20 lat',
  'Typ instalacji',
  'Moc PV [kWp]',
  'Zuzycie roczne [kWh]',
  'Zgoda marketing',
];

export interface OrderRow {
  timestamp: string;
  orderId: string;
  orderNumber: string;
  status: string;
  imie: string;
  nazwisko: string;
  email: string;
  telefon: string;
  ulica: string;
  kod: string;
  miasto: string;
  wojewodztwo: string;
  nip: string;
  paymentMethod: string;
  productName: string;
  productBrand: string;
  capacityKwh: number;
  powerKw: number;
  priceGross: number;
  installationGross: number;
  totalGross: number;
  subsidyMojPrad: number;
  taxRelief: number;
  afterSubsidies: number;
  deposit30: number;
  remainingAtInstall: number;
  annualSavings: number;
  roiYears: number | null;
  savings20y: number;
  installationType: string;
  pvPowerKwp: number;
  annualConsumptionKwh: number;
  marketingConsent: boolean;
}

function ensureDirectory(): void {
  try {
    if (!fs.existsSync(ORDERS_DIR)) {
      fs.mkdirSync(ORDERS_DIR, { recursive: true });
    }
  } catch {
    // /tmp already exists on serverless
  }
}

function getOrCreateWorkbook(): XLSX.WorkBook {
  ensureDirectory();

  if (fs.existsSync(ORDERS_FILE)) {
    const fileBuffer = fs.readFileSync(ORDERS_FILE);
    return XLSX.read(fileBuffer, { type: 'buffer' });
  }

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet([HEADERS]);
  ws['!cols'] = HEADERS.map((h) => ({
    wch: Math.max(h.length + 2, 14),
  }));
  XLSX.utils.book_append_sheet(wb, ws, 'Zamowienia');
  return wb;
}

function orderToRow(order: OrderRow): (string | number)[] {
  return [
    order.timestamp,
    order.orderId,
    order.orderNumber,
    order.status,
    order.imie,
    order.nazwisko,
    order.email,
    order.telefon,
    order.ulica,
    order.kod,
    order.miasto,
    order.wojewodztwo,
    order.nip || '',
    order.paymentMethod || '',
    order.productName,
    order.productBrand,
    order.capacityKwh,
    order.powerKw,
    order.priceGross,
    order.installationGross,
    order.totalGross,
    order.subsidyMojPrad,
    order.taxRelief,
    order.afterSubsidies,
    order.deposit30,
    order.remainingAtInstall,
    order.annualSavings,
    order.roiYears ?? '-',
    order.savings20y,
    order.installationType,
    order.pvPowerKwp,
    order.annualConsumptionKwh,
    order.marketingConsent ? 'tak' : 'nie',
  ];
}

export function saveOrder(order: OrderRow): { success: boolean; filePath: string } {
  const wb = getOrCreateWorkbook();
  const ws = wb.Sheets['Zamowienia'];

  if (!ws) {
    throw new Error('Brak arkusza "Zamowienia" w pliku');
  }

  const existingData = XLSX.utils.sheet_to_json<(string | number)[]>(ws, {
    header: 1,
  });

  existingData.push(orderToRow(order));

  const newWs = XLSX.utils.aoa_to_sheet(existingData);
  newWs['!cols'] = HEADERS.map((h) => ({
    wch: Math.max(h.length + 2, 14),
  }));

  wb.Sheets['Zamowienia'] = newWs;

  ensureDirectory();
  XLSX.writeFile(wb, ORDERS_FILE);

  return { success: true, filePath: ORDERS_FILE };
}
