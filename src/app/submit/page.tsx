'use client'
import { useEffect, useMemo, useState, FormEvent } from 'react'
import { createClient } from '../../lib/supabase/client'
import { useToast } from '../../components/Toast'
import DropzoneUploader from '../../components/DropzoneUploader'

type Draft = {
  nickname: string; title: string; artist: string; features: string; genre: string; releaseDate: string;
  language: string; lyrics: string; email: string; links: string; notes: string; agree: boolean;
}
const GENRES = ['Рэп / Хип-хоп','Поп','Рок','Электроника','R&B / Соул','Инструментал','Другое']
const LANGS = ['Русский','Английский','Испанский','Другой']
const DRAFT_KEY = 'sever-submit-draft'

export default function SubmitPage() {
  const supabase = createClient()
  const { push } = useToast()

  const [step,setStep] = useState(1); const totalSteps=4
  const [sending,setSending]=useState(false)
  const [audio,setAudio]=useState<File|null>(null)
  const [cover,setCover]=useState<File|null>(null)

  const [data,setData]=useState<Draft>({ nickname:'', title:'', artist:'', features:'', genre:'',
    releaseDate:'', language:'', lyrics:'', email:'', links:'', notes:'', agree:false })

  // Загрузка/сохранение черновика
  useEffect(()=>{ try{ const s=localStorage.getItem(DRAFT_KEY); if(s) setData(JSON.parse(s)) }catch{} },[])
  useEffect(()=>{ const id=setTimeout(()=>localStorage.setItem(DRAFT_KEY, JSON.stringify(data)), 400); return ()=>clearTimeout(id) },[data])

  const progress = useMemo(()=> Math.round(step/totalSteps*100), [step])

  const onChange = <K extends keyof Draft>(k:K,v:Draft[K])=> setData(d=>({...d,[k]:v}))

  const validateStep = ()=>{
    if(step===1 && (!data.nickname.trim() || !data.title.trim())) return 'Заполните «Никнейм» и «Название релиза».'
    if(step===3 && !audio) return 'Добавьте аудиофайл.'
    if(step===4 && !data.agree) return 'Подтвердите владение правами.'
    return null
  }
  const handleNext = ()=>{ const e=validateStep(); if(e) return push(e,'error'); setStep(s=>Math.min(totalSteps,s+1)) }
  const prev = ()=> setStep(s=>Math.max(1,s-1))

  async function submit(e:FormEvent){
    e.preventDefault()
    const err=validateStep(); if (err) return push(err,'error')
    setSending(true)
    try{
      const { data: sess } = await supabase.auth.getSession()
      const userId = sess.session?.user?.id
      if(!userId) { push('Войдите в аккаунт','error'); return }

      // upload audio
      let audioPath=''; if(audio){ audioPath=`${userId}/${Date.now()}-${audio.name}`
        const { error } = await supabase.storage.from('audio').upload(audioPath, audio)
        if(error) { push('Ошибка загрузки аудио','error'); return }
      }
      // upload cover
      let coverUrl=''; if(cover){ const coverPath=`${userId}/${Date.now()}-${cover.name}`
        const { data: up, error } = await supabase.storage.from('covers').upload(coverPath, cover)
        if(error){ push('Ошибка загрузки обложки','error'); return }
        coverUrl = supabase.storage.from('covers').getPublicUrl(up.path).data.publicUrl
      }

      const { error: insertError } = await supabase.from('submissions').insert({
        user_id: userId, nickname: data.nickname, title: data.title, artist: data.artist,
        features: data.features, genre: data.genre, release_date: data.releaseDate || null,
        language: data.language, lyrics: data.lyrics, email: data.email, links: data.links,
        notes: data.notes, audio_path: audioPath, cover_url: coverUrl, status: 'new'
      })
      if(insertError){ push(`Не удалось сохранить заявку: ${insertError.message}`,'error'); return }

      localStorage.removeItem(DRAFT_KEY)
      push('Заявка отправлена!','success')
      setStep(1); setAudio(null); setCover(null)
      setData({ nickname:'', title:'', artist:'', features:'', genre:'', releaseDate:'', language:'', lyrics:'', email:'', links:'', notes:'', agree:false })
    } finally { setSending(false) }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-3">Отправить заявку</h1>

      {/* Прогресс */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span>Шаг {step} из {totalSteps}</span><span>{progress}%</span>
        </div>
        <div className="progress"><div className="progress-inner" style={{width:`${progress}%`}} /></div>
      </div>

      <form onSubmit={submit} className="space-y-6">
        {step===1 && (
          <section className="card-section space-y-4">
            <h2 className="font-semibold text-lg">Основная информация</h2>
            <div>
              <label className="label">Никнейм*</label>
              <input className="input" value={data.nickname} onChange={e=>onChange('nickname', e.target.value)} />
            </div>
            <div>
              <label className="label">Название релиза*</label>
              <input className="input" value={data.title} onChange={e=>onChange('title', e.target.value)} />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Артист</label>
                <input className="input" value={data.artist} onChange={e=>onChange('artist', e.target.value)} />
              </div>
              <div>
                <label className="label">Фичеринги</label>
                <input className="input" placeholder="через запятую" value={data.features} onChange={e=>onChange('features', e.target.value)} />
              </div>
            </div>
          </section>
        )}

        {step===2 && (
          <section className="card-section space-y-4">
            <h2 className="font-semibold text-lg">Дополнительно</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Жанр</label>
                <select className="input" value={data.genre} onChange={e=>onChange('genre', e.target.value)}>
                  <option value="">Выберите жанр…</option>
                  {GENRES.map(g=> <option key={g}>{g}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Дата релиза</label>
                <input type="date" className="input" value={data.releaseDate} onChange={e=>onChange('releaseDate', e.target.value)} />
              </div>
              <div>
                <label className="label">Язык</label>
                <select className="input" value={data.language} onChange={e=>onChange('language', e.target.value)}>
                  <option value="">Выберите язык…</option>
                  {LANGS.map(l=> <option key={l}>{l}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="label">Лирика</label>
              <textarea className="textarea" rows={4} value={data.lyrics} onChange={e=>onChange('lyrics', e.target.value)} />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Email</label>
                <input type="email" className="input" value={data.email} onChange={e=>onChange('email', e.target.value)} />
              </div>
              <div>
                <label className="label">Ссылки</label>
                <input className="input" value={data.links} onChange={e=>onChange('links', e.target.value)} />
              </div>
            </div>
            <div>
              <label className="label">Заметки</label>
              <textarea className="textarea" rows={3} value={data.notes} onChange={e=>onChange('notes', e.target.value)} />
            </div>
          </section>
        )}

        {step===3 && (
          <section className="card-section space-y-4">
            <h2 className="font-semibold text-lg">Файлы</h2>

            <DropzoneUploader
              label="Аудио (mp3/wav) — drag&drop"
              accept="audio/*"
              onFile={(f, meta)=>{ setAudio(f); if(meta?.title && !data.title) onChange('title', meta.title); if(meta?.artist && !data.artist) onChange('artist', meta.artist) }}
            />

            <DropzoneUploader
              label="Обложка (jpg/png) — drag&drop"
              accept="image/*"
              previewImage
              onFile={(f)=> setCover(f)}
            />
          </section>
        )}

        {step===4 && (
          <section className="card-section space-y-4">
            <h2 className="font-semibold text-lg">Подтверждение</h2>
            <ul className="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300 space-y-1">
              <li>Проверьте данные перед отправкой.</li>
              <li>Файлы хранятся безопасно (Supabase Storage).</li>
            </ul>
            <label className="flex items-start gap-2">
              <input type="checkbox" className="mt-1" checked={data.agree} onChange={(e)=>onChange('agree', e.target.checked)} />
              <span className="text-sm">Подтверждаю право на использование материала.</span>
            </label>
          </section>
        )}

        {/* навигация */}
        <div className="flex justify-between">
          <button type="button" onClick={prev} disabled={step===1||sending} className={`btn-outline ${step===1||sending?'btn-disabled':''}`}>Назад</button>
          {step<totalSteps
            ? <button type="button" onClick={handleNext} disabled={sending} className={`btn-primary ${sending?'btn-disabled':''}`}>Далее</button>
            : <button type="submit" disabled={sending} className={`btn-primary ${sending?'btn-disabled':''}`}>{sending?'Отправляем…':'Отправить'}</button>}
        </div>
      </form>
    </div>
  )
}
