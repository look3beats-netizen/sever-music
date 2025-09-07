'use client'
import { useEffect, useRef } from 'react'
import { usePlayer } from './player/PlayerProvider'

export default function MiniPlayer(){
  const { current, clear } = usePlayer()
  const ref = useRef<HTMLAudioElement>(null)

  useEffect(()=>{ if (current && ref.current){ ref.current.play().catch(()=>{}) }},[current])

  if (!current) return null
  return (
    <div className="fixed bottom-0 inset-x-0 z-40">
      <div className="mx-auto max-w-3xl m-4 card flex items-center gap-3">
        {current.cover && (
          <img src={current.cover} alt="cover" className="w-12 h-12 rounded-lg object-cover"/>
        )}
        <div className="flex-1">
          <div className="text-sm font-semibold">{current.title}</div>
          {current.artist && <div className="text-xs text-gray-500 dark:text-gray-400">{current.artist}</div>}
          <audio ref={ref} className="w-full" controls src={current.url} />
        </div>
        <button className="btn-outline" onClick={clear}>Закрыть</button>
      </div>
    </div>
  )
}
