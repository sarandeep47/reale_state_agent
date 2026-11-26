const toNumber = (value) => {
  if (value === '' || value === null || value === undefined) return null;
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? n : null;
};

/**
 * Pure client-side filter. Expects properties shaped like
 * { location: string, property_type: string, price: number }.
 */
export function filterProperties(properties, filters) {
  const location = filters.location.trim().toLowerCase();
  const type = filters.propertyType;
  const min = toNumber(filters.budgetMin);
  const max = toNumber(filters.budgetMax);

  return properties.filter((p) => {
    if (location && !String(p.location ?? '').toLowerCase().includes(location)) return false;
    if (type && String(p.property_type ?? '').toLowerCase() !== type.toLowerCase()) return false;
    const price = toNumber(p.price);
    if (min !== null && (price === null || price < min)) return false;
    if (max !== null && (price === null || price > max)) return false;
    return true;
  });
}

export const EMPTY_FILTERS = Object.freeze({
  location: '',
  propertyType: '',
  budgetMin: '',
  budgetMax: '',
});

export function formatInr(amount) {
  const n = toNumber(amount);
  if (n === null) return '-';
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
}
