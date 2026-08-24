# Supabase Setup — MONOKALA

Instruksi lengkap ada di jawaban chat. File di folder ini:

- **`schema.sql`** — SQL untuk membuat semua tabel, trigger, realtime, dan RLS.
  Copy isinya ke **SQL Editor** di Supabase dashboard, lalu klik **Run**.

Setelah SQL dijalankan, isi `.env.local` di root project dengan:

```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
```

Ambil kedua nilai itu dari **Project Settings → API** di Supabase.
