import { create } from 'zustand';

interface AppState {
  graphFilter: { category: string; dynasty: string };
  setGraphFilter: (filter: Partial<AppState['graphFilter']>) => void;
  selectedTerm: number | null;
  setSelectedTerm: (id: number | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  graphFilter: { category: '', dynasty: '' },
  setGraphFilter: (filter) => set((state) => ({ graphFilter: { ...state.graphFilter, ...filter } })),
  selectedTerm: null,
  setSelectedTerm: (id) => set({ selectedTerm: id }),
}));
