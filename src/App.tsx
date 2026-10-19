import { lazy, Suspense, useCallback, useEffect, useMemo, useReducer, useRef } from 'react'
import { NavigationControls } from './components/NavigationControls'
import type { BookOrigin } from './components/BookTransition'
import { getBook, isSectionId } from './data/portfolio'
import { initialSceneState, sceneReducer } from './lib/sceneMachine'
import { LibraryScene } from './scenes/LibraryScene'
import type { PortfolioBook, SectionId } from './types/portfolio'

const BookTransition = lazy(() => import('./components/BookTransition'))

function App() {
  const [scene, dispatch] = useReducer(sceneReducer, initialSceneState)
  const originRef = useRef<BookOrigin | null>(null)
  const triggerRef = useRef<HTMLButtonElement | null>(null)

  const activeBook = useMemo(
    () => scene.activeId ? getBook(scene.activeId) : null,
    [scene.activeId],
  )
  const busy = scene.phase === 'opening' || scene.phase === 'closing'

  const updateAddress = useCallback((id: SectionId | null, mode: 'push' | 'replace' = 'push') => {
    const nextUrl = id ? `#${id}` : `${window.location.pathname}${window.location.search}`
    window.history[mode === 'push' ? 'pushState' : 'replaceState']({ section: id }, '', nextUrl)
  }, [])

  const openBook = useCallback((book: PortfolioBook, trigger?: HTMLButtonElement, historyMode: 'push' | 'replace' = 'push') => {
    if (scene.phase === 'opening' || scene.phase === 'closing') return
    if (scene.activeId === book.id && scene.phase === 'scene') return

    if (trigger) {
      const bounds = trigger.getBoundingClientRect()
      originRef.current = { left: bounds.left, top: bounds.top, width: bounds.width, height: bounds.height }
      triggerRef.current = trigger
    } else {
      originRef.current = null
      triggerRef.current = null
    }

    updateAddress(book.id, historyMode)
    dispatch({ type: 'OPEN', id: book.id })
  }, [scene.activeId, scene.phase, updateAddress])

  const navigateTo = useCallback((id: SectionId) => {
    openBook(getBook(id))
  }, [openBook])

  const requestReturn = useCallback((historyMode: 'push' | 'replace' = 'push') => {
    if (scene.phase !== 'scene') return
    updateAddress(null, historyMode)
    dispatch({ type: 'CLOSE' })
  }, [scene.phase, updateAddress])

  useEffect(() => {
    const syncFromAddress = () => {
      const id = window.location.hash.replace('#', '')
      if (isSectionId(id)) {
        if (scene.phase === 'library') openBook(getBook(id), undefined, 'replace')
        else if (scene.phase === 'scene' && scene.activeId !== id) openBook(getBook(id), undefined, 'replace')
      } else if (scene.phase === 'scene') {
        requestReturn('replace')
      }
    }

    syncFromAddress()
    window.addEventListener('popstate', syncFromAddress)
    window.addEventListener('hashchange', syncFromAddress)
    return () => {
      window.removeEventListener('popstate', syncFromAddress)
      window.removeEventListener('hashchange', syncFromAddress)
    }
  }, [openBook, requestReturn, scene.activeId, scene.phase])

  useEffect(() => {
    document.title = activeBook
      ? `${activeBook.title} — Ridhi Kadam’s Library`
      : 'Ridhi Kadam — The Curious Casebook'
  }, [activeBook])

  return (
    <div className="app-shell">
      <NavigationControls
        activeId={scene.activeId}
        busy={busy}
        onNavigate={navigateTo}
        onReturn={() => requestReturn()}
      />

      <LibraryScene busy={scene.phase !== 'library'} onOpenBook={openBook} />

      {activeBook && scene.phase !== 'library' && (
        <Suspense fallback={<div className="scene-loading" role="status">Retrieving volume…</div>}>
          <BookTransition
            key={activeBook.id}
            book={activeBook}
            phase={scene.phase}
            origin={originRef.current}
            onOpened={() => dispatch({ type: 'OPENED' })}
            onRequestClose={() => requestReturn()}
            onClosed={() => {
              dispatch({ type: 'CLOSED' })
              window.requestAnimationFrame(() => triggerRef.current?.focus())
            }}
          />
        </Suspense>
      )}

      <div className="sr-only" aria-live="polite">
        {busy && activeBook ? `${scene.phase === 'opening' ? 'Opening' : 'Closing'} ${activeBook.title}` : ''}
      </div>
    </div>
  )
}

export default App
