import { createClient } from '../../lib/supabase/server'

export default async function ProfilePage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return <p>Сначала войдите в аккаунт.</p>

  return (
    <div>
      <h1 className="text-xl font-bold mb-2">Профиль</h1>
      <p>Email: {user.email}</p>
    </div>
  )
}
