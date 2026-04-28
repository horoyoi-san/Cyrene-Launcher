
import { create } from 'zustand'

interface LauncherState {
    downloadType: string;
    serverReady: boolean;
    proxyReady: boolean;
    isDownloading: boolean;
    serverRunning: boolean;
    proxyRunning: boolean;
    isLoading: boolean;
    gameRunning: boolean;
    progressDownload: number;
    downloadSpeed: string;
    launcherVersion: string;

    setDownloadType: (value: string) => void;
    setServerReady: (value: boolean) => void;
    setProxyReady: (value: boolean) => void;
    setIsDownloading: (value: boolean) => void;
    setServerRunning: (value: boolean) => void;
    setProxyRunning: (value: boolean) => void;
    setIsLoading: (value: boolean) => void;
    setGameRunning: (value: boolean) => void;
    setProgressDownload: (value: number) => void;
    setDownloadSpeed: (value: string) => void;
}

const useLauncherStore = create<LauncherState>((set, get) => ({
    isLoading: false,
    downloadType: "",
    serverReady: false,
    proxyReady: true,
    isDownloading: false,
    serverRunning: false,
    proxyRunning: false,
    gameRunning: false,
    progressDownload: 0,
    downloadSpeed: "",
    launcherVersion: "",
    setIsLoading: (value: boolean) => set({ isLoading: value }),
    setDownloadType: (value: string) => set({ downloadType: value }),
    setServerReady: (value: boolean) => set({ serverReady: value }),
    setProxyReady: (value: boolean) => set({ proxyReady: value }),
    setIsDownloading: (value: boolean) => set({ isDownloading: value }),
    setServerRunning: (value: boolean) => set({ serverRunning: value }),
    setProxyRunning: (value: boolean) => set({ proxyRunning: value }),
    setGameRunning: (value: boolean) => set({ gameRunning: value }),
    setProgressDownload: (value: number) => set({ progressDownload: value }),
    setDownloadSpeed: (value: string) => set({ downloadSpeed: value }),
   
}));

export default useLauncherStore;