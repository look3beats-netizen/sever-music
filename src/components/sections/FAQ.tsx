'use client'
import { useState } from 'react'

const data = [
  { q: 'Сколько занимает выпуск?', a: 'Обычно 3–7 дней в зависимости от площадок.' },
  { q: 'Какие форматы аудио?', a: 'mp3/wav. Мы подскажем, если что-то не так.' },
  { q: 'Можно ли редактировать после отправки?', a: 'Да, напишите нам — обновим метаданные и файлы.' },
]

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <section className="card">
      <h2 className="text-xl font-semibold mb-3">FAQ</h2>
      <div className="space-y-2">
        {data.map((f, i) => (
          <div key={i} className="card-section">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full text-left font-semibold"
            >
              {f.q}
            </button>
            {open === i && (
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{f.a}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
