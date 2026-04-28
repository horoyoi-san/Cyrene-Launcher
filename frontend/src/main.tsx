import "./i18n"; // 🔥 เอาไว้บนสุด

import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import './styles/index.css'
import "../runtime.js"
import "@wailsio/runtime";
import { routeTree } from './routeTree.gen.js'

const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const rootElement = document.getElementById('root')!

const root = ReactDOM.createRoot(rootElement)

root.render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)
