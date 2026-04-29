package constant

const ProxyGitUrl = "https://gist.githubusercontent.com/horoyoi-san/2e74b72f2f0c69590544bd3beae11bb1/raw/af7e1b749b74a5f3db3163a2a445c44ed46a3ba0/Sophon.json"
const ServerGitUrl = "https://git.kain.io.vn/api/v1/repos/Firefly-Shelter/FireflyGo_Local_Archive/releases"
const LauncherGitUrl = ""
const SophonGitUrl = "https://github.com/horoyoi-san/game-Launcher/releases/download/sophon/sophon.zip"
const ServerStorageUrl = "./server"
const SophonStorageUrl = "./Sophon"
const ServerZipFile = "prebuild_win_x86.zip"
const LauncherFile = ""
const SophonZipFile = "sophon.zip"
const TempUrl = "./temp"

const CurrentLauncherVersion = "2.1.0"

type ToolFile string

const (
	Tool7zaExe     ToolFile = "bin/7za.exe"
	Tool7zaDLL     ToolFile = "bin/7za.dll"
	Tool7zxaDLL    ToolFile = "bin/7zxa.dll"
	ToolHPatchzExe ToolFile = "bin/hpatchz.exe"
)

var RequiredFiles = map[ToolFile]string{
	Tool7zaExe:     "assets/7za.exe",
	Tool7zaDLL:     "assets/7za.dll",
	Tool7zxaDLL:    "assets/7zxa.dll",
	ToolHPatchzExe: "assets/hpatchz.exe",
}

func (t ToolFile) GetEmbedPath() string {
	return RequiredFiles[t]
}

func (t ToolFile) String() string {
	return string(t)
}
