export interface YoutubeVideo {
    id?: string;
    thumb?: string;
    duration?: number;
    title?: string;
    publishedAt?: string;
    selected?: boolean;
    status: ProgressStatus;
    progress?: Progress;
}

export interface Progress {
    percent: number;        // (floatDownloaded * 100).toFixed(2),
    downloaded: number;     // (downloaded / 1024 / 1024).toFixed(2),
    total: number;          // (total / 1024 / 1024).toFixed(2),
    mn: number;             // downloadedMinutes.toFixed(2),
    mnRest: number;         // (downloadedMinutes / floatDownloaded - downloadedMinutes).toFixed(2)
}

export enum ProgressStatus {
    NONE = -1,
    STARTED = 0,
    PAUSED = 1,
    PROGRESS = 2,
    ENDED = 3,
    CANCELLED = 4
}
