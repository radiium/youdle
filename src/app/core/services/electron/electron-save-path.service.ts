import { Injectable } from '@angular/core';
import { EMPTY } from 'rxjs';
import { ElectronService } from './electron.service';

@Injectable()
export class ElectronSavePathService extends ElectronService {

    constructor() {
        super();
    }

    public getDefaultSavePath() {
        if (!this.isElectronApp) { return EMPTY; }
        this.ipcRenderer.send('get-default-save-path');
        return this.getResponseEvent('get-default-save-path-resp');
    }

    public editSavePath(savePath) {
        if (!this.isElectronApp) { return EMPTY; }
        this.ipcRenderer.send('edit-save-path', { savePath: savePath });
        return this.getResponseEvent('edit-save-path-resp');
    }
}
