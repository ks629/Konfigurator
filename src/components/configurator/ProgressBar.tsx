'use client';

import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

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
  const percentage = Math.round(((currentStep - 1) / (totalSteps - 1)) * 100);

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

          const canClick = isCompleted && onStepClick;

          return (
            <div key={step} className="flex items-center flex-1">
              <div className="flex items-center w-full">
                <button
                  type="button"
                  disabled={!canClick}
                  onClick={() => canClick && onStepClick(step)}
                  className={cn(
                    'flex items-center justify-center w-8 h-8 rounded-full border-2 text-sm font-medium transition-all shrink-0',
                    isCompleted && 'bg-primary border-primary text-primary-foreground',
                    isCurrent && 'border-primary text-primary',
                    !isCompleted && !isCurrent && 'border-muted-foreground/30 text-muted-foreground/50',
                    canClick && 'cursor-pointer hover:ring-2 hover:ring-primary/50',
                    !canClick && 'cursor-default'
                  )}
                >
                  {isCompleted ? <Check className="h-4 w-4" /> : step}
                </button>
                {step < totalSteps && (
                  <div
                    className={cn(
                      'h-0.5 w-full mx-1 transition-all',
                      isCompleted ? 'bg-primary' : 'bg-muted-foreground/20'
                    )}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="hidden sm:flex items-center justify-between mt-2">
        {stepLabels.map((label, i) => {
          const stepNum = i + 1;
          const canClickLabel = stepNum < currentStep && onStepClick;
          return (
            <button
              key={label}
              type="button"
              disabled={!canClickLabel}
              onClick={() => canClickLabel && onStepClick(stepNum)}
              className={cn(
                'text-xs text-center flex-1',
                stepNum <= currentStep ? 'text-primary font-medium' : 'text-muted-foreground/50',
                canClickLabel && 'cursor-pointer hover:text-white transition-colors',
                !canClickLabel && 'cursor-default'
              )}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
