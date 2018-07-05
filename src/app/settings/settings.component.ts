import { Component, OnInit, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Settings } from 'shared/models/settings';
import { SettingsService } from 'core/services/settings.service';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

    error: string;
    savePath: string;

    settings: Settings;

    constructor(
    private cdr: ChangeDetectorRef,
    private settingsSrv: SettingsService) {
    }

    ngOnInit() {
        this.settingsSrv.settings$.subscribe((data) => {
            this.settings = data;
            console.log('SettingsComponent change =>>', data);
            this.cdr.detectChanges();
        });
    }

    editSavePath() {
        this.settingsSrv.editSavePath();
    }

    editConcurretDownload() {
        this.settingsSrv.editConcurretDownload();
    }
}
