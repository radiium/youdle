import { Component, Inject, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Subscription } from 'rxjs';
import * as _ from 'lodash';

import { SettingsState } from '@stores/settings';
import { ApiService } from '@core/services/api.service';

@Component({
    selector: 'app-settings-dialog',
    templateUrl: './settings-dialog.component.html',
    styleUrls: ['./settings-dialog.component.scss'],
})
export class SettingsDialogComponent implements OnInit, OnDestroy {

    settingsState: SettingsState;
    subscribtion = new Subscription();
    constructor(
    private apiSrv: ApiService,
    private cdRef: ChangeDetectorRef,
    public dialogRef: MatDialogRef<SettingsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

    ngOnInit() {
        this.subscribtion = this.apiSrv.getSettingsState().subscribe(data => {
            this.settingsState = data;
            this.cdRef.detectChanges();
        });
    }

    ngOnDestroy() {
        this.subscribtion.unsubscribe();
    }

    editSavePath() {
        this.apiSrv.editSavePath();
    }

    increment() {
        this.apiSrv.incrementConcurrentDownload();
    }

    decrement() {
        this.apiSrv.decrementConcurrentDownload();
    }

    onMediaTypeChange(event) {
        this.apiSrv.setMediaType(event.value);

    }
}
