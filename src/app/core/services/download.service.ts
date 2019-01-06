import { Injectable } from '@angular/core';
import { Observable, EMPTY, forkJoin } from 'rxjs';
import { ipcRenderer } from 'electron';
import { ApiService } from './api.service';
import * as _ from 'lodash';

import { DialogService } from './dialog.service';
import { SettingsState } from '@core/stores/settings/settings.model';
import { ProgressStatus, Progress, VideoListItem } from '@core/stores/video-list/video-list.model';
import { MessageType, Message } from '@core/models';
import { ElectronDownloadService } from './electron/electron-download.service';

@Injectable({
    providedIn: 'root',
})
export class DownloadService {

    private readonly ipcRenderer: typeof ipcRenderer;

    private readonly _isElectronApp: boolean = !!window.navigator.userAgent.match(/Electron/);
    get isElectronApp() {
        return this._isElectronApp;
    }

    constructor(
                private downLoadSrv: ElectronDownloadService,
                private dialogSrv: DialogService,
                private apiSrv: ApiService) {

        if (this.isElectronApp) {
            this.ipcRenderer = window.require('electron').ipcRenderer;

            // Load local stored settings
            forkJoin([
                this.getSavePath(),
                this.getConcurrentDownload()
            ]).subscribe(data => {
                this.apiSrv.setSettingsState({
                    savePath: data[0],
                    concurrentDownload: data[1]
                } as SettingsState);
            });
        }
    }

    dlState;

    startDownload(selectedItems: VideoListItem[], settings: SettingsState) {
        if (!this.isElectronApp) { return EMPTY; }
        this.initDownloadListener();
        this.apiSrv.setIsDownloading();

        this.dlState = {
            settings: settings,
            toDownloadCount: selectedItems.length,
            selectedItems: selectedItems,
            toDownload: _.cloneDeep(selectedItems),
            started: [],
            finished: []
        };

        for (let i = 0; i < settings.concurrentDownload; i++) {
            this.downloadNext();
        }
    }

    cancelDownload() {
        this.dlState.started
            .map(video => this.ipcRenderer.send('cancelDownload.' + video.id));
    }

    // Download events
    initDownloadListener() {
        this.ipcRenderer.on('onDownloadStart', this.onDownloadStart.bind(this));
        this.ipcRenderer.on('onDownloadProgress', this.onDownloadProgress.bind(this));
        this.ipcRenderer.on('onDownloadEnd', this.onDownloadEnd.bind(this));
        this.ipcRenderer.on('onDownloadCancel', this.onDownloadCancel.bind(this));
        this.ipcRenderer.on('onDownloadError', this.onDownloadError.bind(this));
    }

    onDownloadStart(event, args) {
        console.log('onDownloadStart');
        this.setVideoStatus(args.id, ProgressStatus.STARTED);
    }

    onDownloadProgress(event, args) {
        // console.log('onDownloadStart');
        this.setVideoStatus(args.id, ProgressStatus.PROGRESS, args.progress);
    }

    onDownloadEnd(event, args) {
        console.log('onDownloadEnd');

        this.downloadNext();
        const progress = {
            percent: 100.00,
            downloaded: 0,
            total: 0,
            mn: 0,
            mnRest: 0,
        };
        this.setVideoStatus(args.id, ProgressStatus.ENDED, progress);

        const finishedItem = _.find(this.dlState.started, { id: args.id });
        if (finishedItem) {
            this.dlState.finished.push(finishedItem);
        }

        if (this.dlState.finished.length === this.dlState.started.length) {
            this.onAllDownloadSuccess();
        }
    }

    onDownloadCancel(event, args) {
        console.log('onDownloadCancel');
        this.setVideoStatus(args.id, ProgressStatus.CANCELLED);
        this.onAllDownloadCancel();
    }

    onDownloadError(event, args) {
        console.log('onDownloadError');
        this.setVideoStatus(args.id, ProgressStatus.ERROR);

    }

    // Download utils
    downloadNext() {
        if (this.dlState && this.dlState.toDownload[0]) {

            const video =  this.dlState.toDownload.shift();
            this.dlState.started.push(video);

            const data = {
                savePath: this.dlState.settings.savePath,
                video: video,
            };
            this.ipcRenderer.send('download', data);

        } else {
            // this.dataSrv.setDownloadStarted(false);
        }
    }

    setVideoStatus(videoId: string, status: ProgressStatus, progress?: Progress) {
        // TODO Update one item
        const video = _.cloneDeep(_.find(this.dlState.selectedItems, { id: videoId }));
        if (video) {
            video.status = status;
            video.progress = progress;
            this.apiSrv.updateItems([video]);
        }
    }

    onAllDownloadSuccess() {
        if (!this.dlState.allCancelled) {
            this.dlState.allCancelled = true;
            const count = this.dlState.finished.length;
            this.onAllEnd({
                type: MessageType.SUCCESS,
                title: 'Success',
                description: `${count} item${(count > 1) ? 's' : ''} downloaded!`
            });
        }
    }

    onAllDownloadCancel() {
        this.onAllEnd({
            type: MessageType.CANCEL,
            title: 'Cancel',
            description: 'Download canceled'
        });
    }

    onAllDownloadError() {
        this.onAllEnd({
            type: MessageType.ERROR,
            title: 'Error',
            description: 'Something went wrong'
        });
    }

    onAllEnd(message: Message) {
        const notif = new Notification(message.title, { body: message.description });
        this.dialogSrv.openMessageDialog(message);
        this.apiSrv.unsetIsDownloading();
    }

    // Save path
    editSavePath(savePath: string) {
        if (!this.isElectronApp) { return EMPTY; }
        this.ipcRenderer.send('edit-save-path', { savePath: savePath });
        return this.getResponseEvent('edit-save-path-resp');
    }

    setSavePath(savePath: string) {
        if (!this.isElectronApp) { return EMPTY; }
        this.ipcRenderer.send('set-save-path', savePath);
        return this.getResponseEvent('set-save-path');
    }

    getSavePath() {
        if (!this.isElectronApp) { return EMPTY; }
        this.ipcRenderer.send('get-save-path');
        return this.getResponseEvent('get-save-path-resp');
    }

    // Concurrent download
    setConcurrentDownload(concurrentDownload: number) {
        if (!this.isElectronApp) { return EMPTY; }
        this.ipcRenderer.send('set-concurrent-download', concurrentDownload);
        return this.getResponseEvent('set-concurrent-download-resp');
    }

    getConcurrentDownload() {
        if (!this.isElectronApp) { return EMPTY; }
        this.ipcRenderer.send('get-concurrent-download');
        return this.getResponseEvent('get-concurrent-download-resp');
    }

    // Handle response
    private getResponseEvent(eventKey: string) {
        return new Observable((obs) => {
            this.ipcRenderer.on(eventKey, (event, error, data) => {
                if (error) {
                    obs.error(error);
                } else {
                    obs.next(data);
                }
                obs.complete();
                this.ipcRenderer.removeAllListeners(eventKey);
            });
        });
    }
}
