/**
 * Official matka chart lists (matkaguessing.in reference)
 * Grouped by final ank: (d1 + d2 + d3) % 10
 */

export type PanaAnkSection = {
  ank: number;
  title: string;
  panas: string[];
};

function pad3(n: number | string): string {
  return String(n).padStart(3, '0');
}

/** Single Pana — 120 total · 12 per ank */
export const SINGLE_PANA_BY_ANK: PanaAnkSection[] = [
  {
    ank: 0,
    title: '0 Single Pana',
    panas: [127, 136, 145, 190, 235, 280, 370, 389, 460, 479, 569, 578].map(pad3),
  },
  {
    ank: 1,
    title: '1 Single Pana',
    panas: [128, 137, 146, 236, 245, 290, 380, 470, 489, 560, 579, 678].map(pad3),
  },
  {
    ank: 2,
    title: '2 Single Pana',
    panas: [129, 138, 147, 156, 237, 246, 345, 390, 480, 570, 589, 679].map(pad3),
  },
  {
    ank: 3,
    title: '3 Single Pana',
    panas: [120, 139, 148, 157, 238, 247, 256, 346, 490, 580, 670, 689].map(pad3),
  },
  {
    ank: 4,
    title: '4 Single Pana',
    panas: [130, 149, 158, 167, 239, 248, 257, 347, 356, 590, 680, 789].map(pad3),
  },
  {
    ank: 5,
    title: '5 Single Pana',
    panas: [140, 159, 168, 230, 249, 258, 267, 348, 357, 456, 690, 780].map(pad3),
  },
  {
    ank: 6,
    title: '6 Single Pana',
    panas: [123, 150, 169, 178, 240, 259, 268, 349, 358, 367, 457, 790].map(pad3),
  },
  {
    ank: 7,
    title: '7 Single Pana',
    panas: [124, 160, 278, 179, 250, 269, 340, 359, 368, 458, 467, 890].map(pad3),
  },
  {
    ank: 8,
    title: '8 Single Pana',
    panas: [125, 134, 170, 189, 260, 279, 350, 369, 468, 378, 459, 567].map(pad3),
  },
  {
    ank: 9,
    title: '9 Single Pana',
    panas: [126, 135, 180, 234, 270, 289, 360, 379, 450, 469, 478, 568].map(pad3),
  },
];

/** Double Pana chart — 94 panels (includes triple panas in chart) */
export const DOUBLE_PANA_BY_ANK: PanaAnkSection[] = [
  {
    ank: 0,
    title: '0 Double Pana',
    panas: [118, 226, 244, 299, 334, 488, 550, 668, 677].map(pad3),
  },
  {
    ank: 1,
    title: '1 Double Pana',
    panas: [100, 119, 155, 227, 335, 344, 399, 588, 669].map(pad3),
  },
  {
    ank: 2,
    title: '2 Double Pana',
    panas: [110, 200, 228, 255, 336, 444, 499, 660, 688, 778].map(pad3),
  },
  {
    ank: 3,
    title: '3 Double Pana',
    panas: [111, 229, 300, 337, 355, 445, 599, 779, 788].map(pad3),
  },
  {
    ank: 4,
    title: '4 Double Pana',
    panas: [112, 220, 266, 338, 400, 446, 455, 699, 770].map(pad3),
  },
  {
    ank: 5,
    title: '5 Double Pana',
    panas: [113, 122, 177, 339, 366, 447, 500, 555, 799, 889].map(pad3),
  },
  {
    ank: 6,
    title: '6 Double Pana',
    panas: [600, 114, 277, 330, 448, 466, 556, 880, 899].map(pad3),
  },
  {
    ank: 7,
    title: '7 Double Pana',
    panas: [115, 133, 188, 223, 377, 449, 557, 566, 700].map(pad3),
  },
  {
    ank: 8,
    title: '8 Double Pana',
    panas: [116, 224, 233, 288, 440, 477, 558, 800, 990].map(pad3),
  },
  {
    ank: 9,
    title: '9 Double Pana',
    panas: [117, 144, 199, 225, 333, 388, 441, 559, 577, 667, 900].map(pad3),
  },
];

/** Triple Pana — 10 total · 1 per ank */
export const TRIPLE_PANA_BY_ANK: PanaAnkSection[] = [
  { ank: 0, title: '0 Triple Pana', panas: ['000'] },
  { ank: 1, title: '1 Triple Pana', panas: ['777'] },
  { ank: 2, title: '2 Triple Pana', panas: ['444'] },
  { ank: 3, title: '3 Triple Pana', panas: ['111'] },
  { ank: 4, title: '4 Triple Pana', panas: ['888'] },
  { ank: 5, title: '5 Triple Pana', panas: ['555'] },
  { ank: 6, title: '6 Triple Pana', panas: ['222'] },
  { ank: 7, title: '7 Triple Pana', panas: ['999'] },
  { ank: 8, title: '8 Triple Pana', panas: ['666'] },
  { ank: 9, title: '9 Triple Pana', panas: ['333'] },
];

export function flattenChart(sections: PanaAnkSection[]): string[] {
  return sections.flatMap((s) => s.panas);
}

export const CHART_SINGLE_PANAS = flattenChart(SINGLE_PANA_BY_ANK);
export const CHART_DOUBLE_PANAS = flattenChart(DOUBLE_PANA_BY_ANK);
export const CHART_TRIPLE_PANAS = flattenChart(TRIPLE_PANA_BY_ANK);

const chartSet = (list: string[]) => new Set(list);

export const CHART_SINGLE_SET = chartSet(CHART_SINGLE_PANAS);
export const CHART_DOUBLE_SET = chartSet(CHART_DOUBLE_PANAS);
export const CHART_TRIPLE_SET = chartSet(CHART_TRIPLE_PANAS);

/** Match typed digits against chart panas (prefix first, then contains). */
export function searchChartPanas(pool: string[], query: string, limit = 12): string[] {
  const q = query.trim();
  if (!q) return [];

  const prefix: string[] = [];
  const contains: string[] = [];

  for (const p of pool) {
    if (p.startsWith(q)) prefix.push(p);
    else if (p.includes(q)) contains.push(p);
  }

  return [...prefix, ...contains].slice(0, limit);
}

/** Filter sections — keep groups that have matching panas. */
export function filterChartSections(
  sections: PanaAnkSection[],
  query: string
): PanaAnkSection[] {
  const q = query.trim();
  if (!q) return sections;

  return sections
    .map((s) => ({
      ...s,
      panas: s.panas.filter((p) => p.includes(q)),
    }))
    .filter((s) => s.panas.length > 0);
}
