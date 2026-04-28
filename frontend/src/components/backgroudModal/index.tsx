import React, { useState } from "react";

const BackgroundVideo: React.FC = () => {
  const [videoSrc, setVideoSrc] = useState<string>("/video1.mp4");

  const [inputUrl, setInputUrl] = useState("");

  const videos = [
    { name: "Honkai: Star Rail", src: "/video1.mp4", icon: "https://raw.githubusercontent.com/horoyoi-san/Hoyo/refs/heads/launcher-sr/build/appicon.png" },
    { name: "Cyrene", src: "/video2.mp4", icon: "https://launcher-webstatic.hoyoverse.com/launcher-public/2025/09/22/4cc51f558225dba65cc875ecd642cfe2_6726801704251292131.png" },
  ];

  return (
    <div className="relative min-h-fit overflow-hidden">
      {/* ปุ่มเลือกวิดีโอ */}
      <div className="fixed right-4 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-3">
        {videos.map((v, index) => (
          <button
            key={index}
            onClick={() => setVideoSrc(v.src)}
            className={`w-14 h-14 rounded-2xl overflow-hidden border-2 transition-all duration-200 hover:scale-110 ${
              videoSrc === v.src
                ? "border-cyan-400 shadow-lg shadow-cyan-400/40"
                : "border-transparent"
            }`}
          >
            <img
              src={v.icon}
              alt={v.name}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>

      {/* input ใส่ลิงก์ */}
      <div className="fixed bottom-4 left-4 z-50 flex gap-2">
        <input
          type="text"
          placeholder="วางลิงก์ .mp4"
          value={inputUrl}
          onChange={(e) => setInputUrl(e.target.value)}
          className="px-3 py-2 rounded-lg bg-black/50 text-white outline-none w-80"
        />
        <button
          onClick={() => {
            if (inputUrl.endsWith(".mp4")) {
              setVideoSrc(inputUrl);
            } else {
              alert("ต้องเป็นลิงก์ .mp4 เท่านั้น");
            }
          }}
          className="bg-cyan-500 px-3 py-2 rounded-lg text-white hover:bg-cyan-400"
        >
          โหลด
        </button>
      </div>

      {/* วิดีโอ */}
      <video
        className="fixed inset-0 z-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        key={videoSrc}
      >
        <source src={videoSrc} type="video/mp4" />
      </video>
    </div>
  );
};

export default BackgroundVideo;
