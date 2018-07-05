import { Component, OnInit } from '@angular/core';
import { AppStateService } from 'core/services/app-state.service';
import { YoutubeVideo } from 'shared/models/youtube-video';
import * as _ from 'lodash';
import { SelectionModel } from '@angular/cdk/collections';
import { AppState } from 'shared/models/app-state';
import { ElectronService } from 'ngx-electron';

@Component({
    selector: 'app-content',
    templateUrl: './content.component.html',
    styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit {

    selection = new SelectionModel<YoutubeVideo>(true, []);
    appState: AppState;

    constructor(

    private electronSrv: ElectronService,
    private appStateSrv: AppStateService) {
        this.appStateSrv.appState$.subscribe((data) => {
            this.appState = data;
            if (this.appState.videoList && this.appState.videoList.length === 1) {
                this.appState.videoList[0].selected = true;
            }
        });
    }

    ngOnInit() {

        this.electronSrv.ipcRenderer.on('downloadProgress', (event, data) => {
                console.log('downloadProgress', data.index);
        });
    }

    isAllSelected() {
        return this.appState.videoList.length === this.selection.selected.length;
    }

    masterToggle() {
        this.isAllSelected()
            ? this.selection.clear()
            : _.forEach(this.appState.videoList, (video) => this.selection.select(video));
    }

    download() {
        // const selected = this.appState.videoList[0];
        const selected = this.selection.selected;
        console.log('Selected video', selected);

        // https://www.youtube.com/watch?list=PL0k4GF1e6u1T9kUYx9ppyGvCS9EcvaCM2
        _.forEach(selected, (video) => {
            const data = {
                videoId: video.id,
                filePath: '/Users/amigamac/Desktop',
                fileName: video.title
            };
            this.electronSrv.ipcRenderer.send('onDownload', data);
        });


    }

    trackByFn(index, item) {
        return item.index;
    }
}
