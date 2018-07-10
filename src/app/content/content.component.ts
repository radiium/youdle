import { Component, OnInit, ChangeDetectorRef, Renderer2 } from '@angular/core';
import * as _ from 'lodash';

import { ElectronService } from 'ngx-electron';
import { DataService } from 'core/services/data.service';
import { AppState, Settings, YoutubeVideo, ProgressStatus } from 'shared/models';

@Component({
    selector: 'app-content',
    templateUrl: './content.component.html',
    styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit {

    appState: AppState;
    settings: Settings;
    videoList: YoutubeVideo[];
    downloaded: YoutubeVideo[];
    selected: YoutubeVideo[];

    downloadStarted: boolean;
    finishedCount: number;
    selectedCount: number;
    allSelected: boolean;
    interSelected: boolean;

    constructor(
    private renderer: Renderer2,
    private cdr: ChangeDetectorRef,
    private electronSrv: ElectronService,
    private dataSrv: DataService) {

        this.downloaded = [];
        this.selected = [];
        this.downloadStarted = false;
        this.finishedCount = 0;
        this.selectedCount = 0;
        this.allSelected = false;
        this.interSelected = false;

        this.dataSrv.appState$.subscribe((data) => {
            this.appState = data;
        });

        this.dataSrv.settings$.subscribe((data) => {
            this.settings = data;
        });

        this.dataSrv.videoList$.subscribe((data) => {
            this.videoList = data;
            this.updateSelectAll();
            if (this.videoList.length > 0) {
                this.cdr.detectChanges();
            }
        });

        this.electronSrv.ipcRenderer.on('onDownloadStart', (event, data) => {
            this.setVideoStatus(data.id, ProgressStatus.STARTED);
        });

        this.electronSrv.ipcRenderer.on('onDownloadProgress', (event, data) => {
            console.log('onDownloadProgress', data);
            this.setVideoStatus(data.id, ProgressStatus.PROGRESS, data.progress);
        });

        this.electronSrv.ipcRenderer.on('onDownloadEnd', (event, data) => {
            this.downloadNext();
            this.setVideoStatus(data.id, ProgressStatus.ENDED, null);
        });

        this.electronSrv.ipcRenderer.on('onDownloadCancel', (event, data) => {
            this.setVideoStatus(data.id, ProgressStatus.CANCELLED, null);
        });

        this.electronSrv.ipcRenderer.on('onDownloadError', (event, data) => {
            this.setVideoStatus(data.id, ProgressStatus.CANCELLED, null);
        });

        this.electronSrv.ipcRenderer.on('onDownloadAllFinish', (event, data) => {
            console.log('onDownloadAllFinish');
        });
    }

    ngOnInit() {
    }

    onSelectAll() {
        this.allSelected = !this.allSelected;
        _.forEach(this.videoList, (video) => {
            video.selected = this.allSelected;
        });
        this.updateSelection();
    }

    updateSelectAll() {
        this.finishedCount = 0;
        this.selectedCount = 0;
        _.forEach(this.videoList, (video) => {
            if (video.status === 3) {
                this.finishedCount++;
                video.selected = true;
            }

            if (video.selected) {
                this.selectedCount++;
            }
        });

        if ((this.finishedCount === this.videoList.length) ||
            (this.selectedCount === this.videoList.length)) {
            this.allSelected = true;
            this.interSelected = false;

        } else if ((this.finishedCount > 0 && this.finishedCount < this.videoList.length) ||
                   (this.selectedCount > 0 && this.selectedCount < this.videoList.length)) {
            this.interSelected = true;

        } else if (this.finishedCount === 0 && this.selectedCount === 0) {
            this.allSelected = false;
            this.interSelected = false;
        }
    }

    updateSelection() {
        this.updateSelectAll();
        this.dataSrv.setVideoList(this.videoList);
    }

    startDownload() {
        this.selected = _.filter(this.videoList, (video) => {
            return video.selected;
        });

        for (let i = 0; i < this.settings.concurrentDownload; i++) {
            this.downloadNext();
        }
        this.downloadStarted = true;
    }

    setVideoStatus(id, status, progress?) {
        const idx = _.findIndex(this.videoList, { id: id });
        this.videoList[idx].status = status;
        this.videoList[idx].progress = progress;
        this.dataSrv.setVideoList(this.videoList);
    }

    downloadNext() {
        if (this.selected.length) {
            const video = this.selected[0];
            this.downloaded.push(video);
            this.selected.splice(0, 1);

            const data = {
                savePath: this.settings.savePath,
                video: video,
            };

            this.downloadStarted = true;
            this.electronSrv.ipcRenderer.send('download', data);
        } else {
            this.downloadStarted = false;
        }
    }

    cancelDownload() {
        _.forEach(this.downloaded, (video) => {
            this.electronSrv.ipcRenderer.send('cancelDownload.' + video.id);
        });
    }

    trackByFn(index, item) {
        return index; // item.index;
    }
}
