import { Action } from '@ngrx/store';

import { SettingsState, MediaType } from './settings.model';

export enum SettingsActionTypes {
    LOAD_SETTINGS_STATE = '[SETTINGS] LOAD_SETTINGS_STATE',
    SET_SETTINGS_STATE = '[SETTINGS] SET_SETTINGS_STATE',

    EDIT_SAVE_PATH = '[SETTINGS] EDIT_SAVE_PATH',
    SET_SAVE_PATH = '[SETTINGS] SET_SAVE_PATH',

    SET_CONCURRENT_DL = '[SETTINGS] SET_CONCURRENT_DL',
    INCREMENT_CONCURRENT_DL = '[SETTINGS] INCREMENT_CONCURRENT_DL',
    DECREMENT_CONCURRENT_DL = '[SETTINGS] DECREMENT_CONCURRENT_DL',

    SET_MEDIA_TYPE = '[SETTINGS] SET_MEDIA_TYPE',

    SET_SUCCESS = '[SETTINGS] SET_SUCCESS',
}

export class SettingsActionLoadSettingsState implements Action {
    readonly type = SettingsActionTypes.LOAD_SETTINGS_STATE;
    constructor() {}
}

export class SettingsActionSetSettingsState implements Action {
    readonly type = SettingsActionTypes.SET_SETTINGS_STATE;
    constructor(public payload: SettingsState | {}) {}
}

export class SettingsActionEditSavePath implements Action {
    readonly type = SettingsActionTypes.EDIT_SAVE_PATH;
    constructor() {}
}

export class SettingsActionSetSavePath implements Action {
    readonly type = SettingsActionTypes.SET_SAVE_PATH;
    constructor(public payload: string) {}
}

export class SettingsActionSetConcurrentDl implements Action {
    readonly type = SettingsActionTypes.SET_CONCURRENT_DL;
    constructor(public payload: number) {}
}

export class SettingsActionIncrementConcurrentDl implements Action {
    readonly type = SettingsActionTypes.INCREMENT_CONCURRENT_DL;
    constructor() {}
}

export class SettingsActionDecrementConcurrentDl implements Action {
    readonly type = SettingsActionTypes.DECREMENT_CONCURRENT_DL;
    constructor() {}
}

export class SettingsActionSetMediaType implements Action {
    readonly type = SettingsActionTypes.SET_MEDIA_TYPE;
    constructor(public payload: MediaType) {}
}

export class SettingsActionSetSuccess implements Action {
    readonly type = SettingsActionTypes.SET_SUCCESS;
    constructor() {}
}

export type SettingsActions =
    | SettingsActionLoadSettingsState
    | SettingsActionSetSettingsState
    | SettingsActionEditSavePath
    | SettingsActionSetSavePath
    | SettingsActionSetConcurrentDl
    | SettingsActionIncrementConcurrentDl
    | SettingsActionDecrementConcurrentDl
    | SettingsActionSetMediaType
    | SettingsActionSetSuccess;
