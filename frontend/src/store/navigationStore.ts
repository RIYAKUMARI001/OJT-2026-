import { create } from 'zustand';

type Screen = 'Home' | 'Auth' | 'RoomSetup' | 'Designer' | 'SavedDesigns';

interface NavigationState {
  currentScreen: Screen;
  navigate: (screen: Screen) => void;
}

export const useNavigationStore = create<NavigationState>((set) => ({
  currentScreen: 'Home',
  navigate: (screen) => set({ currentScreen: screen }),
}));
