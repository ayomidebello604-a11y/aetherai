import { Suspense } from 'react'
import ResearcherPage from '@/components/researcher/ResearcherPage'
import Loading from '@/app/loading'

export default function Researcher() {
  return (
    <Suspense fallback={<Loading />}>
      <ResearcherPage />
    </Suspense>
  )
}