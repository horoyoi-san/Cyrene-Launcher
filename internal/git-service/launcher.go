package gitService

import (
	"Cyrene-launcher/pkg/constant"
	"Cyrene-launcher/pkg/models"
	"encoding/json"
	"io"
	"net/http"
	"net/url"

	"github.com/minio/selfupdate"
)

type GitService struct{}

func (g *GitService) GetLatestLauncherVersion() (bool, string, string) {
		if constant.LauncherGitUrl == "" {
		return false, "", "updates disabled"
	}
	u, err := url.Parse(constant.LauncherGitUrl)
	if err != nil || (u.Scheme != "http" && u.Scheme != "https") {
		return false, "", "invalid launcher feed url"
	}
	resp, err := http.Get(u.String())
	if err != nil {
		return false, "", err.Error()
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)

	var releases []models.ReleaseType
	err = json.Unmarshal(body, &releases)
	if err != nil {
		return false, "", err.Error()
	}

	if len(releases) == 0 {
		return false, "", "no releases found"
	}

	return true, releases[0].TagName, ""
}

func (g *GitService) UpdateLauncherProgress(version string) (bool, string) {
	asset, ok := g.getReleaseAsset(version, constant.LauncherGitUrl, constant.LauncherFile)
	if !ok {
		return false, "no release found"
	}

	resp, err := http.Get(asset.BrowserDownloadURL)
	if err != nil {
		return false, err.Error()
	}
	defer resp.Body.Close()

	err = selfupdate.Apply(resp.Body, selfupdate.Options{})
	if err != nil {
		return false, err.Error()
	}
	return true, ""
}
