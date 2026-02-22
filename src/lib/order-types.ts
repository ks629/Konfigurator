import { z } from 'zod';
import type {
  InstallationType,
  Tariff,
  BillingSystem,
  BackupVariant,
  Priority,
  UserProfile,
  EnergyOperator,
  PVOrientation,
  TaxBracket,
  Product,
  Inverter,
  CalculationResult,
  ConfiguratorState,
} from './types';

// ───────────────────────── Order Status ─────────────────────────

export type OrderStatus =
  | 'konfiguracja'
  | 'podsumowanie'
  | 'dane_klienta'
  | 'oczekuje_platnosci'
  | 'oczekuje_decyzji_rat'
  | 'oplacone'
  | 'raty_zaakceptowane'
  | 'umowa_wyslana'
  | 'umowa_podpisana'
  | 'termin_wybrany'
  | 'w_realizacji'
  | 'zrealizowane'
  | 'anulowane';

// ───────────────────────── Order Interface ─────────────────────────

export interface OrderKonfiguracja {
  typ_instalacji: InstallationType;
  moc_pv_kwp: number;
  falownik_marka: string;
  rok_pv: number;
  zuzycie_roczne_kwh: number;
  taryfa: Tariff;
  rozliczenie: BillingSystem;
  pompa_ciepla: boolean;
  auto_ev: boolean;
  backup_variant: BackupVariant;
  priorytety: Priority[];
  user_profile: UserProfile;
  energy_operator: EnergyOperator;
  pv_orientation: PVOrientation;
  tax_bracket: TaxBracket;
}

export interface OrderProdukt {
  id: string;
  nazwa: string;
  marka: string;
  pojemnosc_kwh: number;
  moc_kw: number;
  cena_brutto: number;
  montaz_brutto: number;
  gwarancja_lat: number;
  zdjecie: string;
  falownik_id?: string;
  falownik_nazwa?: string;
}

export interface OrderFinanse {
  razem_brutto: number;
  dotacja_moj_prad: number;
  ulga_termo: number;
  po_dotacjach: number;
  zaliczka_30: number;
  reszta_przy_montazu: number;
  roczna_oszczednosc: number;
  lat_zwrotu: number | null;
  oszczednosc_20_lat: number;
}

export interface OrderKlient {
  imie: string;
  nazwisko: string;
  email: string;
  telefon: string;
  adres: {
    ulica: string;
    kod: string;
    miasto: string;
    wojewodztwo: string;
  };
  nip?: string;
  zgody: {
    rodo: boolean;
    regulamin: boolean;
    marketing: boolean;
  };
}

export interface OrderPlatnosc {
  metoda: 'zaliczka_p24' | 'raty' | null;
  p24_session_id?: string;
  p24_status?: string;
  raty_status?: string;
}

export interface OrderUmowa {
  pdf_url?: string;
  autenti_document_id?: string;
  status: 'brak' | 'wygenerowana' | 'wyslana' | 'podpisana';
  podpisana_at?: string;
}

export interface OrderMontaz {
  termin_od?: string;
  termin_do?: string;
  calendar_event_id?: string;
}

export interface Order {
  id: string;
  numer: string;
  status: OrderStatus;
  created_at: string;
  updated_at: string;
  konfiguracja: OrderKonfiguracja;
  produkt: OrderProdukt;
  finanse: OrderFinanse;
  klient: OrderKlient | null;
  platnosc: OrderPlatnosc;
  umowa: OrderUmowa;
  montaz: OrderMontaz;
}

// ───────────────────────── Zod Schemas ─────────────────────────

export const customerSchema = z.object({
  imie: z.string().min(2, 'Imie jest wymagane'),
  nazwisko: z.string().min(2, 'Nazwisko jest wymagane'),
  email: z.string().email('Podaj prawidlowy e-mail'),
  telefon: z.string().transform((v) => v.replace(/\s/g, '')).pipe(z.string().regex(/^\+?48?\d{9}$/, 'Podaj prawidlowy numer telefonu')),
  ulica: z.string().min(3, 'Ulica jest wymagana'),
  kod: z.string().regex(/^\d{2}-\d{3}$/, 'Format: XX-XXX'),
  miasto: z.string().min(2, 'Miasto jest wymagane'),
  wojewodztwo: z.string().min(1, 'Wybierz wojewodztwo'),
  nip: z.string().optional(),
  zgoda_rodo: z.literal(true, { errorMap: () => ({ message: 'Zgoda RODO jest wymagana' }) }),
  zgoda_regulamin: z.literal(true, { errorMap: () => ({ message: 'Akceptacja regulaminu jest wymagana' }) }),
  zgoda_marketing: z.boolean().optional(),
});

export type CustomerFormData = z.infer<typeof customerSchema>;

// ───────────────────────── Helpers ─────────────────────────

function generateOrderId(): string {
  return `ord_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function generateOrderNumber(): string {
  const now = new Date();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const seq = String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0');
  return `NEXBE/${now.getFullYear()}/${mm}/${seq}`;
}

export interface CreateOrderInput {
  config: ConfiguratorState;
  product: Product;
  inverter: Inverter | null;
  calculation: CalculationResult;
}

export function createOrder(input: CreateOrderInput): Order {
  const { config, product, inverter, calculation } = input;
  const now = new Date().toISOString();

  const backupPrice = config.backupVariant === 'B'
    ? product.price_gross_b
    : product.price_gross;

  const dotacja_moj_prad = calculation.investment.subsidy_pme;
  const ulga_termo = calculation.investment.tax_relief;
  const razem_brutto = calculation.investment.total_gross;
  const po_dotacjach = calculation.investment.net_cost;
  const zaliczka_30 = Math.round(razem_brutto * 0.3);

  return {
    id: generateOrderId(),
    numer: generateOrderNumber(),
    status: 'podsumowanie',
    created_at: now,
    updated_at: now,
    konfiguracja: {
      typ_instalacji: config.installationType!,
      moc_pv_kwp: config.pvPowerKwp,
      falownik_marka: config.inverterBrand,
      rok_pv: config.installationYear,
      zuzycie_roczne_kwh: config.annualConsumptionKwh,
      taryfa: config.tariff,
      rozliczenie: config.billingSystem,
      pompa_ciepla: config.hasHeatPump,
      auto_ev: config.hasEV,
      backup_variant: config.backupVariant,
      priorytety: config.priorities,
      user_profile: config.userProfile,
      energy_operator: config.energyOperator,
      pv_orientation: config.pvOrientation,
      tax_bracket: config.taxBracket,
    },
    produkt: {
      id: product.id,
      nazwa: product.name,
      marka: product.brand,
      pojemnosc_kwh: product.capacity_kwh,
      moc_kw: product.power_continuous_kw,
      cena_brutto: backupPrice,
      montaz_brutto: calculation.investment.installation,
      gwarancja_lat: product.warranty_years,
      zdjecie: product.image,
      falownik_id: inverter?.id,
      falownik_nazwa: inverter?.name,
    },
    finanse: {
      razem_brutto,
      dotacja_moj_prad,
      ulga_termo,
      po_dotacjach,
      zaliczka_30,
      reszta_przy_montazu: razem_brutto - zaliczka_30,
      roczna_oszczednosc: calculation.annual_savings,
      lat_zwrotu: calculation.roi_years,
      oszczednosc_20_lat: calculation.total_savings_20y,
    },
    klient: null,
    platnosc: {
      metoda: null,
    },
    umowa: {
      status: 'brak',
    },
    montaz: {},
  };
}
