import { Action } from '@ngrx/store';
import { VideoListState, VideoListItem } from './video-list.model';

export enum VideoListActionTypes {
    SET_STATE = '[VIDEO_LIST] SET_STATE',

    SET_ITEMS = '[VIDEO_LIST] SET_ITEMS',
    EMPTY_ITEMS = '[VIDEO_LIST] EMPTY_ITEMS',
    SET_SELECTED_ITEMS = '[VIDEO_LIST] SET_SELECTED_ITEMS',
    EMPTY_SELECTED_ITEMS = '[VIDEO_LIST] EMPTY_SELECTED_ITEMS',
    EMPTY_STATE = '[VIDEO_LIST] EMPTY_STATE',

    START_DOWNLOAD = '[VIDEO_LIST] START_DOWNLOAD',
    START_DOWNLOAD_ERROR = '[VIDEO_LIST] START_DOWNLOAD_ERROR',
    START_DOWNLOAD_SUCCESS = '[VIDEO_LIST] START_DOWNLOAD_SUCCESS',

    CANCEL_DOWNLOAD = '[VIDEO_LIST] CANCEL_DOWNLOAD',
    CANCEL_DOWNLOAD_ERROR = '[VIDEO_LIST] CANCEL_DOWNLOAD_ERROR',
    CANCEL_DOWNLOAD_SUCCESS = '[VIDEO_LIST] CANCEL_DOWNLOAD_SUCCESS',

    UPDATE_ITEMS = '[SETTVIDEO_LISTINGS] UPDATE_ITEMS',
    UPDATE_ITEMS_SUCCESS = '[VIDEO_LIST] UPDATE_ITEMS_SUCCESS',

    DOWNLOAD_FINISH = '[VIDEO_LIST] DOWNLOAD_FINISH',
    DOWNLOAD_FINISH_SUCCESS = '[VIDEO_LIST] DOWNLOAD_FINISH_SUCCESS',
}

export class VideoListActionSetState implements Action {
    readonly type = VideoListActionTypes.SET_STATE;
    constructor(public payload: VideoListState) {}
}

export class VideoListActionSetItems implements Action {
    readonly type = VideoListActionTypes.SET_ITEMS;
    constructor(public payload: VideoListItem[]) {}
}

export class VideoListActionEmptyItems implements Action {
    readonly type = VideoListActionTypes.EMPTY_ITEMS;
    constructor() {}
}

export class VideoListActionSetSelectedItems implements Action {
    readonly type = VideoListActionTypes.SET_SELECTED_ITEMS;
    constructor(public payload: VideoListItem[]) {}
}

// Empty selected items
export class VideoListActionEmptySelectedItems implements Action {
    readonly type = VideoListActionTypes.EMPTY_SELECTED_ITEMS;
    constructor() {}
}

export class VideoListActionEmptyState implements Action {
    readonly type = VideoListActionTypes.EMPTY_STATE;
    constructor() {}
}

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
