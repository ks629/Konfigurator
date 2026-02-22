import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  Order,
  OrderStatus,
  OrderKlient,
  CreateOrderInput,
} from '@/lib/order-types';
import { createOrder } from '@/lib/order-types';

interface OrderStore {
  order: Order | null;

  createFromConfigurator: (input: CreateOrderInput) => Order;
  updateStatus: (status: OrderStatus) => void;
  updateCustomer: (klient: OrderKlient) => void;
  updatePaymentMethod: (metoda: 'zaliczka_p24' | 'raty') => void;
  reset: () => void;
}

export const useOrder = create<OrderStore>()(
  persist(
    (set, get) => ({
      order: null,

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

      reset: () => set({ order: null }),
    }),
    {
      name: 'nexbe-order',
    }
  )
);
