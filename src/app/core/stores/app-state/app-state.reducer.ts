import { AppState } from './app-state.model';
import { AppStateActions, AppStateActionTypes } from './app-state.actions';

export const initialState: AppState = {
    isSearching: false,
    isDownloading: false
};

export function appStateReducer(
    state: AppState = initialState,
    action: AppStateActions): AppState {

    switch (action.type) {
        case AppStateActionTypes.SET_APP_STATE:
            return { ...state, ...action.payload };

        case AppStateActionTypes.SHOW_IS_SEARCHING:
            return { ...state, isSearching: true };

        case AppStateActionTypes.HIDE_IS_SEARCHING:
            return { ...state, isSearching: false };

        case AppStateActionTypes.SET_IS_DOWNLOADING:
            return { ...state, isDownloading: true  };

        case AppStateActionTypes.UNSET_IS_DOWNLOADING:
            return { ...state, isDownloading: false };

        default:
            return state;
    }
}
