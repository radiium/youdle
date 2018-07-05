import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import * as _ from 'lodash';

import { ElectronService } from 'ngx-electron';
import { AppStateService } from 'core/services/app-state.service';
import { VideoListService } from 'core/services/video-list.service';
import { AppState, YoutubeVideo, AppList } from 'shared/models';

@Component({
    selector: 'app-content',
    templateUrl: './content.component.html',
    styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit {

    appState: AppState;
    videoList: YoutubeVideo[];

    selectedCount: number;
    allSelected: boolean;
    interSelected: boolean;

    constructor(
    private electronSrv: ElectronService,
    private appStateSrv: AppStateService,
    private videoListSrv: VideoListService) {

        this.selectedCount = 0;
        this.allSelected   = false;
        this.interSelected = false;

        this.videoListSrv.videoList$.subscribe((data) => {
            this.videoList = data;
        });

        this.appStateSrv.appState$.subscribe((data) => {
            this.appState = data;
        });
    }

    ngOnInit() {
        this.electronSrv.ipcRenderer.on('downloadProgress', (event, data) => {
                console.log('downloadProgress', data.index);
        });
    }

    download() {
        /*
        // const selected = this.videoList[0];
        const selected = this.appList.selection.selected;
        console.log('Selected video', selected, this.videoList);

        // https://www.youtube.com/watch?list=PL0k4GF1e6u1T9kUYx9ppyGvCS9EcvaCM2
        _.forEach(selected, (video) => {
            const data = {
                videoId: video.id,
                filePath: '/Users/amigamac/Desktop',
                fileName: video.title
            };
            this.electronSrv.ipcRenderer.send('onDownload', data);
        });
        */
    }

    trackByFn(index, item) {
        return item.index;
    }


    onSelect() {
        this.updateSelection();
    }

    onSelectAll() {
        this.allSelected = !this.allSelected;
        _.forEach(this.videoList, (video) => {
            video.selected = this.allSelected;
        });
        this.updateSelection();
    }

    updateSelection() {
        this.selectedCount = 0;
        _.forEach(this.videoList, (video) => {
            if (video.selected) {
                this.selectedCount++;
            }
        });

        if (this.selectedCount === this.videoList.length) {
            this.allSelected = true;
            this.interSelected = false;

        } else if (this.selectedCount > 0 && this.selectedCount < this.videoList.length) {
            this.interSelected = true;
        } else if (this.selectedCount === 0) {
            this.allSelected = false;
            this.interSelected = false;
        }

        this.videoListSrv.setVideoList(this.videoList);
    }
}
