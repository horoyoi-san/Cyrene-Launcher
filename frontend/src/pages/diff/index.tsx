import useSettingStore from "@/stores/settingStore"
import { Check, Folder, X, } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { FSService } from "@bindings/SilwerWolf999-launcher/internal/fs-service"
import useDiffStore from "@/stores/diffStore"

export default function DiffPage() {
    const { gameDir, setGameDir } = useSettingStore()
    const {
        isLoading,
        setIsLoading,
        folderCheckResult,
        setFolderCheckResult,
    } = useDiffStore()

    const [bgUrl, setBgUrl] = useState("");
    const [bgType, setBgType] = useState<"video" | "image">("image");


    useEffect(() => {
        // 1️⃣ โหลดค่าจาก localStorage (ค่าที่ Launcher ตั้งไว้ล่าสุด)
        const savedUrl = localStorage.getItem("customBgUrl");
        const savedType = localStorage.getItem("customBgType") as "video" | "image";

        if (savedUrl && savedType) {
            setBgUrl(savedUrl);
            setBgType(savedType);
        } else {
            // ถ้าไม่เคยตั้งค่า ให้ใช้ default ของ Launcher
            setBgUrl("/video2.mp4"); // หรือ videos[0].src ของ Launcher
            setBgType("video");
        }

        // 2️⃣ ฟัง event จาก Launcher
        const handleLauncherBgChange = (event: Event) => {
            const e = event as CustomEvent<{ url: string; type: "video" | "image" }>;
            if (e.detail?.url && e.detail?.type) {
                setBgUrl(e.detail.url);
                setBgType(e.detail.type);
            }
        };

        window.addEventListener("launcherBgChanged", handleLauncherBgChange);
        return () => window.removeEventListener("launcherBgChanged", handleLauncherBgChange);
    }, []);

    useEffect(() => {
        const getLanguage = async () => {
            if (gameDir) {
                const subPath = 'StarRail_Data/StreamingAssets/DesignData/Windows'
                const fullPath = `${gameDir}/${subPath}`

                const exists = await FSService.DirExists(fullPath)
                if (exists) {
                    setFolderCheckResult('success')
                } else {
                    setFolderCheckResult('error')
                    setGameDir('')
                }
            }
        }
        getLanguage()
    }, [gameDir])

    const handlePickGameFolder = async () => {
        try {
            setIsLoading({ game: true, diff: false })
            const basePath = await FSService.PickFolder()
            if (basePath) {
                setGameDir(basePath)
                const subPath = 'StarRail_Data/StreamingAssets/DesignData/Windows'
                const fullPath = `${basePath}/${subPath}`

                const exists = await FSService.DirExists(fullPath)
                setFolderCheckResult(exists ? 'success' : 'error')
                setGameDir(exists ? basePath : '')
                if (!exists) {
                    toast.error('Game directory not found. Please select the correct folder.')
                }
            } else {
                toast.error('No folder path selected')
                setFolderCheckResult('error')
                setGameDir('')
            }
        } catch (err: any) {
            toast.error('PickFolder error:', err)
            setFolderCheckResult('error')
        } finally {
            setIsLoading({ game: false, diff: false })
        }
    }


    return (
        <>
            {/* 🔥 Background */}
            {bgUrl && (
                bgType === "video" ? (
                    <video
                        className="fixed inset-0 z-0 w-full h-full object-cover"
                        autoPlay
                        loop
                        muted
                        playsInline
                    >
                        <source src={bgUrl} type="video/mp4" />
                    </video>
                ) : (
                    <img
                        src={bgUrl}
                        className="fixed inset-0 z-0 w-full h-full object-cover"
                    />
                )
            )}

            {/* 🔥 ของเดิมทั้งหมด */}
            <div className="min-h-screen
w-full

p-4 md:p-6
flex justify-center items-start

bg-gradient-to-br from-purple-900/30 via-black/50 to-indigo-900/30
backdrop-blur-xl

text-white
relative z-60">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-2">
                        <h1 className="text-4xl font-bold mb-2">
                            🎮 Game patch
                        </h1>
                        <p className="">Help you update game with patch</p>
                    </div>

                    {/* Main Content */}
                    <div className="rounded-2xl p-2 space-y-4">

{/* Folder Selection Section */}
<div className="pb-2">
    <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2 text-sky-300">
        <Folder className="text-sky-400 drop-shadow-[0_0_6px_rgba(56,189,248,0.8)]" size={24} />
        Game Directory
    </h2>

    <div className="space-y-1">
        <div className="btn btn-xl font-bold bg-white/5 backdrop-blur-md border border-sky-400/20 hover:bg-gradient-to-r hover:from-sky-500/20 hover:via-blue-500/20 hover:to-purple-500/20 transition rounded-xl">
            
            <button
                onClick={handlePickGameFolder}
                disabled={isLoading.game}
                className="flex items-center gap-2 px-4 py-2 bg-black/30 backdrop-blur-md
                border border-purple-400/30 text-white
                hover:bg-gradient-to-r hover:from-sky-500/20 hover:to-purple-500/20
                hover:border-purple-300/50 transition rounded-lg"
            >
                <Folder size={20} className="text-sky-300" />
                {isLoading.game ? 'Selecting...' : 'Select Game Folder'}
            </button>

            {gameDir && (
                <div className="rounded-lg p-2 mt-2 bg-black/20 border border-sky-400/20 backdrop-blur-md">
                    <p className="font-mono text-sm px-3 py-2 rounded text-sky-200 truncate max-w-full overflow-hidden whitespace-nowrap">
                        {gameDir}
                    </p>
                </div>
            )}
        </div>

        {folderCheckResult && (
            <div className={`flex items-center gap-2 p-3 rounded-lg border backdrop-blur-md transition
                ${folderCheckResult === 'success'
                    ? 'bg-sky-500/10 text-sky-300 border-sky-400/30 shadow-[0_0_10px_rgba(56,189,248,0.2)]'
                    : 'bg-purple-500/10 text-purple-300 border-purple-400/30 shadow-[0_0_10px_rgba(168,85,247,0.2)]'
                }`}>
                
                {folderCheckResult === 'success' ? (
                    <>
                        <Check size={20} className="text-sky-300" />
                        <span>Valid game directory found!</span>
                    </>
                ) : (
                    <>
                        <X size={20} className="text-purple-300" />
                        <span>Game directory not found. Please select the correct folder.</span>
                    </>
                )}
            </div>
        )}
    </div>
</div>


                        {/* คำแนะนำ */}
                        <div className="bg-info/5 rounded-lg p-4 border border-info/30 mt-6">
                            <h3 className="font-medium text-error mb-2">📋 คำแนะนำ:</h3>
                            <ol className="text-sm text-error space-y-1">
                                <li>1. คลิก "เลือกโฟลเดอร์เกม" และเลือกไดเร็กทอรีหลักของเกมของคุณ</li>
                                <li>2. รอให้ระบบตรวจสอบความถูกต้องของไดเร็กทอรีเกม</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}