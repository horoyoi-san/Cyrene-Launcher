package fsService

import (
	"SilwerWolf999-launcher/pkg/constant"
	"SilwerWolf999-launcher/pkg/sevenzip"
	"fmt"
	"io"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
	"strings"

	"github.com/wailsapp/wails/v3/pkg/application"
	"golang.org/x/sys/windows"
)

type FSService struct{}
type ProgressWriter struct{}

func (f *FSService) PickFolder() (string, error) {
	dialog := application.Get().Dialog.OpenFile().
		CanChooseDirectories(true).
		CanCreateDirectories(true).
		ResolvesAliases(true)
	if runtime.GOOS == "darwin" {
		dialog.SetMessage("Select a file/directory")
	} else {
		dialog.SetTitle("Select a file/directory")
	}
	if path, err := dialog.PromptForSingleSelection(); err == nil {
		return path, nil
	}
	return "", nil
}

func (f *FSService) PickFile(filter string) (string, error) {
	dialog := application.Get().Dialog.OpenFile().
		CanChooseFiles(true).
		ResolvesAliases(true)
	if runtime.GOOS == "darwin" {
		dialog.SetMessage("Select a file/directory")
	} else {
		dialog.SetTitle("Select a file/directory")
	}
	if filter == "exe" {
		dialog.AddFilter("Executable Files (*.exe)", "*.exe")
	}
	if path, err := dialog.PromptForSingleSelection(); err == nil {
		return path, nil
	}
	return "", nil
}

func (f *FSService) DirExists(path string) bool {
	info, err := os.Stat(path)
	if err != nil {
		return false
	}
	return info.IsDir()
}

func (f *FSService) FileExists(path string) bool {
	if info, err := os.Stat(path); err == nil {
		return info.Mode().IsRegular()
	}
	return false
}

func (f *FSService) GetDir(path string) string {
	return filepath.Dir(path)
}

func (f *FSService) Join(paths ...string) string {
	return filepath.Join(paths...)
}

func (f *FSService) RemoveFile(path string) error {
	return os.Remove(path)
}

func (f *FSService) StartApp(path string) (bool, string) {
	cmd := exec.Command(path)
	err := cmd.Start()
	if err != nil {
		return false, err.Error()
	}

	if strings.HasSuffix(path, "StarRail.exe") {
		go func() {
			_ = cmd.Wait()
			application.Get().Event.Emit("game:exit")
		}()
	}

	return true, ""
}

func (f *FSService) StartWithConsole(path string) (bool, string) {
	absPath, err := filepath.Abs(path)
	if err != nil {
		return false, err.Error()
	}

	if _, err := os.Stat(absPath); os.IsNotExist(err) {
		return false, "file not found: " + absPath
	}
	cmd := exec.Command(absPath)
	cmd.Dir = filepath.Dir(absPath)
	cmd.Stdin = nil
	cmd.Stdout = nil
	cmd.Stderr = nil

	cmd.SysProcAttr = &windows.SysProcAttr{
		CreationFlags: windows.CREATE_NEW_CONSOLE |
			windows.CREATE_BREAKAWAY_FROM_JOB,
		NoInheritHandles: true,
	}

	err = cmd.Start()

	if err != nil {
		return false, err.Error()
	}

	go func() {
		_ = cmd.Wait()
		if strings.HasSuffix(path, "launcher.exe") {
			application.Get().Event.Emit("game:exit")
		} else if strings.HasSuffix(path, "firefly-go_win.exe") {
			application.Get().Event.Emit("server:exit")
		} else if strings.HasSuffix(path, "firefly-go-proxy.exe") {
			application.Get().Event.Emit("proxy:exit")
		}
	}()
	return true, ""
}

func (f *FSService) OpenFolder(path string) (bool, string) {
	absPath, err := filepath.Abs(path)
	if err != nil {
		return false, "failed to resolve absolute path: " + err.Error()
	}

	if !f.DirExists(absPath) {
		return false, "directory not found: " + absPath
	}

	url := "file:///" + filepath.ToSlash(absPath)
	application.Get().Browser.OpenURL(url)

	return true, ""
}

func (f *FSService) FileExistsInZip(archivePath, fileInside string) (bool, string) {
	exists, err := sevenzip.IsFileIn7z(archivePath, fileInside)
	if err != nil {
		return false, err.Error()
	}
	return exists, ""
}

func (f *FSService) ensureSophonInstalled() (string, error) {

	exe, err := os.Executable()
	if err != nil {
		return "", err
	}

	baseDir := filepath.Dir(exe)
	sophonDir := filepath.Join(baseDir, "Sophon")

	exePath := filepath.Join(sophonDir, "Sophon.Downloader.exe")

	// ✅ 1. check folder exists
	if _, err := os.Stat(exePath); err == nil {
		return exePath, nil
	}

	fmt.Println("Sophon not found → downloading...")

	// ✅ 2. create folder
	_ = os.MkdirAll(sophonDir, 0755)

	zipPath := filepath.Join(sophonDir, "sophon.zip")

	// ✅ 3. download fixed file
	resp, err := http.Get(constant.SophonGitUrl)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	out, err := os.Create(zipPath)
	if err != nil {
		return "", err
	}
	defer out.Close()

	_, err = io.Copy(out, resp.Body)
	if err != nil {
		return "", err
	}

	// ✅ 4. unzip
	err = unzip(zipPath, sophonDir)
	if err != nil {
		return "", err
	}

	_ = os.Remove(zipPath)

	// ✅ 5. verify
	if _, err := os.Stat(exePath); err != nil {
		return "", fmt.Errorf("Sophon install failed")
	}

	return exePath, nil
}

func DownloadSophon() error {
	url := constant.SophonGitUrl

	resp, err := http.Get(url)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	os.MkdirAll(constant.SophonStorageUrl, 0755)

	zipPath := filepath.Join(constant.SophonStorageUrl, "sophon.zip")

	out, err := os.Create(zipPath)
	if err != nil {
		return err
	}
	defer out.Close()

	_, err = io.Copy(out, resp.Body)
	if err != nil {
		return err
	}

	// แตกไฟล์
	return unzip(zipPath, constant.SophonStorageUrl)
}

func (f *FSService) GetLauncherDir() (string, error) {
	exePath, err := os.Executable()
	if err != nil {
		return "", err
	}
	return filepath.Dir(exePath), nil
}

func (f *FSService) RunDownloader(gameID string, pkg string, version string, output string, region string) (bool, error) {

	fmt.Println("STEP 1: start")

	launcherDir, err := f.GetLauncherDir()
	if err != nil {
		return false, err
	}

	output = filepath.Join(
		launcherDir,
		"GameData",
		gameID,
	)

	fmt.Println("LAUNCHER DIR:", launcherDir)
	fmt.Println("FORCED OUTPUT:", output)

	exePath, err := f.ensureSophonInstalled()
	if err != nil {
		return false, err
	}

	fmt.Println("Sophon path:", exePath)

	// check
	if _, err := os.Stat(exePath); err != nil {
		return false, fmt.Errorf("EXE NOT FOUND: %v", err)
	}

	_ = exec.Command("taskkill", "/F", "/IM", "GenshinImpact.exe").Run()

	output = sanitizePath(output)
	fmt.Println("SANITIZED OUTPUT:", output)

	cmd := exec.Command(
		exePath,
		"full",
		gameID,
		pkg,
		version,
		output,
		fmt.Sprintf("--region=%s", region),
	)

	cmd.Dir = filepath.Dir(exePath)

	stdout, err := cmd.StdoutPipe()
	if err != nil {
		return false, err
	}

	if err := cmd.Start(); err != nil {
		return false, err
	}

	go func() {
		buf := make([]byte, 1024)
		for {
			n, err := stdout.Read(buf)
			if n > 0 {
				line := string(buf[:n])
				application.Get().Event.Emit("download:progress", line)
			}
			if err != nil {
				break
			}
		}
	}()

	err = cmd.Wait()
	if err != nil {
		return false, err
	}

	return true, nil
}

func (w *ProgressWriter) Write(p []byte) (n int, err error) {
	line := string(p)

	// ส่งไป Wails event
	// runtime.EventsEmit(app, "download:progress", line)

	println(line)

	return len(p), nil
}

func unzip(zipPath, dest string) error {

	cmd := exec.Command("powershell", "-Command",
		fmt.Sprintf("Expand-Archive -Force '%s' '%s'", zipPath, dest),
	)

	return cmd.Run()
}

func sanitizePath(p string) string {
	p = strings.TrimSpace(p)
	p = strings.TrimSuffix(p, ",")
	p = filepath.Clean(p)

	// 🔥 กัน case bin, แล้ว clean ไม่ทัน
	if strings.Contains(p, ",") {
		parts := strings.Split(p, ",")
		p = parts[0]
	}

	return p
}
