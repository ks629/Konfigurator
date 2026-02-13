'use client';

import Image from 'next/image';
import { Product, Inverter } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Battery, Zap, Shield, Calendar, Check, CreditCard, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/calculations';

interface ProductCardProps {
  product: Product;
  inverter?: Inverter;
  badge: string;
  badgeVariant: 'default' | 'secondary' | 'outline';
  isRecommended: boolean;
  isPremium?: boolean;
  isSelected: boolean;
  onSelect: () => void;
  monthlyRate?: number;
}

export function ProductCard({
  product,
  inverter,
  badge,
  badgeVariant,
  isRecommended,
  isPremium,
  isSelected,
  onSelect,
  monthlyRate,
}: ProductCardProps) {
  const totalPrice = product.price_gross + (inverter?.price_gross || 0);

  return (
    <div
      className={cn(
        'relative flex flex-col rounded-xl border-2 overflow-hidden transition-all',
        isPremium && 'ring-2 ring-amber-400/40 shadow-[0_0_30px_-5px_rgba(251,191,36,0.15)]',
        isRecommended && !isPremium && 'ring-2 ring-primary shadow-lg shadow-primary/10',
        isSelected ? 'border-primary bg-primary/5' : isPremium ? 'border-amber-400/30 bg-card' : 'border-border bg-card'
      )}
    >
      {/* Badge */}
      <div className="absolute top-3 right-3 z-10">
        <Badge variant={badgeVariant} className={cn(
          isRecommended && !isPremium && 'bg-primary text-primary-foreground',
          isPremium && 'bg-gradient-to-r from-amber-400 to-amber-500 text-black font-bold border-0'
        )}>
          {isPremium && <Crown className="h-3 w-3 mr-1" />}
          {badge}
        </Badge>
      </div>

      {/* Product image */}
      <div className={cn(
        'relative h-48 flex items-center justify-center overflow-hidden',
        isPremium
          ? 'bg-gradient-to-br from-amber-400/5 via-muted to-amber-400/5'
          : 'bg-gradient-to-br from-muted to-muted/50'
      )}>
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain p-3"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <Battery className="h-20 w-20 text-muted-foreground/30" />
        )}
        <div className="absolute bottom-2 left-2 z-10">
          <span className="text-xs bg-black/50 text-white px-2 py-1 rounded">
            {product.brand}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 space-y-4">
        <div>
          <h3 className="font-heading text-lg">{product.name}</h3>
          {inverter && (
            <p className="text-sm text-muted-foreground">
              + {inverter.name}
            </p>
          )}
        </div>

        {/* Specs */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <Battery className="h-4 w-4 text-primary" />
            <div>
              <p className="font-medium">{product.capacity_kwh} kWh</p>
              <p className="text-xs text-muted-foreground">Pojemność</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" />
            <div>
              <p className="font-medium">
                {product.power_continuous_kw} / {product.power_peak_kw} kW
              </p>
              <p className="text-xs text-muted-foreground">Ciągła / Szczyt</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            <div>
              <p className="font-medium">{product.type}</p>
              <p className="text-xs text-muted-foreground">Typ</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            <div>
              <p className="font-medium">{product.warranty_years} lat</p>
              <p className="text-xs text-muted-foreground">Gwarancja</p>
            </div>
          </div>
        </div>

        {/* EPS badge */}
        {product.eps_capable && (
          <div className="flex items-center gap-1.5 text-xs text-green-700 bg-green-50 px-2 py-1 rounded-md w-fit">
            <Check className="h-3 w-3" />
            Zasilanie awaryjne (EPS)
          </div>
        )}

        {/* Price + Monthly rate */}
        <div className="pt-2 border-t space-y-2">
          <div className="flex items-baseline justify-between">
            <span className="text-sm text-muted-foreground">Cena brutto:</span>
            <span className={cn(
              'text-2xl font-heading',
              isPremium ? 'text-amber-400' : 'text-primary'
            )}>
              {formatCurrency(totalPrice)}
            </span>
          </div>
          {monthlyRate && monthlyRate > 0 && (
            <div className="flex items-center gap-1.5 text-sm">
              <CreditCard className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-muted-foreground">Rata już od</span>
              <span className="font-heading text-primary">{monthlyRate} zł/mies.</span>
            </div>
          )}
          {inverter && (
            <p className="text-xs text-muted-foreground">
              Magazyn: {formatCurrency(product.price_gross)} + Falownik:{' '}
              {formatCurrency(inverter.price_gross)}
            </p>
          )}
        </div>

        {/* Select button */}
        <Button
          onClick={onSelect}
          variant={isSelected ? 'default' : isRecommended || isPremium ? 'default' : 'outline'}
          className={cn(
            'w-full mt-auto',
            isPremium && !isSelected && 'bg-gradient-to-r from-amber-400 to-amber-500 text-black hover:from-amber-500 hover:to-amber-600'
          )}
          size="lg"
        >
          {isSelected ? (
            <>
              <Check className="h-4 w-4 mr-2" />
              Wybrany
            </>
          ) : (
            'Wybierz ten pakiet'
          )}
        </Button>
      </div>
    </div>
  );
}
