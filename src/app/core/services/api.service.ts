import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';


import {
    AppStateActionShowIsSearching,
    AppStateActionHideIsSearching,
    AppStateActionSetIsDownloading,
    AppStateActionUnsetIsDownloading } from '@core/stores/app-state';

import { VideoListItem } from '@stores/video-list/video-list.model';
import {
    VideoListActionSetSelectedItems,
    VideoListActionSetItems,
    VideoListActionEmptySelectedItems,
    VideoListActionEmptyItems,
    VideoListActionEmptyState,
    VideoListActionStartDownload,
    VideoListActionCancelDownload,
    VideoListActionUpdateItems} from '@stores/video-list/video-list.actions';

import {
    SearchActionClearInputValue,
    SearchActionSetInputValue} from '@stores/search/search.actions';

import { SettingsState, } from '@stores/settings/settings.model';
import {
    SettingsActionSetSettingsState,
    SettingsActionEditSavePath,
    SettingsActionSetSavePath,
    SettingsActionSetConcurrentDl,
    SettingsActionIncrementConcurrentDl,
    SettingsActionDecrementConcurrentDl,
    SettingsActionLoadSettingsState} from '@core/stores/settings/settings.actions';



@Injectable({
    providedIn: 'root'
})
export class ApiService {

    constructor(
    private store: Store<any>) {
    }

    // App state
    getAppState() {
        return this.store.select('AppState');
    }

    showIsSearching() {
        this.store.dispatch(new AppStateActionShowIsSearching());
    }

    hideIsSearching() {
        this.store.dispatch(new AppStateActionHideIsSearching());
    }

    setIsDownloading() {
        this.store.dispatch(new AppStateActionSetIsDownloading());
    }

    unsetIsDownloading() {
        this.store.dispatch(new AppStateActionUnsetIsDownloading());
    }

    // VideoList state
    getVideoListState() {
        return this.store.select('VideoListState');
    }

    setItems(items: VideoListItem[]) {
        this.store.dispatch(new VideoListActionSetItems(items));
    }

    emptyItems() {
        this.store.dispatch(new VideoListActionEmptyItems());
    }

    setSelectedItems(selectedItems: VideoListItem[]) {
        this.store.dispatch(new VideoListActionSetSelectedItems(selectedItems));
    }

    emptySelectedItems() {
        this.store.dispatch(new VideoListActionEmptySelectedItems());
    }

    emptyState() {
        this.store.dispatch(new VideoListActionEmptyState());
    }

    startDownload() {
        this.store.dispatch(new VideoListActionStartDownload());
    }

    cancelDownload() {
        this.store.dispatch(new VideoListActionCancelDownload());
    }

    updateItems(items: VideoListItem[]) {
        this.store.dispatch(new VideoListActionUpdateItems(items));
    }


    // Search state
    getSearchState() {
        return this.store.select('SearchState');
    }

    setInputValue(value: string) {
        this.store.dispatch(new SearchActionSetInputValue(value));
    }

    clearInputValue() {
        this.store.dispatch(new SearchActionClearInputValue());
    }

    // Settings state
    loadSettingsState() {
        this.store.dispatch(new SettingsActionLoadSettingsState());
    }

    getSettingsState() {
        return this.store.select('SettingsState');
    }

    setSettingsState(settingsState: SettingsState) {
        this.store.dispatch(new SettingsActionSetSettingsState(settingsState));
    }

    editSavePath() {
        this.store.dispatch(new SettingsActionEditSavePath());
    }

    setSavePath(savePath: string) {
        this.store.dispatch(new SettingsActionSetSavePath(savePath));
    }

    setConcurrentDownload(concurrentDownload: number) {
        this.store.dispatch(new SettingsActionSetConcurrentDl(concurrentDownload));
    }

    incrementConcurrentDownload() {
        this.store.dispatch(new SettingsActionIncrementConcurrentDl());
    }

    decrementConcurrentDownload() {
        this.store.dispatch(new SettingsActionDecrementConcurrentDl());
    }
}
