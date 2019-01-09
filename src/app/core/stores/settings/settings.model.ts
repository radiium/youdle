export interface SettingsState {
    savePath: string;
    concurrentDownload: number;
    mediaType: MediaType;
}

export enum MediaType {
    VIDEO = 'VIDEO',
    AUDIO = 'AUDIO',
}
