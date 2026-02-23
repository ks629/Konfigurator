import type { PVAzimuthPreset } from '@/lib/types';

/**
 * Mnozniki uzysku rocznego wzgledem optymalnej orientacji S/35deg.
 * Zrodlo: dane PV-GIS dla centralnej Polski (szerokosc ~52N).
 */
const azimuthMultipliers: Record<PVAzimuthPreset, number> = {
  S: 1.0,
  SE: 0.95,
  SW: 0.95,
  E: 0.82,
  W: 0.82,
  EW: 0.87,
  NE: 0.65,
  NW: 0.65,
  N: 0.55,
};

/**
 * Korekcja kata nachylenia wzgledem optymalnych 35deg.
 * Interpolacja liniowa miedzy punktami kontrolnymi.
 */
const tiltCorrection: [number, number][] = [
  [0, 0.87],   // dach plaski
  [15, 0.95],
  [25, 0.98],
  [30, 0.99],
  [35, 1.0],   // optimum
  [40, 0.99],
  [45, 0.97],
  [50, 0.93],
  [55, 0.89],
  [60, 0.85],
];

function interpolateTiltCorrection(tiltAngle: number): number {
  if (tiltAngle <= tiltCorrection[0][0]) return tiltCorrection[0][1];
  if (tiltAngle >= tiltCorrection[tiltCorrection.length - 1][0]) {
    return tiltCorrection[tiltCorrection.length - 1][1];
  }

  for (let i = 0; i < tiltCorrection.length - 1; i++) {
    const [a0, v0] = tiltCorrection[i];
    const [a1, v1] = tiltCorrection[i + 1];
    if (tiltAngle >= a0 && tiltAngle <= a1) {
      const t = (tiltAngle - a0) / (a1 - a0);
      return v0 + t * (v1 - v0);
    }
  }

  return 1.0;
}

/**
 * Zwraca laczny mnoznik orientacji (azymut * nachylenie).
 * Dla dachow plaskich (tilt=0) korekcja kata jest stosowana niezaleznie od azymutu.
 * Dla montazu naziemnego zakladamy optymalne 35deg.
 */
export function getOrientationMultiplier(
  preset: PVAzimuthPreset,
  tiltAngle: number
): number {
  const azimuth = azimuthMultipliers[preset];
  const tilt = interpolateTiltCorrection(tiltAngle);
  return Math.round(azimuth * tilt * 1000) / 1000;
}

export { azimuthMultipliers, tiltCorrection };
