import useLauncherStore from "@/stores/launcherStore";
import useSettingStore from "@/stores/settingStore";
import { FSService } from "@bindings/Cyrene-launcher/internal/fs-service";
import { GitService } from "@bindings/Cyrene-launcher/internal/git-service";
import { toast } from "react-toastify";

export async function CheckUpdateProxy(proxyPath: string, proxyVersion: string) : Promise<{isUpdate: boolean, isExists: boolean, version: string}> {
    const [ok, latestVersion, error] = await GitService.GetLatestProxyVersion()
    const isExists = await FSService.FileExists(proxyPath)

    if (!ok) {
        toast.error("Proxy error: " + error)
        return { isUpdate: false, isExists, version: "" }
    }

    const isUpdate = latestVersion !== proxyVersion
    return { isUpdate, isExists, version: latestVersion }
}

export async function UpdateProxy(proxyVersion: string) : Promise<void> {
    const {setDownloadType } = useLauncherStore.getState()
    const {setProxyPath, setProxyVersion} = useSettingStore.getState()
    setDownloadType("Downloading proxy...")
    const [ok, error] = await GitService.DownloadProxyProgress(proxyVersion)
    if (ok) {
        setDownloadType("Unzipping proxy...")
        GitService.UnzipProxy()
        setDownloadType("Download proxy successfully")
        setProxyVersion(proxyVersion)
        setProxyPath("./proxy/Proxy.exe")
    } else {
        toast.error(error)
        setDownloadType("Download proxy failed")
    }
}