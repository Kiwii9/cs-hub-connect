# KFU Study Hub — Fix Notes and Deployment Checklist

## Main issues found

1. **Build setup was broken in a fresh zip**
   - The project zip did not include `node_modules`, so `npm run build` failed with `vite: not found` until dependencies are installed.
   - `package-lock.json` was out of sync with `package.json`, which made `npm ci` fail. The lockfile has been refreshed.

2. **The product was still CS-only**
   - Branding, homepage copy, footer copy, roadmap, course cards, and filters were focused on Computer Science.
   - The database type file did not expose `college`, `major`, or `program_type` on courses.

3. **Practice and Summary were still first-class resource types**
   - They appeared in upload options and course tabs.
   - This has been removed from the upload flow and course page.
   - Old database rows with legacy `summary` or `practice` values are still displayed safely as `Study Guide` and `Exercises` so existing content does not crash the app.

4. **Email validation was too narrow**
   - The app now accepts `@student.kfu.edu.sa` and `@kfu.edu.sa` on the client.
   - The new Supabase migration updates the server-side trigger too, so users cannot bypass the rule from the frontend.

5. **Lecturer was required for every upload**
   - This can block courses from other colleges where lecturer data is missing.
   - The new migration makes `resources.lecturer_id` nullable, and the upload code now supports optional lecturer values.

6. **Repository cleanup**
   - Removed accidental root files: `git` and `e -i HEAD~10`.
   - Added `.env.example` for safer public repo setup.

## What changed

- Renamed the product to **KFU Study Hub**.
- Added `src/data/kfuCatalog.ts` for KFU-wide college/resource filter data.
- Removed Practice/Summary tabs from course pages.
- Removed Practice/Summary options from upload validation and UI.
- Added college/major badges to course cards and course detail pages.
- Improved homepage UI with stronger hero section, cleaner filters, rounded cards, and KFU-wide messaging.
- Updated footer, login page, roadmap, and academic-integrity copy.
- Added migration: `supabase/migrations/20260508170000_expand_to_all_kfu_majors.sql`.

## Required steps before deploying

Run these locally from the project root:

```bash
npm ci
npm run build
```

Then apply the Supabase migration:

```bash
supabase db push
```

If you are deploying through Netlify, set these environment variables in Netlify instead of relying only on a local `.env` file:

```bash
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```

## Important production notes

- Do not hardcode an admin email/password into the frontend.
- Create the admin account through Supabase Auth, then assign admin rights from the database/admin panel.
- Add real KFU course rows gradually by college and major. The UI supports all majors, but the database still needs actual course data.
- Keep the legacy `summary` and `practice` enum values in Supabase until old rows are migrated or deleted. Removing them immediately could break old records.
