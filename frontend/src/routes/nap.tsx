import { createFileRoute } from '@tanstack/react-router'
import napPage from '@/pages/nap'

export const Route = createFileRoute('/nap')({
  component: napPage,
})

