'use client';

import { useConfigurator } from '@/hooks/useConfigurator';
import { Product, BackupVariant } from '@/lib/types';
import { Shield, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BackupVariantToggleProps {
  product: Product;
}

export function BackupVariantToggle({ product }: BackupVariantToggleProps) {
  const { backupVariant, setBackupVariant } = useConfigurator();

  const labelA = product.backup_a_label || 'Wariant A';
  const labelB = product.backup_b_label || 'Pełny backup 3F (SZR)';

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-col items-center gap-3">
        <p className="text-sm font-medium text-muted-foreground">Wybierz wariant zasilania awaryjnego:</p>
        <div className="flex gap-3">
          <VariantButton
            variant="A"
            label={labelA}
            icon={<Shield className="h-4 w-4" />}
            isActive={backupVariant === 'A'}
            onClick={() => setBackupVariant('A')}
          />
          <VariantButton
            variant="B"
            label={labelB}
            icon={<ShieldCheck className="h-4 w-4" />}
            isActive={backupVariant === 'B'}
            onClick={() => setBackupVariant('B')}
          />
        </div>
      </div>
    </div>
  );
}

function VariantButton({
  variant,
  label,
  icon,
  isActive,
  onClick,
}: {
  variant: BackupVariant;
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all border',
        isActive
          ? 'bg-primary/10 border-primary text-primary'
          : 'bg-card border-border text-muted-foreground hover:text-foreground hover:border-primary/40'
      )}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
