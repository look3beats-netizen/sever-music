'use client'
import { useState } from 'react'
import { createClient } from '../../lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function UploadPage() {
  const [title, setTitle] = useState('')
  const [artist, setArtist] = useState('')
  const [audio, setAudio] = useState<File | null>(null)
  const [cover, setCover] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const router = useRouter()

  const supabase = createClient()

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!audio) return alert('Пожалуйста, выберите аудиофайл')

    setIsUploading(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const user = session?.user
      if (!user) {
        alert('Сначала войдите в аккаунт')
        return
      }

      const audioPath = `${user.id}/${Date.now()}-${audio.name}`
      const { error: audioError } = await supabase.storage.from('audio').upload(audioPath, audio)
      if (audioError) {
        console.error(audioError)
        alert(`Ошибка загрузки аудио: ${audioError.message}`)
        return
      }

      let coverUrl = ''
      if (cover) {
        const coverPath = `${user.id}/${Date.now()}-${cover.name}`
        const { data: coverData, error: coverError } = await supabase.storage.from('covers').upload(coverPath, cover)
        if (coverError) {
          console.error(coverError)
          alert(`Ошибка загрузки обложки: ${coverError.message}`)
          return
        }
        coverUrl = supabase.storage.from('covers').getPublicUrl(coverData.path).data.publicUrl
      }

      const { error: insertError } = await supabase.from('tracks').insert({
        user_id: user.id,
        title,
        artist,
        audio_path: audioPath,
        cover_url: coverUrl,
      })

      if (insertError) {
        console.error(insertError)
        alert(`Ошибка сохранения трека: ${insertError.message}`)
        return
      }

      router.push('/')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <form onSubmit={handleUpload} className="space-y-4">
      <input
        className="border p-2 w-full"
        placeholder="Название трека"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <input
        className="border p-2 w-full"
        placeholder="Исполнитель"
        value={artist}
        onChange={(e) => setArtist(e.target.value)}
      />
      <input type="file" accept="audio/*" onChange={(e) => setAudio(e.target.files?.[0] || null)} required />
      <input type="file" accept="image/*" onChange={(e) => setCover(e.target.files?.[0] || null)} />
      <button type="submit" disabled={isUploading} className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-60">
        {isUploading ? 'Загружаем…' : 'Загрузить'}
      </button>
    </form>
  )
}
