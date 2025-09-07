import { NextResponse } from 'next/server'
import { createClient } from '../../../lib/supabase/server'

export async function POST(req: Request) {
  const supabase = createClient()
  const body = await req.json()
  const { track_id } = body

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await supabase.from('listens').insert({ track_id, user_id: user.id })
  return NextResponse.json({ ok: true })
}
