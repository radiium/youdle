import { VideoListState, VideoListItem } from './video-list.model';
import { videoListActions, VideoListActionTypes } from './video-list.actions';

export const initialState: VideoListState = {
    items: [],
    selectedItems: [],
};

export function videoListReducer(
    state: VideoListState = initialState,
    action: videoListActions): VideoListState {

    switch (action.type) {
        case VideoListActionTypes.SET_STATE:
            return { ...state, ...action.payload };

        case VideoListActionTypes.SET_ITEMS:
            return { ...state, items: action.payload };

        case VideoListActionTypes.EMPTY_ITEMS:
            return { ...state, items: [] };

        case VideoListActionTypes.SET_SELECTED_ITEMS:
            return { ...state, selectedItems: action.payload };

        case VideoListActionTypes.EMPTY_SELECTED_ITEMS:
            return { ...state, selectedItems: [] };

        case VideoListActionTypes.EMPTY_STATE:
            return { ...state, items: [], selectedItems: [] };

        case VideoListActionTypes.START_DOWNLOAD:
        case VideoListActionTypes.START_DOWNLOAD_ERROR:
        case VideoListActionTypes.START_DOWNLOAD_SUCCESS:
        case VideoListActionTypes.CANCEL_DOWNLOAD:
        case VideoListActionTypes.CANCEL_DOWNLOAD_ERROR:
        case VideoListActionTypes.CANCEL_DOWNLOAD_SUCCESS:
        case VideoListActionTypes.UPDATE_ITEMS:
        case VideoListActionTypes.UPDATE_ITEMS_SUCCESS:
        case VideoListActionTypes.DOWNLOAD_FINISH:
        case VideoListActionTypes.DOWNLOAD_FINISH_SUCCESS:
            return state;

        default:
            return state;
    }
}



