import { Action } from '@ngrx/store';
import { MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { VideoListState, VideoListItem } from './video-list.model';

export enum VideoListActionTypes {
    SET_STATE = '[SETTINGS] SET_STATE',

    SET_ITEMS = '[SETTINGS] SET_ITEMS',
    EMPTY_ITEMS = '[SETTINGS] EMPTY_ITEMS',
    SET_SELECTED_ITEMS = '[SETTINGS] SET_SELECTED_ITEMS',
    EMPTY_SELECTED_ITEMS = '[SETTINGS] EMPTY_SELECTED_ITEMS',
    EMPTY_STATE = '[SETTINGS] EMPTY_STATE',

    START_DOWNLOAD = '[SETTINGS] START_DOWNLOAD',
    START_DOWNLOAD_ERROR = '[SETTINGS] START_DOWNLOAD_ERROR',
    START_DOWNLOAD_SUCCESS = '[SETTINGS] START_DOWNLOAD_SUCCESS',

    CANCEL_DOWNLOAD = '[SETTINGS] CANCEL_DOWNLOAD',
    CANCEL_DOWNLOAD_ERROR = '[SETTINGS] CANCEL_DOWNLOAD_ERROR',
    CANCEL_DOWNLOAD_SUCCESS = '[SETTINGS] CANCEL_DOWNLOAD_SUCCESS',

    UPDATE_ITEMS = '[SETTINGS] UPDATE_ITEMS',
    UPDATE_ITEMS_SUCCESS = '[SETTINGS] UPDATE_ITEMS_SUCCESS',

    DOWNLOAD_FINISH = '[SETTINGS] DOWNLOAD_FINISH',
    DOWNLOAD_FINISH_SUCCESS = '[SETTINGS] DOWNLOAD_FINISH_SUCCESS',
}

// Set VideoList state
export class VideoListActionSetState implements Action {
    readonly type = VideoListActionTypes.SET_STATE;
    constructor(public payload: VideoListState) {}
}

// Set items
export class VideoListActionSetItems implements Action {
    readonly type = VideoListActionTypes.SET_ITEMS;
    constructor(public payload: VideoListItem[]) {}
}

// Empty items
export class VideoListActionEmptyItems implements Action {
    readonly type = VideoListActionTypes.EMPTY_ITEMS;
    constructor() {}
}

// Set selected items
export class VideoListActionSetSelectedItems implements Action {
    readonly type = VideoListActionTypes.SET_SELECTED_ITEMS;
    constructor(public payload: VideoListItem[]) {}
}

// Empty selected items
export class VideoListActionEmptySelectedItems implements Action {
    readonly type = VideoListActionTypes.EMPTY_SELECTED_ITEMS;
    constructor() {}
}

// Empty state
export class VideoListActionEmptyState implements Action {
    readonly type = VideoListActionTypes.EMPTY_STATE;
    constructor() {}
}

// Start download
export class VideoListActionStartDownload implements Action {
    readonly type = VideoListActionTypes.START_DOWNLOAD;
    constructor() {}
}

export class VideoListActionStartDownloadError implements Action {
    readonly type = VideoListActionTypes.START_DOWNLOAD_ERROR;
    constructor() {}
}

export class VideoListActionStartDownloadSuccess implements Action {
    readonly type = VideoListActionTypes.START_DOWNLOAD_SUCCESS;
    constructor() {}
}

// Stop download
export class VideoListActionCancelDownload implements Action {
    readonly type = VideoListActionTypes.CANCEL_DOWNLOAD;
    constructor() {}
}

export class VideoListActionCancelDownloadError implements Action {
    readonly type = VideoListActionTypes.CANCEL_DOWNLOAD_ERROR;
    constructor() {}
}

export class VideoListActionCancelDownloadSuccess implements Action {
    readonly type = VideoListActionTypes.CANCEL_DOWNLOAD_SUCCESS;
    constructor() {}
}

export class VideoListActionUpdateItems implements Action {
    readonly type = VideoListActionTypes.UPDATE_ITEMS;
    constructor(public payload: VideoListItem[]) {}
}

export class VideoListActionUpdateItemsSuccess implements Action {
    readonly type = VideoListActionTypes.UPDATE_ITEMS_SUCCESS;
    constructor() {}
}

export class VideoListActionDownloadFinish implements Action {
    readonly type = VideoListActionTypes.DOWNLOAD_FINISH;
    constructor(public payload: VideoListItem[]) {}
}

export class VideoListActionDownloadFinishSuccess implements Action {
    readonly type = VideoListActionTypes.DOWNLOAD_FINISH_SUCCESS;
    constructor() {}
}

export type videoListActions =
    | VideoListActionSetState
    | VideoListActionSetItems
    | VideoListActionEmptyItems
    | VideoListActionSetSelectedItems
    | VideoListActionEmptySelectedItems
    | VideoListActionEmptyState
    | VideoListActionStartDownload
    | VideoListActionStartDownloadError
    | VideoListActionStartDownloadSuccess
    | VideoListActionCancelDownload
    | VideoListActionCancelDownloadError
    | VideoListActionCancelDownloadSuccess
    | VideoListActionUpdateItems
    | VideoListActionUpdateItemsSuccess
    | VideoListActionDownloadFinish
    | VideoListActionDownloadFinishSuccess;
