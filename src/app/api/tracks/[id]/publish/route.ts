export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Временный GET — проверка, что маршрут существует
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  return NextResponse.json({ ok: true, id: params.id })
}

// PATCH: переключение публикации
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    const is_published = body?.is_published
    if (typeof is_published !== 'boolean') {
      return NextResponse.json({ error: 'is_published must be boolean' }, { status: 400 })
    }

    const supabase = createClient()
    const res = await supabase.auth.getUser()
    const user = res.data?.user
    const uerr = res.error
    if (uerr) return NextResponse.json({ error: 'auth error: ' + uerr.message }, { status: 401 })
    if (!user) return NextResponse.json({ error: 'unauthorized: no user' }, { status: 401 })

    // Обновляем по id  RLS не даст менять чужое
    const upd = await supabase
      .from('tracks')
      .update({ is_published })
      .eq('id', params.id)

    if (upd.error) {
      return NextResponse.json({ error: 'db error: ' + upd.error.message }, { status: 400 })
    }

    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: (e?.message ?? 'unknown') }, { status: 500 })
  }
}