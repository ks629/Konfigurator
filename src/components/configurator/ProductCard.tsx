'use client';

import { Product, Inverter } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Battery, Zap, Shield, Calendar, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/calculations';

interface ProductCardProps {
  product: Product;
  inverter?: Inverter;
  badge: string;
  badgeVariant: 'default' | 'secondary' | 'outline';
  isRecommended: boolean;
  isSelected: boolean;
  onSelect: () => void;
}

export function ProductCard({
  product,
  inverter,
  badge,
  badgeVariant,
  isRecommended,
  isSelected,
  onSelect,
}: ProductCardProps) {
  const totalPrice = product.price_gross + (inverter?.price_gross || 0);

  return (
    <div
      className={cn(
        'relative flex flex-col rounded-xl border-2 overflow-hidden transition-all',
        isRecommended && 'ring-2 ring-primary shadow-lg',
        isSelected ? 'border-primary bg-primary/5' : 'border-border bg-card'
      )}
    >
      {/* Badge */}
      <div className="absolute top-3 right-3 z-10">
        <Badge variant={badgeVariant} className={cn(
          isRecommended && 'bg-primary text-primary-foreground'
        )}>
          {badge}
        </Badge>
      </div>

      {/* Image placeholder */}
      <div className="relative h-48 bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
        <Battery className="h-20 w-20 text-muted-foreground/30" />
        <div className="absolute bottom-2 left-2">
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
              <p className="text-xs text-muted-foreground">Pojemnosc</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" />
            <div>
              <p className="font-medium">
                {product.power_continuous_kw} / {product.power_peak_kw} kW
              </p>
              <p className="text-xs text-muted-foreground">Ciagla / Szczyt</p>
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

        {/* Price */}
        <div className="pt-2 border-t">
          <div className="flex items-baseline justify-between">
            <span className="text-sm text-muted-foreground">Cena brutto:</span>
            <span className="text-2xl font-heading text-primary">
              {formatCurrency(totalPrice)}
            </span>
          </div>
          {inverter && (
            <p className="text-xs text-muted-foreground mt-1">
              Magazyn: {formatCurrency(product.price_gross)} + Falownik:{' '}
              {formatCurrency(inverter.price_gross)}
            </p>
          )}
        </div>

        {/* Select button */}
        <Button
          onClick={onSelect}
          variant={isSelected ? 'default' : isRecommended ? 'default' : 'outline'}
          className="w-full mt-auto"
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
