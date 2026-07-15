/**
 * Satta Matka / Kalyan – official panel (patti) rules
 * ----------------------------------------------------
 * Single Pana (SP): 3 unique digits ascending → 120
 * Double Pana (DP): exactly 2 digits same ascending → 90
 * Triple Pana (TP): all 3 same → 10  (kept for charts)
 *
 * Digits always stored ASCENDING (e.g. 128, 001, 112).
 *
 * Single Digit / Ank of a pana = (d1 + d2 + d3) % 10
 *
 * Jodi = Open digit × 10 + Close digit → 00–99 (100)
 *
 * Pana Family = Cut Digit system
 *   Cut pairs: 1↔6, 2↔7, 3↔8, 4↔9, 5↔0
 *   Swap each distinct digit value (keep or cut), renorm ascending.
 *   SP family → 8 unique · DP family → 4 unique
 */

import {
  CHART_DOUBLE_PANAS,
  CHART_SINGLE_PANAS,
  CHART_TRIPLE_PANAS,
} from './panaCharts';

export type PanaType = 'SP' | 'DP' | 'TP';

/** Cut digit: each digit’s partner exactly +5 mod 10. */
export function getCutDigit(d: number): number {
  return (d + 5) % 10;
}

/** Ank / single from a 3-digit pana. */
export function getPanaAnk(pana: string): number {
  if (!/^\d{3}$/.test(pana)) {
    throw new Error(`Invalid pana: ${pana}`);
  }
  const a = Number(pana[0]);
  const b = Number(pana[1]);
  const c = Number(pana[2]);
  return (a + b + c) % 10;
}

function sortDigits(a: number, b: number, c: number): string {
  return [a, b, c].sort((x, y) => x - y).join('');
}

/** Normalize any 3-digit writing to ascending panel form. */
export function normalizePana(pana: string): string {
  if (!/^\d{3}$/.test(pana)) return pana;
  return sortDigits(Number(pana[0]), Number(pana[1]), Number(pana[2]));
}

export function getPanaType(pana: string): PanaType | null {
  const n = normalizePana(pana);
  if (!/^\d{3}$/.test(n)) return null;
  const uniq = new Set(n.split('')).size;
  if (uniq === 3) return 'SP';
  if (uniq === 2) return 'DP';
  if (uniq === 1) return 'TP';
  return null;
}

/** Single Pana — 120: all three digits different (ascending). */
export function generateSinglePanas(): string[] {
  const list: string[] = [];
  for (let a = 0; a <= 9; a++) {
    for (let b = a + 1; b <= 9; b++) {
      for (let c = b + 1; c <= 9; c++) {
        list.push(`${a}${b}${c}`);
      }
    }
  }
  return list;
}

/** Double Pana — 90: exactly two digits identical (ascending). */
export function generateDoublePanas(): string[] {
  const set = new Set<string>();
  for (let repeated = 0; repeated <= 9; repeated++) {
    for (let other = 0; other <= 9; other++) {
      if (other === repeated) continue;
      set.add(sortDigits(repeated, repeated, other));
    }
  }
  return Array.from(set).sort();
}

/** Triple Pana — 10: 000, 111, … 999 */
export function generateTriplePanas(): string[] {
  return Array.from({ length: 10 }, (_, i) => `${i}${i}${i}`);
}

/** Jodi — 00–99 (100) */
export function generateJodis(): string[] {
  return Array.from({ length: 100 }, (_, i) => i.toString().padStart(2, '0'));
}

/**
 * Double Digit board — same valid set as Jodi (00–99).
 * (Bet type differs in payout / UI, number list is identical.)
 */
export function generateDoubleDigits(): string[] {
  return generateJodis();
}

export const SINGLE_PANAS = CHART_SINGLE_PANAS;
export const DOUBLE_PANAS = CHART_DOUBLE_PANAS;
export const TRIPLE_PANAS = CHART_TRIPLE_PANAS;
export const JODIS = generateJodis();
export const DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'] as const;

/** Union of all chart panels (220 unique) */
export const ALL_PANAS = Array.from(
  new Set([...SINGLE_PANAS, ...DOUBLE_PANAS, ...TRIPLE_PANAS])
);

/**
 * Cut-digit Pana Family of a base pana.
 * Distinct digit values are swapped (keep / cut); each triplet re-sorted.
 * SP → 8 members · DP → 4 · TP → 2
 */
export function getCutFamily(pana: string): string[] {
  const n = normalizePana(pana);
  if (!/^\d{3}$/.test(n)) return [];
  const digits = [Number(n[0]), Number(n[1]), Number(n[2])];
  const unique: number[] = [];
  for (const d of digits) {
    if (!unique.includes(d)) unique.push(d);
  }

  const results = new Set<string>();
  const m = unique.length;
  for (let mask = 0; mask < 1 << m; mask++) {
    const map = new Map<number, number>();
    unique.forEach((d, i) => {
      map.set(d, mask & (1 << i) ? getCutDigit(d) : d);
    });
    const next = digits.map((d) => map.get(d)!);
    results.add(sortDigits(next[0], next[1], next[2]));
  }
  return Array.from(results).sort();
}

/** @deprecated use getCutFamily */
export function getPanaFamily(pana: string): string[] {
  return getCutFamily(pana);
}

export function getFamilyBreakdown(pana: string) {
  const all = getCutFamily(pana);
  const type = getPanaType(pana);
  return {
    all,
    base: normalizePana(pana),
    type,
    /** Typical max: SP 8 · DP 4 · TP 2 (can be less if cut overlaps set) */
    expectedSize: type === 'SP' ? 8 : type === 'DP' ? 4 : 2,
    sp: all.filter((p) => getPanaType(p) === 'SP'),
    dp: all.filter((p) => getPanaType(p) === 'DP'),
    tp: all.filter((p) => getPanaType(p) === 'TP'),
    ank: getPanaAnk(normalizePana(pana)),
  };
}

/** Validate a typed SP / DP / any-pana entry before accepting a bid. */
export function isValidSinglePana(pana: string): boolean {
  return CHART_SINGLE_PANAS.includes(pana.padStart(3, '0'));
}

export function isValidDoublePana(pana: string): boolean {
  return CHART_DOUBLE_PANAS.includes(pana.padStart(3, '0'));
}

export function isValidTriplePana(pana: string): boolean {
  return CHART_TRIPLE_PANAS.includes(pana.padStart(3, '0'));
}

export function isValidPana(pana: string): boolean {
  const p = pana.padStart(3, '0');
  return ALL_PANAS.includes(p);
}

/** Hard self-check — throws if chart maths ever drifts. */
export function assertPanaChartIntegrity(): void {
  if (SINGLE_PANAS.length !== 120) {
    throw new Error(`SP must be 120, got ${SINGLE_PANAS.length}`);
  }
  if (DOUBLE_PANAS.length !== 94) {
    throw new Error(`DP chart must be 94, got ${DOUBLE_PANAS.length}`);
  }
  if (TRIPLE_PANAS.length !== 10) {
    throw new Error(`TP must be 10, got ${TRIPLE_PANAS.length}`);
  }
  if (ALL_PANAS.length !== 220) {
    throw new Error(`All panas must be 220, got ${ALL_PANAS.length}`);
  }
  if (JODIS.length !== 100) {
    throw new Error(`Jodi must be 100, got ${JODIS.length}`);
  }

  // Cut digit map
  const cutPairs: [number, number][] = [
    [1, 6],
    [2, 7],
    [3, 8],
    [4, 9],
    [5, 0],
  ];
  for (const [a, b] of cutPairs) {
    if (getCutDigit(a) !== b || getCutDigit(b) !== a) {
      throw new Error(`Cut pair broken: ${a}↔${b}`);
    }
  }

  // Spec example: SP 123 → exactly these 8 (no cut-overlap)
  const fam123 = getCutFamily('123');
  const expect123 = ['123', '128', '137', '178', '236', '268', '367', '678'];
  if (fam123.join(',') !== expect123.join(',')) {
    throw new Error(`123 family wrong: ${fam123.join(',')}`);
  }

  // DP without cut-overlap → 4
  const fam224 = getCutFamily('224');
  if (fam224.length !== 4) {
    throw new Error(`224 family must be 4, got ${fam224.length}`);
  }

  // Family never empty for valid panas
  for (const p of ALL_PANAS) {
    const size = getCutFamily(p).length;
    if (size < 2) {
      throw new Error(`Family ${p} too small: ${size}`);
    }
  }

  // Ank examples from spec
  if (getPanaAnk('138') !== 2) throw new Error('138 ank must be 2');
  if (getPanaAnk('224') !== 8) throw new Error('224 ank must be 8');
}

if (__DEV__) {
  assertPanaChartIntegrity();
}
