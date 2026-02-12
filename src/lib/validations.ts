import { z } from 'zod';

export const contactFormSchema = z.object({
  name: z.string().min(2, 'Imię i nazwisko jest wymagane'),
  email: z.string().email('Podaj prawidłowy adres e-mail'),
  phone: z.string().min(9, 'Podaj prawidłowy numer telefonu'),
  postalCode: z.string().optional(),
  consentContact: z.boolean().refine((val) => val === true, {
    message: 'Wyrażenie zgody jest wymagane',
  }),
  consentPrivacy: z.boolean().refine((val) => val === true, {
    message: 'Akceptacja polityki prywatności jest wymagana',
  }),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
