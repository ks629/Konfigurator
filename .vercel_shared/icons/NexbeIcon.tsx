'use client';

import { isNexbiIcon, isBrandIcon } from './icon-registry';
import type { NexbeIconProps, NexbeIconVariant, NexbiVariant, BrandVariant } from './types';

// ─── Variant → Tailwind color class mapping ────────────────────────

const VARIANT_CLASS: Record<NexbeIconVariant, string> = {
  flame:   'text-nexbe-flame',
  light:   'text-nexbe-text',
  dark:    'text-nexbe-deep',
  muted:   'text-nexbe-text-muted',
  inherit: '',
};

// ─── Helpers ───────────────────────────────────────────────────────

function cn(...classes: (string | undefined | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

function getNexbiSrc(name: string, variant: NexbiVariant): string {
  const suffix = variant === 'default' ? '' : `-${variant}`;
  return `/icons/nexbi/icon-${name}${suffix}.svg`;
}

function getBrandSrc(name: string, variant: BrandVariant = 'dark'): string {
  const suffix = variant === 'dark' ? '' : `-${variant}`;
  return `/icons/brand/icon-${name}${suffix}.svg`;
}

// ─── Component ─────────────────────────────────────────────────────

/**
 * Unified NEXBE brand icon component.
 *
 * For **line icons**: renders inline SVG via sprite `<use>`.
 * Color is controlled by the `variant` prop (maps to CSS text-color).
 *
 * For **NEXBi mini icons**: renders `<img>` with the correct variant file.
 * Use `nexbiVariant` to select: 'default' | 'light' | 'outlined'.
 *
 * For **brand illustrated icons**: renders `<img>` with color variant.
 * Use `brandVariant` to select: 'dark' (default) | 'light' | 'flame' | 'white' | 'plum'.
 *
 * @example
 * <NexbeIcon name="magazyn-energii" size={32} variant="flame" />
 * <NexbeIcon name="nexbi-ok" size={48} nexbiVariant="light" />
 * <NexbeIcon name="brand-certyfikat" size={64} />
 * <NexbeIcon name="brand-certyfikat" size={64} brandVariant="light" />
 */
export function NexbeIcon({
  name,
  size = 24,
  className,
  variant = 'flame',
  nexbiVariant = 'default',
  brandVariant = 'dark',
  style,
  ...rest
}: NexbeIconProps) {
  const ariaLabel = rest['aria-label'];

  if (isBrandIcon(name)) {
    // Brand illustrated icon — render as <img>
    return (
      <img
        src={getBrandSrc(name, brandVariant)}
        alt={ariaLabel || ''}
        width={size}
        height={size}
        className={cn('inline-block flex-shrink-0', className)}
        style={style}
        loading="lazy"
        decoding="async"
      />
    );
  }

  if (isNexbiIcon(name)) {
    // NEXBi mini icon — render as <img>
    return (
      <img
        src={getNexbiSrc(name, nexbiVariant)}
        alt={ariaLabel || ''}
        width={size}
        height={size}
        className={cn('inline-block flex-shrink-0', className)}
        style={style}
        loading="lazy"
        decoding="async"
      />
    );
  }

  // Line icon — render via sprite <use> with CSS color control
  const colorClass = VARIANT_CLASS[variant];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={cn('inline-block flex-shrink-0', colorClass, className)}
      style={style}
      role="img"
      aria-label={ariaLabel}
      aria-hidden={ariaLabel ? undefined : true}
    >
      <use href={`/icons/sprite.svg#icon-${name}`} />
    </svg>
  );
}

export default NexbeIcon;
