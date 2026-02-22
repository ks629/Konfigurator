import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  Order,
  OrderStatus,
  OrderKlient,
  CreateOrderInput,
} from '@/lib/order-types';
import { createOrder } from '@/lib/order-types';

interface FormDraft {
  imie?: string;
  nazwisko?: string;
  email?: string;
  telefon?: string;
  ulica?: string;
  kod?: string;
  miasto?: string;
  wojewodztwo?: string;
  nip?: string;
}

interface OrderStore {
  order: Order | null;
  formDraft: FormDraft | null;

  createFromConfigurator: (input: CreateOrderInput) => Order;
  updateStatus: (status: OrderStatus) => void;
  updateCustomer: (klient: OrderKlient) => void;
  updatePaymentMethod: (metoda: 'zaliczka_p24' | 'raty') => void;
  updateFormDraft: (draft: FormDraft) => void;
  clearFormDraft: () => void;
  reset: () => void;
}

export const useOrder = create<OrderStore>()(
  persist(
    (set, get) => ({
      order: null,
      formDraft: null,

      createFromConfigurator: (input) => {
        const order = createOrder(input);
        set({ order });
        return order;
      },

      updateStatus: (status) => {
        const current = get().order;
        if (!current) return;
        set({
          order: {
            ...current,
            status,
            updated_at: new Date().toISOString(),
          },
        });
      },

      updateCustomer: (klient) => {
        const current = get().order;
        if (!current) return;
        set({
          order: {
            ...current,
            klient,
            status: 'dane_klienta',
            updated_at: new Date().toISOString(),
          },
          formDraft: null,
        });
      },

      updatePaymentMethod: (metoda) => {
        const current = get().order;
        if (!current) return;
        set({
          order: {
            ...current,
            platnosc: { ...current.platnosc, metoda },
            updated_at: new Date().toISOString(),
          },
        });
      },

      updateFormDraft: (draft) => {
        const current = get().formDraft;
        set({ formDraft: { ...current, ...draft } });
      },

      clearFormDraft: () => set({ formDraft: null }),

      reset: () => set({ order: null, formDraft: null }),
    }),
    {
      name: 'nexbe-order',
    }
  )
);
