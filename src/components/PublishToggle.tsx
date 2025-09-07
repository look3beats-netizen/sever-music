'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function PublishToggle({
  id,
  initial,
}: {
  id: string
  initial: boolean
}) {
  const [value, setValue] = useState(initial)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const toggle = async () => {
    if (loading) return
    setLoading(true)
    try {
      const res = await fetch(`/api/tracks/${id}/publish`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_published: !value }),
      })

      const text = await res.text() // читаем ответ как текст
      let json: any = {}
      try {
        json = JSON.parse(text)
      } catch {
        json = { raw: text }
      }

      if (!res.ok) {
        alert('Ошибка: ' + (json.error || JSON.stringify(json)))
      } else {
        setValue(!value)
        router.refresh()
      }
    } catch (e: any) {
      alert('Ошибка JS: ' + e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={toggle}
      className={`btn ${value ? 'btn-outline' : 'btn-primary'}`}
      disabled={loading}
    >
      {loading ? '...' : value ? 'Скрыть' : 'Опубликовать'}
    </button>
  )
}
