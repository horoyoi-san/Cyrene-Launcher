import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware';


interface SettingState {
    locale: string;
    gamePath: string;
    gameDir: string;
    serverPath: string;
    proxyPath: string;
    serverVersion: string;
    proxyVersion: string;
    closingOption: {
        isMinimize: boolean;
        isAsk: boolean;
    }
    background: string;
    extraBackgrounds: string[];
    setExtraBackgrounds: (newExtraBackgrounds: string[]) => void;
    setBackground: (newBackground: string) => void;
    setClosingOption: (newClosingOption: { isMinimize: boolean; isAsk: boolean }) => void;
    setLocale: (newLocale: string) => void;
    setGamePath: (newGamePath: string) => void;
    setGameDir: (newGameDir: string) => void;
    setServerPath: (newServerPath: string) => void;
    setProxyPath: (newProxyPath: string) => void;
    setServerVersion: (newServerVersion: string) => void;
    setProxyVersion: (newProxyVersion: string) => void;
}

const useSettingStore = create<SettingState>()(
    persist(
        (set) => ({
            locale: "en",
            gamePath: "",
            gameDir: "",
            serverPath: "",
            proxyPath: "",
            serverVersion: "",
            proxyVersion: "",
            closingOption: {
                isMinimize: false,
                isAsk: true,
            },
            background: "bg-12.jpg",
            extraBackgrounds: [],
            setExtraBackgrounds: (newExtraBackgrounds: string[]) => set({ extraBackgrounds: newExtraBackgrounds }),
            setBackground: (newBackground: string) => set({ background: newBackground }),
            setClosingOption: (newClosingOption: { isMinimize: boolean; isAsk: boolean }) => set({ closingOption: newClosingOption }),
            setLocale: (newLocale: string) => set({ locale: newLocale }),
            setGamePath: (newGamePath: string) => set({ gamePath: newGamePath }),
            setGameDir: (newGameDir: string) => set({ gameDir: newGameDir }),
            setServerPath: (newServerPath: string) => set({ serverPath: newServerPath }),
            setProxyPath: (newProxyPath: string) => set({ proxyPath: newProxyPath }),
            setServerVersion: (newServerVersion: string) => set({ serverVersion: newServerVersion }),
            setProxyVersion: (newProxyVersion: string) => set({ proxyVersion: newProxyVersion }),
        }),
        {
            name: 'setting-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);

export default useSettingStore;