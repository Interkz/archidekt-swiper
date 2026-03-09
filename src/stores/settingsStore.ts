import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SettingsState {
  colorblindMode: boolean
  setColorblindMode: (enabled: boolean) => void
  toggleColorblindMode: () => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      colorblindMode: false,

      setColorblindMode: (enabled) => set({ colorblindMode: enabled }),

      toggleColorblindMode: () => set({ colorblindMode: !get().colorblindMode }),
    }),
    {
      name: 'archidekt-swiper-settings',
    }
  )
)
