export const parseNumberParam = (val: string | null | undefined, fallback: number, min?: number, max?: number) => {
  if (!val) return fallback;
  const parsed = parseInt(val, 10);
  if (isNaN(parsed)) return fallback;
  if (min !== undefined && parsed < min) return min;
  if (max !== undefined && parsed > max) return max;
  return parsed;
};

export const parseStringParam = (val: string | null | undefined, fallback: string = '') => {
  return val ? val : fallback;
};

export const parseSortOrder = (val: string | null | undefined): 'asc' | 'desc' => {
  if (val === 'asc' || val === 'desc') return val;
  return 'asc';
};
