import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ElectronService } from 'ngx-electron';
import * as _ from 'lodash';
import { AppState, Settings, YoutubeVideo, Message, MessageType } from 'shared/models';

@Injectable({
    providedIn: 'root'
})
export class DataService {

    // App State
    appStateDefault = {
        loader: false,
        notFound: false,
        inputValue: '',
        selectedTab: 0,
        downloadStarted: false
    };
    private appState  = new BehaviorSubject<AppState>(this.appStateDefault);
    public  appState$ = this.appState.asObservable();

    // Settings
    private settingsDefault = {
        savePath: '',
        concurrentDownload: 4
    };
    private settings  = new BehaviorSubject<Settings>(this.settingsDefault);
    public  settings$ = this.settings.asObservable();

    // Video list
    private videoList  = new BehaviorSubject<YoutubeVideo[]>([]);
    public  videoList$ = this.videoList.asObservable();

    // Message
    private messageDefault = {
        type: MessageType.NONE,
        title: '',
        description: ''
    };
    private message  = new BehaviorSubject<Message>(this.messageDefault);
    public  message$ = this.message.asObservable();

    constructor(
    private electronSrv: ElectronService) {

        this.electronSrv.ipcRenderer.send('getSavePath');
        this.electronSrv.ipcRenderer.on('getSavePathResp', (event, data) => {
            this.setSavePath(data);
        });

        this.electronSrv.ipcRenderer.send('getConcurrentDownload');
        this.electronSrv.ipcRenderer.on('getConcurrentDownloadResp', (event, data) => {
            this.setConcurrentDownload(data);
        });
    }

    // App State
    setAppState(data) {
        this.appState.next(_.cloneDeep(data));
    }

    setAppStateByKey(key, value) {
        const appState = this.appState.getValue();
        appState[key] = value;
        this.setAppState(appState);
    }

    setloader(data) {
        this.setAppStateByKey('loader', data);
    }

    setNotFound(data) {
        this.setAppStateByKey('notFound', data);
    }

    setInputValue(data) {
        this.setAppStateByKey('inputValue', data);
    }

    setSelectedTab(data) {
        this.setAppStateByKey('selectedTab', data);
    }

    setDownloadStarted(data) {
        this.setAppStateByKey('downloadStarted', data);
    }


    // Settings
    setSettings(data) {
        this.settings.next(_.cloneDeep(data));
    }
    setSettingsByKey(key, value) {
        const settings = this.settings.getValue();
        settings[key] = value;
        this.setSettings(settings);
    }

    setSavePath(data) {
        this.setSettingsByKey('savePath', data);
    }

    setConcurrentDownload(data) {
        this.setSettingsByKey('concurrentDownload', data);
    }

    setStoreSavePath(savePath: string) {
        this.electronSrv.ipcRenderer.send('setSavePath', savePath);
    }

    setStoreConcurrentDownload(concurrentDownload: number) {
        this.electronSrv.ipcRenderer.send('setConcurrentDownload', concurrentDownload);
    }

    // Save path
    editSavePath() {
        this.electronSrv.ipcRenderer.send('editSavePath', { filePath: this.settings.getValue().savePath });
    }

    // Video list
    setVideoList(data) {
        this.videoList.next(_.cloneDeep(data));
    }

    // Message
    setMessage(data) {
        this.message.next(_.cloneDeep(data));
    }
}
