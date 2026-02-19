'use client';

import { cn } from '@/lib/utils';
import { Check, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  onStepClick?: (step: number) => void;
}

const stepLabels = [
  'Typ instalacji',
  'Dane PV',
  'Zużycie energii',
  'Dodatkowe potrzeby',
  'Rekomendacja',
];

export function ProgressBar({ currentStep, totalSteps, onStepClick }: ProgressBarProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-muted-foreground">
          Krok {currentStep} z {totalSteps}
        </span>
        <span className="text-sm font-medium text-muted-foreground">
          {stepLabels[currentStep - 1]}
        </span>
      </div>

      <div className="flex items-center gap-1">
        {Array.from({ length: totalSteps }, (_, i) => {
          const step = i + 1;
          const isCompleted = step < currentStep;
          const isCurrent = step === currentStep;
          const canClick = isCompleted && !!onStepClick;

          return (
            <div key={step} className="flex items-center flex-1">
              <div className="flex items-center w-full">
                <motion.button
                  type="button"
                  disabled={!canClick}
                  onClick={() => canClick && onStepClick!(step)}
                  whileHover={canClick ? { scale: 1.15 } : undefined}
                  whileTap={canClick ? { scale: 0.9 } : undefined}
                  className={cn(
                    'flex items-center justify-center w-8 h-8 rounded-full border-2 text-sm font-medium transition-all shrink-0',
                    isCompleted && 'bg-primary border-primary text-primary-foreground',
                    isCurrent && 'border-primary text-primary ring-2 ring-primary/20',
                    !isCompleted && !isCurrent && 'border-muted-foreground/30 text-muted-foreground/50',
                    canClick && 'cursor-pointer hover:ring-2 hover:ring-primary/50 hover:shadow-lg hover:shadow-primary/20',
                    !canClick && 'cursor-default'
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
                </motion.button>
                {step < totalSteps && (
                  <div className="h-0.5 w-full mx-1 bg-muted-foreground/20 overflow-hidden rounded-full">
                    <motion.div
                      className="h-full bg-primary"
                      initial={{ width: '0%' }}
                      animate={{ width: isCompleted ? '100%' : '0%' }}
                      transition={{ duration: 0.4, ease: 'easeOut' }}
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="hidden sm:flex items-center justify-between mt-2">
        {stepLabels.map((label, i) => {
          const stepNum = i + 1;
          const canClickLabel = stepNum < currentStep && !!onStepClick;
          return (
            <button
              key={label}
              type="button"
              disabled={!canClickLabel}
              onClick={() => canClickLabel && onStepClick!(stepNum)}
              className={cn(
                'text-xs text-center flex-1 transition-colors',
                stepNum === currentStep && 'text-primary font-semibold',
                stepNum < currentStep && 'text-primary/70 font-medium',
                stepNum > currentStep && 'text-muted-foreground/50',
                canClickLabel && 'cursor-pointer hover:text-white',
                !canClickLabel && 'cursor-default'
              )}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Estimated time */}
      {currentStep < totalSteps && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-1.5 mt-3 text-xs text-muted-foreground/60"
        >
          <Clock className="h-3 w-3" />
          <span>~2 min · bez rejestracji · wynik od razu</span>
        </motion.div>
      )}
    </div>
  );
}
