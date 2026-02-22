import type { Page } from '@playwright/test';

/**
 * Seeds the zustand order store via localStorage so we can test
 * /zamowienie pages without going through the full configurator flow.
 */
export async function seedOrderStore(page: Page, overrides?: { metoda?: 'zaliczka_p24' | 'raty' | null; withCustomer?: boolean }) {
  const metoda = overrides?.metoda ?? null;
  const withCustomer = overrides?.withCustomer ?? false;

  const order = {
    state: {
      order: {
        id: 'ord_test_123',
        numer: 'NEXBE/2026/02/0001',
        status: withCustomer ? 'dane_klienta' : 'podsumowanie',
        created_at: '2026-02-22T10:00:00.000Z',
        updated_at: '2026-02-22T10:00:00.000Z',
        konfiguracja: {
          typ_instalacji: 'retrofit',
          moc_pv_kwp: 8,
          falownik_marka: 'Huawei',
          rok_pv: 2023,
          zuzycie_roczne_kwh: 6000,
          taryfa: 'G12',
          rozliczenie: 'net-billing',
          pompa_ciepla: false,
          auto_ev: false,
          backup_variant: 'A',
          priorytety: ['savings'],
          user_profile: 'standard',
          energy_operator: 'pge',
          pv_orientation: 'south',
          tax_bracket: '32',
        },
        produkt: {
          id: 'test-product-1',
          nazwa: 'LUNA2000-10-S0 10kWh',
          marka: 'Huawei',
          pojemnosc_kwh: 10,
          moc_kw: 5,
          cena_brutto: 16900,
          montaz_brutto: 2000,
          gwarancja_lat: 10,
          zdjecie: '',
          falownik_nazwa: 'SUN2000-5KTL-M1',
        },
        finanse: {
          razem_brutto: 18900,
          dotacja_moj_prad: 16000,
          ulga_termo: 0,
          po_dotacjach: 2900,
          zaliczka_30: 5670,
          reszta_przy_montazu: 13230,
          roczna_oszczednosc: 4200,
          lat_zwrotu: 4.3,
          oszczednosc_20_lat: 84000,
        },
        klient: withCustomer ? {
          imie: 'Jan',
          nazwisko: 'Kowalski',
          email: 'jan@test.pl',
          telefon: '+48123456789',
          adres: {
            ulica: 'ul. Słoneczna 15',
            kod: '00-001',
            miasto: 'Warszawa',
            wojewodztwo: 'mazowieckie',
          },
          zgody: { rodo: true, regulamin: true, marketing: false },
        } : null,
        platnosc: { metoda },
        umowa: { status: 'brak' },
        montaz: {},
      },
    },
    version: 0,
  };

  await page.addInitScript((orderData) => {
    localStorage.setItem('nexbe-order', JSON.stringify(orderData));
  }, order);
}
