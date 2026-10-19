import type { SectionId } from '../types/portfolio'

export type ScenePhase = 'library' | 'opening' | 'scene' | 'closing'

export type SceneState = {
  phase: ScenePhase
  activeId: SectionId | null
}

export type SceneAction =
  | { type: 'OPEN'; id: SectionId }
  | { type: 'OPENED' }
  | { type: 'CLOSE' }
  | { type: 'CLOSED' }

export const initialSceneState: SceneState = {
  phase: 'library',
  activeId: null,
}

export function sceneReducer(state: SceneState, action: SceneAction): SceneState {
  switch (action.type) {
    case 'OPEN':
      if (state.phase === 'opening' || state.phase === 'closing') return state
      return { phase: 'opening', activeId: action.id }
    case 'OPENED':
      if (state.phase !== 'opening' || !state.activeId) return state
      return { ...state, phase: 'scene' }
    case 'CLOSE':
      if (state.phase !== 'scene') return state
      return { ...state, phase: 'closing' }
    case 'CLOSED':
      if (state.phase !== 'closing') return state
      return initialSceneState
    default:
      return state
  }
}
