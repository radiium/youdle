export interface Progress {
    percent: number;        // (floatDownloaded * 100).toFixed(2),
    downloaded: number;     // (downloaded / 1024 / 1024).toFixed(2),
    total: number;          // (total / 1024 / 1024).toFixed(2),
    mn: number;             // downloadedMinutes.toFixed(2),
    mnRest: number;         // (downloadedMinutes / floatDownloaded - downloadedMinutes).toFixed(2)
}
