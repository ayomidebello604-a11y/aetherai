// This is the entry point — "/" renders the landing page.
import LandingHeader from '@/components/landing/LandingHeader'
import LandingHero from '@/components/landing/LandingHero'
import LandingFooters from '@/components/landing/LandingFooters'
import LandingFeature from '@/components/landing/LandingFeature'
import LandingDocumentation from '@/components/landing/LandingDocumentation'

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-black">
      <LandingHeader />
      <LandingHero />
      <LandingFeature />
      <LandingDocumentation />
      <LandingFooters />
    </main>
  )
}
