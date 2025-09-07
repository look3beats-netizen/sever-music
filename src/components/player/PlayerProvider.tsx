'use client'
import { createContext, useContext, useMemo, useState, ReactNode } from 'react'

type Track = { title: string, artist?: string, cover?: string, url: string }
type Ctx = {
  current: Track|null,
  queue: Track[],
  play: (t:Track)=>void,
  clear: ()=>void
}
const PlayerCtx = createContext<Ctx>({current:null, queue:[], play:()=>{}, clear:()=>{}})

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [current, setCurrent] = useState<Track|null>(null)
  const [queue, setQueue] = useState<Track[]>([])
  const ctx = useMemo<Ctx>(()=>({
    current, queue,
    play: (t)=>{ setCurrent(t) },
    clear: ()=>{ setCurrent(null); setQueue([]) }
  }),[current,queue])
  return <PlayerCtx.Provider value={ctx}>{children}</PlayerCtx.Provider>
}

export const usePlayer = ()=> useContext(PlayerCtx)
