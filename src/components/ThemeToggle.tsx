'use client'
import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const [ready, setReady] = useState(false)
  const [dark, setDark] = useState(false)

  useEffect(() => {
    const d = localStorage.getItem('sever-theme') === 'dark'
    setDark(d)
    if (d) document.documentElement.classList.add('dark')
    setReady(true)
  }, [])

  const toggle = () => {
    const next = !dark
    setDark(next)
    document.documentElement.classList.toggle('dark', next)
    localStorage.setItem('sever-theme', next ? 'dark' : 'light')
  }

  if (!ready) return null
  return (
    <button onClick={toggle} className="btn-outline text-sm">
      {dark ? 'Светлая' : 'Тёмная'}
    </button>
  )
}
