import { createFileRoute } from '@tanstack/react-router'
import hygPage from '@/pages/hyg'

export const Route = createFileRoute('/hyg')({
  component: hygPage,
  
})
