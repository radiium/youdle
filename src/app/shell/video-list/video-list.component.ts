import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';

import { SearchState } from '@stores/search';
import { VideoListItem } from '@stores/video-list';
import { ApiService } from '@core/services/api.service';
import { AppState } from '@core/stores/app-state';

@Component({
    selector: 'app-video-list',
    templateUrl: './video-list.component.html',
    styleUrls: ['./video-list.component.scss'],
})
export class VideoListComponent implements OnInit {
    count = {
        selected: 0,
        finished: 0
    };

    appState: AppState;
    searchState: SearchState;

    displayedColumns: string[] = ['selected', 'thumbnail', 'meta', 'title'];
    dataSource = new MatTableDataSource<VideoListItem>([]);
    selection = new SelectionModel<VideoListItem>(true, []);

    constructor(
    private cdRef: ChangeDetectorRef,
    private apiSrv: ApiService,
    ) {}

    ngOnInit() {
        this.apiSrv.getAppState().subscribe(data => this.appState = data);
        this.apiSrv.getSearchState().subscribe(data => this.searchState = data);
        this.apiSrv.getVideoListState().subscribe(data => {
            this.dataSource = new MatTableDataSource<VideoListItem>(data.items);
            this.selection = new SelectionModel<VideoListItem>(true, data.selectedItems);
            this.cdRef.detectChanges();
        });
    }

    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.data.length;
        return numSelected === numRows;
    }

    masterToggle() {
        this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
        this.apiSrv.setSelectedItems(this.selection.selected);
    }

    itemToggle(item: VideoListItem, event: any) {
        if (event) {
            this.selection.toggle(item);
            this.apiSrv.setSelectedItems(this.selection.selected);
        }
    }

    startDownload() {
        this.apiSrv.startDownload();
    }

    cancelDownload() {
        this.apiSrv.cancelDownload();
    }









/*
    this.electronSrv.ipcRenderer.on('onDownloadStart', (event, data) => {
        console.log('onDownloadStart', data);
        this.setVideoStatus(data.id, ProgressStatus.STARTED);
    });

    this.electronSrv.ipcRenderer.on('onDownloadProgress', (event, data) => {
        // console.log('onDownloadProgress', data);
        this.setVideoStatus(data.id, ProgressStatus.PROGRESS, data.progress);
    });

    this.electronSrv.ipcRenderer.on('onDownloadEnd', (event, data) => {
        this.downloadNext();
        this.setVideoStatus(data.id, ProgressStatus.ENDED);

        if (this.count.finished === this.downloaded.length) {
            this.onAllDownloadSuccess();
        }
    });

    this.electronSrv.ipcRenderer.on('onDownloadCancel', (event, data) => {
        this.setVideoStatus(data.id, ProgressStatus.CANCELLED);
        this.onAllDownloadCancel();
    });

    this.electronSrv.ipcRenderer.on('onDownloadError', (event, data) => {
        this.setVideoStatus(data.id, ProgressStatus.ERROR);
    });
    */

    // Items selection
    onSelectAll() {
        /*
        this.selectAllState.all = !this.selectAllState.all;
        _.forEach(this.search.items, (video) => {
            video.selected = this.selectAllState.all;
        });
        this.updateSelection();
        */
    }

    updateSelection() {
        // this.updateSelectAll();
        // this.dataSrv.setItems(this.search.items);
    }

    updateSelectAll() {
        /*

        this.count = {
            selected: 0,
            finished: 0
        };

        _.forEach(this.search.items, (video) => {
            if (video.status === ProgressStatus.ENDED) {
                this.count.finished++;
                video.selected = true;
            }

            if (video.selected) {
                this.count.selected++;
            }
        });

        if ((this.count.finished === this.search.items.length) ||
            (this.count.selected === this.search.items.length)) {
            this.selectAllState.all = true;
            this.selectAllState.inter = false;

        } else if ((this.count.finished > 0 && this.count.finished < this.search.items.length) ||
                   (this.count.selected > 0 && this.count.selected < this.search.items.length)) {
            this.selectAllState.inter = true;

        } else if (this.count.finished === 0 && this.count.selected === 0) {
            this.selectAllState.all = false;
            this.selectAllState.inter = false;
        }
        */
    }



    /*
    startDownload() {
        this.toDownload = _.filter(this.search.items, (video) => {
            return video.selected;
        });

        for (let i = 0; i < this.settings.concurrentDownload; i++) {
            this.downloadNext();
        }
        this.dataSrv.setDownloadStarted(true);
    }
       */

    setVideoStatus(id, status, progress?) {
        /*
        const idx = _.findIndex(this.search.items, { id: id });

        console.log(id, idx, this.search.items[idx]);

        if (this.search.items[idx]) {
            this.search.items[idx].status = status;
            this.search.items[idx].progress = progress;
            this.dataSrv.setItems(this.search.items);
        }
        */
    }

    downloadNext() {
        /*
        if (this.toDownload && this.toDownload[0]) {
            const video = this.toDownload[0];
            this.downloaded.push(video);
            this.toDownload.splice(0, 1);

            const data = {
                // savePath: this.settings.savePath,
                video: video,
            };

            this.dataSrv.setDownloadStarted(true);
            this.electronSrv.ipcRenderer.send('download', data);

        } else {
            // this.dataSrv.setDownloadStarted(false);
        }
        */
    }

    /*
    cancelDownload() {
        _.forEach(this.downloaded, (video) => {
            const current = _.find(this.search.items, { id: video.id });
            if (current && current.status === ProgressStatus.PROGRESS) {
                this.electronSrv.ipcRenderer.send('cancelDownload.' + video.id);
            }
        });
    }
    */

    onAllDownloadSuccess() {
        /*
        const message: Message = {
            type: MessageType.SUCCESS,
            title: 'Success',
            description: this.getMessageDescription()
        };
        this.update(message);
        this.notify(message);
        this.dataSrv.setDownloadStarted(false);
        */
    }

    onAllDownloadError() {
        /*
        const message: Message = {
            type: MessageType.ERROR,
            title: 'ERROR',
            description: 'Somethings went wrong...'
        };
        this.update(message);
        this.notify(message);
        */
    }

    onAllDownloadCancel() {
        /*
        const message: Message = {
            type: MessageType.CANCEL,
            title: 'Cancel',
            description: ''
        };
        this.update(message);
        */
    }

    update(message) {
        /*
        this.downloaded = [];
        this.toDownload = [];
        this.count = {
            selected: 0,
            finished: 0
        };

        this.dataSrv.setDownloadStarted(false);
        this.dataSrv.setMessage(message);
        this.dataSrv.setInputValue('');
        this.dataSrv.setItems([]);

        this.zone.run(() => {
            // this.router.navigateByUrl('/message');
            // this.router.navigate(['../message']);
        });
        */
    }

    getMessageDescription() {
        /*
        let desc = '';
        desc += this.downloaded.length.toString();
        desc += ' item';
        desc += this.downloaded.length > 1 ? 's' : '';
        desc += ' downloaded!';
        return desc;
        */
    }

    notify(message) {
        /*
        const myNotification = new Notification(message.title, {
            body: message.description,
            // icon: 'assets/icons/checked.svg'
        });
        */
    }
}
