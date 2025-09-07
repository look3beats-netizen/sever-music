# Sever Music

Minimal music service (catalog + player + upload).

## Tech stack
- Next.js (App Router) + TypeScript + Tailwind
- Supabase (Auth, Postgres, Storage, RLS)
- Deploy on Vercel

## ENV (.env.local)
```
NEXT_PUBLIC_SUPABASE_URL=your-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Database SQL
```sql
create table profiles (
  id uuid primary key references auth.users on delete cascade,
  username text unique,
  avatar_url text,
  created_at timestamptz default now()
);
alter table profiles enable row level security;
create policy "profiles_select" on profiles for select using (true);
create policy "profiles_insert" on profiles for insert with check (auth.uid() = id);
create policy "profiles_update" on profiles for update using (auth.uid() = id);

create table tracks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade,
  title text not null,
  artist text,
  description text,
  audio_path text not null,
  cover_url text,
  duration_seconds int,
  created_at timestamptz default now()
);
create index tracks_created_at_idx on tracks(created_at desc);
alter table tracks enable row level security;
create policy "tracks_select" on tracks for select using (true);
create policy "tracks_insert" on tracks for insert with check (auth.role() = 'authenticated');
create policy "tracks_update" on tracks for update using (auth.uid() = user_id);

create table listens (
  track_id uuid references tracks on delete cascade,
  user_id uuid references auth.users on delete cascade,
  listened_at timestamptz default now()
);
create index listens_track_id_idx on listens(track_id);
alter table listens enable row level security;
create policy "listens_select" on listens for select using (true);
create policy "listens_insert" on listens for insert with check (auth.role() = 'authenticated');
```

## Storage
- audio (private)
- covers (public)

## Run
```
npm install
npm run dev
```
