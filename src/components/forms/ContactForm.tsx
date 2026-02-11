'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactFormSchema, ContactFormData } from '@/lib/validations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Loader2, Send, Lock, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface ContactFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ContactFormData) => Promise<void>;
  title?: string;
}

export function ContactForm({ open, onOpenChange, onSubmit, title = 'Wyslij oferte na e-mail' }: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      postalCode: '',
      consentContact: false,
      consentPrivacy: false,
    },
  });

  const handleSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      setIsSuccess(true);
      toast.success('Oferta zostala wyslana!');
    } catch {
      toast.error('Wystapil blad. Sprobuj ponownie.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <div className="text-center space-y-4 py-6">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="font-heading text-xl">Oferta wyslana!</h3>
            <p className="text-sm text-muted-foreground">
              Sprawdz swoją skrzynke e-mail. Nasz doradca skontaktuje sie z Toba w ciagu 24 godzin.
            </p>
            <Button onClick={() => onOpenChange(false)} className="w-full">
              Zamknij
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading">{title}</DialogTitle>
          <DialogDescription>
            Podaj dane kontaktowe, a my wyslemy Ci szczegolowa oferte
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Imie i nazwisko *</Label>
            <Input
              id="name"
              placeholder="Jan Kowalski"
              {...form.register('name')}
              className="h-11"
            />
            {form.formState.errors.name && (
              <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Adres e-mail *</Label>
            <Input
              id="email"
              type="email"
              placeholder="jan@example.com"
              {...form.register('email')}
              className="h-11"
            />
            {form.formState.errors.email && (
              <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Numer telefonu *</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+48 XXX-XXX-XXX"
              {...form.register('phone')}
              className="h-11"
            />
            {form.formState.errors.phone && (
              <p className="text-xs text-destructive">{form.formState.errors.phone.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="postalCode">Kod pocztowy (opcjonalnie)</Label>
            <Input
              id="postalCode"
              placeholder="00-000"
              {...form.register('postalCode')}
              className="h-11"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <Checkbox
                id="consentContact"
                checked={form.watch('consentContact')}
                onCheckedChange={(checked) =>
                  form.setValue('consentContact', checked === true)
                }
              />
              <Label htmlFor="consentContact" className="text-xs text-muted-foreground leading-relaxed cursor-pointer">
                Wyrazam zgode na kontakt w sprawie oferty
              </Label>
            </div>
            {form.formState.errors.consentContact && (
              <p className="text-xs text-destructive">{form.formState.errors.consentContact.message}</p>
            )}

            <div className="flex items-start gap-2">
              <Checkbox
                id="consentPrivacy"
                checked={form.watch('consentPrivacy')}
                onCheckedChange={(checked) =>
                  form.setValue('consentPrivacy', checked === true)
                }
              />
              <Label htmlFor="consentPrivacy" className="text-xs text-muted-foreground leading-relaxed cursor-pointer">
                Akceptuje polityke prywatnosci NEXBE
              </Label>
            </div>
            {form.formState.errors.consentPrivacy && (
              <p className="text-xs text-destructive">{form.formState.errors.consentPrivacy.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Wysylanie...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Wyslij oferte
              </>
            )}
          </Button>

          <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <Lock className="h-3 w-3" />
            Twoje dane sa bezpieczne. Nie udostepniamy ich osobom trzecim.
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
