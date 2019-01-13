import { Injectable, NgZone } from '@angular/core';
import { ApiService } from './api.service';
import * as _ from 'lodash';

import { DialogService } from './dialog.service';
import { SettingsState } from '@core/stores/settings/settings.model';
import { DownloadStatus, Progress, VideoListItem } from '@core/stores/video-list/video-list.model';
import { Message } from '@core/models';
import { ElectronDownloadService } from './electron/electron-download.service';
import { Store } from '@ngrx/store';
import { VideoListActionEmptyState } from '@core/stores/video-list/video-list.actions';
import { SearchActionClearInputValue } from '@core/stores/search/search.actions';

@Injectable()
export class DownloadService {

    dlState;
    allEnded = false;
    settings: SettingsState;

    constructor(
    private store$: Store<any>,
    private ngZone: NgZone,
    private downLoadSrv: ElectronDownloadService,
    private dialogSrv: DialogService,
    private apiSrv: ApiService) {
    }

    startDownloadVideo(selectedItems: VideoListItem[], settings: SettingsState) {
        this.downLoadSrv.onDownload().subscribe(args => this.onDownload(args[0]));
        this.apiSrv.setIsDownloading();

        this.settings = settings;

        this.dlState = {
            selectedItems: selectedItems,
            toDownload: _.cloneDeep(selectedItems),

            itemsStart: [],
            itemsError: [],
            itemsCancel: [],
            itemsSuccess: [],
        };

        for (let i = 0; i < settings.concurrentDownload; i++) {
            this.downloadNext();
        }
    }

    cancelDownload() {
        // Cancel current download
        this.dlState.itemsStart.map((video: VideoListItem) => {
            this.downLoadSrv.cancelDownloadVideo(video.id);
            this.dlState.itemsCancel.push(video);
        });

        this.dlState.toDownload.map((video: VideoListItem) => {
            this.dlState.itemsCancel.push(video);
        });

        this.dlState.itemsCancel.map((video: VideoListItem) => {
            this.setVideoStatus(video, DownloadStatus.CANCEL);
        });

        this.dlState.toDownload = [];
        this.onAllDownloadEnd();
    }


    onDownload(args: any) {

        switch (args.status) {
            case 'START':
                this.setVideoStatus(args.item, DownloadStatus.START);
                break;

            case 'PROGRESS':
                this.setVideoStatus(args.item, DownloadStatus.PROGRESS, args.progress);
                break;

            case 'ERROR':
                this.dlState.error = args.err;
                this.dlState.itemsError.push(args.item);
                this.setVideoStatus(args.item, DownloadStatus.ERROR);
                this.downloadNext();
                this.onAllDownloadEnd();
                break;

            case 'CANCEL':
                // Do nothing
                // Canceled one time for all download
                break;

            case 'SUCCESS':
                this.dlState.itemsSuccess.push(args.item);
                const progress = { percent: 100.00, downloaded: 0, total: 0, mn: 0, mnRest: 0 };
                this.setVideoStatus(args.item, DownloadStatus.SUCCESS, progress);
                this.downloadNext();
                this.onAllDownloadEnd();
                break;

            default:
                break;
        }
    }

    getItems(videoId: string) {
        return _.cloneDeep(_.find(this.dlState.selectedItems, { id: videoId }));
    }

    // Download utils
    downloadNext() {
        if (this.dlState.toDownload[0]) {
            const video =  this.dlState.toDownload.shift();
            this.dlState.itemsStart.push(video);

            this.downLoadSrv.startDownloadVideo(video, {
                savePath: this.settings.savePath,
                type: this.settings.mediaType
            });
        }
    }

    onAllDownloadEnd() {
        if (this.dlState.toDownload.length === 0 && !this.allEnded) {
            const message: Message = {
                successCount: this.dlState.itemsSuccess.length,
                cancelCount: this.dlState.itemsCancel.length,
                errorCount: this.dlState.itemsError.length,
                error: this.dlState.error
            };

            this.allEnded = true;
            const notif = new Notification('Youdle', { body: `Download end!` });
            this.apiSrv.unsetIsDownloading();

            this.ngZone.run(() => {
                this.dialogSrv.openMessageDialog(message, () => {});
            });
            this.store$.dispatch(new VideoListActionEmptyState());
            this.store$.dispatch(new SearchActionClearInputValue());
        }
    }

    setVideoStatus(item: VideoListItem, status: DownloadStatus, progress?: Progress) {
        item = _.cloneDeep(item);
        if (item) {
            item.status = status;
            item.progress = progress ? progress : item.progress;
            this.apiSrv.updateItems([item]);
        }
    }
}
