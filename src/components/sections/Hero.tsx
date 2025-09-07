export default function Hero() {
  return (
    <section className="card overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-sever-primary/10 to-sever-accent/10 pointer-events-none" />
      <div className="relative">
        <h1 className="text-3xl sm:text-4xl font-bold">Sever Music — релиз без боли</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Загрузите релиз — мы аккуратно доведём его до площадок. Прозрачно и быстро.
        </p>
        <div className="mt-4 flex gap-2">
          <a className="btn-primary" href="/submit">Отправить заявку</a>
          <a className="btn-outline" href="#how">Как это работает</a>
        </div>
      </div>
    </section>
  )
}
