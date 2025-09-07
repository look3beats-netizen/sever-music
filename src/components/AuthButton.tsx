'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '../lib/supabase/client'

type Sess = Awaited<ReturnType<ReturnType<typeof createClient>['auth']['getSession']>>['data']['session']

export function AuthButton() {
  const supabase = createClient()
  const router = useRouter()
  const [session, setSession] = useState<Sess | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (mounted) setSession(session)
      setLoading(false)
    }
    init()
    const { data: sub } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess)
      router.refresh()
    })
    return () => {
      mounted = false
      sub.subscription.unsubscribe()
    }
  }, [router, supabase])

  const signInGithub = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: { redirectTo: window.location.origin }
    })
  }

  const signInEmail = async () => {
    const email = prompt('Введите ваш email для входа по ссылке:')
    if (!email) return
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin }
    })
    if (error) alert(error.message)
    else alert('Ссылка для входа отправлена на почту!')
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setSession(null)
    router.refresh()
  }

  if (loading) return <div className="text-sm text-gray-500">Загрузка…</div>

  if (!session?.user) {
    return (
      <div className="flex gap-2">
        <button onClick={signInGithub} className="btn-outline">GitHub</button>
        <button onClick={signInEmail} className="btn-primary">Email</button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-600 hidden sm:inline">{session.user.email}</span>
      <button onClick={signOut} className="btn-danger">Выйти</button>
    </div>
  )
}
