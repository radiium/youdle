export interface YoutubeVideo {
    index?: number;
    id?: string;
    thumb?: string;
    duration?: number;
    title?: string;
    publishedAt?: string;
    selected?: boolean;

    progress?: Progress;
}

export interface Progress {
    finish: boolean;
    type: ProgressType;
    status: ProgressStatus;
    download: ProgressDownload;
    convert: ProgressConvert;
}

export interface ProgressDownload {
    percent: number;        // (floatDownloaded * 100).toFixed(2),
    downloaded: number;     // (downloaded / 1024 / 1024).toFixed(2),
    total: number;          // (total / 1024 / 1024).toFixed(2),
    mn: number;             // downloadedMinutes.toFixed(2),
    mnRest: number;         // (downloadedMinutes / floatDownloaded - downloadedMinutes).toFixed(2)
}

export interface ProgressConvert {
    percent: number;        // an estimation of the progress percentage
    frames: number;         // total processed frame count
    currentFps: number;     // framerate at which FFmpeg is currently processing
    currentKbps: number;    // throughput at which FFmpeg is currently processing
    targetSize: number;     // current size of the target file in kilobytes
    timemark: number;       // the timestamp of the current frame in seconds
}

export enum ProgressType {
    NONE = 0,
    DOWNLOAD = 1,
    CONVERT = 2
}

export enum ProgressStatus {
    NONE = 0,
    STARTED = 1,
    PROGRESS = 2,
    ENDED = 3
}
