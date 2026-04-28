import { CheckUpdateLauncher } from "@/helper"
import useModalStore from "@/stores/modalStore"
import useSettingStore from "@/stores/settingStore"
import useLauncherStore from "@/stores/launcherStore"
import { toast } from "react-toastify"
import { AppService } from '@bindings/Cyrene-launcher/internal/app-service'
import i18n from "i18next"


export default function SettingModal({
    isOpen,
    onClose
}: {
    isOpen: boolean
    onClose: () => void
}) {
    if (!isOpen) return null

    const changeLang = (lang: string) => {
        i18n.changeLanguage(lang)
        localStorage.setItem("lang", lang)
        window.location.reload() // 🔥 บังคับรีเฟรช
    }

    const { setIsOpenSelfUpdateModal } = useModalStore()
    const { closingOption, setClosingOption } = useSettingStore()
    const { setUpdateData, updateData } = useLauncherStore()
    const CheckUpdate = async () => {
        const launcherData = await CheckUpdateLauncher()
        if (!launcherData.isUpdate) {
            toast.success("Launcher is already up to date")
            return
        }
        setUpdateData({
            server: updateData.server,
            proxy: updateData.proxy,
            launcher: launcherData
        })

        setIsOpenSelfUpdateModal(true)
    }
    const handleResize = (w: number, h: number) => {
        AppService.SetWindowSize(w, h)
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="relative w-[90%] max-w-md bg-black/30 backdrop-blur-md text-white rounded-2xl border border-purple-400/30 shadow-2xl shadow-purple-500/20 p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-extrabold text-2xl text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-cyan-500">
                        Settings
                    </h3>
                    <button
                        className="btn btn-circle btn-sm bg-red-600 hover:bg-red-700 text-white border-none shadow-lg"
                        onClick={onClose}
                    >
                        ✕
                    </button>
                </div>

                {/* Content */}
                <div className="flex flex-col gap-6">
                    {/* Section 1: Launcher Update */}
                    <div className="p-4 bg-black/30 backdrop-blur-md rounded-xl border border-purple-400/30 shadow-lg shadow-purple-500/20">
                        <h4 className="font-bold text-lg mb-2">Launcher Update</h4>
                        <p className="text-sm text-info mb-3">
                            Check if your launcher is up to date.
                        </p>
                        <button
                            className="btn btn-primary bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-500 text-white shadow-md hover:shadow-lg transition-all duration-200"
                            onClick={CheckUpdate}
                        >
                            Check for Launcher Updates
                        </button>
                    </div>

                    {/* Section 3: Window Size */}
                    <div className="p-4 bg-black/30 backdrop-blur-md rounded-xl border border-purple-400/30 shadow-lg shadow-purple-500/20">
                        <h4 className="font-bold text-lg mb-2">Window Size</h4>
                        <p className="text-sm text-info mb-3">
                            Adjust launcher resolution.
                        </p>

                        <div className="flex flex-col gap-2">
                            <button
                                className="btn btn-sm"
                                onClick={() => handleResize(1280, 720)}
                            >
                                1280 x 720
                            </button>

                            <button
                                className="btn btn-sm"
                                onClick={() => handleResize(1920, 1080)}
                            >
                                1920 x 1080
                            </button>
                        </div>
                    </div>


                    {/* Section 4: Language */}
                    <div className="p-4 bg-black/30 backdrop-blur-md rounded-xl border border-purple-400/30 shadow-lg shadow-purple-500/20">
                        <h4 className="font-bold text-lg mb-2">Language</h4>
                        <p className="text-sm text-info mb-3">
                            Change application language.
                        </p>

                        <div className="flex gap-2">
                            <button
                                className="btn btn-sm flex-1"
                                onClick={() => changeLang("th")}
                            >
                                🇹🇭 ไทย
                            </button>

                            <button
                                className="btn btn-sm flex-1"
                                onClick={() => changeLang("en")}
                            >
                                🇺🇸 English
                            </button>
                        </div>
                    </div>

                    {/* Section 2: Closing Option */}
                    <div className="p-4 bg-black/30 backdrop-blur-md rounded-xl border border-purple-400/30 shadow-lg shadow-purple-500/20">
                        <h4 className="font-bold text-lg mb-2">Closing Options</h4>
                        <label className="flex items-start gap-3 cursor-pointer select-none">
                            <input
                                type="checkbox"
                                className="checkbox checkbox-primary w-5 h-5 mt-1"
                                checked={!closingOption.isAsk}
                                onChange={(e) => {
                                    setClosingOption({
                                        isMinimize: closingOption.isMinimize,
                                        isAsk: !e.target.checked
                                    })
                                }}
                            />
                            <div className="flex flex-col">
                                <span className="text-base font-medium text-info">
                                    Set do not ask again
                                </span>
                                <span className="text-sm text-accent">
                                    Next time you close the app, it will automatically{" "}
                                    {closingOption.isMinimize ? "minimize to system tray" : "quit the app"}{" "}
                                    without asking.
                                </span>
                            </div>
                        </label>
                    </div>
                </div>

            </div>
        </div>
    )
}
