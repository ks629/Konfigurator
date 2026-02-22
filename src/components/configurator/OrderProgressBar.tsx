'use client';

import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';

interface OrderProgressBarProps {
  currentStep: 1 | 2 | 3;
  paymentLabel?: string;
}

const stepLabels = ['Podsumowanie', 'Dane', 'Płatność'];

export function OrderProgressBar({ currentStep, paymentLabel }: OrderProgressBarProps) {
  const labels = paymentLabel
    ? [stepLabels[0], stepLabels[1], paymentLabel]
    : stepLabels;

  return (
    <div className="w-full max-w-md mx-auto mb-10">
      <div className="flex items-center">
        {labels.map((label, i) => {
          const step = i + 1;
          const isCompleted = step < currentStep;
          const isCurrent = step === currentStep;

          return (
            <div key={label} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-1.5">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: i * 0.1, type: 'spring', stiffness: 300, damping: 20 }}
                  className={cn(
                    'flex items-center justify-center w-9 h-9 rounded-full border-2 text-sm font-medium transition-all shrink-0',
                    isCompleted && 'bg-primary border-primary text-primary-foreground',
                    isCurrent && 'border-primary text-primary ring-2 ring-primary/20',
                    !isCompleted && !isCurrent && 'border-muted-foreground/30 text-muted-foreground/50'
                  )}
                >
                  {isCompleted ? (
                    <motion.div
                      initial={{ scale: 0, rotate: -90 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    >
                      <Check className="h-4 w-4" />
                    </motion.div>
                  ) : (
                    step
                  )}
                </motion.div>
                <span
                  className={cn(
                    'hidden sm:block text-xs text-center whitespace-nowrap transition-colors',
                    isCurrent && 'text-primary font-semibold',
                    isCompleted && 'text-primary/70 font-medium',
                    !isCompleted && !isCurrent && 'text-muted-foreground/50'
                  )}
                >
                  {label}
                </span>
              </div>

              {step < 3 && (
                <div className="h-0.5 w-full mx-2 bg-muted-foreground/20 overflow-hidden rounded-full self-start mt-[18px]">
                  <motion.div
                    className="h-full bg-primary"
                    initial={{ width: '0%' }}
                    animate={{ width: isCompleted ? '100%' : '0%' }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
