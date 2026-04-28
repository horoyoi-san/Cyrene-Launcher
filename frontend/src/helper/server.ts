import useLauncherStore from '@/stores/launcherStore';
import useSettingStore from '@/stores/settingStore';
import { FSService } from '@bindings/Cyrene-launcher/internal/fs-service';
import { GitService } from '@bindings/Cyrene-launcher/internal/git-service';
import { toast } from 'react-toastify';

export async function CheckUpdateServer(
    serverPath: string,
    serverVersion: string
): Promise<{ isUpdate: boolean; isExists: boolean; version: string }> {
    const [ok, latestVersion, error] = await GitService.GetLatestServerVersion()
    const isExists = await FSService.FileExists(serverPath)

    if (!ok) {
        toast.error("Server error: " + error)
        return { isUpdate: false, isExists, version: "" }
    }

    const isUpdate = latestVersion !== serverVersion
    return { isUpdate, isExists, version: latestVersion }
}


export async function UpdateServer(serverVersion: string) : Promise<void> {
    const {setDownloadType } = useLauncherStore.getState()
    const {setServerPath, setServerVersion} = useSettingStore.getState()
    setDownloadType("Downloading server...")
    const [ok, error] = await GitService.DownloadServerProgress(serverVersion)
    if (ok) {
        setDownloadType("Unzipping server...")
        GitService.UnzipServer()
        setDownloadType("Download server successfully")
        setServerVersion(serverVersion)
        setServerPath("./server/firefly-go_win.exe")
    } else {
        toast.error(error)
        setDownloadType("Download server failed")
    }
}