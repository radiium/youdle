import { Injectable } from '@angular/core';
import { ipcRenderer } from 'electron';
import { Observable } from 'rxjs';

const getWindow = (): any => window;

@Injectable()
export class ElectronService {

    private readonly _ipcRenderer: typeof ipcRenderer;
    get ipcRenderer() {
        return this._ipcRenderer;
    }

    private readonly _isElectronApp: boolean = !!window.navigator.userAgent.match(/Electron/);
    get isElectronApp() {
        return this._isElectronApp;
    }

    constructor() {
        if (this.isElectronApp) {
            this._ipcRenderer = getWindow().require('electron').ipcRenderer;
        }
    }

    protected log(msg: string, ...args: any) {
        if (args.length > 0) {
            console.log('[ElectronApiService] => ' + msg, args);
        } else {
            console.log('[ElectronApiService] => ' + msg);
        }
    }

    // Handle response
    protected getResponseEvent(eventKey: string) {
        return new Observable((obs) => {
            this.ipcRenderer.on(eventKey, (event: any, error: any, ...args: any) => {
                if (error) {
                    obs.error(error);
                } else {
                    obs.next(args);
                }
                // obs.complete();
                // this.ipcRenderer.removeAllListeners(eventKey);
            });
        });
    }
}
