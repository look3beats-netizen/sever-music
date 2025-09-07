'use client'
import { useRef, useState } from 'react'

type Props = {
  label: string
  accept: string
  onFile: (f: File, meta?: { title?: string; artist?: string; pictureUrl?: string }) => void
  previewImage?: boolean
}

export default function DropzoneUploader({ label, accept, onFile, previewImage }: Props) {
  const [drag, setDrag] = useState(false)
  const [name, setName] = useState<string>('')
  const [img, setImg] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handle = async (file: File) => {
    setName(file.name)

    // Preview для изображений
    if (previewImage && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file)
      setImg(url)
      onFile(file)
      return
    }

    // ID3 только для аудио — динамический импорт браузерной сборки
    if (file.type.startsWith('audio/')) {
      try {
        const { default: jsmediatags } = await import('jsmediatags/dist/jsmediatags.min.js')
        ;(jsmediatags as any).read(file, {
          onSuccess: (tag: any) => {
            const t = tag?.tags?.title
            const a = tag?.tags?.artist
            let pictureUrl: string | undefined
            const pic = tag?.tags?.picture
            if (pic?.data && pic?.format) {
              const bin = Array.isArray(pic.data)
                ? String.fromCharCode(...pic.data)
                : ''
              pictureUrl = `data:${pic.format};base64,${btoa(bin)}`
              setImg(pictureUrl)
            }
            onFile(file, { title: t, artist: a, pictureUrl })
          },
          onError: () => onFile(file),
        })
      } catch {
        // если что-то пошло не так — продолжаем без метаданных
        onFile(file)
      }
      return
    }

    // Прочие файлы (на всякий случай)
    onFile(file)
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault()
        setDrag(true)
      }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => {
        e.preventDefault()
        setDrag(false)
        const f = e.dataTransfer.files?.[0]
        if (f) handle(f)
      }}
      className={`card cursor-pointer text-center ${drag ? 'ring-2 ring-sever-primary' : ''}`}
      onClick={() => inputRef.current?.click()}
    >
      <div className="font-semibold">{label}</div>
      <div className="text-xs text-gray-500 mb-2">Перетащите файл сюда или кликните</div>
      {name && <div className="text-sm">{name}</div>}
      {img && <img src={img} alt="preview" className="mt-2 mx-auto w-40 h-40 object-cover rounded-xl" />}
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept={accept}
        onChange={(e) => {
          const f = e.target.files?.[0]
          if (f) handle(f)
        }}
      />
    </div>
  )
}
