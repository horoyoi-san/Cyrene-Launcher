import { createFileRoute } from '@tanstack/react-router'
import abcPage from '@/pages/abc'

export const Route = createFileRoute('/abc')({
  component: abcPage,
  
})
