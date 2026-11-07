export const CATEGORY_COLORS = [
  "#6d6af0",
  "#34d399",
  "#fb7185",
  "#fbbf24",
  "#38bdf8",
  "#f472b6",
  "#a78bfa",
  "#2dd4bf",
] as const;

export const DEFAULT_CATEGORIES = [
  { name: "Mercado", color: CATEGORY_COLORS[0] },
  { name: "Transporte", color: CATEGORY_COLORS[4] },
  { name: "Salário", color: CATEGORY_COLORS[1] },
  { name: "Lazer", color: CATEGORY_COLORS[5] },
  { name: "Outros", color: CATEGORY_COLORS[6] },
];
