import { Component, OnInit } from '@angular/core';

import { DataService } from 'core/services/data.service';
import { Settings } from 'core/services/data.models';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

    error: string;
    savePath: string;
    settings: Settings;

    constructor(private dataSrv: DataService) {}

    ngOnInit() {
        this.dataSrv.settings$.subscribe((data) => {
            this.settings = data;
        });
    }

    editSavePath() {
        this.dataSrv.editSavePath();
    }

    increment() {
        this.settings.concurrentDownload++;
        if (this.settings.concurrentDownload >  10) {
            this.settings.concurrentDownload = 10;
        }
        this.dataSrv.setStoreConcurrentDownload(this.settings.concurrentDownload);
    }

    decrement() {
        this.settings.concurrentDownload--;
        if (this.settings.concurrentDownload < 1) {
            this.settings.concurrentDownload = 1;
        }
        this.dataSrv.setStoreConcurrentDownload(this.settings.concurrentDownload);
    }
}
