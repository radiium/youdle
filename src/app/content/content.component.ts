import { Component, OnInit, ChangeDetectorRef, Renderer2 } from '@angular/core';
import * as _ from 'lodash';

import { ElectronService } from 'ngx-electron';
import { AppStateService } from 'core/services/app-state.service';
import { VideoListService } from 'core/services/video-list.service';
import { AppState,
         YoutubeVideo,
         ProgressDownload,
         ProgressConvert,
         ProgressType,
         ProgressStatus} from 'shared/models';

@Component({
    selector: 'app-content',
    templateUrl: './content.component.html',
    styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit {

    appState: AppState;
    videoList: YoutubeVideo[];

    downloadStarted: boolean;
    finishedCount: number;
    selectedCount: number;
    allSelected: boolean;
    interSelected: boolean;

    constructor(
    private renderer: Renderer2,
    private cdr: ChangeDetectorRef,
    private electronSrv: ElectronService,
    private appStateSrv: AppStateService,
    private videoListSrv: VideoListService) {

        this.downloadStarted = false;
        this.finishedCount = 0;
        this.selectedCount = 0;
        this.allSelected = false;
        this.interSelected = false;

        this.videoListSrv.videoList$.subscribe((data) => {
            this.videoList = data;
            if (this.videoList[0]) {
                this.videoList[0].progress.finish = false;
            }
            this.updateSelectAll();
        });

        this.appStateSrv.appState$.subscribe((data) => {
            this.appState = data;
        });



        this.electronSrv.ipcRenderer.on('downloadStart', (event, data) => {
            this.videoList[data.index].progress.type = ProgressType.DOWNLOAD;
            this.videoList[data.index].progress.status = ProgressStatus.STARTED;
            this.cdr.detectChanges();
        });
        this.electronSrv.ipcRenderer.on('downloadProgress', (event, data) => {
            this.videoList[data.index].progress.status = ProgressStatus.PROGRESS;
            this.videoList[data.index].progress.download = data.progress;
            this.cdr.detectChanges();
        });
        this.electronSrv.ipcRenderer.on('downloadEnd', (event, data) => {
            this.videoList[data.index].progress.type = ProgressType.NONE;
            this.videoList[data.index].progress.status = ProgressStatus.ENDED;
            this.cdr.detectChanges();
        });


        this.electronSrv.ipcRenderer.on('convertStart', (event, data) => {
            this.videoList[data.index].progress.type = ProgressType.CONVERT;
            this.videoList[data.index].progress.status = ProgressStatus.STARTED;
            this.cdr.detectChanges();
        });
        this.electronSrv.ipcRenderer.on('convertProgress', (event, data) => {
            this.videoList[data.index].progress.status = ProgressStatus.PROGRESS;
            this.videoList[data.index].progress.convert = data.progress;
            this.cdr.detectChanges();

        });
        this.electronSrv.ipcRenderer.on('convertEnd', (event, data) => {
            this.videoList[data.index].progress.type = ProgressType.NONE;
            this.videoList[data.index].progress.status = ProgressStatus.ENDED;
            this.videoList[data.index].progress.finish = true;
            this.videoList[data.index].selected = true;
            this.cdr.detectChanges();
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
            if (video.progress.finish) {
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

        /*
        console.log('======================================');
        console.log('Update selection');
        console.log(`len: ${this.videoList.length} - finish: ${this.finishedCount} - slected: ${this.selectedCount}`);
        console.log('allSelected', this.allSelected);
        console.log('interSelected', this.interSelected);
        */
    }

    updateSelection() {
        this.updateSelectAll();
        this.videoListSrv.setVideoList(this.videoList);
    }

    startDownload() {
        // const selected = this.videoList[0];
        this.downloadStarted = true;
        // https://www.youtube.com/watch?list=PL0k4GF1e6u1T9kUYx9ppyGvCS9EcvaCM2
        _.forEach(this.videoList, (video) => {

            if (video.selected) {
                console.log('======================================');
                console.log('Download video infos');
                console.log('index', video.index);
                console.log('videoId', video.id);
                console.log('filePath', '/Users/amigamac/Desktop');
                console.log('fileName', video.title);

                const data = {
                    index: video.index,
                    videoId: video.id,
                    filePath: '/Users/amigamac/Desktop',
                    fileName: video.title
                };
                this.electronSrv.ipcRenderer.send('onDownload', data);
            }

        });
    }

    cancelDownload() {

    }

    trackByFn(index, item) {
        return index; // item.index;
    }
}
