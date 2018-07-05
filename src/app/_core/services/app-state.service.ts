import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import * as _ from 'lodash';
import { AppState } from 'shared/models/app-state';

@Injectable()
export class AppStateService {

    // App state
    appStateDefault = {
        loader: false,
        notFound: false,
        macOsTitleBar: false,
        inputValue: '',
        selectedTab: 0,
        videoList: []
    };
    private appState  = new BehaviorSubject<AppState>(this.appStateDefault);
    public  appState$ = this.appState.asObservable();

    constructor() { }

    // App state
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
    setMacOsTitleBar(data) {
        this.setAppStateByKey('macOsTitleBar', data);
    }
    setInputValue(data) {
        this.setAppStateByKey('inputValue', data);
    }
    setSelectedTab(data) {
        this.setAppStateByKey('selectedTab', data);
    }
    setVideoList(data) {
        this.setAppStateByKey('videoList', data);
    }
}
