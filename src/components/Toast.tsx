'use client'
import { createContext, useContext, useState, ReactNode, useCallback } from 'react'

type Toast = { id: number, text: string, kind?: 'success'|'error'|'info' }
const Ctx = createContext<{push:(t:string,kind?:Toast['kind'])=>void}>({push:()=>{}})

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Toast[]>([])
  const push = useCallback((text:string, kind:Toast['kind']='info')=>{
    const id = Date.now()
    setItems(s=>[...s,{id,text,kind}])
    setTimeout(()=> setItems(s=>s.filter(i=>i.id!==id)), 3000)
  },[])
  return (
    <Ctx.Provider value={{push}}>
      {children}
      <div className="fixed bottom-4 right-4 space-y-2 z-50">
        {items.map(t=>(
          <div key={t.id}
               className={`card animate-fade px-4 py-2 text-sm shadow-lg ${t.kind==='success'?'border-l-4 border-green-500': t.kind==='error'?'border-l-4 border-red-500':'border-l-4 border-blue-500'}`}>
            {t.text}
          </div>
        ))}
      </div>
    </Ctx.Provider>
  )
}
export const useToast = ()=> useContext(Ctx)
