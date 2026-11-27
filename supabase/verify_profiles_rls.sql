-- READ-ONLY checks for the public.profiles table used by the web app.
-- Run in Supabase Dashboard -> SQL Editor. These queries only read catalog
-- metadata; they do not change any table, policy or data.

-- 1) RLS must be ENABLED on profiles (relrowsecurity = true).
select relname, relrowsecurity as rls_enabled, relforcerowsecurity as rls_forced
from pg_class
where oid = 'public.profiles'::regclass;

-- 2) All policies on profiles.
--    REQUIRED for the app: a SELECT policy for role "authenticated" whose USING
--    expression limits rows to the user's own row, e.g. (auth.uid() = id).
--    MUST NOT EXIST: any INSERT/UPDATE/ALL policy for "authenticated" or "anon"
--    that would let a user create a profile with a role or change their own role.
select policyname, cmd, roles, permissive, qual as using_expr, with_check
from pg_policies
where schemaname = 'public' and tablename = 'profiles'
order by cmd, policyname;

-- 3) Table-level privileges granted to the API roles.
--    Supabase grants broad privileges by default and relies on RLS, so INSERT/UPDATE
--    showing here is normal; what matters is that no policy in (2) permits them.
select grantee, privilege_type
from information_schema.role_table_grants
where table_schema = 'public' and table_name = 'profiles'
  and grantee in ('anon', 'authenticated')
order by grantee, privilege_type;

-- 4) Column-level UPDATE privileges on "role" (if column grants are used).
select grantee, privilege_type, column_name
from information_schema.column_privileges
where table_schema = 'public' and table_name = 'profiles'
  and column_name = 'role' and grantee in ('anon', 'authenticated');

-- 5) Triggers on profiles (e.g. a guard that blocks role changes) and on auth.users
--    (e.g. a trigger that creates a profile row on sign-up, and which role it assigns).
select event_object_schema as schema, event_object_table as table_name,
       trigger_name, event_manipulation as event, action_statement
from information_schema.triggers
where (event_object_schema = 'public' and event_object_table = 'profiles')
   or (event_object_schema = 'auth' and event_object_table = 'users')
order by schema, table_name, trigger_name;

-- 6) Allowed values for role (a CHECK constraint, if one exists).
select conname, pg_get_constraintdef(oid) as definition
from pg_constraint
where conrelid = 'public.profiles'::regclass and contype = 'c';

-- 7) Triggers on public.profiles and auth.users, read directly from pg_trigger.
--    Unlike information_schema.triggers (query 5), this also lists triggers on
--    tables the current user does not own, such as auth.users on Supabase.
--    Look for: a sign-up trigger on auth.users that creates the profile row (then
--    check which role its function assigns), and any guard trigger on profiles.
--    Internal (system-generated) triggers, e.g. for foreign keys, are excluded.
select tn.nspname                as table_schema,
       c.relname                 as table_name,
       t.tgname                  as trigger_name,
       case t.tgenabled
         when 'O' then 'enabled'
         when 'D' then 'disabled'
         when 'R' then 'replica only'
         when 'A' then 'always'
         else t.tgenabled::text
       end                       as trigger_enabled,
       t.tgisinternal            as is_internal,
       pn.nspname                as trigger_function_schema,
       p.proname                 as trigger_function_name,
       pg_get_triggerdef(t.oid)  as trigger_definition
from pg_trigger t
join pg_class c       on c.oid = t.tgrelid
join pg_namespace tn  on tn.oid = c.relnamespace
join pg_proc p        on p.oid = t.tgfoid
join pg_namespace pn  on pn.oid = p.pronamespace
where not t.tgisinternal
  and ((tn.nspname = 'public' and c.relname = 'profiles')
    or (tn.nspname = 'auth'   and c.relname = 'users'))
order by table_schema, table_name, trigger_name;
