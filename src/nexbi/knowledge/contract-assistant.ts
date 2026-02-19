import type { KnowledgeEntry } from '../engine/types';

export const CONTRACT_KNOWLEDGE: KnowledgeEntry[] = [
  // === POLA UMOWY ===
  {
    keywords: ['osd', 'operator', 'dystrybutor', 'pge', 'tauron', 'enea', 'energa', 'innogy'],
    question: 'OSD — Operator Systemu Dystrybucyjnego',
    answer: 'OSD to firma zarządzająca siecią energetyczną w danym regionie:\n\n- PGE Dystrybucja — centralna/wschodnia Polska\n- Tauron Dystrybucja — południowa Polska\n- Enea Operator — zachodnia Polska\n- Energa Operator — północna Polska\n- Stoen (Innogy) — Warszawa\n\nOSD znajdziesz na fakturze za prąd klienta lub w umowie prosumenckiej.',
    emotion: 'teaching',
    followUp: 'Sprawdź OSD na fakturze klienta — pozycja "Operator".',
  },
  {
    keywords: ['pesel', 'nip', 'dane osobowe', 'identyfikacj'],
    question: 'PESEL vs NIP',
    answer: 'Kiedy PESEL, kiedy NIP?\n\n- Osoba prywatna → PESEL + nr dowodu\n- Jednoosobowa działalność → NIP (ale PESEL też potrzebny)\n- Spółka/firma → NIP + KRS/REGON\n\nWażne: dla dotacji Mój Prąd wniosek jest TYLKO na osobę fizyczną (PESEL), nawet jeśli PV jest na firmę.',
    emotion: 'teaching',
    followUp: 'Przy firmach sprawdź czy dotacja idzie na osobę czy firmę.',
  },
  {
    keywords: ['umowa', 'prosumencka', 'przyłączeni', 'net-billing', 'rozliczen'],
    question: 'Umowa prosumencka',
    answer: 'Wymagane dane z umowy prosumenckiej:\n\n- Nr umowy (PPE — Punkt Poboru Energii)\n- Moc przyłączeniowa (kW)\n- System rozliczeniowy (net-billing / net-metering)\n- Taryfa (G11, G12, G12w, G13)\n- OSD i sprzedawca energii\n\nBez tych danych nie złożysz wniosku o dotację.',
    emotion: 'teaching',
    followUp: 'Poproś klienta o skan umowy prosumenckiej.',
  },
  {
    keywords: ['taryfa', 'g11', 'g12', 'g12w', 'g13', 'dynamiczn'],
    question: 'Taryfy energetyczne',
    answer: 'Taryfy:\n\n- G11 — jednostrefowa (jedna cena całą dobę)\n- G12 — dwustrefowa (dzienna + nocna)\n- G12w — weekendowa (niższa w weekendy)\n- G13 — trzystrefowa (szczyt, częściowy, pozaszczyt)\n\nG12/G13 z magazynem = dodatkowe oszczędności (ładujesz w taniej strefie).',
    emotion: 'teaching',
    followUp: 'Taryfę znajdziesz na fakturze za prąd.',
  },

  // === WARUNKI UMOWY ===
  {
    keywords: ['warunki', 'postanowien', 'klauzul', 'paragraf', 'regulamin'],
    question: 'Warunki umowy',
    answer: 'Kluczowe elementy umowy NEXBE:\n\n- Zakres: dostawa + montaż + konfiguracja + szkolenie\n- Termin realizacji: 7-14 dni roboczych\n- Gwarancja: wg producenta (10-15 lat)\n- Płatność: przelew/raty Inbank\n- Concierge: złożenie wniosku o dotację w cenie\n- RODO: zgoda na przetwarzanie danych',
    emotion: 'teaching',
    followUp: 'Sprawdź czy wszystkie pola są wypełnione przed wysłaniem.',
  },
  {
    keywords: ['kompletnoś', 'sprawdź', 'brakuje', 'walidacj', 'błąd', 'błedy'],
    question: 'Sprawdzanie kompletności',
    answer: 'Checklist umowy:\n\n[ ] Dane klienta (imię, nazwisko, adres, PESEL/NIP)\n[ ] Nr tel. + email\n[ ] Dane instalacji PV (marka, moc, nr inwertera)\n[ ] OSD + nr PPE\n[ ] Taryfa + system rozliczeniowy\n[ ] Wybrany magazyn (marka, model, pojemność)\n[ ] Sposób płatności\n[ ] Data montażu\n[ ] Podpisy + data\n[ ] Zgoda RODO\n\nKażde brakujące pole opóźnia realizację!',
    emotion: 'curious',
    followUp: 'Przejdź tę checklistę przed wysłaniem umowy.',
  },

  // === DOTACJA - WYMOGI FORMALNE ===
  {
    keywords: ['dotacja', 'wniosek', 'wymogi', 'nfoś', 'mój prąd'],
    question: 'Wymogi dotacji do umowy',
    answer: 'Wymogi NFOŚiGW do umowy:\n\n- Magazyn min. 10 kWh\n- Island mode (backup) — musi być w specyfikacji\n- EMS (zarządzanie energią)\n- Faktura VAT (nie paragon!)\n- Protokół montażu\n- Certyfikaty CE produktu\n- Dane z umowy prosumenckiej\n\nUpewnij się, że wybrany model spełnia WSZYSTKIE wymogi.',
    emotion: 'teaching',
    followUp: 'Wszystkie nasze modele spełniają wymogi NFOŚiGW.',
  },

  // === FINANSOWANIE ===
  {
    keywords: ['raty', 'inbank', 'finansowan', 'leasing', 'płatnoś'],
    question: 'Opcje finansowania',
    answer: 'Opcje płatności w umowie:\n\n1. Przelew — całość przed montażem\n2. Raty Inbank — RRSO 9,9%, 12-60 msc, bez zaliczki\n3. Leasing (B2B) — odliczenie VAT + amortyzacja\n\nPrzy ratach: wymagana pozytywna decyzja kredytowa Inbank PRZED podpisaniem umowy.',
    emotion: 'teaching',
    followUp: 'Sprawdź zdolność kredytową klienta przed wyborem rat.',
  },

  // === MONTAŻ ===
  {
    keywords: ['montaż', 'protokół', 'termin', 'realizacj'],
    question: 'Montaż w umowie',
    answer: 'Sekcja montażu:\n\n- Adres montażu (może być inny niż korespondencyjny)\n- Preferowany termin\n- Dostęp do rozdzielnicy elektrycznej\n- Lokalizacja magazynu (garaż/kotłownia/piwnica)\n- Wymagania: 0-45°C, suche, wentylowane, ~0.5 m²\n\nProtokół montażu jest wymagany do wniosku o dotację.',
    emotion: 'teaching',
    followUp: 'Upewnij się że klient zna wymagania pomieszczenia.',
  },
];
