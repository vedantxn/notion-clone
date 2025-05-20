import { create } from "zustand";

type SearchState = {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
    onToggle: () => void;
};

export const useSearch = create<SearchState>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
    onToggle: () => set((state) => ({ isOpen: !state.isOpen })),
}));

