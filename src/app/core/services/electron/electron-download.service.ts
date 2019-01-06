import { Injectable } from '@angular/core';
import { EMPTY } from 'rxjs';
import { ElectronService } from './electron.service';

export interface DownloadOptions {
    savePath: string;
    container: MediaType;
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

    public cancelDownloadVideo(video) {
        if (!this.isElectronApp) { return EMPTY; }
        this.ipcRenderer.send('cancel-download.' + video.id);
        return this.getResponseEvent('cancel-download-resp');
    }

    public onDownloadStart() {
        if (!this.isElectronApp) { return EMPTY; }
        return this.getResponseEvent('onDownloadStart');
    }

    public onDownloadProgress() {
        if (!this.isElectronApp) { return EMPTY; }
        return this.getResponseEvent('onDownloadProgress');
    }

    public onDownloadEnd() {
        if (!this.isElectronApp) { return EMPTY; }
        return this.getResponseEvent('onDownloadEnd');
    }
}
