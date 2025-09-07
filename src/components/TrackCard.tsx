'use client'
import { useEffect, useState } from 'react'
import { createClient } from '../lib/supabase/client'
import { Card } from './ui'

export default function TrackCard({ track }: any) {
  const supabase = createClient()
  const [audioUrl, setAudioUrl] = useState('')

  useEffect(() => {
    const getUrl = async () => {
      const { data } = await supabase.storage.from('audio').createSignedUrl(track.audio_path, 600)
      setAudioUrl(data?.signedUrl || '')
    }
    getUrl()
  }, [track.audio_path])

  const handlePlay = async () => {
    await fetch('/api/listens', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ track_id: track.id })
    })
  }

  return (
    <Card className="space-y-3">
      {track.cover_url && (
        <div className="overflow-hidden rounded-2xl">
          <img
            src={track.cover_url}
            alt="Обложка"
            className="w-full aspect-[16/9] object-cover transition-transform duration-300 hover:scale-[1.02]"
          />
        </div>
      )}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">{track.title}</h2>
          {track.artist && <p className="text-sm text-gray-600">{track.artist}</p>}
        </div>
      </div>
      {audioUrl && (
        <audio className="w-full" controls src={audioUrl} onPlay={handlePlay}></audio>
      )}
    </Card>
  )
}
