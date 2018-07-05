import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Settings } from 'shared/models/settings';
import { ElectronService } from 'ngx-electron';
import * as _ from 'lodash';

@Injectable({
    providedIn: 'root'
})
export class SettingsService {

    private settingsDefault = {
        savePath: '',
        concurrentDownload: 4
    };
    private settings  = new BehaviorSubject<Settings>(this.settingsDefault);
    public  settings$ = this.settings.asObservable();

    constructor(
    private electronSrv: ElectronService) {
        // Load stored settings
        this.electronSrv.ipcRenderer.send('getSettings');
        this.electronSrv.ipcRenderer.on('getSettingsResp', (event, data) => {
            this.setSettings(data);
        });
    }

    setSettings(data) {
        this.settings.next(_.cloneDeep(data));
        this.setStoreSettings(data);
    }

    setStoreSettings(settings: Settings) {
        this.electronSrv.ipcRenderer.send('saveSettings', settings);
    }

    editSavePath() {
        this.electronSrv.ipcRenderer.send('editSavePath', { filePath: this.settings.getValue().savePath });
        this.electronSrv.ipcRenderer.on('editSavePathResp', (event, data) => {
            const settings = this.settings.getValue();
            settings.savePath = data;
            this.setSettings(data);
        });
    }

    editConcurretDownload() {
    }
}
