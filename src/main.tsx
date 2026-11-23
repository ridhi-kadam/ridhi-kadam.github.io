import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

const designPreview = new URLSearchParams(window.location.search).get('preview')

if (designPreview !== 'legacy') {
  document.documentElement.dataset.designPreview = 'polished'
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
