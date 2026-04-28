import { useEffect, useState } from "react";
import { FSService } from "@bindings/SilwerWolf999-launcher/internal/fs-service";
import { toast } from "react-toastify";

type Game = {
  name: string;
  biz: string;
  background: string;
};

export default function napPage() {
  const [_game, setGame] = useState<Game | null>(null);
  const [_loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const [progress, setProgress] = useState(0);
  const [displayProgress, setDisplayProgress] = useState(0);

  const [config, setConfig] = useState<any>(null)
  const [gameName, setGameName] = useState<string>("Loading...");

  // =========================
  // 📡 PROGRESS PARSER (ROBUST)
  // =========================
  const parseProgress = (line: string) => {
    // รองรับ MB/GB ทั้งคู่
    const match = line.match(/([\d.]+)\s*(MB|GB)\/([\d.]+)\s*(MB|GB)/i);
    if (!match) return null;

    let current = parseFloat(match[1]);
    let currentUnit = match[2].toUpperCase();
    let total = parseFloat(match[3]);
    let totalUnit = match[4].toUpperCase();

    if (currentUnit === "GB") current *= 1024;
    if (totalUnit === "GB") total *= 1024;

    return Math.round((current / total) * 100);
  };

const [sharedBg, setSharedBg] = useState<string | null>(null);
const [bgUrl, setBgUrl] = useState("/video2.mp4"); // 🔥 default ไปเลย
const [bgType, setBgType] = useState<"video" | "image">("video");

useEffect(() => {
  if (!config) return;

  const gameConfig = config.games.find(
    (g: any) => g.id === "Zenless"
  );

  if (gameConfig) {
    setGameName(gameConfig.name);
  }
}, [config]);

useEffect(() => {
  if (!config?.games) return;

  const gameConfig = config.games.find(
    (g: any) => g.id === "Zenless"
  );

  console.log("FOUND:", gameConfig);

  if (gameConfig) {
    setGameName(gameConfig.name);
  } else {
    setGameName("NOT FOUND");
  }
}, [config]);

useEffect(() => {
  const handler = (e: any) => {
    if (e.detail?.url && e.detail?.type) {
      setSharedBg(e.detail.url);
      setBgType(e.detail.type);
    }
  };

  window.addEventListener("launcherBgChanged", handler);

  // โหลด initial (🔥 สำคัญมาก)
  const url = localStorage.getItem("customBgUrl");
  const type = localStorage.getItem("customBgType") as "video" | "image";

  if (url && type) {
    setSharedBg(url);
    setBgType(type);
  }

  return () => {
    window.removeEventListener("launcherBgChanged", handler);
  };
}, []);


useEffect(() => {
  fetch("https://raw.githubusercontent.com/horoyoi-san/Cyrene-Launcher/refs/heads/main/game.json")
    .then(res => res.json())
    .then(data => setConfig(data))
    .catch(err => console.error(err));
}, []);

  // =========================
  // 📡 LISTEN DOWNLOAD PROGRESS
  // =========================
  useEffect(() => {
    const handler = (line: string) => {
      console.log("PROGRESS:", line);

      const percent = parseProgress(line);

      if (percent !== null && !isNaN(percent)) {
        setProgress(percent);
      }
    };

    window.runtime?.EventsOn?.("download:progress", handler);

    return () => {
      window.runtime?.EventsOff?.("download:progress", handler);
    };
  }, []);

  // =========================
  // 🎯 SMOOTH UI PROGRESS
  // =========================
  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayProgress((prev) => {
        if (prev < progress) return Math.min(prev + 1, progress);
        if (prev > progress) return Math.max(prev - 1, progress);
        return prev;
      });
    }, 15);

    return () => clearInterval(interval);
  }, [progress]);

  // =========================
  // 🎮 FETCH GAME
  // =========================
  useEffect(() => {
    const fetchGame = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          "https://sg-hyp-api.hoyoverse.com/hyp/hyp-connect/api/getGames?launcher_id=VYTpXlbWo8"
        );

        const json = await res.json();
        const list = json?.data?.games || [];

        const nap = list.find((g: any) => g.biz === "nap_global");

        if (!nap) {
          toast.error("Zenless not found");
          return;
        }

        const parsed: Game = {
          name: nap.display.name,
          biz: nap.biz,
          background: nap.display.background.url,
        };

        setGame(parsed);
        setBgUrl(parsed.background);

      } catch (err) {
        console.error(err);
        toast.error("Failed to load game");
      } finally {
        setLoading(false);
      }
    };

    fetchGame();
  }, []);

  // =========================
  // 🚀 DOWNLOAD
  // =========================
const downloadGame = async () => {
  try {
    if (!config) {
      toast.error("Config not loaded");
      return;
    }

    setDownloading(true);
    setProgress(0);

    const outputDir = await FSService.GetLauncherDir();

    // 🔥 หา game จาก config
    const gameConfig = config.games.find(
      (g: any) => g.id === "Zenless" // หรือ map จาก biz ก็ได้
    );

    if (!gameConfig) {
      toast.error("Game config not found");
      return;
    }

    const result = await FSService.RunDownloader(
  gameConfig.gameId,
  gameConfig.package,
  gameConfig.version,
  `${outputDir}/${gameConfig.output}`,
  gameConfig.region // 🔥 เพิ่มตรงนี้
    );

    if (!result) {
      toast.error("Download failed");
      return;
    }

    toast.success("Download started");

  } catch (err: any) {
    console.error(err);
    toast.error(err?.message || "Unknown error");
  } finally {
    setDownloading(false);
  }
};


  // =========================
  // 🎨 UI
  // =========================
  return (
    <>
<div className="fixed inset-0 z-0">
  {sharedBg ? (
    bgType === "video" ? (
      <video
        key={sharedBg}
        className="w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src={sharedBg} />
      </video>
    ) : (
      <img src={sharedBg} className="w-full h-full object-cover" />
    )
  ) : (
    bgType === "video" ? (
      <video
        key={bgUrl}
        className="w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src={bgUrl} />
      </video>
    ) : (
      <img src={bgUrl} className="w-full h-full object-cover" />
    )
  )}

    <div className="absolute inset-0 bg-black/60" />
  </div>

      {/* CONTENT */}
      <div className="relative z-10 text-white p-6">
      <h1 className="text-3xl font-bold ml-16">
        {gameName}
      </h1>
      </div>

      {/* DOWNLOAD UI */}
      <div className="fixed bottom-6 right-6 z-50 w-64">

        <button
          onClick={downloadGame}
          disabled={downloading}
          className="px-6 py-3 rounded-xl bg-green-500/20 border border-green-400/40 w-full"
        >
          {downloading ? "Downloading..." : "Download Game"}
        </button>

        {/* PROGRESS */}
        <div className="mt-3">
          <div className="text-white mb-1 text-sm">
            {displayProgress}%
          </div>

          <div className="w-full h-2 bg-white/10 rounded overflow-hidden">
            <div
              className="h-2 bg-green-400 transition-all duration-150"
              style={{ width: `${displayProgress}%` }}
            />
          </div>
        </div>

      </div>
    </>
  );
}
