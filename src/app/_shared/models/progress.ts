

export interface Progress {
    type: ProgressType;
    download: ProgressDownload;
    convert: ProgressConvert;
}

export enum ProgressType {
    NONE = 0,
    DOWNLOAD = 1,
    CONVERT = 2
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


/*
progress: {
    percent: (floatDownloaded * 100).toFixed(2),
    downloaded: (downloaded / 1024 / 1024).toFixed(2),
    total: (total / 1024 / 1024).toFixed(2),
    mn: downloadedMinutes.toFixed(2),
    mnRest: (downloadedMinutes / floatDownloaded - downloadedMinutes).toFixed(2)
}
*/
