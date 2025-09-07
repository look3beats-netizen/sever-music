// src/app/profile/page.tsx
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import PublishToggle from '@/components/PublishToggle'

type MyTrack = {
  id: string
  title: string
  artist: string | null
  cover_url: string | null
  is_published: boolean
  created_at: string
}

export const dynamic = 'force-dynamic'

export default async function ProfilePage() {
  const supabase = createClient()

  // кто ты?
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return (
      <main className="page">
        <p className="text-gray-600">Войдите, чтобы увидеть свои треки.</p>
      </main>
    )
  }

  // мои треки
  const { data, error } = await supabase
    .from('tracks')
    .select('id,title,artist,cover_url,is_published,created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const tracks = (data ?? []) as MyTrack[]

  return (
    <main className="page">
      <h1 className="text-2xl font-bold mb-4">Мои треки</h1>

      {error && <p className="text-red-500 mb-4">Ошибка: {error.message}</p>}

      {tracks.length === 0 && <p className="text-gray-600">Пока нет треков.</p>}

      <ul className="grid gap-4 sm:grid-cols-2">
        {tracks.map(t => (
          <li key={t.id} className="card flex gap-4 items-center">
            {t.cover_url && (
              <Image
                src={t.cover_url}
                alt={t.title}
                width={72}
                height={72}
                className="rounded-xl object-cover"
              />
            )}
            <div className="flex-1">
              <div className="font-medium">{t.title}</div>
              <div className="text-sm text-gray-600">{t.artist ?? '—'}</div>

              <div className="mt-2 flex gap-2">
                <Link href={`/track/${t.id}`} className="btn-outline text-sm">
                  Открыть страницу
                </Link>
                <PublishToggle id={t.id} initial={t.is_published} />
              </div>

              <div className="mt-2 text-xs">
                Статус:{' '}
                <span className={t.is_published ? 'text-green-600' : 'text-yellow-700'}>
                  {t.is_published ? 'Опубликован' : 'Черновик'}
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </main>
  )
}
