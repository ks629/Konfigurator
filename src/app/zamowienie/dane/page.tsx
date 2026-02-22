'use client';

import { useEffect, useState, type ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { OrderProgressBar } from '@/components/configurator/OrderProgressBar';
import { useOrder } from '@/hooks/useOrder';
import { customerSchema, type CustomerFormData } from '@/lib/order-types';
import { formatCurrency } from '@/lib/calculations';
import { staggerContainer, fadeUp } from '@/lib/animations';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ArrowLeft,
  ArrowRight,
  User,
  Loader2,
  Shield,
  Lock,
  Check,
  CreditCard,
  Banknote,
} from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

const WOJEWODZTWA = [
  'dolnośląskie', 'kujawsko-pomorskie', 'lubelskie', 'lubuskie',
  'łódzkie', 'małopolskie', 'mazowieckie', 'opolskie',
  'podkarpackie', 'podlaskie', 'pomorskie', 'śląskie',
  'świętokrzyskie', 'warmińsko-mazurskie', 'wielkopolskie', 'zachodniopomorskie',
];

function formatPostalCode(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 5);
  if (digits.length > 2) {
    return `${digits.slice(0, 2)}-${digits.slice(2)}`;
  }
  return digits;
}

export default function DaneKlientaPage() {
  const router = useRouter();
  const { order, updateCustomer } = useOrder();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      imie: order?.klient?.imie ?? '',
      nazwisko: order?.klient?.nazwisko ?? '',
      email: order?.klient?.email ?? '',
      telefon: order?.klient?.telefon ?? '',
      ulica: order?.klient?.adres?.ulica ?? '',
      kod: order?.klient?.adres?.kod ?? '',
      miasto: order?.klient?.adres?.miasto ?? '',
      wojewodztwo: order?.klient?.adres?.wojewodztwo ?? '',
      nip: '',
      zgoda_rodo: false as unknown as true,
      zgoda_regulamin: false as unknown as true,
      zgoda_marketing: false,
    },
  });

  useEffect(() => {
    if (!order) {
      router.replace('/konfigurator');
    }
  }, [order, router]);

  if (!order) {
    return (
      <div className="nexbe-dark dark min-h-screen flex flex-col bg-[#0f0520]">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Przekierowywanie...</p>
        </main>
      </div>
    );
  }

  const isDeposit = order.platnosc.metoda === 'zaliczka_p24';

  const handlePostalCodeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPostalCode(e.target.value);
    form.setValue('kod', formatted, { shouldValidate: true });
  };

  const onSubmit = async (data: CustomerFormData) => {
    setIsSubmitting(true);
    try {
      updateCustomer({
        imie: data.imie,
        nazwisko: data.nazwisko,
        email: data.email,
        telefon: data.telefon,
        adres: {
          ulica: data.ulica,
          kod: data.kod,
          miasto: data.miasto,
          wojewodztwo: data.wojewodztwo,
        },
        nip: data.nip || undefined,
        zgody: {
          rodo: true,
          regulamin: true,
          marketing: data.zgoda_marketing ?? false,
        },
      });

      const res = await fetch('/api/order/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: order.id,
          orderNumber: order.numer,
          customer: data,
          product: order.produkt,
          finances: order.finanse,
          paymentMethod: order.platnosc.metoda,
          config: order.konfiguracja,
        }),
      });

      if (!res.ok) {
        throw new Error(`Błąd zapisu: ${res.status}`);
      }

      toast.success('Dane zapisane!');

      if (isDeposit) {
        router.push('/zamowienie/platnosc');
      } else {
        router.push('/zamowienie/raty');
      }
    } catch {
      toast.error('Wystąpił błąd. Spróbuj ponownie.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="nexbe-dark dark min-h-screen flex flex-col bg-[#0f0520]">
      <Header />

      <main className="flex-1 relative">
        <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0" style={{
          backgroundImage: `linear-gradient(rgba(181,0,93,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(181,0,93,0.3) 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
        }} />
        <div className="energy-orb energy-orb-1" />
        <div className="energy-orb energy-orb-2" />

        <div className="container mx-auto px-4 py-8 md:py-12 pb-24 lg:pb-12 relative z-10">
          {/* Back */}
          <Link
            href="/zamowienie"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Wróć do podsumowania
          </Link>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-3 mb-6"
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white/90 border border-white/20 backdrop-blur-sm text-xs font-medium">
              <User className="h-3.5 w-3.5" />
              Dane klienta
            </div>
            <h1 className="font-heading text-3xl md:text-4xl text-white">
              DANE DO ZAMÓWIENIA
            </h1>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Podaj dane do umowy i montażu
            </p>
          </motion.div>

          {/* Order Progress Bar */}
          <OrderProgressBar currentStep={2} paymentLabel={isDeposit ? 'Płatność' : 'Raty'} />

          <div className="max-w-3xl mx-auto grid gap-8 lg:grid-cols-3">
            {/* Order summary sidebar — mobile first, desktop last */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-1 order-first lg:order-last"
            >
              <div className="rounded-2xl border border-white/10 bg-[#1A0A2E]/80 backdrop-blur-sm p-5 space-y-4 lg:sticky lg:top-24">
                <h3 className="font-heading text-sm text-white">Twoje zamówienie</h3>

                <div className="space-y-2 text-sm">
                  <p className="text-white font-medium">{order.produkt.nazwa}</p>
                  <p className="text-muted-foreground text-xs">{order.produkt.marka} — {order.produkt.pojemnosc_kwh} kWh</p>
                </div>

                <div className="space-y-2 border-t border-white/10 pt-3 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Brutto</span>
                    <span className="text-white">{formatCurrency(order.finanse.razem_brutto)}</span>
                  </div>
                  {(order.finanse.dotacja_moj_prad > 0 || order.finanse.ulga_termo > 0) && (
                    <div className="flex justify-between text-green-400">
                      <span>Dotacje</span>
                      <span>-{formatCurrency(order.finanse.dotacja_moj_prad + order.finanse.ulga_termo)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-sm border-t border-white/10 pt-2">
                    <span className="text-white">Do zapłaty</span>
                    <span className="text-white">{formatCurrency(order.finanse.po_dotacjach)}</span>
                  </div>
                </div>

                {/* Payment method badge */}
                <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5">
                  {isDeposit ? (
                    <>
                      <CreditCard className="h-4 w-4 text-[#B5005D]" />
                      <span className="text-xs text-white">Zaliczka {formatCurrency(order.finanse.zaliczka_30)}</span>
                    </>
                  ) : (
                    <>
                      <Banknote className="h-4 w-4 text-[#B5005D]" />
                      <span className="text-xs text-white">Raty</span>
                    </>
                  )}
                </div>

                <p className="text-[10px] text-muted-foreground">
                  Nr: {order.numer}
                </p>
              </div>
            </motion.div>

            {/* Form — 2 cols */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="lg:col-span-2 order-last lg:order-first"
            >
              <form id="order-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Personal data */}
                <motion.div variants={fadeUp} className="rounded-2xl border border-white/10 bg-[#1A0A2E]/80 backdrop-blur-sm p-6 space-y-4">
                  <h3 className="font-heading text-base text-white">Dane osobowe</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="imie" className="text-sm text-muted-foreground">Imię *</Label>
                      <Input
                        id="imie"
                        autoComplete="given-name"
                        {...form.register('imie')}
                        placeholder="Jan"
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-[#B5005D]"
                      />
                      {form.formState.errors.imie && (
                        <p className="text-xs text-red-400">{form.formState.errors.imie.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nazwisko" className="text-sm text-muted-foreground">Nazwisko *</Label>
                      <Input
                        id="nazwisko"
                        autoComplete="family-name"
                        {...form.register('nazwisko')}
                        placeholder="Kowalski"
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-[#B5005D]"
                      />
                      {form.formState.errors.nazwisko && (
                        <p className="text-xs text-red-400">{form.formState.errors.nazwisko.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm text-muted-foreground">E-mail *</Label>
                      <Input
                        id="email"
                        type="email"
                        autoComplete="email"
                        {...form.register('email')}
                        placeholder="jan@example.com"
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-[#B5005D]"
                      />
                      {form.formState.errors.email && (
                        <p className="text-xs text-red-400">{form.formState.errors.email.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="telefon" className="text-sm text-muted-foreground">Telefon *</Label>
                      <Input
                        id="telefon"
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        {...form.register('telefon')}
                        placeholder="123 456 789"
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-[#B5005D]"
                      />
                      {form.formState.errors.telefon && (
                        <p className="text-xs text-red-400">{form.formState.errors.telefon.message}</p>
                      )}
                    </div>
                  </div>
                </motion.div>

                {/* Address */}
                <motion.div variants={fadeUp} className="rounded-2xl border border-white/10 bg-[#1A0A2E]/80 backdrop-blur-sm p-6 space-y-4">
                  <h3 className="font-heading text-base text-white">Adres montażu</h3>

                  <div className="space-y-2">
                    <Label htmlFor="ulica" className="text-sm text-muted-foreground">Ulica i numer *</Label>
                    <Input
                      id="ulica"
                      autoComplete="street-address"
                      {...form.register('ulica')}
                      placeholder="ul. Słoneczna 15"
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-[#B5005D]"
                    />
                    {form.formState.errors.ulica && (
                      <p className="text-xs text-red-400">{form.formState.errors.ulica.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="kod" className="text-sm text-muted-foreground">Kod pocztowy *</Label>
                      <Input
                        id="kod"
                        autoComplete="postal-code"
                        inputMode="numeric"
                        maxLength={6}
                        value={form.watch('kod')}
                        onChange={handlePostalCodeChange}
                        placeholder="00-000"
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-[#B5005D]"
                      />
                      {form.formState.errors.kod && (
                        <p className="text-xs text-red-400">{form.formState.errors.kod.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="miasto" className="text-sm text-muted-foreground">Miasto *</Label>
                      <Input
                        id="miasto"
                        autoComplete="address-level2"
                        {...form.register('miasto')}
                        placeholder="Warszawa"
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-[#B5005D]"
                      />
                      {form.formState.errors.miasto && (
                        <p className="text-xs text-red-400">{form.formState.errors.miasto.message}</p>
                      )}
                    </div>
                    <div className="space-y-2 sm:col-span-2 lg:col-span-1">
                      <Label htmlFor="wojewodztwo" className="text-sm text-muted-foreground">Województwo *</Label>
                      <Controller
                        control={form.control}
                        name="wojewodztwo"
                        render={({ field }) => (
                          <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger className="w-full h-10 bg-white/5 border-white/10 text-white focus:border-[#B5005D]">
                              <SelectValue placeholder="Wybierz..." />
                            </SelectTrigger>
                            <SelectContent className="bg-[#1A0A2E] border-white/10">
                              {WOJEWODZTWA.map((w) => (
                                <SelectItem key={w} value={w} className="text-white focus:bg-white/10 focus:text-white">
                                  {w}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {form.formState.errors.wojewodztwo && (
                        <p className="text-xs text-red-400">{form.formState.errors.wojewodztwo.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nip" className="text-sm text-muted-foreground">NIP (opcjonalnie — dla faktury firmowej)</Label>
                    <Input
                      id="nip"
                      {...form.register('nip')}
                      placeholder="1234567890"
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-[#B5005D]"
                    />
                  </div>
                </motion.div>

                {/* Consents */}
                <motion.div variants={fadeUp} className="rounded-2xl border border-white/10 bg-[#1A0A2E]/80 backdrop-blur-sm p-6 space-y-4">
                  <h3 className="font-heading text-base text-white">Zgody</h3>

                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="zgoda_rodo"
                        checked={form.watch('zgoda_rodo') ?? false}
                        onCheckedChange={(checked) => form.setValue('zgoda_rodo', checked as true, { shouldValidate: true })}
                        className="mt-0.5 border-white/20 data-[state=checked]:bg-[#B5005D] data-[state=checked]:border-[#B5005D]"
                      />
                      <Label htmlFor="zgoda_rodo" className="text-xs text-muted-foreground leading-relaxed cursor-pointer">
                        Wyrażam zgodę na przetwarzanie moich danych osobowych przez NEXBE Sp. z o.o. w celu realizacji zamówienia, zgodnie z RODO. *
                      </Label>
                    </div>
                    {form.formState.errors.zgoda_rodo && (
                      <p className="text-xs text-red-400 ml-8">{form.formState.errors.zgoda_rodo.message}</p>
                    )}

                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="zgoda_regulamin"
                        checked={form.watch('zgoda_regulamin') ?? false}
                        onCheckedChange={(checked) => form.setValue('zgoda_regulamin', checked as true, { shouldValidate: true })}
                        className="mt-0.5 border-white/20 data-[state=checked]:bg-[#B5005D] data-[state=checked]:border-[#B5005D]"
                      />
                      <Label htmlFor="zgoda_regulamin" className="text-xs text-muted-foreground leading-relaxed cursor-pointer">
                        Akceptuję{' '}
                        <Link href="/regulamin" target="_blank" className="text-[#B5005D] hover:underline">regulamin</Link>
                        {' '}i{' '}
                        <Link href="/polityka-prywatnosci" target="_blank" className="text-[#B5005D] hover:underline">politykę prywatności</Link>. *
                      </Label>
                    </div>
                    {form.formState.errors.zgoda_regulamin && (
                      <p className="text-xs text-red-400 ml-8">{form.formState.errors.zgoda_regulamin.message}</p>
                    )}

                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="zgoda_marketing"
                        checked={form.watch('zgoda_marketing') ?? false}
                        onCheckedChange={(checked) => form.setValue('zgoda_marketing', !!checked)}
                        className="mt-0.5 border-white/20 data-[state=checked]:bg-[#B5005D] data-[state=checked]:border-[#B5005D]"
                      />
                      <Label htmlFor="zgoda_marketing" className="text-xs text-muted-foreground leading-relaxed cursor-pointer">
                        Wyrażam zgodę na otrzymywanie informacji marketingowych drogą elektroniczną (opcjonalnie).
                      </Label>
                    </div>
                  </div>
                </motion.div>

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  size="lg"
                  className="hidden lg:flex w-full h-14 text-lg bg-gradient-to-r from-[#350066] via-[#B5005D] to-[#FF004E] hover:from-[#4a0080] hover:via-[#D4006E] hover:to-[#FF1A5E] text-white shadow-xl shadow-[#B5005D]/30 rounded-2xl"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Zapisywanie...
                    </>
                  ) : (
                    <>
                      <ArrowRight className="h-5 w-5 mr-2" />
                      {isDeposit ? 'Przejdź do płatności' : 'Złóż wniosek o raty'}
                    </>
                  )}
                </Button>

                {/* Trust signals */}
                <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Lock className="h-3.5 w-3.5" />
                    Szyfrowanie SSL
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Shield className="h-3.5 w-3.5" />
                    Zgodne z RODO
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Check className="h-3.5 w-3.5" />
                    38 000+ projektów
                  </span>
                </div>
              </form>
            </motion.div>
          </div>
        </div>

        {/* Mobile sticky CTA */}
        <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-[#0f0520]/95 backdrop-blur-md border-t border-white/10 px-4 py-3">
          <Button
            type="submit"
            form="order-form"
            disabled={isSubmitting}
            size="lg"
            className="w-full h-12 text-base bg-gradient-to-r from-[#350066] via-[#B5005D] to-[#FF004E] hover:from-[#4a0080] hover:via-[#D4006E] hover:to-[#FF1A5E] text-white shadow-xl shadow-[#B5005D]/30 rounded-xl"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Zapisywanie...
              </>
            ) : (
              <>
                <ArrowRight className="h-5 w-5 mr-2" />
                {isDeposit ? 'Przejdź do płatności' : 'Złóż wniosek o raty'}
              </>
            )}
          </Button>
        </div>
      </main>
    </div>
  );
}
