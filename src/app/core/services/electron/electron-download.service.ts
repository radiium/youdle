import { Injectable } from '@angular/core';
import { EMPTY } from 'rxjs';
import { ElectronService } from './electron.service';

export interface DownloadOptions {
    savePath: string;
    type: MediaType;
}

export enum MediaType {
    VIDEO = 'VIDEO',
    AUDIO = 'AUDIO',
}

@Injectable()
export class ElectronDownloadService extends ElectronService {

    constructor() {
        super();
    }

    public startDownloadVideo(video, options: DownloadOptions) {
        if (!this.isElectronApp) { return EMPTY; }
        this.ipcRenderer.send('start-download', video, options);
    }

    public cancelDownloadVideo(videoId: string) {
        if (!this.isElectronApp) { return EMPTY; }
        this.ipcRenderer.send('cancel-download.' + videoId);
        return this.getResponseEvent('cancel-download-resp');
    }

    public onDownload() {
        if (!this.isElectronApp) { return EMPTY; }
        return this.getResponseEvent('onDownload');
    }
}
