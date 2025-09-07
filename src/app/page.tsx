import Hero from '@/components/sections/Hero'
import HowItWorks from '../components/sections/HowItWorks'
import Benefits from '../components/sections/Benefits'
import FAQ from '@/components/sections/FAQ'

export default function HomePage() {
  return (
    <div className="space-y-4">
      <Hero />
      <HowItWorks />
      <Benefits />
      <FAQ />
    </div>
  )
}
