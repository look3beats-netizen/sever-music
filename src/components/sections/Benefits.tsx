export default function Benefits() {
  const items = [
    { t: 'Чёткий онбординг', d: 'Подсказываем, что и куда писать.' },
    { t: 'Поддержка', d: 'Отвечаем вежливо и быстро.' },
    { t: 'Прозрачность', d: 'Без сюрпризов и скрытых условий.' },
  ]
  return (
    <section className="card">
      <h2 className="text-xl font-semibold mb-3">Почему с нами удобно</h2>
      <div className="grid sm:grid-cols-3 gap-3">
        {items.map((b, i) => (
          <div key={i} className="card-section">
            <div className="text-lg font-semibold">{b.t}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">{b.d}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
