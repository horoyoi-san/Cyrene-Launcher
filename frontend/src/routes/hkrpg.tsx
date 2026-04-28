import hkrpgPage from '@/pages/hkrpg'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/hkrpg')({
  component: hkrpgPage,
})

