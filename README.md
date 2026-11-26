# HomeFind – Real Estate web app

React + Vite (JavaScript) frontend with Supabase Google sign-in and role-based pages.

- **Customers** → `/properties` (property browsing with location / type / budget filters)
- **Owners** → `/owner/dashboard` (management dashboard)
- A floating chat button appears on every authenticated page. It is a **frontend-only
  placeholder**: nothing is sent anywhere yet (see `src/services/chatService.js`).

## Setup

```bash
npm install
cp .env.example .env     # then fill in the two public Supabase values
npm run dev              # http://localhost:5173
```

`.env` needs only the **public** values from Supabase → Project Settings → API:

```
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon / publishable key>
```

Never put the `service_role` key or any other secret in a `VITE_` variable – it would be
shipped to every browser.

## Supabase configuration (done in the Supabase / Google dashboards)

1. **Authentication → Providers → Google**: enable, add the Google OAuth client ID/secret.
2. **Google Cloud Console** → OAuth client → Authorised redirect URI:
   `https://<project-ref>.supabase.co/auth/v1/callback`
3. **Authentication → URL Configuration**:
   - Site URL: `http://localhost:5173` (change to the production URL at deployment)
   - Redirect URLs: `http://localhost:5173/auth/callback`
     (add the Cloudflare Pages URL + `/auth/callback` later)
4. **profiles RLS** – run `supabase/verify_profiles_rls.sql` (read-only) and confirm:
   - RLS is enabled on `public.profiles`;
   - a SELECT policy lets an authenticated user read **only their own row** (`auth.uid() = id`);
   - **no** INSERT/UPDATE policy lets a user create a profile or change `role`.

## How roles work

- After sign-in the app reads `id, full_name, email, role, created_at` from `profiles`
  where `id = auth.uid()` (`src/services/profileService.js`). The app never writes to `profiles`.
- Only `customer` and `owner` are accepted (`src/lib/roles.js`). A missing profile, a missing
  or unknown role, or a failed lookup sends the user to `/account-pending` – there is no
  default role.
- Route guards (`src/components/auth/RequireRole.jsx`) keep customers and owners on their own
  pages. This is **UI separation only**; data must be protected by Supabase RLS.

## Project structure

```
src/
  lib/            supabaseClient.js, roles.js
  context/        authContext.js, AuthProvider.jsx (session + profile + role)
  hooks/          useAuth.js
  services/       profileService.js, propertyService.js (not connected), chatService.js (placeholder)
  utils/          filterProperties.js
  components/
    auth/         RequireRole, RoleHomeRedirect
    layout/       Header, PublicLayout, AppLayout (adds the chatbot)
    chat/         ChatLauncher, ChatWindow, ChatMessage, chat.css
    property/     PropertyFilters, PropertyGrid, PropertyCard
    ui/           Button, Card, EmptyState, Notice, Spinner
  pages/          HomePage, LoginPage, AuthCallbackPage, AccountPendingPage, NotFoundPage,
                  customer/PropertiesPage, owner/DashboardPage
  styles/         tokens.css, global.css
public/_redirects SPA fallback for Cloudflare Pages (used at deployment)
supabase/verify_profiles_rls.sql  read-only RLS checks
```

## Not done yet (by design)

- Property inventory is not connected: the browsing page shows an empty state; no sample listings.
- Owner dashboard figures show "Not connected".
- The chatbot does not call n8n. When it does, it must send the Supabase access token so n8n
  can verify the user and look up the role server-side – never trust a role sent by the browser.
- No deployment.
