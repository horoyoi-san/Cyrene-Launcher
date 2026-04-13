// stores/panelStore.ts
import { create } from "zustand";

type PanelStore = {
    activeUrl?: string;
    showPanel: boolean;
    isMinimized: boolean;

    setActiveUrl: (url?: string) => void;
    setShowPanel: (show: boolean) => void;
    setIsMinimized: (min: boolean) => void;
};

const usePanelStore = create<PanelStore>((set) => ({
    activeUrl: undefined,
    showPanel: false,
    isMinimized: false,

    setActiveUrl: (url) => set({ activeUrl: url }),
    setShowPanel: (show) => set({ showPanel: show }),
    setIsMinimized: (min) => set({ isMinimized: min }),
}));

export default usePanelStore;
