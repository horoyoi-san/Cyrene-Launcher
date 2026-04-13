import { Link } from '@tanstack/react-router';
import { useEffect, useState } from "react";

export default function AnalysisPage() {

    // ✅ background state
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

    return (
        <div className="fixed inset-0 z-60 overflow-y-auto">

            {/* 🔥 Background */}
            {bgType === "video" ? (
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
            )}

            {/* 🔥 overlay */}
            <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-60" />

            {/* 🔥 content */}
            <div className="  relative z-60
  w-full max-w-6xl
  ml-24
  mt-10
  bg-white/10 backdrop-blur-2xl
  shadow-[0_0_40px_rgba(0,0,0,0.6)]
  rounded-3xl
  p-6 md:p-10
  space-y-8
  border border-white/20
  text-white
  transition-all duration-300">

                <h1 className="
                text-4xl font-bold text-center
                text-purple-300
                drop-shadow-[0_0_10px_rgba(255,0,150,0.8)]
                drop-shadow-[0_0_20px_rgba(255,0,150,0.6)]
                ">
                    Cyrene Analysis & Veritas Plugin
                </h1>

                {/* ส่วนเกี่ยวกับ Veritas */}
                <div className="bg-green-50 border-l-4 border-green-400 p-6 rounded-r-lg">

                    <h2 className="text-2xl font-bold text-green-800 flex items-center gap-2 mb-4">
                        <span>🔬</span>
                        <span>เกี่ยวกับ Veritas</span>

                    </h2>

                    <div className="space-y-4 text-green-700">

                        <div className="flex items-start gap-3">
                            <div className="text-green-600 text-lg">⚡</div>

                            <div>
                                <p className="mb-2">
                                    <span className="font-semibold text-success">Veritas</span> คือเครื่องมือ
                                    <span className="text-info font-mono bg-blue-100 px-2 py-1 rounded ml-1">
                                        โปรแกรมบันทึกความเสียหาย (Logger)
                                    </span>{" "}
                                    ที่ออกแบบมาเพื่อวิเคราะห์ความเสียหายแบบเรียลไทม์ระหว่างการเล่นเกม
                                </p>

                                <p className="text-sm">
                                    มีน้ำหนักเบา รวดเร็ว และใช้งานง่ายสำหรับการวิเคราะห์ความเสียหายอย่างครอบคลุม
                                </p>
                            </div>
                        </div>



                        <div className="bg-white border border-green-200 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-green-600 text-lg">📁</span>
                                <span className="font-semibold text-green-800">คลังเก็บข้อมูล GitHub</span>
                            </div>
                            <a
                                href="https://github.com/hessiser/veritas"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="link link-info font-mono break-all"

                            >
                                https://github.com/hessiser/veritas

                            </a>

                        </div>
                    </div>
                </div>

                {/* ส่วนเครื่องมือวิเคราะห์เว็บ */}

                <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-r-lg">

                    <h2 className="text-2xl font-bold text-blue-800 flex items-center gap-2 mb-4">

                        <span>🌐</span>

                        <span>เครื่องมือวิเคราะห์เว็บ</span>

                    </h2>

                    <div className="space-y-4">

                        <p className="text-blue-700">
                            ใช้แอปพลิเคชันเว็บเหล่านี้สำหรับการวิเคราะห์ความเสียหายแบบเรียลไทม์ด้วย Veritas:

                        </p>

                        <div className="grid md:grid-cols-2 gap-4">

                            <div className="bg-white border border-blue-200 rounded-lg p-4">

                                <div className="flex items-center gap-2 mb-2">

                                    <span className="text-blue-600 text-lg">🏆</span>

                                    <span className="font-semibold text-blue-800">เว็บไซต์หลัก</span>

                                </div>
                                <a
                                    href="https://srtools.punklorde.org/"
                                    className="link link-warning font-mono text-sm break-all"
                                    target="_blank"
                                    rel="noopener noreferrer"

                                >
                                    https://srtools.punklorde.org/

                                </a>

                            </div>

                            <div className="bg-white border border-blue-200 rounded-lg p-4">

                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-blue-600 text-lg">🔄</span>
                                    <span className="font-semibold text-blue-800">เว็บไซต์สำรอง</span>

                                </div>
                                <a
                                    href="https://Cyrene-sranalysis.vercel.app/"
                                    className="link link-warning font-mono text-sm break-all"
                                    target="_blank"
                                    rel="noopener noreferrer"

                                >
                                    https://Cyrene-sranalysis.vercel.app/


                                </a>

                            </div>

                        </div>

                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">

                            <div className="flex items-start gap-2">
                                <div className="text-yellow-600 text-lg">💡</div>
                                <p className="text-yellow-800 text-sm">
                                    <strong>คำแนะนำ:</strong> หากประเทศของคุณมีปัญหาในการโหลดจากเว็บไซต์หลัก โปรดใช้เว็บไซต์สำรองแทน

                                </p>

                            </div>

                        </div>

                    </div>
                </div>
                {/* คำแนะนำในการติดตั้ง */}

                <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded-r-lg">

                    <h2 className="text-2xl font-bold text-red-800 flex items-center gap-2 mb-4">

                        <span>⚠️</span>

                        <span>คำแนะนำในการติดตั้ง</span>

                    </h2>

                    <div className="bg-white border border-red-200 rounded-lg p-4">

                        <div className="flex items-start gap-3">

                            <div className="text-red-600 text-xl">📋</div>

                            <div>
                                <h3 className="font-semibold text-red-800 mb-2">ขั้นตอนการตั้งค่าที่สำคัญ</h3>

                                <p className="text-red-700 mb-2">
                                    หลังจากดาวน์โหลด Veritas แล้ว คุณต้องเปลี่ยนชื่อไฟล์เพื่อให้ใช้งานได้ อย่างถูกต้อง:

                                </p>
                                <div className="bg-red-100 p-3 rounded-lg">

                                    <p className="text-red-800 font-mono text-sm">
                                        เปลี่ยนชื่อ: <code className="bg-red-200 px-1 py-0.5 rounded">veritas.dll</code> → <code className="bg-red-200 px-1 py-0.5 rounded">astrolabe.dll</code>

                                    </p>
                                    <p className="text-red-800 text-sm mt-1">
                                        จากนั้นวาง <code className="bg-red-200 px-1 py-0.5 rounded">astrolabe.dll</code> ลงในไดเร็กทอรีเกมของคุณ

                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* คำแนะนำการใช้งาน */}
                <div className="bg-purple-50 border-l-4 border-purple-400 p-6 rounded-r-lg">
                    <h2 className="text-2xl font-bold text-purple-800 flex items-center gap-2 mb-4">
                        <span>🛠️</span>
                        <span>วิธีใช้เว็บแอป</span>

                    </h2>

                    <div className="space-y-6">
                        {/* Cyrene GO Local */}
                        <div className="bg-white border border-purple-200 rounded-lg p-4">
                            <h3 className="font-semibold text-purple-800 mb-3 flex items-center gap-2">
                                <span className="text-purple-600">🚀</span>
                                <span>สำหรับ Cyrene GO Local</span>

                            </h3>

                            <div className="space-y-2 text-purple-700">
                                <div className="flex items-start gap-2">
                                    <span className="font-medium min-w-[20px] text-purple-600">1.</span>
                                    <p>เปิดเกม <span className="font-semibold">และเซิร์ฟเวอร์ Cyrene GO (PS) ของคุณ</span>.</p>
                                </div>
                                <div className="flex items-start gap-2">
                                    <span className="font-medium min-w-[20px] text-purple-600">2.</span>
                                    <p>เปิดเครื่องมือวิเคราะห์เว็บอย่างใดอย่างหนึ่ง</p>
                                </div>
                                <div className="flex items-start gap-2">
                                    <span className="font-medium min-w-[20px] text-purple-600">3.</span>
                                    <p>ไปที่ <strong>การตั้งค่าการเชื่อมต่อ</strong> → เลือก <strong>ประเภทการเชื่อมต่อ: PS</strong> → คลิก <strong>เชื่อมต่อ</strong>.</p>

                                </div>
                                <div className="flex items-start gap-2">

                                    <span className="font-medium min-w-[20px] text-purple-600">4.</span>

                                    <p>เมื่อเชื่อมต่อแล้ว ให้เล่นเกม เครื่องมือจะวิเคราะห์โดยอัตโนมัติในพื้นหลัง</p>

                                </div>
                            </div>
                        </div>
                        {/* เซิร์ฟเวอร์ส่วนตัวอื่นๆ */}
                        <div className="bg-white border border-purple-200 rounded-lg p-4">
                            <h3 className="font-semibold text-purple-800 mb-3 flex items-center gap-2">
                                <span className="text-purple-600">🌐</span>
                                <span>สำหรับเซิร์ฟเวอร์ส่วนตัวอื่นๆ</span>
                            </h3>
                            <div className="space-y-2 text-purple-700">
                                <div className="flex items-start gap-2">
                                    <span className="font-medium min-w-[20px] text-purple-600">1.</span>
                                    <p>เริ่มเกมและเซิร์ฟเวอร์ส่วนตัวของคุณ</p>

                                </div>
                                <div className="flex items-start gap-2">
                                    <span className="font-medium min-w-[20px] text-purple-600">2.</span>

                                    <p>เปิดเครื่องมือวิเคราะห์เว็บอย่างใดอย่างหนึ่ง</p>

                                </div>
                                <div className="flex items-start gap-2">

                                    <span className="font-medium min-w-[20px] text-purple-600">3.</span>
                                    <p>ไปที่ <strong>การตั้งค่าการเชื่อมต่อ</strong> → เลือก <strong>ประเภทการเชื่อมต่อ: เซิฟ</strong> → คลิก <strong>เชื่อมต่อ</strong>.</p>

                                </div>
                                <div className="flex items-start gap-2">
                                    <span className="font-medium min-w-[20px] text-purple-600">4.</span>

                                    <p>เมื่อเชื่อมต่อแล้ว ให้เล่นเกมตามปกติ</p>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="text-center pt-6">
                    <Link to="/" className="btn btn-wide bg-black/30 backdrop-blur-md border border-purple-400/30 text-white hover:bg-purple-500/30 hover:shadow-lg hover:shadow-purple-500/40 active:scale-95 transition">Back to Home</Link>
                </div>
            </div>
        </div>
    );
}