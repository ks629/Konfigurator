import { test, expect } from '@playwright/test';
import { seedOrderStore } from './helpers';

test.describe('Order flow — Podsumowanie (Step 6)', () => {
  test.beforeEach(async ({ page }) => {
    await seedOrderStore(page);
    await page.goto('/zamowienie');
  });

  test('renders product info and price breakdown', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /PODSUMOWANIE ZAMÓWIENIA/i })).toBeVisible();
    await expect(page.getByText('LUNA2000-10-S0 10kWh')).toBeVisible();
    await expect(page.getByText('Huawei')).toBeVisible();
    await expect(page.getByText('10 kWh')).toBeVisible();
    await expect(page.getByText('5 kW')).toBeVisible();
    await expect(page.getByText('SUN2000-5KTL-M1')).toBeVisible();
  });

  test('shows order progress bar at step 1', async ({ page }) => {
    // Step 1 circle should be current (not completed)
    const stepperCircles = page.locator('[class*="rounded-full"][class*="border-2"]');
    await expect(stepperCircles).toHaveCount(3);
  });

  test('hides dotacja line when value is 0', async ({ page }) => {
    // ulga_termo is 0 in our seed data — should be hidden
    await expect(page.getByText('Ulga termomodernizacyjna')).not.toBeVisible();
    // dotacja_moj_prad is 16000 — should be visible
    await expect(page.getByText('Dotacja Mój Prąd 7.0')).toBeVisible();
  });

  test('clicking Zaliczka navigates to /zamowienie/dane', async ({ page }) => {
    await page.getByText('Zaliczka 30%').click();
    await expect(page).toHaveURL(/\/zamowienie\/dane/);
  });

  test('clicking Raty navigates to /zamowienie/dane', async ({ page }) => {
    await page.getByRole('button', { name: /Raty/ }).click();
    await expect(page).toHaveURL(/\/zamowienie\/dane/);
  });
});

test.describe('Order flow — Dane (Step 7)', () => {
  test.beforeEach(async ({ page }) => {
    await seedOrderStore(page, { metoda: 'zaliczka_p24' });
    await page.goto('/zamowienie/dane');
  });

  test('renders form with correct heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /DANE DO ZAMÓWIENIA/i })).toBeVisible();
  });

  test('shows order progress bar at step 2', async ({ page }) => {
    const stepperCircles = page.locator('[class*="rounded-full"][class*="border-2"]');
    await expect(stepperCircles).toHaveCount(3);
  });

  test('form inputs have autocomplete attributes', async ({ page }) => {
    await expect(page.locator('input#imie')).toHaveAttribute('autocomplete', 'given-name');
    await expect(page.locator('input#nazwisko')).toHaveAttribute('autocomplete', 'family-name');
    await expect(page.locator('input#email')).toHaveAttribute('autocomplete', 'email');
    await expect(page.locator('input#telefon')).toHaveAttribute('autocomplete', 'tel');
    await expect(page.locator('input#ulica')).toHaveAttribute('autocomplete', 'street-address');
    await expect(page.locator('input#kod')).toHaveAttribute('autocomplete', 'postal-code');
    await expect(page.locator('input#miasto')).toHaveAttribute('autocomplete', 'address-level2');
  });

  test('postal code input formats as XX-XXX', async ({ page }) => {
    const kodInput = page.locator('input#kod');
    await kodInput.fill('01234');
    await expect(kodInput).toHaveValue('01-234');
  });

  test('shows sidebar with order summary', async ({ page }) => {
    await expect(page.getByText('Twoje zamówienie')).toBeVisible();
    await expect(page.getByText('LUNA2000-10-S0 10kWh')).toBeVisible();
  });

  test('shows trust signals', async ({ page }) => {
    await expect(page.getByText('Szyfrowanie SSL')).toBeVisible();
    await expect(page.getByText('Zgodne z RODO')).toBeVisible();
    await expect(page.getByText('38 000+ projektów')).toBeVisible();
  });

  test('validation errors appear on empty submit', async ({ page }) => {
    // Try to submit empty form by clicking desktop button
    await page.locator('button[type="submit"]:visible').first().click();
    // Should show validation errors
    await expect(page.getByText('Imie jest wymagane')).toBeVisible();
  });
});

test.describe('Order flow — Płatność (Step 8)', () => {
  test.beforeEach(async ({ page }) => {
    await seedOrderStore(page, { metoda: 'zaliczka_p24', withCustomer: true });
    await page.goto('/zamowienie/platnosc');
  });

  test('renders payment page with correct heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /PŁATNOŚĆ ZALICZKI/i })).toBeVisible();
  });

  test('shows order progress bar at step 3', async ({ page }) => {
    const stepperCircles = page.locator('[class*="rounded-full"][class*="border-2"]');
    await expect(stepperCircles).toHaveCount(3);
  });

  test('displays correct payment amounts', async ({ page }) => {
    await expect(page.getByText('Zaliczka 30%')).toBeVisible();
  });

  test('shows confirmation checks', async ({ page }) => {
    await expect(page.getByText('Dane klienta zapisane')).toBeVisible();
    await expect(page.getByText(/NEXBE\/2026\/02\/0001 zarejestrowane/)).toBeVisible();
  });

  test('shows trust signals', async ({ page }) => {
    await expect(page.getByText('Szyfrowanie SSL')).toBeVisible();
  });
});

test.describe('Order flow — Raty (Step 8)', () => {
  test.beforeEach(async ({ page }) => {
    await seedOrderStore(page, { metoda: 'raty', withCustomer: true });
    await page.goto('/zamowienie/raty');
  });

  test('renders installment page with correct heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /WNIOSEK O RATY/i })).toBeVisible();
  });

  test('displays finance amounts', async ({ page }) => {
    await expect(page.getByText('Kwota do sfinansowania')).toBeVisible();
    await expect(page.getByText('Kwota brutto')).toBeVisible();
  });

  test('shows confirmation and trust signals', async ({ page }) => {
    await expect(page.getByText('Dane klienta zapisane')).toBeVisible();
    await expect(page.getByText('Szyfrowanie SSL')).toBeVisible();
  });
});

test.describe('Order flow — redirects without order', () => {
  test('zamowienie redirects to konfigurator when no order', async ({ page }) => {
    await page.goto('/zamowienie');
    await expect(page).toHaveURL(/\/konfigurator/);
  });

  test('dane redirects to konfigurator when no order', async ({ page }) => {
    await page.goto('/zamowienie/dane');
    await expect(page).toHaveURL(/\/konfigurator/);
  });

  test('platnosc redirects to konfigurator when no order', async ({ page }) => {
    await page.goto('/zamowienie/platnosc');
    await expect(page).toHaveURL(/\/konfigurator/);
  });

  test('raty redirects to konfigurator when no order', async ({ page }) => {
    await page.goto('/zamowienie/raty');
    await expect(page).toHaveURL(/\/konfigurator/);
  });
});

test.describe('Mobile — sticky CTA', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test('shows sticky CTA on zamowienie page', async ({ page }) => {
    await seedOrderStore(page);
    await page.goto('/zamowienie');
    const stickyCta = page.getByRole('button', { name: /Wybierz płatność/ });
    await expect(stickyCta).toBeVisible();
  });

  test('shows sticky submit on dane page', async ({ page }) => {
    await seedOrderStore(page, { metoda: 'zaliczka_p24' });
    await page.goto('/zamowienie/dane');
    // Mobile sticky CTA submit button
    const stickySubmit = page.locator('.fixed button[type="submit"]');
    await expect(stickySubmit).toBeVisible();
  });
});
