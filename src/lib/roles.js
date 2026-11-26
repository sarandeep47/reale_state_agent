// Roles supported by this version of the app. Anything else is treated as "not set up".
// The role is only ever READ from the profiles table; the frontend never writes it.
export const ROLES = Object.freeze({
  CUSTOMER: 'customer',
  OWNER: 'owner',
});

const ALLOWED = new Set(Object.values(ROLES));

/** Returns a supported role or null. Never defaults to a role. */
export function normaliseRole(value) {
  if (typeof value !== 'string') return null;
  const role = value.trim().toLowerCase();
  return ALLOWED.has(role) ? role : null;
}

export const ROLE_HOME = Object.freeze({
  [ROLES.CUSTOMER]: '/properties',
  [ROLES.OWNER]: '/owner/dashboard',
});

export function homeForRole(role) {
  return ROLE_HOME[role] ?? '/account-pending';
}
