import { Injectable } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { BehaviorSubject } from 'rxjs';
import * as _ from 'lodash';

import { SelectionModel } from '@angular/cdk/collections';
import { AppState, Settings, Message, Search, Item, MessageType } from './data.models';


@Injectable({
    providedIn: 'root'
})
export class DataService {

    // Loader
    appStateDefault: AppState = {
        loader: false,
        noResult: false,
        downloadStarted: false
    };
    private appState  = new BehaviorSubject<AppState>(this.appStateDefault);
    public  appState$ = this.appState.asObservable();


    // Settings
    settingsDefault: Settings = {
        savePath: '',
        concurrentDownload: 4
    };
    private settings  = new BehaviorSubject<Settings>(this.settingsDefault);
    public  settings$ = this.settings.asObservable();

    private coucou  = new BehaviorSubject<Settings>({
        savePath: '',
        concurrentDownload: 4
    });
    public  coucou$ = this.coucou.asObservable();


    // Message
    messageDefault: Message = {
        type: MessageType.NONE,
        title: '',
        description: ''
    };
    private message  = new BehaviorSubject<Message>(this.messageDefault);
    public  message$ = this.message.asObservable();


    // Search
    searchDefault: Search = {
        inputValue: '',
        items: [],
        selectedItems: new SelectionModel<Item>()
    };
    private search  = new BehaviorSubject<Search>(this.searchDefault);
    public  search$ = this.search.asObservable();


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

    // AppState
    setAppState(data: AppState) {
        this.appState.next(_.cloneDeep(data));
    }
    setAppStateByKey(key, value) {
        const appState = this.appState.getValue();
        appState[key] = value;
        this.setAppState(appState);
    }

    setLoader(data: boolean) {
        this.setAppStateByKey('', data);
        this.setAppStateByKey('loader', data);

    }
    setNoResult(data: boolean) {
        this.setAppStateByKey('noResult', data);
    }
    setDownloadStarted(data: boolean) {
        this.setAppStateByKey('downloadStarted', data);
    }

    // Settings
    setSettings(data: Settings) {
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
    //
    setStoreSavePath(savePath: string) {
        this.electronSrv.ipcRenderer.send('setSavePath', savePath);
    }
    setStoreConcurrentDownload(concurrentDownload: number) {
        this.electronSrv.ipcRenderer.send('setConcurrentDownload', concurrentDownload);
    }
    editSavePath() {
        this.electronSrv.ipcRenderer.send('editSavePath', { filePath: this.settings.getValue().savePath });
    }


    // Message
    setMessage(data: Message) {
        this.message.next(_.cloneDeep(data));
    }


    // Search
    setSearch(data: Search) {
        this.search.next(_.cloneDeep(data));
    }
    setSearchByKey(key, value) {
        const search = this.search.getValue();
        search[key] = value;
        this.setSearch(search);
    }
    setInputValue(data: string) {
        this.setSearchByKey('inputValue', data);
    }
    setItems(data: Item[]) {
        this.setSearchByKey('items', data);
    }
    setSelectedItems(data: SelectionModel<Item>) {
        this.setSearchByKey('selectedItems', data);
    }
}
