import { Injectable } from '@angular/core';
import { Observable, EMPTY } from 'rxjs';
import { ElectronService } from './electron.service';

@Injectable()
export class ElectronStorageService extends ElectronService {

    constructor() {
        super();
    }

    public getAllItems(): Observable<any> {
        if (!this.isElectronApp) { return EMPTY; }
        this.ipcRenderer.send('get-all-items');
        return this.getResponseEvent('get-all-items-resp', true);
    }

    public deleteAllItems(): Observable<any> {
        if (!this.isElectronApp) { return EMPTY; }
        this.ipcRenderer.send('delete-all-items');
        return this.getResponseEvent('delete-all-items-resp', true);
    }

    public getItem(key: string): Observable<any> {
        if (!this.isElectronApp) { return EMPTY; }
        this.ipcRenderer.send('get-item', key);
        return this.getResponseEvent('get-item-resp', true);
    }

    public setItem(key: string, data: any): Observable<any> {
        if (!this.isElectronApp) { return EMPTY; }
        this.ipcRenderer.send('set-item', key, data);
        return this.getResponseEvent('set-item-resp', true);
    }

    public hasItem(key: string): Observable<any> {
        if (!this.isElectronApp) { return EMPTY; }
        this.ipcRenderer.send('has-item', key);
        return this.getResponseEvent('has-item-resp', true);
    }

    public deleteItem(key: string): Observable<any> {
        if (!this.isElectronApp) { return EMPTY; }
        this.ipcRenderer.send('delete-item', key);
        return this.getResponseEvent('delete-item-resp', true);
    }
}
