import { Action } from '@ngrx/store';
import { AppState } from './app-state.model';

export enum AppStateActionTypes {
    SET_APP_STATE = '[APP_STATE] SET_APP_STATE',
    SHOW_IS_SEARCHING = '[APP_STATE] SHOW_IS_SEARCHING',
    HIDE_IS_SEARCHING = '[APP_STATE] HIDE_IS_SEARCHING',
    SET_IS_DOWNLOADING = '[APP_STATE] SET_IS_DOWNLOADING',
    UNSET_IS_DOWNLOADING = '[APP_STATE] UNSET_IS_DOWNLOADING',
}

export class AppStateActionSetAppState implements Action {
    readonly type = AppStateActionTypes.SET_APP_STATE;
    constructor(public payload: AppState) {}
}

export class AppStateActionShowIsSearching implements Action {
    readonly type = AppStateActionTypes.SHOW_IS_SEARCHING;
    constructor() {}
}

export class AppStateActionHideIsSearching implements Action {
    readonly type = AppStateActionTypes.HIDE_IS_SEARCHING;
    constructor() {}
}

export class AppStateActionSetIsDownloading implements Action {
    readonly type = AppStateActionTypes.SET_IS_DOWNLOADING;
    constructor() {}
}

export class AppStateActionUnsetIsDownloading implements Action {
    readonly type = AppStateActionTypes.UNSET_IS_DOWNLOADING;
    constructor() {}
}


export type AppStateActions =
    | AppStateActionSetAppState
    | AppStateActionShowIsSearching
    | AppStateActionHideIsSearching
    | AppStateActionSetIsDownloading
    | AppStateActionUnsetIsDownloading;
