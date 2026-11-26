/**
 * Property inventory source.
 *
 * Real inventory is NOT connected yet, so this returns an empty list and a
 * "not_connected" status. No sample or fake listings are ever returned.
 * When the inventory table is ready, replace the body with a Supabase query
 * (protected by RLS) and keep the same return shape.
 *
 * @returns {Promise<{ status: 'not_connected'|'ok'|'error', properties: Array, error?: Error }>}
 */
export async function listProperties() {
  return { status: 'not_connected', properties: [] };
}

export const PROPERTY_TYPES = Object.freeze([
  'Apartment',
  'Villa',
  'Independent House',
  'Plot',
  'Commercial',
]);
