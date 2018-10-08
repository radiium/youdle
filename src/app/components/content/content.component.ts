import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as _ from 'lodash';

import { ElectronService } from 'ngx-electron';
import { DataService } from 'core/services/data.service';
import { UtilsService } from 'core/services/utils.service';
import { AppState, Settings, Message, Search, Item, MessageType, ProgressStatus } from 'core/services/data.models';


@Component({
    selector: 'app-content',
    templateUrl: './content.component.html',
    styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit {
    messageType = MessageType;
    appState: AppState;
    settings: Settings;
    search: Search;
    message: Message;

    downloaded: Item[];
    toDownload: Item[];

    count = {
        selected: 0,
        finished: 0
    };

    selectAllState = {
        all: false,
        inter: false
    };


    constructor(
    private router: Router,
    private electronSrv: ElectronService,
    private dataSrv: DataService,
    private utilsSrv: UtilsService) {
    }

    ngOnInit() {
        this.downloaded = [];
        this.toDownload = [];

        this.dataSrv.appState$.subscribe((data) => {
            this.appState = data;
        });

        this.dataSrv.settings$.subscribe((data) => {
            this.settings = data;
        });

        this.dataSrv.message$.subscribe((data) => {
            this.message = data;
        });

        this.dataSrv.search$.subscribe((data) => {
            this.search = data;
            this.updateSelectAll();
        });

        this.electronSrv.ipcRenderer.on('onDownloadStart', (event, data) => {
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

        /*
        this.electronSrv.ipcRenderer.on('onDownloadAllFinish', (event, data) => {
            // console.log('onDownloadAllFinish');
        });
        */
    }

    // Search input
    onInputChange(event) {
        this.dataSrv.setInputValue(event);
        this.utilsSrv.parseInputValue(event);
    }

    clearInput() {
        this.dataSrv.setInputValue('');
        this.dataSrv.setNoResult(false);
    }

    // Items selection
    onSelectAll() {
        this.selectAllState.all = !this.selectAllState.all;
        _.forEach(this.search.items, (video) => {
            video.selected = this.selectAllState.all;
        });
        this.updateSelection();
    }

    updateSelection() {
        this.updateSelectAll();
        this.dataSrv.setItems(this.search.items);
    }

    updateSelectAll() {

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
    }



    startDownload() {
        this.toDownload = _.filter(this.search.items, (video) => {
            return video.selected;
        });

        for (let i = 0; i < this.settings.concurrentDownload; i++) {
            this.downloadNext();
        }
        this.dataSrv.setDownloadStarted(true);
    }

    setVideoStatus(id, status, progress?) {

        const idx = _.findIndex(this.search.items, { id: id });

        if (this.search.items[idx]) {
            // console.log('setVideoStatus', status);
            // console.log('item', this.search.items[idx]);

            this.search.items[idx].status = status;
            this.search.items[idx].progress = progress;
            this.dataSrv.setItems(this.search.items);
        }
    }

    downloadNext() {
        if (this.toDownload && this.toDownload[0]) {
            const video = this.toDownload[0];
            this.downloaded.push(video);
            this.toDownload.splice(0, 1);

            const data = {
                savePath: this.settings.savePath,
                video: video,
            };

            this.dataSrv.setDownloadStarted(true);
            this.electronSrv.ipcRenderer.send('download', data);

        } else {
            this.dataSrv.setDownloadStarted(false);
        }
    }

    cancelDownload() {
        _.forEach(this.downloaded, (video) => {
            const current = _.find(this.search.items, { id: video.id });
            if (current && current.status === ProgressStatus.PROGRESS) {
                this.electronSrv.ipcRenderer.send('cancelDownload.' + video.id);
            }
        });
    }

    onAllDownloadSuccess() {
        const message: Message = {
            type: MessageType.SUCCESS,
            title: 'Success',
            description: this.getMessageDescription()
        };
        this.update(message);
        this.notify(message);
    }

    onAllDownloadError() {
        const message: Message = {
            type: MessageType.ERROR,
            title: 'ERROR',
            description: 'Somethings went wrong...'
        };
        this.update(message);
        this.notify(message);
    }

    onAllDownloadCancel() {
        const message: Message = {
            type: MessageType.CANCEL,
            title: 'Cancel',
            description: ''
        };
        this.update(message);
    }

    update(message: Message) {
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
        this.router.navigateByUrl('/message');
    }

    getMessageDescription() {
        let desc = '';
        desc += this.downloaded.length.toString();
        desc += ' item';
        desc += this.downloaded.length > 1 ? 's' : '';
        desc += ' downloaded!';
        return desc;
    }

    trackByFn(index, item) {
        return index; // item.index;
    }

    notify(message: Message) {
        const myNotification = new Notification(message.title, {
            body: message.description,
            // icon: 'assets/icons/checked.svg'
        });
    }
}
