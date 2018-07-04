import { Component, OnInit, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ElectronService } from 'ngx-electron';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

    error: string;
    filePath: string;

    constructor(
    private cdr: ChangeDetectorRef,
    private electronSrv: ElectronService
    ) { }

    ngOnInit() {
        this.electronSrv.ipcRenderer.send('send-get-save-path', { edit: false });
        this.electronSrv.ipcRenderer.on('get-save-path', this.getPathDL.bind(this));
        this.electronSrv.ipcRenderer.on('app-error', this.handleError.bind(this));
    }

    getPathDL(event, newPath) {
        console.log('getPathDL', newPath);
        this.filePath = newPath;
        this.cdr.detectChanges();
    }

    editDLPath() {
        this.electronSrv.ipcRenderer.send('send-get-save-path', {
            edit: true,
            filePath: this.filePath
        });
        this.cdr.detectChanges();
    }

    handleError(event, error) {
        this.error = error;
    }
}
