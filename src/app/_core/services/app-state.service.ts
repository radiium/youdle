import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import * as _ from 'lodash';
import { AppState } from 'shared/models/app-state';

@Injectable()
export class AppStateService {

    appStateDefault = {
        loader: false,
        notFound: false,
        macOsTitleBar: false,
        inputValue: 'https://www.youtube.com/watch?list=PL0k4GF1e6u1T9kUYx9ppyGvCS9EcvaCM2',
        selectedTab: 0,
        videoList: []
    };
    private appState  = new BehaviorSubject<AppState>(this.appStateDefault);
    public  appState$ = this.appState.asObservable();

    constructor() { }

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
