import { Suspense } from 'react'
import CoProgrammerPage from '@/components/coprogrammer/CoProgrammerPage'
import Loading from '@/app/loading'

export default function CoProgrammer() {
  return (
    <Suspense fallback={<Loading />}>
      <CoProgrammerPage />
    </Suspense>
  )
}