export default function HowItWorks() {
  const steps = [
    { t: 'Заявка', d: 'Заполните форму и прикрепите треки/обложку.' },
    { t: 'Проверка', d: 'Мы проверяем метаданные и качество.' },
    { t: 'Отправка', d: 'Готовим релиз к дистрибуции.' },
    { t: 'Релиз', d: 'Публикуем и присылаем ссылки.' },
  ]
  return (
    <section id="how" className="card">
      <h2 className="text-xl font-semibold mb-3">Как это работает</h2>
      <div className="grid sm:grid-cols-2 gap-3">
        {steps.map((s, i) => (
          <div key={i} className="card-section animate-fade">
            <div className="text-sever-primary font-semibold">Шаг {i + 1}</div>
            <div className="text-lg">{s.t}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">{s.d}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
