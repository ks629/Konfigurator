'use client';

import { motion } from 'framer-motion';
import { useConfigurator } from '@/hooks/useConfigurator';
import { InstallationType } from '@/lib/types';
import { Battery, Sun, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

const options: {
  type: InstallationType;
  title: string;
  description: string;
  icon: React.ElementType;
}[] = [
  {
    type: 'retrofit',
    title: 'Mam juz instalacje PV i chce dodac magazyn',
    description: 'Twoj obecny falownik zostaje, dodajemy magazyn AC',
    icon: Battery,
  },
  {
    type: 'hybrid',
    title: 'Planuje nowa instalacje PV z magazynem',
    description: 'Kompletny system: panele + falownik hybrydowy + magazyn DC',
    icon: Sun,
  },
  {
    type: 'upgrade',
    title: 'Chce wymienic falownik na hybrydowy i dodac magazyn',
    description: 'Modernizacja istniejacej instalacji do systemu hybrydowego',
    icon: RefreshCw,
  },
];

export function StepInstallationType() {
  const { installationType, setInstallationType, nextStep } = useConfigurator();

  const handleSelect = (type: InstallationType) => {
    setInstallationType(type);
    setTimeout(() => nextStep(), 300);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="text-center space-y-2">
        <h2 className="font-heading text-2xl md:text-3xl">
          Jaka jest Twoja sytuacja?
        </h2>
        <p className="text-muted-foreground">
          To pomoze nam dobrac najlepsze rozwiazanie
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3 max-w-4xl mx-auto">
        {options.map(({ type, title, description, icon: Icon }) => (
          <button
            key={type}
            onClick={() => handleSelect(type)}
            className={cn(
              'group relative flex flex-col items-center text-center p-6 rounded-xl border-2 transition-all hover:shadow-lg hover:border-primary/50 cursor-pointer',
              installationType === type
                ? 'border-primary bg-primary/5 shadow-md'
                : 'border-border bg-card'
            )}
          >
            <div
              className={cn(
                'mb-4 p-4 rounded-full transition-colors',
                installationType === type
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'
              )}
            >
              <Icon className="h-8 w-8" />
            </div>
            <h3 className="font-heading text-sm md:text-base mb-2">{title}</h3>
            <p className="text-xs md:text-sm text-muted-foreground">
              {description}
            </p>
            {installationType === type && (
              <motion.div
                layoutId="selected-indicator"
                className="absolute -top-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center"
              >
                <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>
            )}
          </button>
        ))}
      </div>
    </motion.div>
  );
}
