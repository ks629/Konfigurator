import { z } from 'zod';

export const contactFormSchema = z.object({
  name: z.string().min(2, 'Imie i nazwisko jest wymagane'),
  email: z.string().email('Podaj prawidlowy adres e-mail'),
  phone: z.string().min(9, 'Podaj prawidlowy numer telefonu'),
  postalCode: z.string().optional(),
  consentContact: z.boolean().refine((val) => val === true, {
    message: 'Wyrazenie zgody jest wymagane',
  }),
  consentPrivacy: z.boolean().refine((val) => val === true, {
    message: 'Akceptacja polityki prywatnosci jest wymagana',
  }),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
